import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', 'client', 'src');

const copyKeys = new Set([
  'PT', 'EN', 'label', 'description', 'title', 'intro', 'note', 'text',
  'content', 'summary', 'body', 'placeholder', 'message', 'error', 'success',
  'subject', 'headline', 'caption'
]);

function isCopyKeyPreceding(resultStr) {
  let idx = resultStr.length - 1;
  while (idx >= 0 && /\s/.test(resultStr[idx])) {
    idx--;
  }
  if (idx < 0 || resultStr[idx] !== ':') {
    return false;
  }
  idx--;
  while (idx >= 0 && /\s/.test(resultStr[idx])) {
    idx--;
  }
  let key = '';
  while (idx >= 0 && /[a-zA-Z0-9_$]/.test(resultStr[idx])) {
    key = resultStr[idx] + key;
    idx--;
  }
  return copyKeys.has(key);
}

function scanAndFix(content) {
  let result = '';
  let i = 0;
  let len = content.length;
  let fixedCount = 0;

  while (i < len) {
    let char = content[i];

    if (char === '/' && i + 1 < len) {
      let next = content[i + 1];
      if (next === '/') {
        result += '//';
        i += 2;
        while (i < len && content[i] !== '\n' && content[i] !== '\r') {
          result += content[i];
          i++;
        }
        continue;
      } else if (next === '*') {
        result += '/*';
        i += 2;
        while (i < len) {
          if (content[i] === '*' && i + 1 < len && content[i + 1] === '/') {
            result += '*/';
            i += 2;
            break;
          }
          result += content[i];
          i++;
        }
        continue;
      }
    }

    if (char === '"' || char === "'") {
      let quote = char;
      let startIdx = i;
      let innerContent = '';
      i++;

      while (i < len) {
        let c = content[i];
        if (c === '\\') {
          innerContent += '\\' + content[i + 1];
          i += 2;
          continue;
        }
        if (c === quote) {
          break;
        }
        innerContent += c;
        i++;
      }
      i++;

      const hasPt = /[áàâãäéêëíìîïóôõöúùûüçÁÀÂÃÄÉÊËÍÌÎÏÓÔÕÖÚÙÛÜÇ]/.test(innerContent);
      const hasApostrophe = innerContent.includes("'") || innerContent.includes("’");
      
      const hasCommaAndLong = innerContent.includes(",") && 
                              innerContent.length > 15 && 
                              !/[\(\)\*=\[\]\{\}]/.test(innerContent);

      const isCopyKey = isCopyKeyPreceding(result);

      if (hasPt || hasApostrophe || hasCommaAndLong || isCopyKey) {
        const isLikelyCode = innerContent.startsWith('http') || 
                             innerContent.startsWith('/') || 
                             innerContent.startsWith('.') || 
                             /^[a-zA-Z0-9_\-\/]+$/.test(innerContent) ||
                             innerContent === 'application/json';

        if (!isLikelyCode) {
          let processed = '';
          let j = 0;
          while (j < innerContent.length) {
            let c2 = innerContent[j];
            if (c2 === '\\') {
              let next2 = innerContent[j + 1];
              if (next2 === quote) {
                processed += quote;
                j += 2;
              } else {
                processed += '\\' + next2;
                j += 2;
              }
            } else if (c2 === '`') {
              processed += '\\`';
              j++;
            } else if (c2 === '$' && innerContent[j + 1] === '{') {
              processed += '\\${';
              j += 2;
            } else {
              processed += c2;
              j++;
            }
          }

          const newStr = '`' + processed + '`';
          const originalStr = content.slice(startIdx, i);
          if (originalStr !== newStr) {
            result += newStr;
            fixedCount++;
            continue;
          }
        }
      }

      result += content.slice(startIdx, i);
      continue;
    }

    if (char === '`') {
      result += '`';
      i++;
      while (i < len) {
        let c = content[i];
        if (c === '\\') {
          result += '\\' + content[i + 1];
          i += 2;
          continue;
        }
        if (c === '`') {
          result += '`';
          i++;
          break;
        }
        result += c;
        i++;
      }
      continue;
    }

    result += char;
    i++;
  }

  return { result, fixedCount };
}

function collectFiles(dir, exts = ['.jsx', '.tsx', '.js', '.ts']) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(full, exts));
    } else if (exts.includes(path.extname(entry.name))) {
      results.push(full);
    }
  }
  return results;
}

const files = collectFiles(ROOT);
const summary = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const { result, fixedCount } = scanAndFix(content);
  if (fixedCount > 0) {
    fs.writeFileSync(file, result, 'utf8');
    const relativePath = path.relative(ROOT, file);
    summary.push({ file: relativePath, count: fixedCount });
    console.log(`Updated: ${relativePath} (${fixedCount} strings converted)`);
  }
}

// Write the summary report
fs.writeFileSync(path.resolve(__dirname, 'conversion-report.json'), JSON.stringify(summary, null, 2), 'utf8');
console.log('Done!');
