import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import less from 'less';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import CleanCSS from 'clean-css';
import { rollup } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { babel } from '@rollup/plugin-babel';
import { minify } from 'terser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const CORE_DIR = path.resolve(__dirname, '../packages/techno4-framework2-core');
const SRC_DIR = path.join(CORE_DIR, 'src');
const DIST_DIR = path.join(CORE_DIR, 'dist');

console.log('⚡ Starting Techno4 Framework Core build...');

// Ensure dist directory exists
fs.ensureDirSync(DIST_DIR);

// 1. Discover all components
const componentsDir = path.join(SRC_DIR, 'components');
const componentFolders = fs.readdirSync(componentsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

// Core base components that are imported directly in techno4.js
const baseCoreComponents = [
  'app', 'statusbar', 'view', 'navbar', 'toolbar', 'subnavbar',
  'touch-ripple', 'touch-highlight', 'modal', 'page', 'link', 'block',
  'list', 'badge', 'button', 'icon'
];

// Additional components to bundle
const additionalComponents = componentFolders.filter(c => !baseCoreComponents.includes(c));

function capitalize(name) {
  return name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

// 2. Build Styles
async function buildStyles() {
  console.log('🎨 Compiling LESS styles into CSS bundle...');

  const lessImports = additionalComponents
    .filter(c => fs.existsSync(path.join(componentsDir, c, `${c}.less`)))
    .map(c => `@import './components/${c}/${c}.less';`)
    .join('\n');

  let rawLess = fs.readFileSync(path.join(SRC_DIR, 'techno4.less'), 'utf8');
  
  // Inject component imports and variables
  let processedLess = rawLess
    .replace('$includeIosTheme', 'true')
    .replace('$includeMdTheme', 'true')
    .replace('$includeDarkTheme', 'true')
    .replace('$includeLightTheme', 'true')
    .replace('$rtl', 'false')
    .replace('//IMPORT_COMPONENTS', lessImports);

  // Core icons font plugin
  const fontFile = path.join(SRC_DIR, 'icons', 'font', 'techno4-core-icons.woff');
  const base64Font = fs.existsSync(fontFile)
    ? fs.readFileSync(fontFile).toString('base64')
    : '';

  const coreIconsPlugin = {
    install(lessInstance, pluginManager, functions) {
      functions.add('techno4_coreIconsFont', () => {
        return base64Font;
      });
    },
  };

  // Compile with LESS
  const lessResult = await less.render(processedLess, {
    paths: [SRC_DIR, path.join(SRC_DIR, 'less'), path.join(ROOT_DIR, 'node_modules'), path.join(CORE_DIR, 'node_modules')],
    filename: path.join(SRC_DIR, 'techno4.less'),
    plugins: [coreIconsPlugin],
  });

  // Autoprefix with PostCSS
  const postCssResult = await postcss([autoprefixer]).process(lessResult.css, {
    from: undefined,
  });

  // Save unminified CSS
  const cssPath = path.join(DIST_DIR, 'techno4.bundle.css');
  fs.writeFileSync(cssPath, postCssResult.css, 'utf8');

  // Minify with CleanCSS
  const minified = new CleanCSS({ compatibility: '*' }).minify(postCssResult.css);
  const minCssPath = path.join(DIST_DIR, 'techno4.bundle.min.css');
  fs.writeFileSync(minCssPath, minified.styles, 'utf8');

  // Copy icon fonts
  const srcFonts = path.join(SRC_DIR, 'icons', 'font');
  const distFonts = path.join(DIST_DIR, 'icons', 'font');
  if (fs.existsSync(srcFonts)) {
    fs.copySync(srcFonts, distFonts);
  }

  console.log(`✅ CSS generated: ${cssPath} (${Math.round(minified.styles.length / 1024)} KB minified)`);
}

// 3. Build JavaScript Bundles
async function buildJs() {
  console.log('📦 Bundling JavaScript modules with Rollup...');

  // Prepare component imports for bundle
  const jsImports = additionalComponents
    .filter(c => fs.existsSync(path.join(componentsDir, c, `${c}.js`)))
    .map(c => ({
      name: c,
      exportName: capitalize(c),
      path: `./components/${c}/${c}.js`
    }));

  const importStatements = jsImports
    .map(c => `import ${c.exportName} from '${c.path}';`)
    .join('\n');

  const installStatements = jsImports
    .map(c => c.exportName)
    .join(',\n  ');

  let rawJs = fs.readFileSync(path.join(SRC_DIR, 'techno4.js'), 'utf8');

  // Generate complete bundle entry point
  const bundleJsCode = rawJs
    .replace('//IMPORT_COMPONENTS', importStatements)
    .replace('//IMPORT_HELPERS', "import * as utils from './shared/utils.js';\nimport { getSupport } from './shared/get-support.js';\nimport { getDevice } from './shared/get-device.js';")
    .replace('//NAMED_EXPORT', 'export { Component, $jsx, $ as Dom64, utils, getDevice, getSupport, createStore };')
    + `\nTechno4.use([\n  ${installStatements}\n]);\n`;

  const tempBundleEntry = path.join(SRC_DIR, 'techno4-bundle.temp.js');
  fs.writeFileSync(tempBundleEntry, bundleJsCode, 'utf8');

  try {
    const basePlugins = [
      nodeResolve(),
      replace({
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': JSON.stringify('production'),
        },
      }),
      babel({
        babelHelpers: 'bundled',
        extensions: ['.js', '.jsx'],
        presets: [
          ['@babel/preset-react', { pragma: '$jsx' }],
        ],
      }),
    ];

    // 1. ESM output (dependencies can remain external for bundlers)
    const esmBundle = await rollup({
      input: tempBundleEntry,
      plugins: basePlugins,
      external: ['swiper', 'htm', 'path-to-regexp', 'skeleton-elements', 'ssr-window'],
    });

    const esmPath = path.join(DIST_DIR, 'techno4.esm.js');
    await esmBundle.write({
      file: esmPath,
      format: 'es',
      banner: '/* Techno4 Framework v2.0.0 (ESM) */',
    });

    // 2. Standalone UMD bundle (inlines htm, ssr-window, path-to-regexp, skeleton-elements)
    const umdBundle = await rollup({
      input: tempBundleEntry,
      plugins: basePlugins,
      external: [],
    });

    const umdPath = path.join(DIST_DIR, 'techno4.bundle.js');
    const umdResult = await umdBundle.write({
      file: umdPath,
      format: 'umd',
      name: 'Techno4',
      exports: 'named',
      banner: '/* Techno4 Framework v2.0.0 (Bundle) */',
    });

    // 3. Minify UMD bundle with Terser
    const minified = await minify(umdResult.output[0].code, {
      sourceMap: false,
    });
    const minJsPath = path.join(DIST_DIR, 'techno4.bundle.min.js');
    fs.writeFileSync(minJsPath, minified.code, 'utf8');

    console.log(`✅ JS generated: ${esmPath}`);
    console.log(`✅ UMD bundle generated: ${umdPath} (${Math.round(minified.code.length / 1024)} KB minified)`);
  } finally {
    // Cleanup temporary bundle entry file
    if (fs.existsSync(tempBundleEntry)) {
      fs.removeSync(tempBundleEntry);
    }
  }
}

// 4. Copy typings
function copyTypings() {
  const dtsFiles = ['techno4.d.ts', 'techno4-types.d.ts', 'techno4.css.d.ts'];
  for (const file of dtsFiles) {
    const src = path.join(SRC_DIR, file);
    if (fs.existsSync(src)) {
      fs.copySync(src, path.join(DIST_DIR, file));
    }
  }
  console.log('✅ TypeScript definitions copied to dist');
}

async function run() {
  try {
    await buildStyles();
    await buildJs();
    copyTypings();
    console.log('\n🎉 Techno4 Framework Core successfully built in Windows!');
  } catch (err) {
    console.error('❌ Build failed with message:', err.message);
    if (err.code) console.error('Error Code:', err.code);
    if (err.loc) console.error('Location:', err.loc);
    if (err.frame) console.error('Frame:', err.frame);
    if (err.id) console.error('File ID:', err.id);
    process.exit(1);
  }
}

run();
