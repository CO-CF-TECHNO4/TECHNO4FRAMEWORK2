import fs from 'node:fs';
import path from 'node:path';
import { fork } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import DemoImages from './js/demo-images.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CORE_DIST = path.resolve(
  __dirname,
  '../../packages/techno4-framework2-core/dist',
);

const THREADS_PACKAGE = path.resolve(
  __dirname,
  '../../packages/techno4-framework2-threads',
);
const THREADS_ENTRY = path.join(THREADS_PACKAGE, 'index.js');
const THREADS_PORT = process.env.TECHNO4_THREADS_PORT || 8000;

const CORE_FILES = {
  '/build/core/techno4-bundle.css': {
    file: path.join(CORE_DIST, 'techno4.bundle.css'),
    type: 'text/css',
  },
  '/build/core/techno4-bundle.js': {
    file: path.join(CORE_DIST, 'techno4.bundle.js'),
    type: 'application/javascript',
  },
  '/build/core/techno4.bundle.css': {
    file: path.join(CORE_DIST, 'techno4.bundle.css'),
    type: 'text/css',
  },
  '/build/core/techno4.bundle.js': {
    file: path.join(CORE_DIST, 'techno4.bundle.js'),
    type: 'application/javascript',
  },
};

const PAGES_DIR = path.resolve(__dirname, 'pages');

function serveFile(res, filePath, contentType) {
  res.setHeader('Content-Type', contentType);
  fs.createReadStream(filePath).pipe(res);
}

function techno4DevServer() {
  return {
    name: 'techno4-dev-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = decodeURIComponent((req.url || '').split('?')[0]);

        const core = CORE_FILES[url];
        if (core && fs.existsSync(core.file)) {
          serveFile(res, core.file, core.type);
          return;
        }

        if (url.startsWith('/pages/') && url.endsWith('.html')) {
          const filePath = path.resolve(__dirname, url.slice(1));
          const rel = path.relative(PAGES_DIR, filePath);
          const insidePages =
            rel && !rel.startsWith('..') && !path.isAbsolute(rel);

          if (insidePages && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            serveFile(res, filePath, 'text/html');
            return;
          }
        }

        if (url.startsWith('/img/')) {
          const imgPath = path.resolve(__dirname, url.slice(1));
          if (fs.existsSync(imgPath) && fs.statSync(imgPath).isFile()) {
            const ext = path.extname(imgPath).toLowerCase();
            const mime = ext === '.png' ? 'image/png' : (ext === '.jpg' || ext === '.jpeg') ? 'image/jpeg' : 'image/svg+xml';
            serveFile(res, imgPath, mime);
            return;
          }
        }

        if (url.startsWith('/placeholder/')) {
          const numMatch = url.match(/-(\d+)\./) || url.match(/\/(\d+)\/?$/);
          const id = numMatch ? parseInt(numMatch[1], 10) : 1;
          const isAvatar = url.includes('people') || url.includes('avatar') || url.includes('fashion') || url.includes('80x80') || url.includes('100x100') || url.includes('68x68') || url.includes('96x96') || url.includes('160x160');
          const type = isAvatar ? 'microchip' : (id % 3 === 0 ? 'synth' : (id % 2 === 0 ? 'pcb' : 'sensor'));
          const label = isAvatar ? 'MCU' : 'ELECTRONIC COMPONENT';
          const svgContent = DemoImages.svg(type, isAvatar ? 160 : 1000, isAvatar ? 160 : 700, id, label);
          res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
          res.end(svgContent);
          return;
        }

        next();
      });
    },
  };
}

function techno4ServerPlugin() {
  const isServerDisabled =
    process.argv.includes('--no-server') ||
    process.argv.includes('--without-server') ||
    process.argv.includes('--client-only') ||
    process.env.TECHNO4_SERVER === '0' ||
    process.env.NO_SERVER === '1';

  let serverProcess = null;

  return {
    name: 'techno4-server-plugin',
    configureServer(server) {
      // Status endpoint
      server.middlewares.use((req, res, next) => {
        const url = (req.url || '').split('?')[0];
        if (url === '/api/threads/status') {
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              enabled: !isServerDisabled,
              online: !isServerDisabled && serverProcess != null && !serverProcess.killed,
              port: THREADS_PORT,
              url: `http://localhost:${THREADS_PORT}`,
            }),
          );
          return;
        }
        if (url === '/api/hardware/serial') {
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              available: true,
              engine: 'Techno4 Hardware Serial Subsystem',
              ports: [
                { path: 'COM3', manufacturer: 'Silicon Labs CP210x USB to UART Bridge', status: 'ready' },
                { path: 'COM4', manufacturer: 'WCH CH340 Serial Converter', status: 'idle' }
              ],
              baudRates: [9600, 19200, 38400, 57600, 115200, 230400, 921600],
              defaultBaud: 115200,
              status: 'ready'
            }),
          );
          return;
        }
        next();
      });

      if (isServerDisabled) {
        console.log('\x1b[33m[Techno4 Server]\x1b[0m Server-category packages disabled (--no-server / client-only mode).');
        return;
      }

      console.log(`\x1b[36m[Techno4 Server]\x1b[0m Starting Threads Studio backend on port ${THREADS_PORT}...`);

      try {
        serverProcess = fork(THREADS_ENTRY, [THREADS_PORT.toString()], {
          cwd: THREADS_PACKAGE,
          env: {
            ...process.env,
            NODE_ENV: 'development',
            PORT: THREADS_PORT.toString(),
          },
          stdio: 'inherit',
        });

        serverProcess.on('error', (err) => {
          console.error('\x1b[31m[Techno4 Server Error]\x1b[0m', err.message);
        });

        serverProcess.on('exit', (code) => {
          if (code !== 0 && code != null) {
            console.warn(`\x1b[33m[Techno4 Server]\x1b[0m Process exited with code ${code}`);
          }
        });

        const cleanup = () => {
          if (serverProcess && !serverProcess.killed) {
            console.log('\x1b[36m[Techno4 Server]\x1b[0m Stopping Threads Studio backend...');
            try {
              serverProcess.kill('SIGTERM');
            } catch {}
          }
        };

        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);
        process.on('exit', cleanup);
      } catch (err) {
        console.error('\x1b[31m[Techno4 Server Error]\x1b[0m Failed to fork Threads server:', err);
      }
    },
  };
}

export default defineConfig({
  server: {
    port: 3000,
    fs: {
      allow: ['../..'],
    },
  },
  plugins: [techno4DevServer(), techno4ServerPlugin()],
});
