const { Jimp } = require('jimp');
async function run() {
  const img = await Jimp.read('../client/public/assets/logos/logo-horizontal.png');
  console.log('width:', img.bitmap.width, 'height:', img.bitmap.height);
}
run();
