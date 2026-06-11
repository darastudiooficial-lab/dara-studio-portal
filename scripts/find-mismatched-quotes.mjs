import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', 'client', 'src');

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
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, i) => {
    // Check for patterns like:
    // "`..."" or ""...`" or "`..."'" etc.
    // Specifically matching mixed quotes around same string fragment, e.g. "`" or "`"
    if (
      l.includes('"`') || 
      l.includes('`"') || 
      l.includes('\'`') || 
      l.includes('`\'') || 
      (l.includes('`') && (l.includes('"') || l.includes("'")) && !l.includes('${'))
    ) {
      // Print only if it looks like a quote error
      // Simple heuristic: count of occurrences of different quotes
      const backticks = (l.match(/`/g) || []).length;
      const doubleQuotes = (l.match(/"/g) || []).length;
      const singleQuotes = (l.match(/'/g) || []).length;
      if (
        (backticks % 2 !== 0 && (doubleQuotes % 2 !== 0 || singleQuotes % 2 !== 0)) ||
        (l.includes('"`') || l.includes('`"') || l.includes('\'`') || l.includes('`\''))
      ) {
        console.log(`${path.relative(ROOT, file)}:${i+1}: ${l.trim()}`);
      }
    }
  });
}
