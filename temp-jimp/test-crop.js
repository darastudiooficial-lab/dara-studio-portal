const { Jimp } = require('jimp');

async function run() {
  const orig = await Jimp.read('../client/public/assets/logos/logo-horizontal.png');
  for (let w = 150; w <= 220; w += 10) {
    const clone = orig.clone();
    clone.crop({ x: 0, y: 0, w: w, h: 255 });
    clone.autocrop();
    console.log('Cutoff', w, '-> Autocrop width:', clone.bitmap.width);
  }
}
run();
