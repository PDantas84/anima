import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const query = require('query-string');
test('Expo Router query decoding retains its CommonJS API after security updates', () => {
  assert.equal(
    query.parse('prompt=Como%20voc%C3%AA%20est%C3%A1%3F').prompt,
    'Como você está?',
  );
  assert.equal(query.parse('id=presence').id, 'presence');
  assert.equal(query.stringify({ id: 'diário' }), 'id=di%C3%A1rio');
});
test('malformed long percent-encoded deep links decode without exponential work', () => {
  const start = performance.now();
  const malformed = '%C0%AF'.repeat(2000);
  const parsed = query.parse(`prompt=${malformed}`);
  assert.equal(typeof parsed.prompt, 'string');
  assert.ok(performance.now() - start < 1000);
});
