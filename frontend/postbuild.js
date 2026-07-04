import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const src = path.join(__dirname, 'dist', 'index.html');
const dest = path.join(__dirname, 'dist', '404.html');

try {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log('Successfully created dist/404.html for SPA router fallback!');
  } else {
    console.error('Error: dist/index.html not found! Make sure vite build ran first.');
  }
} catch (err) {
  console.error('Failed to create 404.html fallback:', err);
}
