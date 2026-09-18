import assert from 'node:assert';
import RoundRange from '../packages/techno4-framework2-core/src/components/round-range/round-range-class.js';

console.log('🧪 Testing RoundRange component logic...');

// Mock Minimal Element & App for Node.js environment
function createMockEl(attrs = {}) {
  const el = {
    nodeType: 1,
    f7RoundRange: null,
    dataset: { ...attrs },
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 88, height: 88 }),
    setAttribute: () => {},
    removeAttribute: () => {},
    querySelectorAll: () => [],
    classList: {
      add: () => {},
      remove: () => {},
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  };
  return el;
}

const mockApp = {
  theme: 'ios',
  params: {},
  emit: () => {},
};

// 1. Test Mode '0+'
console.log('  Testing mode "0+"...');
const el1 = createMockEl({ mode: '0+', min: '0', max: '100', value: '25', defaultValue: '10' });
const r1 = new RoundRange(mockApp, { el: el1 });
assert.strictEqual(r1.mode, '0+');
assert.strictEqual(r1.min, 0);
assert.strictEqual(r1.max, 100);
assert.strictEqual(r1.value, 25);
assert.strictEqual(r1.defaultValue, 10);
assert.strictEqual(r1.valueToAngle(0), -135);
assert.strictEqual(r1.valueToAngle(100), 135);
assert.strictEqual(r1.valueToAngle(50), 0);

// Test reset
r1.setValue(75);
assert.strictEqual(r1.getValue(), 75);
r1.reset();
assert.strictEqual(r1.getValue(), 10, 'Reset should restore defaultValue (10)');

// 2. Test Mode '-0+' with Snap to 0
console.log('  Testing mode "-0+" with center 0 and snap...');
const el2 = createMockEl({ mode: '-0+', min: '-50', max: '50', snap: 'true', snapValues: '[0]' });
const r2 = new RoundRange(mockApp, { el: el2 });
assert.strictEqual(r2.mode, '-0+');
assert.strictEqual(r2.min, -50);
assert.strictEqual(r2.max, 50);
assert.strictEqual(r2.defaultValue, 0, 'DefaultValue in -0+ mode should be 0');
assert.strictEqual(r2.valueToAngle(0), 0, '0 in -0+ mode is at 0 degrees (12 o clock)');

// Test snapping to 0: snapThreshold is (50 - (-50)) * 0.04 = 4
r2.setValue(2);
assert.strictEqual(r2.getValue(), 0, 'Value 2 within snapThreshold (4) of 0 should snap to 0');
assert.strictEqual(r2.isSnapped, true);

r2.setValue(-1.5);
assert.strictEqual(r2.getValue(), 0, 'Value -1.5 within snapThreshold of 0 should snap to 0');

r2.setValue(20);
assert.strictEqual(r2.getValue(), 20, 'Value 20 outside snapThreshold should NOT snap');
assert.strictEqual(r2.isSnapped, false);

// 3. Test Multiple Snap Points
console.log('  Testing multiple snap points [-50, 0, 50]...');
const el3 = createMockEl({ mode: '-0+', min: '-100', max: '100', snap: 'true', snapValues: '[-50, 0, 50]', snapThreshold: '5' });
const r3 = new RoundRange(mockApp, { el: el3 });
r3.setValue(-48);
assert.strictEqual(r3.getValue(), -50, '-48 should snap to -50');
r3.setValue(52);
assert.strictEqual(r3.getValue(), 50, '52 should snap to 50');
r3.setValue(2);
assert.strictEqual(r3.getValue(), 0, '2 should snap to 0');

// 4. Test Mode '-0'
console.log('  Testing mode "-0" (negative to 0)...');
const el4 = createMockEl({ mode: '-0', min: '-60', max: '0', value: '-12', defaultValue: '0' });
const r4 = new RoundRange(mockApp, { el: el4 });
assert.strictEqual(r4.mode, '-0');
assert.strictEqual(r4.min, -60);
assert.strictEqual(r4.max, 0);
assert.strictEqual(r4.defaultValue, 0);
assert.strictEqual(r4.value, -12);
r4.reset();
assert.strictEqual(r4.getValue(), 0, 'Reset on -0 mode should restore 0');

console.log('✅ ALL RoundRange unit tests passed successfully!');
