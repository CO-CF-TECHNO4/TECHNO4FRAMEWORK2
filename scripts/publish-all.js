import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const packages = [
  'packages/techno4-framework2-dom64',
  'packages/techno4-framework2-rollup',
  'packages/techno4-framework2-core',
  'packages/techno4-framework2-total',
  'packages/techno4-framework2-threads-components',
  'packages/techno4-framework2-threads',
  'packages/techno4-framework2-cli'
];

const otpArg = process.argv.find(a => a.startsWith('--otp='));
const otp = otpArg ? ` ${otpArg}` : '';

console.log('\n==================================================');
console.log('  TECHNO4 FRAMEWORK 2 - NPM PUBLISH PIPELINE');
console.log('==================================================\n');

for (const pkg of packages) {
  const pkgDir = path.resolve(ROOT, pkg);
  console.log(`\n🚀 [Publishing] ${pkg}...`);
  try {
    execSync(`npm publish --access public${otp}`, { cwd: pkgDir, stdio: 'inherit' });
    console.log(`✅ [Success] Published ${pkg}`);
  } catch (err) {
    console.error(`\n❌ [Error] Failed to publish ${pkg}`);
    process.exit(1);
  }
}

console.log('\n==================================================');
console.log('  🎉 ALL 7 PACKAGES SUCCESSFULLY PUBLISHED TO NPM!');
console.log('==================================================\n');
