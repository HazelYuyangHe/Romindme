# Sprint 1 Planning & Retrospective

**Sprint Duration:** Week 1–2  
**Team:** Yuyang He, Ningxi Yang  
**Goal:** Deliver core authentication and person profile management

---

## Sprint Planning

### Sprint Goal
Build the foundational infrastructure and core profile management features so users can register, log in, and manage dating candidate profiles.

### Issues in Sprint 1
| Issue | Title | Assignee | Status |
|---|---|---|---|
| #14 | Project scaffolding (Next.js + Prisma + Tailwind) | Yuyang | ✅ Done |
| #15 | Add CLAUDE.md rules file | Yuyang | ✅ Done |
| #1 | Add a person profile | Yuyang | ✅ Done |
| #2 | Edit a person profile | Ningxi | ✅ Done |
| #3 | Delete a person profile | Ningxi | ✅ Done |
| #4 | View full person profile detail | Yuyang | ✅ Done |
| #5 | Search and filter profile list | Yuyang | ✅ Done |
| #6 | Log a date entry | Ningxi | ✅ Done |
| #7 | View date timeline | Ningxi | ✅ Done |

### Definition of Done
- Feature is implemented and manually tested
- Code is pushed to main branch
- GitHub Issue is closed

---

## Sprint Retrospective

### What went well
- Project scaffolding with Next.js and Prisma went smoothly using AI-assisted development
- CLAUDE.md rules file significantly improved code consistency across sessions
- Person profile CRUD was completed ahead of schedule
- Supabase PostgreSQL integration worked well as a cloud database solution

### What didn't go well
- Prisma 7 introduced breaking changes that required extra debugging time
- Vercel deployment had initial failures due to missing `prisma generate` step
- Zsh shell caused issues with multi-line bash commands during setup

### What we will improve in Sprint 2
- Write tests alongside features rather than at the end
- Document known issues in GitHub Issues immediately when discovered
- Use VS Code directly for file creation instead of terminal heredoc commands
