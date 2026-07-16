const fs = require('fs');
const path = require('path');

const cssDir = path.join(__dirname, 'client/src');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // replace serif fonts like 'Instrument Serif', 'Playfair Display'
            content = content.replace(/font-family\s*:\s*['"]?(Instrument Serif|Playfair Display)['"]?[^;]*;/gi, 'font-family: var(--font-serif);');
            
            // replace sans fonts like 'DM Sans', 'Inter', 'Plus Jakarta Sans'
            content = content.replace(/font-family\s*:\s*['"]?(DM Sans|Inter|Plus Jakarta Sans)['"]?[^;]*;/gi, 'font-family: var(--font-sans);');
            
            // replace 'Century Gothic', monospace
            content = content.replace(/font-family\s*:\s*['"]?Century Gothic['"]?\s*,\s*monospace\s*;/gi, 'font-family: var(--font-mono);');

            // replace hardcoded monospace
            content = content.replace(/font-family\s*:\s*monospace\s*;/gi, 'font-family: var(--font-mono);');

            fs.writeFileSync(fullPath, content);
        }
    }
}

processDir(cssDir);

let indexContent = fs.readFileSync(path.join(cssDir, 'index.css'), 'utf8');
if (!indexContent.includes('--font-mono')) {
    indexContent = indexContent.replace(/--font-sans:\s*'Century Gothic',\s*sans-serif;/, '--font-sans: \'Century Gothic\', sans-serif;\n  --font-mono: \'Century Gothic\', monospace;');
    fs.writeFileSync(path.join(cssDir, 'index.css'), indexContent);
}
console.log('Fonts standardized');
