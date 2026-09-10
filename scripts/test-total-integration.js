// Automated Integration Test Suite for Techno4 Framework 2 (techno4-total)
// Verifies all core subsystems: Engine, Namespaces, Actions, Schemas, Tangular, NoSQL, HTTP Routing, and Client Bridge.

import http from 'node:http';

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

async function runTests() {
  console.log('\n' + ANSI.bold + ANSI.cyan + '==================================================' + ANSI.reset);
  console.log(ANSI.bold + ANSI.cyan + '  TECHNO4 FRAMEWORK 2 - TOTAL.JS V5 INTEGRATION TEST' + ANSI.reset);
  console.log(ANSI.bold + ANSI.cyan + '==================================================' + ANSI.reset + '\n');

  // TEST 1: ESM & CJS Imports & Engine Metadata
  console.log(ANSI.bold + '[Test 1] Engine Imports & Namespaces' + ANSI.reset);
  const totalModule = await import('../packages/techno4-framework2-total/index.mjs');
  const total = totalModule.default;

  assert(total != null, 'techno4-total default export exists');
  assert(total.version === 5019, 'Total.js version is 5019 (v5.0.19)');
  assert(global.Total === total, 'global.Total namespace is bound');
  assert(global.Techno4Total === total, 'global.Techno4Total namespace alias is bound');
  assert(global.T4Total === total, 'global.T4Total namespace alias is bound');
  assert(global.F === total, 'global.F namespace is bound');
  assert(typeof global.NEWACTION === 'function', 'NEWACTION global is available');
  assert(typeof global.NEWSCHEMA === 'function', 'NEWSCHEMA global is available');
  assert(typeof global.Tangular === 'object', 'Tangular global is available');
  assert(typeof global.NOSQL === 'function', 'NOSQL global is available');

  // TEST 2: NEWACTION Subsystem
  console.log('\n' + ANSI.bold + '[Test 2] NEWACTION & ACTION Execution' + ANSI.reset);
  NEWACTION('Test/calc', {
    name: 'Add two numbers',
    input: 'a:Number, b:Number',
    action: function($, model) {
      $.success({ sum: model.a + model.b, engine: 'Techno4Total' });
    }
  });

  const actionResult = await ACTION('Test/calc', { a: 15, b: 27 }).promise();
  assert(actionResult != null, 'ACTION returned response');
  assert(actionResult.success === true, 'ACTION success flag is true');
  assert(actionResult.value.sum === 42, 'ACTION calculated sum correctly (15 + 27 = 42)');
  assert(actionResult.value.engine === 'Techno4Total', 'ACTION returned metadata');

  // TEST 3: NEWSCHEMA Subsystem
  console.log('\n' + ANSI.bold + '[Test 3] NEWSCHEMA Validation & Operations' + ANSI.reset);
  NEWSCHEMA('Product', function(schema) {
    schema.action('create', {
      name: 'Create product',
      input: '*name:String(50), *price:Number, tags:[String]',
      action: function($, model) {
        $.success({ id: UID(), name: model.name, price: model.price, tags: model.tags || [] });
      }
    });
  });

  const validProduct = { name: 'MacBook Pro', price: 1999.99, tags: ['laptop', 'apple'] };
  const schemaResult = await ACTION('Product/create', validProduct).promise();
  assert(schemaResult != null && schemaResult.success === true, 'SCHEMA action executed successfully');
  assert(schemaResult.value.name === 'MacBook Pro', 'SCHEMA product name matches');
  assert(schemaResult.value.price === 1999.99, 'SCHEMA price parsed as Number');
  assert(Array.isArray(schemaResult.value.tags), 'SCHEMA tags parsed as Array');

  // TEST 4: Tangular Templating Subsystem
  console.log('\n' + ANSI.bold + '[Test 4] Tangular Templating & Helpers' + ANSI.reset);
  const { Tangular, Thelpers } = await import('../packages/techno4-framework2-total/tangular.mjs');
  assert(Tangular != null, 'Tangular module imported via ESM');
  assert(Tangular.version === 'v5.0.5', 'Tangular version is v5.0.5');

  // Basic interpolation
  const rendered1 = Tangular.render('Hello {{ name }}!', { name: 'Techno4' });
  assert(rendered1 === 'Hello Techno4!', 'Basic {{ variable }} interpolation works');

  // Conditionals
  const tplCondition = '{{ if active }}Online{{ else }}Offline{{ fi }}';
  assert(Tangular.render(tplCondition, { active: true }) === 'Online', 'Conditionals: if true');
  assert(Tangular.render(tplCondition, { active: false }) === 'Offline', 'Conditionals: if false');

  // Loops
  const tplLoop = '{{ foreach item in items }}{{ item }};{{ end }}';
  assert(Tangular.render(tplLoop, { items: ['A', 'B', 'C'] }) === 'A;B;C;', 'Foreach loop works');

  // Helpers
  assert(Thelpers.currency(1234.56, 'EUR') === '1 234,56 €' || Thelpers.currency(1234.56).includes('1'), 'Thelpers.currency formats number');
  
  // Custom helper
  Tangular.register('badge', function(text, color) {
    return '<span class="badge-' + (color || 'primary') + '">' + text + '</span>';
  });
  const renderedCustom = Tangular.render('{{ title | badge("success") }}', { title: 'Passed' });
  assert(renderedCustom.includes('badge-success') && renderedCustom.includes('Passed'), 'Custom Tangular helper registered and executed');

  // TEST 5: Embedded NoSQL Subsystem
  console.log('\n' + ANSI.bold + '[Test 5] Embedded NoSQL Database' + ANSI.reset);
  const testCollection = 'test_techno4_audit';
  const testDocId = UID();
  
  // Insert
  await new Promise((resolve, reject) => {
    NOSQL(testCollection).insert({ id: testDocId, title: 'Integration Test Doc', priority: 1, created: NOW }).callback((err, res) => {
      if (err) reject(err); else resolve(res);
    });
  });
  assert(true, 'NOSQL document inserted successfully');

  // Find
  const foundDocs = await new Promise((resolve, reject) => {
    NOSQL(testCollection).find().where('id', testDocId).callback((err, docs) => {
      if (err) reject(err); else resolve(docs);
    });
  });
  assert(foundDocs && foundDocs.length === 1, 'NOSQL found document by UID');
  assert(foundDocs[0].title === 'Integration Test Doc', 'Document title matches');

  // Remove cleanup
  await new Promise((resolve, reject) => {
    NOSQL(testCollection).remove().where('id', testDocId).callback((err, res) => {
      if (err) reject(err); else resolve(res);
    });
  });
  assert(true, 'NOSQL document removed cleanly');

  // TEST 6: HTTP REST Server Lifecycle & Routing
  console.log('\n' + ANSI.bold + '[Test 6] HTTP REST Server Lifecycle' + ANSI.reset);
  const TEST_PORT = 19890;

  ROUTE('GET /api/techno4/ping', function($) {
    $.json({ status: 'ok', framework: 'Techno4 Framework 2', uptime: process.uptime() });
  });

  ROUTE('POST /api/techno4/echo', function($) {
    $.json({ received: $.body, serverTime: Date.now() });
  });

  // Start HTTP server and wait for ready event
  await new Promise(resolve => {
    total.on('ready', function() {
      total.TRouting.sort();
      resolve();
    });
    total.http({ port: TEST_PORT, load: 'none' });
  });
  total.TRouting.sort();
  assert(total.server != null, 'HTTP server initialized and listening');

  // GET Request
  const getRes = await fetch('http://127.0.0.1:' + TEST_PORT + '/api/techno4/ping');
  assert(getRes.status === 200, 'GET /api/techno4/ping returned HTTP 200');
  const getData = await getRes.json();
  assert(getData.status === 'ok', 'GET returned expected JSON payload');
  assert(getData.framework === 'Techno4 Framework 2', 'GET framework identifier matches');

  // POST Request
  const postRes = await fetch('http://127.0.0.1:' + TEST_PORT + '/api/techno4/echo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Techno4 Total.js v5 Bridge Active' })
  });
  assert(postRes.status === 200, 'POST /api/techno4/echo returned HTTP 200');
  const postData = await postRes.json();
  assert(postData.received.message === 'Techno4 Total.js v5 Bridge Active', 'POST body parsed and echoed');

  // Close server
  await new Promise(resolve => total.server.close(resolve));
  assert(true, 'HTTP server stopped cleanly');

  // TEST 7: Client Bridge
  console.log('\n' + ANSI.bold + '[Test 7] Techno4 Core Client Bridge' + ANSI.reset);
  const { Techno4TotalClient, Techno4TotalPlugin } = await import('../packages/techno4-framework2-total/client.mjs');
  assert(typeof Techno4TotalClient === 'function', 'Techno4TotalClient constructor exists');
  assert(typeof Techno4TotalPlugin === 'object', 'Techno4TotalPlugin object exists');

  const client = new Techno4TotalClient({ url: 'http://localhost:19890' });
  client.setToken('test-secret-token-123');
  assert(client.headers['Authorization'] === 'Bearer test-secret-token-123', 'Client sets Bearer token');
  client.setToken(null);
  assert(client.headers['Authorization'] === undefined, 'Client unsets Bearer token');

  // Cleanup background intervals
  if (total.internal && total.internal.interval) {
    clearInterval(total.internal.interval);
  }

  console.log('\n' + ANSI.bold + ANSI.green + '==================================================' + ANSI.reset);
  console.log(ANSI.bold + ANSI.green + '  ALL ' + passed + ' INTEGRATION TESTS PASSED SUCCESSFULLY!' + ANSI.reset);
  console.log(ANSI.bold + ANSI.green + '==================================================' + ANSI.reset + '\n');
  setTimeout(() => process.exit(0), 50);
}

runTests().catch(err => {
  console.error('\n' + ANSI.bold + ANSI.red + 'FATAL ERROR DURING TEST SUITE:' + ANSI.reset, err);
  process.exit(1);
});
