import { readFileSync } from 'node:fs'
import { createGuild } from './guild.js'

const config = JSON.parse(readFileSync(new URL('./config.json', import.meta.url)))
const guild = createGuild({ config, randomCode: () => '424242' })

const say = (who, line) => console.log(`${who.padEnd(8)} ${line}`)
const step = (title) => console.log(`\n== ${title}`)
const attempt = (who, line, fn) => {
  try { return fn() } catch (e) { say('bot', `x ${e.message}`); say(who, `(${line} was refused)`) }
}

step('1. Members join and land in Holding')
guild.join('u-ceo', 'dana', ['CEO'])
guild.join('u-new', 'newcomer')
say('newcomer', `joined with roles [${guild.members.get('u-new').roles}]`)

step('2. /verify: email OTP, allowed domains only')
attempt('newcomer', '/verify with gmail address', () => guild.requestOtp('u-new', 'x@gmail.com'))
const code = guild.requestOtp('u-new', 'sam@example.com')
say('bot', `emailed code ${code} to sam@example.com`)
guild.submitOtp('u-new', code)
say('newcomer', `verified, nickname "${guild.members.get('u-new').name}", still in [${guild.members.get('u-new').roles}]`)

step('3. Role gate: a Holding member cannot approve themselves')
attempt('newcomer', '/approve', () => guild.approve('u-new', 'u-new', ['Senior Dev']))

step('4. /approve by CEO: Holding -> Verified + roles')
guild.approve('u-ceo', 'u-new', ['Junior Dev'])
say('bot', `newcomer now has [${guild.members.get('u-new').roles}]`)

step('5. /feature: multi-step flow, then private ticket channel')
guild.startFeature('u-new', { title: 'Dark mode toggle', description: 'Add a theme switch to settings' })
guild.chooseAssignees('u-new', ['u-ceo'])
const ticket = guild.confirmFeature('u-new')
say('bot', `created #${ticket.channel}, visible to ${ticket.visibleTo.join(', ')}`)

step('6. /close-feature with an attached markdown write-up')
attempt('newcomer', '/close-feature outside a ticket', () => guild.closeFeature('u-new', 'general', '# x'))
guild.closeFeature('u-new', ticket.channel, '# Dark mode\nImplemented via CSS variables.')
say('bot', `ticket ${ticket.id} is ${ticket.status}; doc saved (${guild.docs[0].body.length} chars)`)
