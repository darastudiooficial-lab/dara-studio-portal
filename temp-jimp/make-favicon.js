const { Jimp } = require('jimp');

async function run() {
  try {
    const img = await Jimp.read('../client/public/assets/logos/logo-horizontal.png');
    
    console.log('Original dimensions:', img.bitmap.width, 'x', img.bitmap.height);
    
    // We want the 'D'. The full width is around 1000? Let's check.
    // I will crop a square from the left edge equal to the height
    const h = img.bitmap.height;
    // Assuming the D is at most as wide as it is tall
    img.crop({ x: 0, y: 0, w: h, h: h });
    
    img.autocrop();
    console.log('Cropped dimensions (should be just D or Da):', img.bitmap.width, 'x', img.bitmap.height);
    
    img.contain({ w: 64, h: 64 });
    
    await img.write('../client/public/favicon.png');
    console.log('Favicon created successfully');
  } catch (err) {
    console.error(err);
  }
}
run();
