import test from 'node:test'
import assert from 'node:assert/strict'
import { createFlowStore } from '../demo/flowStore.js'

test('stores and merges step answers', () => {
  const s = createFlowStore()
  s.set('u', 'g', 'feature', { title: 'A' })
  s.update('u', 'g', 'feature', { assignees: [1] })
  assert.deepEqual(s.get('u', 'g', 'feature'), { title: 'A', assignees: [1] })
})

test('flows are isolated per user and per command', () => {
  const s = createFlowStore()
  s.set('u1', 'g', 'bug', { a: 1 })
  assert.equal(s.get('u2', 'g', 'bug'), null)
  assert.equal(s.get('u1', 'g', 'feature'), null)
})

test('abandoned flows expire', () => {
  let t = 0
  const s = createFlowStore({ ttlMs: 1000, now: () => t })
  s.set('u', 'g', 'bug', { a: 1 })
  t = 1001
  assert.equal(s.get('u', 'g', 'bug'), null)
  assert.equal(s.size, 0)
})
