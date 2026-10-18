/**
 * Role gate: a command's allowed roles live in config, not in the command code.
 *
 *   []            -> anyone may run it
 *   ["A", "B"]    -> member needs at least one of the roles
 *   (missing)     -> deny by default, so a new command is locked until configured
 */
export function canRun(commandRoles, command, memberRoles = [], { isOwner = false } = {}) {
  if (isOwner) return true
  const required = commandRoles[command]
  if (required === undefined) return false
  if (required.length === 0) return true
  return required.some((role) => memberRoles.includes(role))
}
