# Command reference

Required roles come from the command config. "Verified" means any approved member.

## Setup and administration

| Command | Roles | Flow |
|---|---|---|
| `/init` | CEO, Server Manager | Confirm, then create roles, onboarding channel, and categories (Onboarding, Rules, Documentation, Announcements, Meetings, Casual, Archive, role-locked engineering categories, command channels). |
| `/scrap` | CEO, Server Manager | Confirm, then remove bot-created roles and channels and clear guild config. Run `/init` to rebuild. |
| `/invite` | CEO, Server Manager | Modal for a work email; invite sent by email, and by DM if already in the server. |
| `/approve` | CEO, Server Manager | Select a Holding user, multi-select roles, confirm. |
| `/backlog` | CEO, Server Manager | List Holding users and approve from a modal. |
| `/repos` | CEO, Server Manager | Add or list repositories (URL, optional project). |
| `/dashboard` | CEO, Server Manager | Pick Overview, Tasks (grouped by module), Bugs, Features, Meetings, or FAQs. |
| `/faq-answer` | CEO, Server Manager | Pick an unanswered FAQ, answer in a modal. |

## Everyone

| Command | Flow |
|---|---|
| `/verify` | Request OTP by email, submit code. |

## Tickets and tasks

| Command | Roles | Flow |
|---|---|---|
| `/bug` | Verified | Select repo, modal (title, description), select members to tag, create. Opens a private channel and a doc stub. |
| `/feature` | Verified | Modal, select repo/project, select assignees, create. Private channel and doc stub. |
| `/ticket` | Senior Dev, CEO, Server Manager | Select a ticket, set status (pending, resolved, abandoned). |
| `/resolve-bug` | Inside a bug channel | Attach a Markdown file; the ticket resolves and the file is saved as the solution doc. |
| `/close-feature` | Inside a feature channel | Attach a Markdown file; the ticket closes and the file is saved as the implementation doc. |
| `/fetch-my` | Verified | Choose Bugs, Features, Meetings, or All to list your items. |

## Meetings and time

| Command | Flow |
|---|---|
| `/schedule` | Modal (topic, natural-language time), select members, confirm. Times respect the guild timezone. |
| `/meetings` | List upcoming and past meetings. |
| `/record`, `/playback` | Record a voice meeting per speaker and replay it. |
| `/clock-in`, `/clock-out` | Time tracking with a clocked-in role. |

## Knowledge

| Command | Roles | Flow |
|---|---|---|
| `/docs` | Verified | Select a docs root or repo, search query modal, results as an embed. |
| `/explain` | Verified | Ask a question; the answer is generated from the synced project docs. |
| `/project-db` | Verified | View a project's database schema or paste a new one. |
| `/faq` | Verified | Ask a question, or search existing answers. |
| `/evaluate` | Senior Dev, CEO, Server Manager | Select a member; embed of their bugs, features, and commits. |
