const fs = require('fs');
const filePath = 'd:/DARA Studio - Portal/client/src/pages/HowWeWork.jsx';
let text = fs.readFileSync(filePath, 'utf8');

// The second planningNote is right after statusBadge in num "03"
const search = '    statusBadge: { EN: "40% — Project Initiation & Conceptual Design", PT: "40% — Project Initiation & Conceptual Design" },\r\n    planningNote: {';
const search2 = '    statusBadge: { EN: "40% — Project Initiation & Conceptual Design", PT: "40% — Project Initiation & Conceptual Design" },\n    planningNote: {';

if (text.includes(search)) {
    text = text.replace(search, '    statusBadge: { EN: "40% — Project Initiation & Conceptual Design", PT: "40% — Project Initiation & Conceptual Design" },\r\n    infoNote: {');
    fs.writeFileSync(filePath, text, 'utf8');
    console.log('Fixed duplicate planningNote!');
} else if (text.includes(search2)) {
    text = text.replace(search2, '    statusBadge: { EN: "40% — Project Initiation & Conceptual Design", PT: "40% — Project Initiation & Conceptual Design" },\n    infoNote: {');
    fs.writeFileSync(filePath, text, 'utf8');
    console.log('Fixed duplicate planningNote!');
} else {
    console.log('Could not find the duplicate planningNote text exactly.');
}
