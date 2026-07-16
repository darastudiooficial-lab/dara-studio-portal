const { Jimp, rgbaToInt } = require('jimp');

async function run() {
  try {
    const img = await Jimp.read('../client/public/assets/logos/logo-horizontal.png');
    const h = img.bitmap.height;
    
    // Scan columns to find the gap between D and a
    let startD = -1;
    let endD = -1;
    
    for (let x = 0; x < 300; x++) {
      let isTransparentColumn = true;
      for (let y = 0; y < h; y++) {
        const color = Jimp.intToRGBA(img.getPixelColor(x, y));
        if (color.a > 10) { // not fully transparent
          isTransparentColumn = false;
          break;
        }
      }
      
      if (!isTransparentColumn && startD === -1) {
        startD = x;
      } else if (isTransparentColumn && startD !== -1 && endD === -1) {
        // we found the gap after D
        endD = x;
        break;
      }
    }
    
    console.log('D starts at', startD, 'and ends at', endD);
    
    if (startD !== -1 && endD !== -1) {
      img.crop({ x: startD, y: 0, w: endD - startD, h: h });
      img.autocrop();
      img.contain({ w: 64, h: 64 });
      await img.write('../client/public/favicon.png');
      console.log('Favicon correctly cropped to just D');
    }
  } catch (err) {
    console.error(err);
  }
}
run();
