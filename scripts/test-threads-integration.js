// Automated Integration Test Suite for Techno4 Framework 2 Visual Workflow & Threads Studio
// Verifies package dependencies, engine startup, HTTP endpoints (/ and /designer/), clean shutdown, and Vite server plugin flag logic.

import fs from 'node:fs';
import path from 'node:path';
import { fork } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const THREADS_PKG = path.resolve(ROOT_DIR, 'packages/techno4-framework2-threads');
const BOONKER_DIR = fs.existsSync(path.resolve(ROOT_DIR, 'apps/techno4-framework2-boonker'))
  ? path.resolve(ROOT_DIR, 'apps/techno4-framework2-boonker')
  : path.resolve(ROOT_DIR, 'apps/boonker');

const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m'
};

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (!condition) {
    failed++;
    console.error('  ' + ANSI.red + 'FAIL:' + ANSI.reset + ' ' + message);
    throw new Error(message);
  } else {
    passed++;
    console.log('  ' + ANSI.green + 'PASS:' + ANSI.reset + ' ' + message);
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, maxAttempts = 15, delayMs = 500) {
  for (let i = 1; i <= maxAttempts; i++) {
    try {
      const res = await fetch(url);
      return res;
    } catch (err) {
      if (i === maxAttempts) throw err;
      await sleep(delayMs);
    }
  }
}

