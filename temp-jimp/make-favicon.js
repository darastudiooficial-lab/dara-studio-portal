const { Jimp } = require('jimp');

async function run() {
  try {
    const img = await Jimp.read('../client/public/assets/logos/logo-horizontal.png');
    // Crop only the 'D' part (width ~140, height 255)
    img.crop({ x: 0, y: 0, w: 140, h: 255 });
    // Autocrop extra transparent borders
    img.autocrop();
    // Contain within a 64x64 box to keep proportions and add transparent padding if needed
    img.contain({ w: 64, h: 64 });
    
    await img.write('../client/public/favicon.png');
    console.log('Favicon D created successfully');
  } catch (err) {
    console.error(err);
  }
}
run();
