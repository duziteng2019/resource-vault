// SVG to PNG converter using sharp
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'miniprogram', 'images');
const files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.png') || f.endsWith('.svg'));

async function convertSvgToPng(inputFile, outputFile) {
  const inputPath = path.join(imagesDir, inputFile);
  const outputPath = path.join(imagesDir, outputFile);
  
  if (inputFile.endsWith('.svg')) {
    try {
      const svgBuffer = fs.readFileSync(inputPath);
      // Set size based on icon type
      let size = 81; // default for tabBar
      if (inputFile.includes('empty') || inputFile.includes('logo')) size = 200;
      if (inputFile.includes('feature')) size = 80;
      if (inputFile.includes('share-icon')) size = 100;
      
      await sharp(svgBuffer, { density: 300 })
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      // Remove original SVG
      fs.unlinkSync(inputPath);
      console.log(`✓ ${outputFile}`);
    } catch (err) {
      console.error(`✗ Error converting ${inputFile}:`, err.message);
    }
  }
}

async function main() {
  console.log('开始转换SVG到PNG...');
  for (const file of files) {
    const baseName = path.basename(file, path.extname(file));
    await convertSvgToPng(file, baseName + '.png');
  }
  console.log('转换完成！');
}

main();
