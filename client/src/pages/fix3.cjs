const fs = require('fs');
const filePath = 'd:/DARA Studio - Portal/client/src/pages/HowWeWork.jsx';
let text = fs.readFileSync(filePath, 'utf8');
const regex = /"Escopo Pretendido:[^]*?num: "02",/g;
const match = text.match(regex);
if (match) {
    console.log('Match found:', JSON.stringify(match[0]));
    const replaceStr = '"Escopo Pretendido: Uma breve descrição da sua demanda, seja ela uma reforma, construção nova ou ampliação."\n      ]\n    }\n  },\n  {\n    num: "02",';
    text = text.replace(match[0], replaceStr);
    fs.writeFileSync(filePath, text, 'utf8');
    console.log('Fixed syntax error!');
} else {
    console.log('Not found via regex.');
}
