import fs from 'node:fs';
import path from 'node:path';

const outputDir = path.resolve('dist');
const manifestPath = path.join(outputDir, 'manifest.webmanifest');
const publicBase = '/Brahmacharya-UI/';

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
manifest.id = publicBase;
manifest.start_url = publicBase;
manifest.scope = publicBase;

for (const icon of manifest.icons ?? []) {
  const filename = path.basename(new URL(icon.src, 'https://example.invalid/').pathname);
  const filePath = path.join(outputDir, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Manifest icon file does not exist in dist/: ${filename}`);
  }
  icon.src = `${publicBase}${filename}`;
}

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest)}\n`);
