const { Jimp } = require('jimp');

async function run() {
  const img = await Jimp.read('../client/public/assets/logos/logo-horizontal.png');
  const w = img.bitmap.width;
  const h = img.bitmap.height;
  
  let endOfD = -1;
  let inGap = false;
  
  for (let x = 0; x < 300; x++) {
    let hasSolidPixel = false;
    for (let y = 0; y < h; y++) {
      const idx = (w * y + x) << 2;
      const alpha = img.bitmap.data[idx + 3];
      if (alpha > 50) {
        hasSolidPixel = true;
        break;
      }
    }
    
    if (hasSolidPixel) {
      if (inGap) {
        // We hit the 'a'
        break;
      }
      endOfD = x;
    } else {
      if (endOfD !== -1) {
        inGap = true;
      }
    }
  }
  
  console.log('D ends exactly at x =', endOfD);
  
  const dImg = img.clone();
  dImg.crop({ x: 0, y: 0, w: endOfD + 1, h: h });
  dImg.autocrop();
  dImg.contain({ w: 64, h: 64 });
  await dImg.write('../client/public/favicon.png');
  console.log('Saved favicon exactly to the end of D');
}
run();
