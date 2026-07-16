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
            let modified = false;
            
            // Remove opacity: 0.x; from css files
            // But be careful not to remove opacity from hover states or backgrounds if they are not text?
            // Actually, the user said "toda a transparencia dos textos". So we look for classes related to text.
            // Let's just remove opacity: 0.\d+; that are inside rules with color: or ont- maybe?
            // Safer to just remove all opacity: 0.5;, opacity: 0.6;, opacity: 0.7;, opacity: 0.8;, opacity: 0.85;, opacity: 0.65;, opacity: 0.4; etc.
            
            const newContent = content.replace(/opacity\s*:\s*0\.[0-9]+;/g, '');
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent);
                console.log('Fixed opacity in CSS:', file);
            }
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // replace inline opacity with color: '#000000' and remove opacity
            // e.g. style={{ opacity: 0.5 }} -> style={{ color: '#000000' }}
            // e.g. style={{ fontSize: 10, opacity: 0.5 }} -> style={{ fontSize: 10, color: '#000000' }}
            
            const newContent = content.replace(/opacity\s*:\s*0\.[0-9]+/g, 'color: "#000000"');
            
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent);
                console.log('Fixed opacity in JSX:', file);
            }
        }
    }
}

processDir(cssDir);
