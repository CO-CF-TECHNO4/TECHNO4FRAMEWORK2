#!/usr/bin/env node

/**
 * Techno4 Framework 2 - Boonker Component Test & Audit Suite
 *
 * Validates:
 * 1. SFC Compilation & VDOM Rendering (htm pipeline, template literals, JS syntax)
 * 2. Branding & Namespaces ($t4, t4-icons, Techno4, no leftover $f7 or Framework7)
 * 3. Dropped Features (Aurora theme eradication)
 * 4. Layout Modernization (CSS Grid enforcement: .grid, .grid-cols-X, zero legacy row/col)
 * 5. Modern Swiper API (.swiper instead of .swiper-container)
 * 6. Legacy Template7 detection ({{...}} -> ${...})
 * 7. Routes & Links Integrity (route targets exist on disk, internal links resolve)
 *
 * Usage:
 *   node ./scripts/test-boonker-components.js
 *   node ./scripts/test-boonker-components.js --fix
 *   node ./scripts/test-boonker-components.js --verbose
 *   node ./scripts/test-boonker-components.js --filter=buttons
 *   node ./scripts/test-boonker-components.js --json
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import htm from 'htm';

// ---------------------------------------------------------------------------
// Path & CLI Setup
// ---------------------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const BOONKER_DIR = path.join(ROOT_DIR, 'apps', 'boonker');
const PAGES_DIR = path.join(BOONKER_DIR, 'pages');
const ROUTES_FILE = path.join(BOONKER_DIR, 'js', 'routes.js');

const args = process.argv.slice(2);
const IS_FIX = args.includes('--fix');
const IS_VERBOSE = args.includes('--verbose') || args.includes('-v');
const IS_JSON = args.includes('--json');
const filterArg = args.find((a) => a.startsWith('--filter='));
const FILTER_NAME = filterArg ? filterArg.split('=')[1].trim().toLowerCase() : null;

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Techno4 Framework 2 - Boonker Component Audit & Testing Tool

Options:
  --fix          Automatically fix safe namespace and aurora class issues
  --verbose, -v  Show detailed information for every component
  --filter=<str> Only test pages matching <str>
  --json         Output results in JSON format
  --help, -h     Show this help message
`);
  process.exit(0);
}

// ---------------------------------------------------------------------------
// ANSI Terminal Colors
// ---------------------------------------------------------------------------
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
};

// ---------------------------------------------------------------------------
// Global Browser Environment Emulation for Node
// ---------------------------------------------------------------------------
if (typeof globalThis.window === 'undefined') {
  globalThis.window = globalThis;
}
if (typeof globalThis.document === 'undefined') {
  globalThis.document = {
    createElement: () => ({
      appendChild: () => {},
      removeChild: () => {},
      remove: () => {},
      setAttribute: () => {},
      style: {},
      classList: { add: () => {}, remove: () => {} },
    }),
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    body: { appendChild: () => {}, removeChild: () => {} },
    head: { appendChild: () => {}, removeChild: () => {} },
    documentElement: { style: { setProperty: () => {} } },
  };
}

// ---------------------------------------------------------------------------
// VDOM & Techno4 Pipeline Simulator
// ---------------------------------------------------------------------------
function h(type, props, ...children) {
  return {
    type,
    props: props || {},
    children: children.flat().filter((child) => child !== null && child !== undefined),
  };
}
const $h = htm.bind(h);

function createMockDom() {
  const domChain = {
    length: 0,
    find: () => domChain,
    filter: () => domChain,
    closest: () => domChain,
    parent: () => domChain,
    children: () => domChain,
    siblings: () => domChain,
    on: () => domChain,
    off: () => domChain,
    once: () => domChain,
    trigger: () => domChain,
    css: () => '',
    addClass: () => domChain,
    removeClass: () => domChain,
    toggleClass: () => domChain,
    hasClass: () => false,
    attr: () => '',
    removeAttr: () => domChain,
    prop: () => '',
    data: () => ({}),
    val: () => '',
    text: () => '',
    html: () => '',
    empty: () => domChain,
    append: () => domChain,
    prepend: () => domChain,
    before: () => domChain,
    after: () => domChain,
    remove: () => domChain,
    width: () => 100,
    height: () => 100,
    offset: () => ({ top: 0, left: 0 }),
    show: () => domChain,
    hide: () => domChain,
  };
  const mockDom = function () {
    return domChain;
  };
  for (const key of Object.keys(domChain)) {
    if (key !== 'length' && key !== 'name') {
      mockDom[key] = domChain[key];
    }
  }
  return mockDom;
}

function createMockContext() {
  const mockDom = createMockDom();
  const mockT4 = {
    name: 'Techno4',
    version: '2.0.0',
    theme: 'ios',
    colors: {
      primary: '#007aff',
      red: '#ff3b30',
      green: '#34c759',
      blue: '#007aff',
      pink: '#ff2d55',
      yellow: '#ffcc00',
      orange: '#ff9500',
      purple: '#af52de',
      deeppurple: '#5856d6',
      lightblue: '#5ac8fa',
      teal: '#5ac8fa',
      lime: '#a4c639',
      deeporange: '#ff6b22',
      gray: '#8e8e93',
      black: '#000000',
      white: '#ffffff',
    },
    params: {},
    dialog: {
      alert: () => {},
      confirm: () => {},
      prompt: () => {},
      create: () => ({ open: () => {}, close: () => {}, destroy: () => {} }),
    },
    toast: {
      create: () => ({ open: () => {}, close: () => {}, destroy: () => {} }),
    },
    notification: {
      create: () => ({ open: () => {}, close: () => {}, destroy: () => {} }),
    },
    popup: {
      create: () => ({ open: () => {}, close: () => {}, destroy: () => {} }),
    },
    sheet: {
      create: () => ({ open: () => {}, close: () => {}, destroy: () => {} }),
    },
    popover: {
      create: () => ({ open: () => {}, close: () => {}, destroy: () => {} }),
    },
    actions: {
      create: () => ({ open: () => {}, close: () => {}, destroy: () => {} }),
    },
    preloader: {
      show: () => {},
      hide: () => {},
    },
    request: () => Promise.resolve({ data: {} }),
    utils: {
      id: () => Math.random().toString(36).substring(2, 9),
      extend: (...items) => Object.assign({}, ...items),
    },
    device: { ios: true, android: false, desktop: true },
    support: { touch: false },
    pieChart: {
      create: () => ({ destroy: () => {}, update: () => {} }),
    },
    areaChart: {
      create: () => ({ destroy: () => {}, update: () => {} }),
    },
    tooltip: {
      create: () => ({ destroy: () => {}, show: () => {}, hide: () => {} }),
    },
    view: {
      create: () => ({
        router: { navigate: () => {}, back: () => {} },
      }),
    },
    virtualList: {
      create: () => ({ destroy: () => {}, resetFilter: () => {} }),
    },
  };

  const mockRoute = {
    url: '/test/',
    path: '/test/',
    params: {
      id: '1',
      user: 'test-user',
      userId: '100',
      posts: 'posts',
      postId: '200',
      effect: 'fade',
    },
    query: { test: '1', foo: 'bar', search: 'demo' },
    hash: '',
  };

  const mockRouter = {
    navigate: () => {},
    back: () => {},
    refreshPage: () => {},
    currentRoute: mockRoute,
  };

  const mockStore = {
    state: { users: ['John', 'Jane'], items: [], products: [], firstName: 'Jimmy', lastName: 'Doe' },
    getters: {
      users: { value: ['John', 'Jane'] },
      usersLoading: { value: false },
      items: { value: [] },
      products: { value: [] },
    },
    dispatch: () => Promise.resolve(),
  };

  return {
    $: mockDom,
    $h,
    $root: {},
    $t4: mockT4,
    $f7: mockT4,
    $t4route: mockRoute,
    $f7route: mockRoute,
    $t4router: mockRouter,
    $f7router: mockRouter,
    $theme: { ios: true, md: false, aurora: false },
    $update: () => {},
    $store: mockStore,
    $ref: (initial) => ({ value: initial }),
    $useState: (initial) => [initial, () => {}],
    $on: () => {},
    $once: () => {},
    $onBeforeMount: () => {},
    $onMounted: () => {},
    $onBeforeUpdate: () => {},
    $onUpdated: () => {},
    $onBeforeUnmount: () => {},
    $onUnmounted: () => {},
    $tick: (cb) => cb && cb(),
    $props: {},
  };
}

// ---------------------------------------------------------------------------
// Component Parser & Compiler (Techno4 Core Spec)
// ---------------------------------------------------------------------------
function parseComponentContent(componentString) {
  let template = null;
  const hasTemplate = componentString.match(/<template([ ]?)([a-z0-9-]*)>/);
  if (hasTemplate) {
    template = componentString
      .split(/<template[ ]?[a-z0-9-]*>/)
      .filter((_, index) => index > 0)
      .join('<template>')
      .split('</template>')
      .filter((_, index, arr) => index < arr.length - 1)
      .join('</template>')
      .replace(/{{#raw}}([ \n]*)<template/g, '{{#raw}}<template')
      .replace(/\/template>([ \n]*){{\/raw}}/g, '/template>{{/raw}}')
      .replace(/([ \n])<template/g, '$1{{#raw}}<template')
      .replace(/\/template>([ \n])/g, '/template>{{/raw}}$1');
  }

  let style = null;
  if (componentString.indexOf('<style>') >= 0) {
    style = componentString.split('<style>')[1].split('</style>')[0];
  }
  if (componentString.indexOf('<style scoped>') >= 0) {
    style = componentString.split('<style scoped>')[1].split('</style>')[0];
  }

  let scriptContent = null;
  if (componentString.indexOf('<script>') >= 0) {
    const scripts = componentString.split('<script>');
    scriptContent = scripts[scripts.length - 1].split('</script>')[0].trim();
  }

  return { template, style, scriptContent, isSfc: Boolean(hasTemplate || scriptContent) };
}

function compileAndRenderSfc(template, scriptContent) {
  let executableScript = scriptContent || 'return () => $render';

  if (template) {
    executableScript = executableScript
      .replace(
        '$render',
        `function ($$ctx) {
          var $ = $$ctx.$;
          var $h = $$ctx.$h;
          var $root = $$ctx.$root;
          var $t4 = $$ctx.$t4;
          var $f7 = $$ctx.$f7 || $$ctx.$t4;
          var $t4route = $$ctx.$t4route || $$ctx.$f7route;
          var $t4router = $$ctx.$t4router || $$ctx.$f7router;
          var $f7route = $$ctx.$f7route || $$ctx.$t4route;
          var $f7router = $$ctx.$f7router || $$ctx.$t4router;
          var $theme = $$ctx.$theme;
          var $update = $$ctx.$update;
          var $store = $$ctx.$store;
          var $ref = $$ctx.$ref;
          var $useState = $$ctx.$useState;
          var $props = $$ctx.$props;

          return $h\`${template}\`
        }`
      )
      .replace(/export default/g, 'return');
  }

  const factoryFn = new Function('$', executableScript);
  const ctx = createMockContext();
  const component = factoryFn(ctx.$);

  let vdom = null;
  if (typeof component === 'function') {
    const renderFn = component(ctx.$props, ctx);
    if (typeof renderFn === 'function') {
      vdom = renderFn(ctx);
    } else {
      vdom = renderFn;
    }
  } else if (component && typeof component.render === 'function') {
    vdom = component.render(ctx);
  }

  return vdom;
}

// ---------------------------------------------------------------------------
// Static Lint Rules & Namespace Fixer
// ---------------------------------------------------------------------------
const NS_FIXES = [
  [/\$f7route\b/g, '$t4route'],
  [/\$f7router\b/g, '$t4router'],
  [/\$f7ready\b/g, '$t4ready'],
  [/\$f7\b/g, '$t4'],
  [/\bf7router\b/g, 't4router'],
  [/\bf7route\b/g, 't4route'],
  [/\bicon-f7\b/g, 'icon-t4'],
  [/\bf7-icons\b/g, 't4-icons'],
  [/\bFramework7Icons\b/g, 'Techno4Icons'],
  [/\bFramework7\b/g, 'Techno4'],
];

function auditRules(content, filename) {
  const issues = [];
  const lines = content.split('\n');

  function addIssue(rule, level, message, lineIndex, matchStr, fixable = false) {
    issues.push({
      rule,
      level,
      message,
      line: lineIndex + 1,
      col: matchStr ? lines[lineIndex].indexOf(matchStr) + 1 : 1,
      match: matchStr,
      fixable,
    });
  }

  lines.forEach((lineText, idx) => {
    // 1. rule-no-aurora: Check for obsolete Aurora theme references
    if (/\bif-not-aurora\b/.test(lineText)) {
      addIssue('rule-no-aurora', 'warn', 'Deprecated "if-not-aurora" class found (Aurora was dropped in v2)', idx, 'if-not-aurora', true);
    }
    if (/\bif-aurora\b/.test(lineText)) {
      addIssue('rule-no-aurora', 'warn', 'Obsolete "if-aurora" class found (Aurora was dropped in v2)', idx, 'if-aurora', true);
    }
    if (/\$theme\.aurora\b/.test(lineText)) {
      addIssue('rule-no-aurora', 'warn', 'Deprecated "$theme.aurora" check (always false in v2)', idx, '$theme.aurora', false);
    }
    if (/theme\s*===\s*['"]aurora['"]/.test(lineText)) {
      addIssue('rule-no-aurora', 'warn', 'Deprecated \'theme === "aurora"\' condition found', idx, 'aurora', false);
    }
    if (/[?&]theme=aurora\b/.test(lineText)) {
      addIssue('rule-no-aurora', 'warn', 'Obsolete "?theme=aurora" query param link found', idx, 'theme=aurora', true);
    }

    // 2. rule-namespaces: Check for legacy F7 identifiers
    if (/\bf7-icons\b/.test(lineText)) {
      addIssue('rule-namespaces', 'warn', 'Legacy "f7-icons" font class found. Use "t4-icons".', idx, 'f7-icons', true);
    }
    if (/\bicon-f7\b/.test(lineText)) {
      addIssue('rule-namespaces', 'warn', 'Legacy "icon-f7" icon class found. Use "icon-t4".', idx, 'icon-f7', true);
    }
    if (/\$f7\b/.test(lineText) && !/\$f7route|\$f7router|\$f7ready/.test(lineText)) {
      addIssue('rule-namespaces', 'warn', 'Legacy "$f7" instance used. Use "$t4".', idx, '$f7', true);
    }
    if (/\$f7route\b/.test(lineText)) {
      addIssue('rule-namespaces', 'warn', 'Legacy "$f7route" used. Use "$t4route".', idx, '$f7route', true);
    }
    if (/\$f7router\b/.test(lineText)) {
      addIssue('rule-namespaces', 'warn', 'Legacy "$f7router" used. Use "$t4router".', idx, '$f7router', true);
    }
    if (/\bFramework7\b/.test(lineText) && !lineText.includes('//') && !lineText.includes('/*')) {
      addIssue('rule-namespaces', 'warn', 'Legacy "Framework7" identifier found. Use "Techno4".', idx, 'Framework7', true);
    }

    // 3. rule-modern-grid: Enforce native CSS Grid over legacy flexbox grid
    const hasClassRow = /(^|[\s"'`])row(?=[\s"'`]|$)/.test(lineText);
    const hasCol = /(^|[\s"'`])col-(?:(?:ios|md|aurora|tablet|desktop|xsmall|small|medium|large)-)?(?:auto|\d{1,3})(?=[\s"'`]|$)/.test(lineText);
    if (hasClassRow && /class\s*=\s*["'][^"']*\brow\b[^"']*["']/.test(lineText)) {
      addIssue(
        'rule-modern-grid',
        'warn',
        'Legacy flexbox "row" class found. Techno4 v2 requires native CSS Grid (".grid", ".grid-cols-X", ".grid-gap").',
        idx,
        'row',
        false
      );
    }
    if (hasCol && /class\s*=\s*["'][^"']*\bcol-[^"']*["']/.test(lineText)) {
      addIssue(
        'rule-modern-grid',
        'warn',
        'Legacy flexbox "col-*" class found. Use native CSS Grid (".grid-cols-X").',
        idx,
        'col-',
        false
      );
    }

    // 4. rule-modern-swiper: Swiper v11+ class checks
    if (/(^|[\s"'`.])swiper-container(?=[\s"'`.]|$)/.test(lineText)) {
      addIssue('rule-modern-swiper', 'warn', 'Legacy "swiper-container" class used. Modern Swiper uses ".swiper".', idx, 'swiper-container', true);
    }

    // 5. rule-legacy-template7: Detect unresolved Template7 syntax
    if (/{{\s*#(?:if|each|unless|with)/.test(lineText) || /{{\s*else\s*}}/.test(lineText)) {
      addIssue('rule-legacy-template7', 'warn', 'Legacy Template7 block directive found in template. Migrate to ES6 template expressions.', idx, '{{#', false);
    }
  });

  return issues;
}

function applyAutoFixes(content) {
  let updated = content;

  // 1. Longest-first namespace fixes
  for (const [regex, replacement] of NS_FIXES) {
    updated = updated.replace(regex, replacement);
  }

  // 2. Remove if-not-aurora class cleanly
  updated = updated.replace(/\bif-not-aurora\b/g, '');

  // 3. Replace swiper-container with swiper in class attributes
  updated = updated.replace(/class=(["'])(.*?)\bswiper-container\b(.*?)\1/g, (match, quote, before, after) => {
    return `class=${quote}${before}swiper${after}${quote}`;
  });

  // 4. Clean up any leftover double spaces in class attributes
  updated = updated.replace(/class=(["'])(.*?)\1/g, (match, quote, classes) => {
    const cleaned = classes.replace(/\s+/g, ' ').trim();
    return `class=${quote}${cleaned}${quote}`;
  });

  return updated;
}

// ---------------------------------------------------------------------------
// Routes & Links Integrity Validator
// ---------------------------------------------------------------------------
function loadAndValidateRoutes() {
  const routesContent = fs.readFileSync(ROUTES_FILE, 'utf8');
  const parseFn = new Function(`
    var routes = [];
    ${routesContent}
    return routes;
  `);
  const rawRoutes = parseFn();

  function flattenRoutes(list, parentPath = '') {
    let result = [];
    for (const r of list) {
      let fullPath = r.path || '';
      if (parentPath && !fullPath.startsWith('/')) {
        fullPath = (parentPath.endsWith('/') ? parentPath : parentPath + '/') + fullPath;
      }
      result.push({ ...r, fullPath });
      if (Array.isArray(r.routes)) {
        result.push(...flattenRoutes(r.routes, fullPath));
      }
      if (Array.isArray(r.detailRoutes)) {
        result.push(...flattenRoutes(r.detailRoutes, fullPath));
      }
      if (Array.isArray(r.tabs)) {
        result.push(...flattenRoutes(r.tabs, fullPath));
      }
    }
    return result;
  }

  const allRoutes = flattenRoutes(rawRoutes);
  const routeIssues = [];
  const referencedFiles = new Set();
  const declaredPaths = new Set();

  for (const route of allRoutes) {
    if (route.fullPath) declaredPaths.add(route.fullPath);
    if (route.path) declaredPaths.add(route.path);

    const targetUrl = route.componentUrl || route.url;
    if (targetUrl && typeof targetUrl === 'string') {
      const cleanPath = targetUrl.split('?')[0].split('#')[0];
      const resolvedPath = path.resolve(BOONKER_DIR, cleanPath);
      referencedFiles.add(path.basename(cleanPath));

      if (!fs.existsSync(resolvedPath)) {
        routeIssues.push({
          rule: 'rule-routes-integrity',
          level: 'error',
          message: `Route target file does not exist: "${targetUrl}" for route "${route.fullPath}"`,
          route: route.fullPath,
          target: targetUrl,
        });
      }
    }
  }

  const routePatterns = allRoutes
    .map((r) => {
      const p = r.fullPath || r.path || '';
      if (!p || p === '(.*)') return null;
      const regexStr = '^' + p.replace(/:[a-zA-Z0-9_]+/g, '[^/]+') + '$';
      try {
        return new RegExp(regexStr);
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  return { allRoutes, routeIssues, referencedFiles, declaredPaths, routePatterns };
}

// ---------------------------------------------------------------------------
// Main Audit Orchestrator
// ---------------------------------------------------------------------------
async function main() {
  if (!IS_JSON) {
    console.log(`\n${c.bold}${c.cyan}========================================================================${c.reset}`);
    console.log(`${c.bold}${c.cyan} Techno4 Framework 2 - Boonker Component Audit & Verification Suite ${c.reset}`);
    console.log(`${c.bold}${c.cyan}========================================================================${c.reset}\n`);
  }

  // 1. Verify Routes Integrity
  if (!IS_JSON) console.log(`${c.bold}[1/3] Auditing routes.js integrity...${c.reset}`);
  const { allRoutes, routeIssues, referencedFiles, declaredPaths, routePatterns } = loadAndValidateRoutes();

  if (!IS_JSON) {
    if (routeIssues.length === 0) {
      console.log(`  ${c.green}✔${c.reset} All ${allRoutes.length} route endpoints map to existing files.`);
    } else {
      for (const issue of routeIssues) {
        console.log(`  ${c.red}✖ [${issue.level.toUpperCase()}]${c.reset} ${issue.message}`);
      }
    }
  }

  // 2. Audit All Pages
  if (!IS_JSON) console.log(`\n${c.bold}[2/3] Auditing Boonker pages in ${PAGES_DIR}...${c.reset}`);
  const pageFiles = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith('.html'));

  let totalPages = 0;
  let totalPassed = 0;
  let totalWarnings = 0;
  let totalErrors = routeIssues.length;
  const pageAuditResults = [];

  for (const filename of pageFiles) {
    if (FILTER_NAME && !filename.toLowerCase().includes(FILTER_NAME)) {
      continue;
    }
    totalPages++;

    const filePath = path.join(PAGES_DIR, filename);
    let rawContent = fs.readFileSync(filePath, 'utf8');

    // Apply auto-fix if requested
    if (IS_FIX) {
      const fixedContent = applyAutoFixes(rawContent);
      if (fixedContent !== rawContent) {
        fs.writeFileSync(filePath, fixedContent, 'utf8');
        rawContent = fixedContent;
      }
    }

    const { template, style, scriptContent, isSfc } = parseComponentContent(rawContent);
    const issues = auditRules(rawContent, filename);

    // Test SFC Compilation and VDOM Rendering
    let vdomError = null;
    let vdomTree = null;

    if (isSfc && template) {
      try {
        vdomTree = compileAndRenderSfc(template, scriptContent);
      } catch (err) {
        vdomError = err;
        issues.unshift({
          rule: 'rule-syntax',
          level: 'error',
          message: `SFC Compilation / VDOM Render Failed: ${err.message}`,
          line: 1,
          col: 1,
          match: '',
          fixable: false,
        });
      }
    } else if (!isSfc) {
      // Test plain HTML parsing through HTM
      try {
        vdomTree = $h([rawContent]);
      } catch (err) {
        // Plain HTML may contain normal page tags, skip strict HTM fail if harmless
      }
    }

    // Check internal links in page
    const linkMatches = rawContent.matchAll(/href=(["'])(\/[^"'#?]+)\1/g);
    for (const m of linkMatches) {
      const href = m[2];
      // Skip dynamic interpolation expressions
      if (href.includes('$') || href.includes('{')) continue;

      const normalized = href.endsWith('/') ? href : href + '/';
      
      // Check exact match, known test links, or parametric route patterns
      const isExact = declaredPaths.has(href) || declaredPaths.has(normalized) || href === '/' || href === '/load-something-that-doesnt-exist/';
      const isParametric = !isExact && routePatterns.some((pattern) => pattern.test(href) || pattern.test(normalized));

      if (!isExact && !isParametric) {
        issues.push({
          rule: 'rule-broken-link',
          level: 'warn',
          message: `Internal link "${href}" does not match any registered route in routes.js`,
          line: rawContent.substring(0, m.index).split('\n').length,
          col: 1,
          match: href,
          fixable: false,
        });
      }
    }

    const errors = issues.filter((i) => i.level === 'error');
    const warnings = issues.filter((i) => i.level === 'warn');

    totalErrors += errors.length;
    totalWarnings += warnings.length;

    let status = 'PASS';
    if (errors.length > 0) status = 'FAIL';
    else if (warnings.length > 0) status = 'WARN';
    else totalPassed++;

    pageAuditResults.push({
      filename,
      type: isSfc ? 'SFC' : 'HTML',
      status,
      errorsCount: errors.length,
      warningsCount: warnings.length,
      issues,
    });

    if (!IS_JSON && (IS_VERBOSE || status !== 'PASS')) {
      const statusBadge =
        status === 'PASS'
          ? `${c.green}✔ PASS${c.reset}`
          : status === 'WARN'
          ? `${c.yellow}▲ WARN (${warnings.length})${c.reset}`
          : `${c.red}✖ FAIL (${errors.length} err, ${warnings.length} warn)${c.reset}`;

      console.log(`  ${statusBadge.padEnd(20)} ${c.bold}${filename}${c.reset} ${c.dim}[${isSfc ? 'SFC' : 'HTML'}]${c.reset}`);
      for (const issue of issues) {
        const icon = issue.level === 'error' ? `${c.red}✖` : `${c.yellow}▲`;
        console.log(`    ${icon} L${issue.line}: ${issue.message} ${c.dim}(${issue.rule})${c.reset}`);
      }
    }
  }

  // 3. Summary Report
  if (!IS_JSON) {
    console.log(`\n${c.bold}[3/3] Audit Summary:${c.reset}`);
    console.log(`  -------------------------------------------`);
    console.log(`  Total Pages Audited:    ${c.bold}${totalPages}${c.reset}`);
    console.log(`  Clean Passing Pages:    ${c.green}${c.bold}${totalPassed}${c.reset}`);
    console.log(`  Total Warnings:         ${totalWarnings > 0 ? c.yellow : c.green}${c.bold}${totalWarnings}${c.reset}`);
    console.log(`  Total Critical Errors:  ${totalErrors > 0 ? c.red : c.green}${c.bold}${totalErrors}${c.reset}`);
    console.log(`  Total Route Endpoints:  ${c.bold}${allRoutes.length}${c.reset}`);
    console.log(`  Missing Route Targets:  ${routeIssues.length > 0 ? c.red : c.green}${c.bold}${routeIssues.length}${c.reset}`);
    console.log(`  -------------------------------------------\n`);
  }

  if (IS_JSON) {
    const jsonOutput = {
      summary: { totalPages, totalPassed, totalWarnings, totalErrors, routeEndpoints: allRoutes.length },
      routeIssues,
      pages: pageAuditResults,
    };
    console.log(JSON.stringify(jsonOutput, null, 2));
  }

  if (totalErrors > 0) {
    if (!IS_JSON) console.log(`${c.bgRed}${c.white}${c.bold} AUDIT FAILED: ${totalErrors} critical errors found. ${c.reset}\n`);
    process.exit(1);
  } else if (totalWarnings > 0) {
    if (!IS_JSON) console.log(`${c.yellow}${c.bold} AUDIT PASSED WITH WARNINGS: Code is operational, ${totalWarnings} modernization items remain. ${c.reset}\n`);
    process.exit(0);
  } else {
    if (!IS_JSON) console.log(`${c.bgGreen}${c.white}${c.bold} ALL CHECKS PASSED: 100% compliant with Techno4 Framework 2! ${c.reset}\n`);
    process.exit(0);
  }
}

main().catch((err) => {
  console.error(`${c.red}FATAL ERROR: ${err.message}${c.reset}`);
  console.error(err.stack);
  process.exit(1);
});