async function runTests() {
  console.log('\n' + ANSI.bold + ANSI.cyan + '==================================================' + ANSI.reset);
  console.log(ANSI.bold + ANSI.cyan + '  TECHNO4 FRAMEWORK 2 - THREADS STUDIO TEST SUITE' + ANSI.reset);
  console.log(ANSI.bold + ANSI.cyan + '==================================================' + ANSI.reset + '\n');

  // TEST 1: Package Dependencies & Structural Integrity
  console.log(ANSI.bold + '[Test 1] Package Dependencies & Structure' + ANSI.reset);
  const pkgJsonPath = path.join(THREADS_PKG, 'package.json');
  assert(fs.existsSync(pkgJsonPath), 'techno4-threads package.json exists');

  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  assert(pkgJson.name === 'techno4-threads', 'Package name is techno4-threads');
  assert(pkgJson.dependencies && pkgJson.dependencies['techno4-total'] != null, 'Dependency "techno4-total" is defined');
  assert(!pkgJson.dependencies['total5'], 'Legacy "total5" dependency is completely removed');

  const indexJsPath = path.join(THREADS_PKG, 'index.js');
  assert(fs.existsSync(indexJsPath), 'index.js entry point exists');
  const indexJsContent = fs.readFileSync(indexJsPath, 'utf8');
  assert(indexJsContent.includes("require('techno4-total')"), 'index.js strictly requires techno4-total');
  assert(indexJsContent.includes('function start'), 'index.js exports start() programmatic API');
  assert(indexJsContent.includes('function stop'), 'index.js exports stop() programmatic API');

  const authJsPath = path.join(THREADS_PKG, 'definitions/auth.js');
  assert(fs.existsSync(authJsPath), 'definitions/auth.js exists');
  const authJsContent = fs.readFileSync(authJsPath, 'utf8');
  assert(authJsContent.includes('CONF.autologin'), 'definitions/auth.js contains autologin support for embedded mode');

  // TEST 2: Boonker App Route & Page Integration
  console.log('\n' + ANSI.bold + '[Test 2] Boonker Page & Route Registration' + ANSI.reset);
  const threadsPagePath = path.join(BOONKER_DIR, 'pages/threads.html');
  assert(fs.existsSync(threadsPagePath), 'threads.html exists');

  const threadsPageContent = fs.readFileSync(threadsPagePath, 'utf8');
  assert(threadsPageContent.includes('class="page page-threads"'), 'threads.html has page-threads class');
  assert(threadsPageContent.includes('/api/threads/status'), 'threads.html polls /api/threads/status');
  assert(threadsPageContent.includes('threads-offline-banner'), 'threads.html contains offline fallback banner');
  assert(threadsPageContent.includes('threads-iframe-container'), 'threads.html contains iframe canvas container');

  const routesJsPath = path.join(BOONKER_DIR, 'js/routes.js');
  const routesJsContent = fs.readFileSync(routesJsPath, 'utf8');
  assert(routesJsContent.includes("path: '/threads/'"), 'Route /threads/ is registered in routes.js');
  assert(routesJsContent.includes("componentUrl: './pages/threads.html'"), 'Route points to ./pages/threads.html');

  const homeHtmlPath = path.join(BOONKER_DIR, 'pages/home.html');
  const homeHtmlContent = fs.readFileSync(homeHtmlPath, 'utf8');
  assert(homeHtmlContent.includes('href="/threads/"'), 'Navigation link to /threads/ exists in home.html');

  // TEST 3: Server Parameter / Mode Flags Logic
  console.log('\n' + ANSI.bold + '[Test 3] Server Execution Flags & Offline Mode' + ANSI.reset);
  const viteConfigPath = path.join(BOONKER_DIR, 'vite.config.js');
  const viteConfigContent = fs.readFileSync(viteConfigPath, 'utf8');
  assert(viteConfigContent.includes('--no-server'), 'vite.config.js checks for --no-server');
  assert(viteConfigContent.includes('--client-only'), 'vite.config.js checks for --client-only');
  assert(viteConfigContent.includes('TECHNO4_SERVER'), 'vite.config.js checks for TECHNO4_SERVER');
  assert(viteConfigContent.includes('/api/threads/status'), 'vite.config.js exposes /api/threads/status endpoint');

  // TEST 4: Live Server Boot & HTTP Endpoints
  console.log('\n' + ANSI.bold + '[Test 4] Live Threads Engine Boot & HTTP Routes' + ANSI.reset);
  const TEST_PORT = 19898;

  const serverProcess = fork('index.js', [TEST_PORT.toString()], {
    cwd: THREADS_PKG,
    stdio: 'pipe',
    env: {
      ...process.env,
      PORT: TEST_PORT.toString(),
      NODE_ENV: 'development'
    }
  });

  let serverLogs = '';
  serverProcess.stdout.on('data', d => serverLogs += d);
  serverProcess.stderr.on('data', d => serverLogs += d);

  try {
    // Wait for server to respond on index /
    const indexRes = await fetchWithRetry(`http://127.0.0.1:${TEST_PORT}/`);
    assert(indexRes.status === 200, `GET / returned HTTP 200 on port ${TEST_PORT}`);
    const indexHtml = await indexRes.text();
    assert(indexHtml.includes('<title>') && indexHtml.length > 500, 'GET / returned valid HTML page');

    // Wait for designer /designer/
    const designerRes = await fetchWithRetry(`http://127.0.0.1:${TEST_PORT}/designer/`);
    assert(designerRes.status === 200, `GET /designer/ returned HTTP 200`);
    const designerHtml = await designerRes.text();
    assert(designerHtml.includes('designer') || designerHtml.length > 500, 'GET /designer/ returned valid designer HTML');

    // TEST 5: Clean Process Lifecycle & Shutdown
    console.log('\n' + ANSI.bold + '[Test 5] Graceful Shutdown & Process Isolation' + ANSI.reset);
    const exitPromise = new Promise((resolve) => {
      serverProcess.on('exit', (code, signal) => {
        resolve({ code, signal });
      });
    });

    serverProcess.kill('SIGTERM');
    const exitResult = await exitPromise;
    assert(exitResult.signal === 'SIGTERM' || exitResult.code === 0, 'Threads server process terminated cleanly via SIGTERM');

    // Verify port is released
    await sleep(200);
    let portReleased = false;
    try {
      await fetch(`http://127.0.0.1:${TEST_PORT}/`);
    } catch {
      portReleased = true;
    }
    assert(portReleased, 'Test port 19898 was cleanly released after server process shutdown');

  } catch (err) {
    if (!serverProcess.killed) {
      serverProcess.kill('SIGTERM');
    }
    console.error('SERVER LOGS AT FAILURE:\n', serverLogs);
    throw err;
  }

  console.log('\n' + ANSI.bold + ANSI.green + '==================================================' + ANSI.reset);
  console.log(ANSI.bold + ANSI.green + `  ALL ${passed} THREADS INTEGRATION TESTS PASSED!` + ANSI.reset);
  console.log(ANSI.bold + ANSI.green + '==================================================' + ANSI.reset + '\n');
  process.exit(0);
}

runTests().catch(err => {
  console.error('\n' + ANSI.bold + ANSI.red + 'FATAL ERROR IN THREADS TEST SUITE:' + ANSI.reset, err);
  process.exit(1);
});
