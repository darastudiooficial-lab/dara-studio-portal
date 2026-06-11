const fs = require('fs');
const filePath = 'd:/DARA Studio - Portal/client/src/pages/HowWeWork.jsx';
let text = fs.readFileSync(filePath, 'utf8');
const search = '}, "Fornecimento de arquivos editáveis nativos (como .plan ou .dwg) — disponíveis mediante taxa de liberação"\r\n      ]\r\n    }\r\n  },';
const search2 = '}, "Fornecimento de arquivos editáveis nativos (como .plan ou .dwg) — disponíveis mediante taxa de liberação"\n      ]\n    }\n  },';
let changed = false;
if (text.includes(search)) {
    text = text.replace(search, '  },');
    changed = true;
} else if (text.includes(search2)) {
    text = text.replace(search2, '  },');
    changed = true;
}

if (changed) {
    fs.writeFileSync(filePath, text, 'utf8');
    console.log('Fixed syntax error!');
} else {
    console.log('Could not find the exact string. Checking alternative substring.');
    const idx = text.indexOf('}, "Fornecimento');
    if (idx !== -1) {
        console.log('Found string starting at', idx);
        console.log('Sample:', text.substring(idx, idx + 200));
        const before = text.substring(0, idx);
        const afterIdx = text.indexOf('  {', idx);
        if (afterIdx !== -1) {
            text = before + '  },\n' + text.substring(afterIdx);
            fs.writeFileSync(filePath, text, 'utf8');
            console.log('Fixed syntax error via fallback!');
        }
    } else {
        console.log('Not found at all.');
    }
}
