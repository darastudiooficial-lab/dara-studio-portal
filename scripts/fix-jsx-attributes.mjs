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
let totalFixed = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  // Regex to find: attribute=`value` where the value is in backticks (and has no curly braces around it)
  // We match word characters followed by =`...`
  const re = /\b([a-zA-Z0-9_\-]+)=`([^`]*)`/g;
  
  if (re.test(content)) {
    const fixed = content.replace(re, '$1={`$2`}');
    fs.writeFileSync(file, fixed, 'utf8');
    console.log(`Fixed JSX attributes in: ${path.relative(ROOT, file)}`);
    totalFixed++;
  }
}

console.log(`Completed fixing JSX attributes in ${totalFixed} files.`);
