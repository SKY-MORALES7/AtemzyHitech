import fs from 'fs';
import path from 'path';

const baseDir = path.resolve('public/planet');
const texturesDir = path.resolve(baseDir, 'textures');

fs.mkdirSync(texturesDir, { recursive: true });

const files = [
  'scene.gltf',
  'scene.bin',
  'textures/Clouds_baseColor.png',
  'textures/Planet_baseColor.png'
];

async function download() {
  for (const file of files) {
    const url = `http://localhost:5174/planet/${file}`;
    console.log(`Downloading ${url}...`);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
        continue;
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      const dest = path.resolve(baseDir, file);
      fs.writeFileSync(dest, buffer);
      console.log(`Saved ${file} (${buffer.length} bytes) to ${dest}`);
    } catch (err) {
      console.error(`Error downloading ${file}:`, err);
    }
  }
  console.log('Download complete.');
}

download();
