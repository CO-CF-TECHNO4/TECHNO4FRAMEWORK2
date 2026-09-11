import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

console.log('🧹 Cleaning build artifacts and runtime temporary files...');

const targetsToRemove = [
  // Core dist
  path.join(ROOT_DIR, 'packages/techno4-framework2-core/dist'),
  path.join(ROOT_DIR, 'packages/techno4-framework2-core/src/techno4-bundle.temp.js'),

  // Dom64 build/package
  path.join(ROOT_DIR, 'packages/techno4-framework2-dom64/build'),
  path.join(ROOT_DIR, 'packages/techno4-framework2-dom64/package'),

  // Boonker dist
  path.join(ROOT_DIR, 'apps/techno4-framework2-boonker/dist'),

  // Root temporary databases and logs
  path.join(ROOT_DIR, 'databases'),
  path.join(ROOT_DIR, 'logs'),

  // Threads runtime files
  path.join(ROOT_DIR, 'packages/techno4-framework2-threads/databases'),
  path.join(ROOT_DIR, 'packages/techno4-framework2-threads/logs'),
  path.join(ROOT_DIR, 'packages/techno4-framework2-threads/index.js.json'),
  path.join(ROOT_DIR, 'packages/techno4-framework2-threads/index.js.map'),
];

let removedCount = 0;

for (const target of targetsToRemove) {
  if (fs.existsSync(target)) {
    try {
      fs.removeSync(target);
      console.log(`  ✓ Removed: ${path.relative(ROOT_DIR, target)}`);
      removedCount++;
    } catch (err) {
      console.warn(`  ⚠ Could not remove ${path.relative(ROOT_DIR, target)}: ${err.message}`);
    }
  }
}

// Remove any *.tgz archives in packages and root
const findAndRemoveTgz = (dir) => {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory() && item.name !== 'node_modules' && item.name !== '.git') {
      findAndRemoveTgz(fullPath);
    } else if (item.isFile() && item.name.endsWith('.tgz')) {
      fs.removeSync(fullPath);
      console.log(`  ✓ Removed package tarball: ${path.relative(ROOT_DIR, fullPath)}`);
      removedCount++;
    }
  }
};

findAndRemoveTgz(ROOT_DIR);

console.log(`✨ Cleanup complete! (${removedCount} items cleaned)\n`);
