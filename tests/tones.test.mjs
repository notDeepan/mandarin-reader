import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadBrowserScripts } from '../scripts/lib/load-scripts.mjs';

const { Tones } = loadBrowserScripts(['js/tones.js']);
const plain = v => JSON.parse(JSON.stringify(v));

test('curvePoints level line', () => assert.deepEqual(plain(Tones.curvePoints([3, 3], 100, 40)), [[0, 20], [100, 20]]));
test('curvePoints dip-rise', () => assert.deepEqual(plain(Tones.curvePoints([2, 1, 4], 100, 40)), [[0, 30], [50, 40], [100, 10]]));
