import test from 'node:test'
import assert from 'node:assert/strict'
import { canRun } from '../demo/gates.js'

const roles = { open: [], admin: ['CEO'], dev: ['Verified'] }

test('empty role list means anyone', () => assert.equal(canRun(roles, 'open', []), true))
test('needs one matching role', () => {
  assert.equal(canRun(roles, 'admin', ['CEO']), true)
  assert.equal(canRun(roles, 'admin', ['Verified']), false)
})
test('unconfigured commands are denied by default', () => assert.equal(canRun(roles, 'nope', ['CEO']), false))
test('owner bypasses the gate', () => assert.equal(canRun(roles, 'admin', [], { isOwner: true }), true))
