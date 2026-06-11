import fs from 'fs';
import path from 'path';

const file = 'client/src/pages/InteriorReference.jsx';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('`')) {
    console.log(`${i+1}: ${l}`);
  }
});
