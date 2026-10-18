import { canRun } from './gates.js'
import { createFlowStore } from './flowStore.js'

/**
 * A tiny in-memory model of the server the real bot manages. It mirrors the real
 * lifecycle (join -> Holding -> verify -> approve -> tickets) without needing
 * Discord or a database, so the behaviour can be run and tested anywhere.
 */
export function createGuild({ config, randomCode = defaultCode, now = () => Date.now() }) {
  const guildId = 'demo-guild'
  const members = new Map()
  const otps = new Map()
  const channels = []
  const docs = []
  const flows = createFlowStore({ now })
  let nextTicket = 1

  const member = (id) => {
    const m = members.get(id)
    if (!m) throw new Error(`Unknown member ${id}`)
    return m
  }

  function guard(userId, command) {
    if (!canRun(config.commandRoles, command, member(userId).roles)) {
      throw new Error(`/${command} requires one of: ${(config.commandRoles[command] ?? ['<unconfigured>']).join(', ')}`)
    }
  }

  return {
    flows,
    members,
    channels,
    docs,

    join(id, name, roles = []) {
      members.set(id, { id, name, roles: roles.length ? roles : ['Holding'], email: null, verified: false })
      return member(id)
    },

    /** /verify step 1: email an OTP to an allowed-domain address. */
    requestOtp(id, email) {
      guard(id, 'verify')
      const domain = email.split('@')[1]?.toLowerCase()
      if (!config.allowedEmailDomains.includes(domain)) throw new Error(`Email domain not allowed: ${domain}`)
      const code = randomCode()
      otps.set(id, { code, email, exp: now() + 10 * 60 * 1000 })
      return code // the real bot emails this; the demo returns it
    },

    /** /verify step 2: submit the code; the member stays in Holding until approved. */
    submitOtp(id, code) {
      const otp = otps.get(id)
      if (!otp || now() > otp.exp) throw new Error('Code expired or not requested')
      if (otp.code !== code) throw new Error('Incorrect code')
      otps.delete(id)
      const m = member(id)
      m.email = otp.email
      m.verified = true
      m.name = otp.email.split('@')[0]
      return m
    },

    /** /approve: an admin swaps Holding for Verified plus the chosen roles. */
    approve(adminId, targetId, roles) {
      guard(adminId, 'approve')
      const target = member(targetId)
      if (!target.verified) throw new Error('Target has not verified their email yet')
      target.roles = ['Verified', ...roles]
      return target
    },

    /** /feature: collect answers across steps, then create a private ticket channel + doc stub. */
    startFeature(id, { title, description }) {
      guard(id, 'feature')
      flows.set(id, guildId, 'feature', { title, description })
    },
    chooseAssignees(id, assigneeIds) {
      flows.update(id, guildId, 'feature', { assigneeIds })
    },
    confirmFeature(id) {
      const flow = flows.get(id, guildId, 'feature')
      if (!flow?.assigneeIds) throw new Error('Flow expired or incomplete')
      const ticket = {
        id: nextTicket++,
        type: 'feature',
        title: flow.title,
        description: flow.description,
        status: 'open',
        channel: `feature-${nextTicket - 1}-${slug(flow.title)}`,
        visibleTo: [id, ...flow.assigneeIds], // private channel: assigner + assignees only
      }
      channels.push(ticket)
      docs.push({ ticketId: ticket.id, title: ticket.title, body: null })
      flows.clear(id, guildId, 'feature')
      return ticket
    },

    /** /close-feature: only valid inside a ticket channel; stores the attached markdown. */
    closeFeature(id, channelName, markdown) {
      guard(id, 'close-feature')
      const ticket = channels.find((c) => c.channel === channelName)
      if (!ticket) throw new Error('/close-feature must be used inside a feature ticket channel')
      if (!ticket.visibleTo.includes(id)) throw new Error('You are not part of this ticket')
      ticket.status = 'closed'
      docs.find((d) => d.ticketId === ticket.id).body = markdown
      return ticket
    },
  }
}

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const defaultCode = () => String(Math.floor(100000 + Math.random() * 900000))
