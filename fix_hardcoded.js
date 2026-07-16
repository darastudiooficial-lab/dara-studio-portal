const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  content = content.replace(/background:\s*["']?#111111["']?/gi, 'background: "var(--bg1)"');
  content = content.replace(/background:\s*["']?#0d0d12["']?/gi, 'background: "var(--bg)"');
  content = content.replace(/color:\s*["']?#111["']?/gi, 'color: "var(--tx)"');
  content = content.replace(/background-color:\s*["']?#050505["']?/gi, 'background-color: "var(--bg)"');
  content = content.replace(/background:\s*["']?#050505["']?/gi, 'background: "var(--bg)"');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', filePath);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.css') || fullPath.endsWith('.js') || fullPath.endsWith('.cjs')) {
      replaceInFile(fullPath);
    }
  }
}

walkDir('./client/src');
