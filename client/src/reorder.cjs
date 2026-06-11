const fs = require('fs');
const path = 'd:/DARA Studio - Portal/client/src/pages/Services.jsx';
let content = fs.readFileSync(path, 'utf-8');

const match = content.match(/const SERVICES_DATA = \[([\s\S]*?)\];\s*export default/);
if (!match) {
    console.error("Could not match SERVICES_DATA");
    process.exit(1);
}

const arrayContent = match[1].trim();

// Split the array content into individual object strings
let blocks = arrayContent.split(/  \},\r?\n  \{/);

// Add back the braces that were split off
blocks = blocks.map((b, i) => {
    let block = b;
    // If it's not the first block, we removed its leading '  {'
    if (i !== 0 && !block.trim().startsWith('{')) block = '  {\n' + block;
    // If it's not the last block, we removed its trailing '  }'
    if (i !== blocks.length - 1 && !block.trim().endsWith('}')) block = block + '\n  }';
    return block;
});

const getId = (block) => {
    const m = block.match(/id:\s*"([^"]+)"/);
    return m ? m[1] : null;
};

const idToBlock = {};
blocks.forEach(b => {
    idToBlock[getId(b)] = b;
});

const order = [
    'drafting',
    'redrawing',
    'viz',
    'permit_processing',
    'wood_frame',
    'pdf_cad',
    'office_support'
];

const newBlocks = order.map(id => idToBlock[id]).filter(Boolean);
if (newBlocks.length !== blocks.length) {
    console.error("Mismatch in count", blocks.length, newBlocks.length);
    console.log("Found ids:", Object.keys(idToBlock));
    process.exit(1);
}

const newArrayContent = '[\n' + newBlocks.join(',\n') + '\n]';
const newContent = content.replace(/const SERVICES_DATA = \[[\s\S]*?\]/, 'const SERVICES_DATA = ' + newArrayContent);

fs.writeFileSync(path, newContent, 'utf-8');
console.log("Success");
