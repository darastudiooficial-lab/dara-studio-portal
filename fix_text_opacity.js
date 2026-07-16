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

            // split by blocks
            const blockRegex = /([^{]+)\{([^}]+)\}/g;
            const newContent = content.replace(blockRegex, (match, selector, rules) => {
                // If the rules contain font properties, it's likely a text block
                if (/font-|text-|letter-spacing|line-height/i.test(rules)) {
                    // Remove opacity rules
                    const newRules = rules.replace(/opacity\s*:\s*0\.[0-9]+;?/gi, '');
                    if (rules !== newRules) {
                        return selector + '{' + newRules + '}';
                    }
                }
                return match;
            });

            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent);
                console.log('Fixed text opacity in CSS:', file);
            }
        }
    }
}

processDir(cssDir);
