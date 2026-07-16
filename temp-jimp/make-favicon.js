const { Jimp } = require('jimp');

async function run() {
  try {
    const img = await Jimp.read('../client/public/assets/logos/logo-horizontal.png');
    // Crop the leftmost portion that contains just the icon
    // Height is 255, so we take a 270x255 chunk from the left
    img.crop({ x: 0, y: 0, w: 270, h: 255 });
    // Autocrop any extra transparent borders
    img.autocrop();
    // Resize to a square 64x64 for favicon
    img.resize({ w: 64, h: 64 });
    await img.write('../client/public/favicon.png');
    console.log('Favicon created successfully');
  } catch (err) {
    console.error(err);
  }
}
run();
