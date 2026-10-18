import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createGuild } from '../demo/guild.js'

const config = JSON.parse(readFileSync(new URL('../demo/config.json', import.meta.url)))
const make = () => {
  const g = createGuild({ config, randomCode: () => '111111' })
  g.join('ceo', 'dana', ['CEO'])
  g.join('new', 'newcomer')
  return g
}
const verified = () => {
  const g = make()
  g.submitOtp('new', g.requestOtp('new', 'sam@example.com'))
  g.approve('ceo', 'new', ['Junior Dev'])
  return g
}

test('rejects disallowed email domains', () => {
  assert.throws(() => make().requestOtp('new', 'a@gmail.com'), /not allowed/)
})
test('wrong or expired code is rejected', () => {
  const g = make()
  g.requestOtp('new', 'sam@example.com')
  assert.throws(() => g.submitOtp('new', '000000'), /Incorrect/)
  let t = 0
  const g2 = createGuild({ config, now: () => t, randomCode: () => '1' })
  g2.join('new', 'n')
  g2.requestOtp('new', 'a@example.com')
  t = 11 * 60 * 1000
  assert.throws(() => g2.submitOtp('new', '1'), /expired/)
})
test('cannot approve before verifying, and non-admins cannot approve', () => {
  const g = make()
  assert.throws(() => g.approve('ceo', 'new', []), /not verified/)
  assert.throws(() => g.approve('new', 'new', []), /requires one of/)
})
test('approval swaps Holding for Verified', () => {
  assert.deepEqual(verified().members.get('new').roles, ['Verified', 'Junior Dev'])
})
test('Holding members cannot create features', () => {
  assert.throws(() => make().startFeature('new', { title: 't', description: 'd' }), /requires one of/)
})
test('feature flow creates a private channel and closes with a doc', () => {
  const g = verified()
  g.startFeature('new', { title: 'Dark Mode!', description: 'd' })
  g.chooseAssignees('new', ['ceo'])
  const t = g.confirmFeature('new')
  assert.equal(t.channel, 'feature-1-dark-mode')
  assert.deepEqual(t.visibleTo, ['new', 'ceo'])
  assert.throws(() => g.closeFeature('new', 'general', 'x'), /ticket channel/)
  g.closeFeature('new', t.channel, '# done')
  assert.equal(t.status, 'closed')
  assert.equal(g.docs[0].body, '# done')
})
test('confirming without answering all steps fails', () => {
  const g = verified()
  g.startFeature('new', { title: 't', description: 'd' })
  assert.throws(() => g.confirmFeature('new'), /incomplete/)
})
