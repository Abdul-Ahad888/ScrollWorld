import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, 'public', 'assets', 'frames');
const outputDir = path.join(__dirname, 'public', 'assets', 'webp');

// check input folder
if (!fs.existsSync(inputDir)) {
  console.error('❌ Input folder not found:', inputDir);
  process.exit(1);
}

// create output folder if missing
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdirSync(inputDir).forEach(file => {
  if (/\.(jpg|jpeg)$/i.test(file)) {
    sharp(path.join(inputDir, file))
      .webp({ quality: 80 })
      .toFile(
        path.join(outputDir, `${path.parse(file).name}.webp`)
      )
      .then(() => console.log(`✅ ${file} converted`))
      .catch(err => console.error(err));
  }
});
