/**
 * In-memory state for multi-step slash-command flows.
 *
 * Discord interactions are stateless: each button click or modal submit is a new
 * event. A flow (e.g. /feature: modal -> pick repo -> pick assignees -> confirm)
 * therefore needs somewhere to park the answers collected so far.
 *
 * Key:  userId:guildId:command   (one live flow per user per command)
 * TTL:  abandoned flows expire so the map cannot grow without bound.
 */
export function createFlowStore({ ttlMs = 30 * 60 * 1000, now = () => Date.now() } = {}) {
  const state = new Map()
  const key = (userId, guildId, command) => `${userId}:${guildId}:${command}`

  return {
    get(userId, guildId, command) {
      const k = key(userId, guildId, command)
      const entry = state.get(k)
      if (!entry) return null
      if (now() > entry.exp) {
        state.delete(k)
        return null
      }
      return entry.data
    },
    set(userId, guildId, command, data) {
      state.set(key(userId, guildId, command), { data, exp: now() + ttlMs })
    },
    /** Merge new answers into the flow so each step only supplies its own field. */
    update(userId, guildId, command, patch) {
      const current = this.get(userId, guildId, command) ?? {}
      this.set(userId, guildId, command, { ...current, ...patch })
    },
    clear(userId, guildId, command) {
      state.delete(key(userId, guildId, command))
    },
    get size() {
      return state.size
    },
  }
}
