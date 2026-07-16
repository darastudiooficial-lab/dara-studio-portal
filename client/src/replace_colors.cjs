const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname);

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        const filePath = path.join(currentDirPath, name);
        const stat = fs.statSync(filePath);
        if (stat.isFile() && (filePath.endsWith('.jsx') || filePath.endsWith('.css'))) {
            callback(filePath, stat);
        } else if (stat.isDirectory() && name !== 'node_modules') {
            walkSync(filePath, callback);
        }
    });
}

const replacements = [
    { regex: /#7D9F85/gi, replacement: '#A1824A' },
    { regex: /#5A7E62/gi, replacement: '#8F723E' },
    { regex: /#7DAF8E/gi, replacement: '#A1824A' },
    { regex: /#1B4332/gi, replacement: '#A1824A' },
    { regex: /#225740/gi, replacement: '#8F723E' },
    { regex: /#1C3826/gi, replacement: '#A1824A' },
    { regex: /#244932/gi, replacement: '#8F723E' },
    { regex: /rgba\(90,\s*126,\s*98/gi, replacement: 'rgba(161, 130, 74' }
];

walkSync(srcDir, function(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    for (const r of replacements) {
        content = content.replace(r.regex, r.replacement);
    }
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
});
console.log('Done replacing colors.');
