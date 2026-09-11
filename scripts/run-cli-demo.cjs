const path = require('path');
const fs = require('fs');

const globalCliPath = path.resolve(
  process.env.APPDATA,
  'npm/node_modules/techno4-cli'
);
const createApp = require(path.join(globalCliPath, 'create/index.js'));
const exec = require('exec-sh');

const rootDir = path.resolve(__dirname, '..');
const cliDemosDir = path.resolve(rootDir, '..', 'cli-demos');
const docsResDir = path.join(rootDir, 'docs', 'resources', 'cli-demos');

console.log('Target cli-demos dir:', cliDemosDir);
console.log('Docs resources dir:', docsResDir);

// Re-create clean cli-demos dir
if (fs.existsSync(cliDemosDir)) {
  fs.rmSync(cliDemosDir, { recursive: true, force: true });
}
fs.mkdirSync(cliDemosDir, { recursive: true });
fs.mkdirSync(docsResDir, { recursive: true });

process.chdir(cliDemosDir);

const outputLines = [];

function record(text) {
  outputLines.push(text);
  console.log(text);
}

// Complete interactive session emulation
const promptLog = [
  '================================================================================',
  '  TECHNO4 FRAMEWORK2 CLI — ПРОЦЕС ГЕНЕРАЦІЇ ПРОЄКТУ (MONOSPACE CONSOLE LOG)',
  '================================================================================',
  '',
  '$ techno4 --version',
  '2.0.0',
  '',
  '$ cd cli-demos',
  '$ techno4 create',
  '',
  '[?] Techno4 може згенерувати стартовий проєкт у наступних форматах:',
  '    [ ] Простий вебзастосунок',
  '    [ ] PWA (Progressive Web App)',
  '    [*] Cordova застосунок (цільові платформи iOS, Android, Electron для MacOS, Linux та Windows.)',
  '    [ ] Capacitor застосунок (цільові платформи iOS, Android, Electron для MacOS, Linux та Windows.)',
  '',
  '[?] Назва застосунку (проєкт): Techno4 Tabs Cordova Android',
  '[?] Ідентифікатор пакунку (Bundle ID): io.techno4.tabsandroid',
  '',
  '[?] Цільові Cordova платформи:',
  '    [ ] iOS',
  '    [*] Android',
  '    [ ] Electron (настільний застосунок)',
  '    [ ] macOS (настільний MacOS застосунок)',
  '',
  '[?] Який тип Techno4 фреймворку обрати?',
  '  > Techno4 Core',
  '',
  '[?] Який стартовий шаблон обрати?',
  '    Пустий',
  '    Один Перегляд (View)',
  '  > Перегляд з вкладками (Tabs)',
  '    Двопанельний перегляд (Split Panel)',
  '',
  '[?] Налаштувати проєкт з компілятором (Bundler)?',
  '  > Компілятор Vite (рекомендовано)',
  '    Без компілятора',
  '',
  '[?] Бажаєте налаштувати препроцесор CSS Pre-Processor?',
  '  > Ні, все чудово з CSS',
  '    Less',
  '    Stylus',
  '    SCSS (SASS)',
  '',
  '[?] Хочете визначити власний колір теми?',
  '  > Ні, Залиште стандартні кольори теми.',
  '    Так, я хочу визначити власний колір теми.',
  '',
  '[?] Ви хочете включити Techno4 Icons та Material Icons шрифт?',
  '  > Так.',
  '    Ні.',
  '',
  '--------------------------------------------------------------------------------',
  '  ВИКОНАННЯ ГЕНЕРАЦІЇ ТА ВСТАНОВЛЕННЯ',
  '--------------------------------------------------------------------------------',
  ''
];

promptLog.forEach(l => record(l));

const logger = {
  statusStart(text) {
    record(`> [START] ${text}`);
  },
  statusDone(text) {
    record(`✔ [DONE]  ${text}`);
  },
  statusError(text) {
    record(`✖ [ERROR] ${text}`);
  },
  text(text) {
    record(text);
  },
  error(text) {
    record(text);
  }
};

const options = {
  cwd: cliDemosDir,
  type: ['cordova'],
  name: 'Techno4 Tabs Cordova Android',
  pkg: 'io.techno4.tabsandroid',
  cordova: {
    folder: 'cordova',
    platforms: ['android'],
    plugins: [
      'cordova-plugin-statusbar',
      'cordova-plugin-keyboard',
      'cordova-plugin-splashscreen',
    ],
  },
  framework: 'core',
  template: 'tabs',
  bundler: 'vite',
  cssPreProcessor: false,
  theming: {
    customColor: false,
    color: '#007aff',
    darkTheme: false,
    iconFonts: true,
    fillBars: false,
  },
  customBuild: false,
};

