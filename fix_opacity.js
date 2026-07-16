const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'client/src');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.css') || fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            
            // For JSX inline styles
            if (fullPath.endsWith('.jsx')) {
                // remove opacity: 0.x
                const newContent = content.replace(/opacity:\s*0\.[0-9]+/g, 'color: "#000000"'); // wait, replace opacity with color?
                if (content !== newContent) {
                    content = newContent;
                    modified = true;
                }
            }
            
            if (modified) {
                // fs.writeFileSync(fullPath, content);
            }
        }
    }
}
// Just checking what would be replaced
console.log('Test run');
