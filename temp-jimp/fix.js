const { Jimp } = require('jimp');
const path = require('path');

const srcDir = '../client/public/assets/logos';

async function processImage(filename) {
    try {
        const filePath = path.join(srcDir, filename);
        const image = await Jimp.read(filePath);
        
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
            const red = this.bitmap.data[idx + 0];
            const green = this.bitmap.data[idx + 1];
            const blue = this.bitmap.data[idx + 2];
            
            if (red > 240 && green > 240 && blue > 240) {
                this.bitmap.data[idx + 3] = 0; // set alpha to 0
            }
        });
        
        await image.write(filePath);
        console.log('Processed', filename);
    } catch(err) {
        console.error('Error on', filename, err);
    }
}

async function main() {
    await processImage('logo-horizontal.png');
    await processImage('logo-stacked.png');
    await processImage('logo-horizontal-subtitle.png');
}

main().catch(console.error);
