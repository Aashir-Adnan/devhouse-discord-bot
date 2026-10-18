# Demo walkthrough

Run `npm run demo` to reproduce this transcript. It exercises the same lifecycle as the real bot (join, verify, approve, ticket, close) against an in-memory model, including the refusals.

```

== 1. Members join and land in Holding
newcomer joined with roles [Holding]

== 2. /verify: email OTP, allowed domains only
bot      x Email domain not allowed: gmail.com
newcomer (/verify with gmail address was refused)
bot      emailed code 424242 to sam@example.com
newcomer verified, nickname "sam", still in [Holding]

== 3. Role gate: a Holding member cannot approve themselves
bot      x /approve requires one of: CEO, Server Manager
newcomer (/approve was refused)

== 4. /approve by CEO: Holding -> Verified + roles
bot      newcomer now has [Verified,Junior Dev]

== 5. /feature: multi-step flow, then private ticket channel
bot      created #feature-1-dark-mode-toggle, visible to u-new, u-ceo

== 6. /close-feature with an attached markdown write-up
bot      x /close-feature must be used inside a feature ticket channel
newcomer (/close-feature outside a ticket was refused)
bot      ticket 1 is closed; doc saved (42 chars)
```

## What each step demonstrates

| Step | Behaviour |
|---|---|
| 1 | New members get only the Holding role. |
| 2 | `/verify` enforces the email domain allow-list, then an OTP. Verifying does not grant access by itself. |
| 3 | The role gate refuses `/approve` for a member without an admin role. |
| 4 | An admin swaps Holding for Verified plus chosen roles. |
| 5 | `/feature` gathers answers across steps in the flow store, then creates a private channel visible only to the assigner and assignees, plus a doc stub. |
| 6 | `/close-feature` only works inside a ticket channel and saves the attached Markdown as the ticket's documentation. |

## In a real server

1. A member joins, sees only `#onboarding`, and runs `/verify`.
2. They enter a work email and the emailed code. Admins get a ping in `#admin`.
3. An admin runs `/approve`, selects the member and roles, and confirms.
4. The member opens a ticket with `/feature` or `/bug`; a private channel appears for the people involved.
5. When the work ships, they run `/close-feature` or `/resolve-bug` in that channel with a Markdown write-up. It becomes a doc page browsable through `/docs`.
6. Everyone on an open ticket gets one DM reminder per day.
