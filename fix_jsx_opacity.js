const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'client/src/pages');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // replace inline opacity with color: "#000000" in style objects
            // this specifically matches style={{ ... opacity: 0.5 ... }}
            const newContent = content.replace(/opacity:\s*0\.[0-9]+/g, 'color: "#000000"');
            
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent);
                console.log('Fixed opacity in JSX:', file);
            }
        }
    }
}

processDir(srcDir);