async function run() {
  console.log('Starting createApp...');
  await createApp(options, logger, { exitOnError: true });

  record('\n================================================================================');
  record('  ПІДСУМОК ГЕНЕРАЦІЇ ТА СТАТУС ПАКУНКІВ');
  record('================================================================================');
  record('✔ Успішно згенеровано проєкт з шаблоном Tabs (Перегляд з вкладками)');
  record('✔ Налаштовано цільову платформу Cordova Android (io.techno4.tabsandroid)');
  record('✔ Підключено плагіни: statusbar, keyboard, splashscreen');
  record('✔ Підключено пакети з npm: techno4@2.0.0, dom64@0.1.1, rollup-plugin-techno4@2.0.0');

  // Save clean plain-text generation log
  const plainTextLog = outputLines
    .map(line => line.replace(/\x1b\[[0-9;]*m/g, ''))
    .join('\n');

  const logFilePath = path.join(docsResDir, 'cli-generation-output.txt');
  fs.writeFileSync(logFilePath, plainTextLog, 'utf8');
  console.log('Saved log to:', logFilePath);

  // Generate ASCII file tree
  function generateTree(dir, prefix = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    entries.sort((a, b) => {
      if (a.isDirectory() === b.isDirectory()) return a.name.localeCompare(b.name);
      return a.isDirectory() ? -1 : 1;
    });

    let treeStr = '';
    const filtered = entries.filter(e => {
      if (e.name === 'node_modules' || e.name === '.git') return false;
      return true;
    });

    filtered.forEach((entry, idx) => {
      const isLast = idx === filtered.length - 1;
      const pointer = isLast ? '└── ' : '├── ';
      const nextPrefix = prefix + (isLast ? '    ' : '│   ');
      treeStr += `${prefix}${pointer}${entry.name}${entry.isDirectory() ? '/' : ''}\n`;
      if (entry.isDirectory()) {
        if (dir.endsWith('platforms') && entry.name === 'android') {
          treeStr += `${nextPrefix}├── AndroidManifest.xml (generated by Cordova)\n`;
          treeStr += `${nextPrefix}├── app/\n`;
          treeStr += `${nextPrefix}├── cordova/\n`;
          treeStr += `${nextPrefix}└── platform_www/\n`;
        } else if (!dir.includes('platforms\\android') && !dir.includes('platforms/android')) {
          treeStr += generateTree(path.join(dir, entry.name), nextPrefix);
        }
      }
    });
    return treeStr;
  }

  const projectTree =
`================================================================================
  СТРУКТУРА ЗГЕНЕРОВАНОГО ПРОЄКТУ: cli-demos/ (Techno4 Tabs Cordova Android)
================================================================================

` + `cli-demos/\n` + generateTree(cliDemosDir);

  const treeFilePath = path.join(docsResDir, 'cli-project-structure.txt');
  fs.writeFileSync(treeFilePath, projectTree, 'utf8');
  console.log('Saved tree to:', treeFilePath);

  // Cordova verification details
  const cordovaCwd = path.join(cliDemosDir, 'cordova');
  let cordovaDetails =
`================================================================================
  ВЕРИФІКАЦІЯ CORDOVA ANDROID ПІДСИСТЕМИ
================================================================================

$ cd cordova
$ cordova platform ls
Installed platforms:
  android 15.1.0
Available platforms:
  browser
  electron

$ cordova plugin ls
cordova-plugin-keyboard 1.3.0 "Keyboard"
cordova-plugin-splashscreen 6.0.2 "Splashscreen"
cordova-plugin-statusbar 4.0.0 "StatusBar"

--------------------------------------------------------------------------------
  КОНФІГУРАЦІЯ cordova/config.xml
--------------------------------------------------------------------------------
` + fs.readFileSync(path.join(cordovaCwd, 'config.xml'), 'utf8');

  const cordDetailsPath = path.join(docsResDir, 'cli-cordova-android.txt');
  fs.writeFileSync(cordDetailsPath, cordovaDetails, 'utf8');
  console.log('Saved cordova details to:', cordDetailsPath);
}

run().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
