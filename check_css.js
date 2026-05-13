
const fs = require('fs');
const content = fs.readFileSync('client/src/index.css', 'utf8');

let stack = [];
for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '{') {
        stack.push(i);
    } else if (char === '}') {
        if (stack.length === 0) {
            console.log(`Extra closing brace at position ${i}`);
        } else {
            stack.pop();
        }
    }
}

if (stack.length > 0) {
    stack.forEach(pos => {
        console.log(`Unclosed opening brace starting at position ${pos}`);
    });
} else {
    console.log("All braces are matched.");
}
