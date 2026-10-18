# Security notes

- **Deny by default.** A command with no entry in the role config cannot be run.
- **Domain allow-list** for verification and invites; OTPs expire after 10 minutes and are single use.
- **Holding role** isolates unverified members from everything except onboarding until a human approves them.
- **Private ticket channels** are visible only to the assigner and assignees.
- **Rate limiting** on command handling and IP utilities for the HTTP callback.
- **Internal routes** (service-to-service status updates) are loopback-only and refuse every request unless a shared secret is configured.
- **Secrets** live in environment variables. `.env` is git-ignored and `.env.example` holds placeholders only.
- **Tests never reach production.** Commands take injected `db` and config seams; a written rule forbids tests that connect to a real database.
- **Recordings** are stored outside version control and git-ignored.
