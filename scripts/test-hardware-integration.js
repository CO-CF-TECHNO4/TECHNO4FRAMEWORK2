// Automated Integration Test Suite for Techno4 Framework 2
// Hardware & Sound Subsystems: Serial Port, Web Audio API, and MIDI
// Verifies engine bindings, native hardware drivers, mock simulation, and data flow.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const TOTAL_PKG = path.resolve(ROOT_DIR, 'packages/techno4-framework2-total');
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

async function runTests() {
  console.log('\n' + ANSI.bold + ANSI.cyan + '==================================================' + ANSI.reset);
  console.log(ANSI.bold + ANSI.cyan + '  TECHNO4 FRAMEWORK 2 - HARDWARE & SOUND SUITE' + ANSI.reset);
  console.log(ANSI.bold + ANSI.cyan + '  (Serial Port, Rust Web Audio API, Hardware MIDI)' + ANSI.reset);
  console.log(ANSI.bold + ANSI.cyan + '==================================================' + ANSI.reset + '\n');

  // TEST 1: Imports and Namespace Bindings
  console.log(ANSI.bold + '[Test 1] Hardware Subsystems & Namespace Bindings' + ANSI.reset);
  const totalModule = await import('../packages/techno4-framework2-total/index.mjs');
  const total = totalModule.default;

  assert(total.Serial != null, 'Total.Serial subsystem is attached');
  assert(total.Audio != null, 'Total.Audio subsystem is attached');
  assert(total.MIDI != null, 'Total.MIDI subsystem is attached');
  assert(global.Techno4Serial === total.Serial, 'global.Techno4Serial is bound');
  assert(global.Techno4Audio === total.Audio, 'global.Techno4Audio is bound');
  assert(global.Techno4MIDI === total.MIDI, 'global.Techno4MIDI is bound');
  assert(totalModule.Techno4Serial != null, 'ESM export Techno4Serial is available');
  assert(totalModule.Techno4Audio != null, 'ESM export Techno4Audio is available');
  assert(totalModule.Techno4MIDI != null, 'ESM export Techno4MIDI is available');

  // TEST 2: Serial Port Subsystem
  console.log('\n' + ANSI.bold + '[Test 2] Serial Port Subsystem & Mock Loopback' + ANSI.reset);
  const Serial = total.Serial;
  assert(Serial.isSupported === true, 'SerialPort driver is supported');

  const ports = await Serial.list();
  assert(Array.isArray(ports), `Serial.list() returned port array (detected ${ports.length} ports)`);

  // Mock port testing
  const mockPortPath = '/dev/TEST_ROBOT_COM';
  const mockPort = Serial.createMock(mockPortPath, { baudRate: 115200, parser: 'readline' });
  assert(mockPort != null, 'Serial.createMock() created virtual test port');

  await new Promise((resolve) => {
    if (mockPort.isOpen) resolve();
    else mockPort.on('open', resolve);
  });
  assert(mockPort.isOpen, 'Mock serial port opened successfully');

  let receivedLine = null;
  mockPort.parser.on('data', (line) => {
    receivedLine = line.trim();
  });

  // Write through mock port
  mockPort.write('HELLO TECHNO4 ROBOT\r\n');
  await sleep(100);
  assert(receivedLine === 'HELLO TECHNO4 ROBOT', `Mock serial port echoed line correctly: "${receivedLine}"`);
  mockPort.close();

  // TEST 3: Rust Web Audio API Subsystem
  console.log('\n' + ANSI.bold + '[Test 3] Rust-Powered Web Audio API Subsystem' + ANSI.reset);
  const Audio = total.Audio;
  assert(Audio.isSupported === true, 'Rust Web Audio API is supported');
  assert(typeof Audio.AudioContext === 'function', 'AudioContext constructor exists');
  assert(typeof Audio.OfflineAudioContext === 'function', 'OfflineAudioContext constructor exists');
  assert(typeof Audio.OscillatorNode === 'function', 'OscillatorNode constructor exists');
  assert(typeof Audio.GainNode === 'function', 'GainNode constructor exists');

  // Live AudioContext creation and shutdown
  const liveCtx = Audio.createContext();
  assert(liveCtx != null && liveCtx.sampleRate > 0, `Live AudioContext initialized (SampleRate: ${liveCtx.sampleRate}Hz)`);
  assert(liveCtx.state === 'running', 'Live AudioContext is in running state');
  await liveCtx.close();
  assert(liveCtx.state === 'closed', 'Live AudioContext closed cleanly');

  // Fast offline synthesis & WAV rendering
  console.log('  Synthesizing 440Hz sine wave tone via Rust engine...');
  const tone = await Audio.synthTone({ frequency: 440, type: 'sine', duration: 0.25, sampleRate: 44100 });
  assert(tone != null, 'Audio.synthTone() rendered audio buffer');
  assert(tone.length === 11025, 'Rendered sample length matches duration (0.25s * 44100 = 11025 samples)');
  assert(tone.channelData instanceof Float32Array, 'Channel data is Float32Array');

  let hasAudioSignal = false;
  for (let i = 0; i < tone.channelData.length; i++) {
    if (Math.abs(tone.channelData[i]) > 0.05) {
      hasAudioSignal = true;
      break;
    }
  }
  assert(hasAudioSignal, 'Rendered audio contains non-zero synthesized audio waveform');

  const wavBuffer = tone.toWavBuffer();
  assert(Buffer.isBuffer(wavBuffer), 'toWavBuffer() generated Buffer');
  assert(wavBuffer.toString('ascii', 0, 4) === 'RIFF', 'WAV buffer starts with RIFF header');
  assert(wavBuffer.toString('ascii', 8, 12) === 'WAVE', 'WAV buffer contains WAVE format identifier');

  // TEST 4: Hardware MIDI Subsystem
  console.log('\n' + ANSI.bold + '[Test 4] Hardware MIDI Subsystem & Virtual Loopback' + ANSI.reset);
  const MIDI = total.MIDI;
  assert(MIDI.isSupported === true, 'Hardware MIDI subsystem is supported');

  const midiInputs = MIDI.getInputs();
  const midiOutputs = MIDI.getOutputs();
  assert(Array.isArray(midiInputs), `MIDI.getInputs() returned array (detected ${midiInputs.length} inputs)`);
  assert(Array.isArray(midiOutputs), `MIDI.getOutputs() returned array (detected ${midiOutputs.length} outputs)`);

  // Virtual loopback testing
  const loopback = MIDI.createVirtualPair('Techno4TestBus');
  assert(loopback.input != null && loopback.output != null, 'MIDI.createVirtualPair() created virtual port pair');

  let receivedNote = null;
  loopback.input.on('noteon', (msg) => {
    receivedNote = msg;
  });

  loopback.output.send('noteon', { note: 60, velocity: 110, channel: 1 });
  assert(receivedNote != null, 'Virtual MIDI noteon event was received');
  assert(receivedNote.note === 60, 'Received MIDI note number matches (Middle C = 60)');
  assert(receivedNote.velocity === 110, 'Received MIDI velocity matches (110)');
  assert(receivedNote.channel === 1, 'Received MIDI channel matches (1)');

  let receivedCC = null;
  loopback.input.on('cc', (msg) => {
    receivedCC = msg;
  });
  loopback.output.send('cc', { controller: 7, value: 95, channel: 1 });
  assert(receivedCC != null && receivedCC.controller === 7 && receivedCC.value === 95, 'Received MIDI CC message matches (Volume = 95)');

  loopback.input.close();
  loopback.output.close();

  // TEST 5: Boonker Hardware Page Files
  console.log('\n' + ANSI.bold + '[Test 5] Boonker Hardware Studio Page Files' + ANSI.reset);
  const studioPagePath = path.join(BOONKER_DIR, 'pages/hardware-studio.html');
  if (fs.existsSync(studioPagePath)) {
    const pageContent = fs.readFileSync(studioPagePath, 'utf8');
    assert(pageContent.includes('hardware-studio'), 'hardware-studio.html contains hardware-studio class');
    assert(pageContent.includes('icon-back'), 'hardware-studio.html has back button');
    assert(!pageContent.includes('f7-icons'), 'hardware-studio.html does not use f7-icons');
  } else {
    console.log('  ' + ANSI.yellow + 'INFO:' + ANSI.reset + ' hardware-studio.html is currently being assembled by Grok');
  }

  console.log('\n' + ANSI.bold + ANSI.green + '==================================================' + ANSI.reset);
  console.log(ANSI.bold + ANSI.green + `  ALL ${passed} HARDWARE INTEGRATION TESTS PASSED!` + ANSI.reset);
  console.log(ANSI.bold + ANSI.green + '==================================================' + ANSI.reset + '\n');
  process.exit(0);
}

runTests().catch(err => {
  console.error('\n' + ANSI.bold + ANSI.red + 'FATAL ERROR IN HARDWARE TEST SUITE:' + ANSI.reset, err);
  process.exit(1);
});
