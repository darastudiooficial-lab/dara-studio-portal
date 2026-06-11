const fs = require('fs');
const filePath = 'd:/DARA Studio - Portal/client/src/pages/HowWeWork.jsx';
let text = fs.readFileSync(filePath, 'utf8');
const search = '"Escopo Pretendido: Uma breve descrição da sua demanda, seja ela uma reforma, construção nova, amplia  {';
const replace = '"Escopo Pretendido: Uma breve descrição da sua demanda, seja ela uma reforma, construção nova ou ampliação."\n      ]\n    }\n  },\n  {';

if (text.includes(search)) {
    text = text.replace(search, replace);
    fs.writeFileSync(filePath, text, 'utf8');
    console.log('Fixed syntax error!');
} else {
    // maybe encoding issue with 'descrição' etc
    console.log('String not found. Trying regex fallback.');
    const regex = /"Escopo Pretendido:[^]*?amplia\s*\{/;
    if (regex.test(text)) {
        text = text.replace(regex, replace);
        fs.writeFileSync(filePath, text, 'utf8');
        console.log('Fixed syntax error via regex!');
    } else {
        console.log('Not found via regex either.');
    }
}
