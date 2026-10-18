# Data model (overview)

The schema is grouped by concern. Table and column details are intentionally summarised here.

```mermaid
erDiagram
  GUILD_CONFIG ||--o{ GUILD_MEMBER : has
  GUILD_CONFIG ||--o{ REPOSITORY : tracks
  PROJECT ||--o{ PROJECT_REPOS : links
  PROJECT ||--o{ PROJECT_MEMBER : staffs
  PROJECT ||--o{ PROJECT_SCHEMAS : versions
  TASK ||--o{ TASK_DEPENDENCY : blocks
  TASK ||--o| TICKET_DOC : documents
  TASK }o--o{ GUILD_MEMBER : assigned
  MEETING ||--o{ MEETING_RECORDING : captures
  MEETING ||--o{ MEETING_PIPELINE_JOB : processes
  MEETING_RECORDING ||--o{ MEETING_UTTERANCE : contains
  MEETING_PIPELINE_JOB ||--o{ TASK : produces
```

| Concern | Tables |
|---|---|
| Server setup | guild config, assignable roles, scopes, modules |
| People | guild member, verification OTP, pending invite, email log, clock entries |
| Work | task (unified bugs and features), task dependency, ticket doc, bug comments, project, project members |
| Projects | repositories, project schemas, schema dump versions |
| Meetings | scheduled meeting, meeting channel and messages, recording and status, pipeline job, utterances |
| Knowledge | doc source, doc page, FAQ |
| Ops | schema_migrations |

**Unified task model.** Bugs and features share one `task` table with a type column plus optional fields (handler, scope, implementation status, API/QA/acceptance results). Fields are nullable when irrelevant, which keeps the dashboard query and the meeting pipeline simple.
