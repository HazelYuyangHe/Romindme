# CLAUDE.md — RomindMe AI Development Rules

This file provides context for AI-assisted development of RomindMe.
Read this file before writing any code, suggesting any changes, or answering any questions about this project.

---

## 1. Project Context

**RomindMe** is a personal dating management web app that helps users track multiple dating candidates.
It combines contact profiles, a date calendar, birthday/date reminders, and a private story journal.
All data is stored in the browser via `localStorage` — there is no backend.

**Team:** Yuyang He, Ningxi Yang
**Course:** Prompt Engineering — Project 2

---

## 2. Tech Stack

| Layer       | Technology                        | Version  |
|-------------|-----------------------------------|----------|
| Framework   | React + TypeScript                | React 18 |
| Styling     | Tailwind CSS                      | v3       |
| Storage     | localStorage (browser-native)     | —        |
| Testing     | Jest + React Testing Library      | Latest   |
| Build Tool  | Vite                              | Latest   |
| Deployment  | Vercel                            | —        |

**Never suggest** adding a backend, database, or authentication system — this is intentionally a client-only app.

---

## 3. Folder Structure

```
romindme/
├── src/
│   ├── components/
│   │   ├── profiles/       # ProfileGrid, ProfileCard, ProfileForm, ProfileDetail
│   │   ├── calendar/       # DateTimeline, DateForm, DateCard
│   │   ├── reminders/      # BirthdayReminders, UpcomingDates
│   │   ├── journal/        # StoryTimeline, StoryForm, StoryCard
│   │   └── shared/         # Modal, ConfirmDialog, TabBar, EmptyState, Button
│   ├── hooks/              # Custom React hooks (useProfiles, useDates, useStories)
│   ├── store/              # localStorage read/write helpers (profiles.ts, dates.ts, stories.ts)
│   ├── types/              # TypeScript interfaces (index.ts)
│   ├── utils/              # Pure helper functions (zodiac.ts, dateHelpers.ts)
│   └── App.tsx
├── tests/
│   └── (mirror src/ structure)
├── CLAUDE.md
└── package.json
```

Always place new files in the correct folder. Never create files in the project root unless they are config files.

---

## 4. TypeScript Data Models

These are the **canonical interfaces**. Never modify them without team agreement.

```typescript
// src/types/index.ts

interface Person {
  id: string;           // UUID via crypto.randomUUID()
  name: string;         // required
  nickname?: string;
  height?: number;      // cm, positive integer
  birthday?: string;    // ISO date string "YYYY-MM-DD"
  occupation?: string;
  contact?: string;
  color: string;        // hex color e.g. "#FF6B9D"
  tags: string[];       // personality tags
  sparkRating: number;  // 1–5
  notes?: string;
  createdAt: string;    // ISO datetime string
}

interface DateEntry {
  id: string;
  personId: string;     // must reference a valid Person.id
  date: string;         // ISO date string "YYYY-MM-DD"
  time?: string;        // "HH:MM"
  location?: string;
  mood?: "loved" | "good" | "neutral" | "awkward" | "bad";
  notes?: string;
  createdAt: string;
}

interface StoryEntry {
  id: string;
  personId: string;     // must reference a valid Person.id
  content: string;      // required, free text
  date: string;         // ISO date string "YYYY-MM-DD"
  moodTag: "sweet" | "awkward" | "funny" | "red-flag" | "memorable";
  createdAt: string;
}
```

---

## 5. Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Components | PascalCase | `ProfileCard.tsx` |
| Hooks | camelCase with `use` prefix | `useProfiles.ts` |
| Store helpers | camelCase | `getProfiles()`, `saveProfile()` |
| Utility functions | camelCase | `getZodiacSign()`, `daysUntilBirthday()` |
| CSS classes | Tailwind utilities only | no custom CSS files |
| Constants | SCREAMING_SNAKE_CASE | `PERSONALITY_TAGS`, `SPARK_COLORS` |
| Test files | same name + `.test.ts(x)` | `ProfileCard.test.tsx` |

---

## 6. localStorage Conventions

All localStorage keys follow this pattern: `romindme_<entity>`

```typescript
// Keys
const STORAGE_KEYS = {
  PROFILES: "romindme_profiles",
  DATES:    "romindme_dates",
  STORIES:  "romindme_stories",
} as const;

// Always read/write through src/store/ helpers, never directly in components
// Example:
// store/profiles.ts exports: getProfiles(), saveProfile(), deleteProfile()
```

---

## 7. Component Patterns

- Use **functional components only** — no class components
- Use **custom hooks** for all localStorage reads/writes — never call localStorage directly inside a component
- Keep components **under 150 lines** — split into smaller components if needed
- Every form must have a **controlled input** pattern (`value` + `onChange`)
- Modals/slide-up panels use the shared `<Modal>` component in `components/shared/`
- All destructive actions (delete) must use the shared `<ConfirmDialog>` component

---

## 8. PRD & Design Reference

**PRD location:** See `CLAUDE.md` Section 8 or the full PRD document in the repo wiki.

**Epics and features:**
- **Epic 1 — Profiles:** Add / Edit / Delete / View / Search person profiles (Issues #1–5)
- **Epic 2 — Calendar:** Log / View / Delete date entries (Issues #6–8)
- **Epic 3 — Reminders:** Birthday countdowns + upcoming date panel (Issues #9–10)
- **Epic 4 — Story Journal:** Write / View / Delete story entries per person (Issues #11–13)

**UI Design reference (Claude Artifact prototype):**
- Bottom tab navigation: `Profiles` / `Calendar` / `Reminders`
- Profile grid: 2-column card layout, color-coded top border per person
- Add/Edit forms: slide-up modal from bottom
- Person detail: slide-up bottom sheet showing all info + date history + journal link
- Color palette: warm tones, avoid pure white backgrounds, use soft pinks and neutrals

When implementing a feature, refer to the relevant Epic and Issue number above.

---

## 9. Testing Strategy

- **Unit tests** for all utility functions in `src/utils/`
- **Unit tests** for all store helpers in `src/store/`
- **Component tests** using React Testing Library for all form components
- Minimum coverage goal: **70%** for Sprint 1, **80%** for Sprint 2
- Test file location mirrors source: `tests/components/profiles/ProfileCard.test.tsx`
- Never mock localStorage — use a real in-memory implementation in tests

---

## 10. Scrum & Git Workflow

### Branch Naming
```
feature/<issue-number>-short-description
chore/<issue-number>-short-description
docs/<issue-number>-short-description
bug/<issue-number>-short-description
```
Examples:
- `feature/1-add-person-profile`
- `chore/14-project-setup`

### Commit Message Format
```
<type>(#<issue>): <short description>

feat(#1): add PersonForm component with zodiac auto-calculation
fix(#3): remove associated dates on profile deletion
chore(#14): initialize Vite + React + Tailwind setup
docs(#15): add CLAUDE.md rules file
```

### PR Workflow
1. Branch from `main`
2. PR title: same format as commit message
3. PR body must reference issue: `Closes #<issue-number>`
4. At least one teammate review before merge
5. Squash merge into `main`

---

## 11. Do's ✅

- Always use TypeScript — no `any` types
- Always use Tailwind for styling — no inline styles, no CSS modules
- Always use `crypto.randomUUID()` for generating IDs
- Always handle the empty state (no profiles, no dates, etc.) in every list view
- Always show a loading/saving indicator during localStorage operations
- Keep utility functions pure and well-tested
- Reference the GitHub Issue number in every commit and PR

---

## 12. Don'ts ❌

- **Don't** add a backend, API, or database — localStorage only
- **Don't** use `any` type in TypeScript
- **Don't** write inline styles — use Tailwind classes only
- **Don't** call `localStorage` directly inside a React component — use store helpers
- **Don't** create new top-level folders outside the defined structure without discussion
- **Don't** install new dependencies without team agreement
- **Don't** skip writing tests for utility functions and store helpers
- **Don't** commit directly to `main`

---

## 13. Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "vite": "^5.0.0",
    "jest": "^29.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0"
  }
}
```

Do not suggest adding UI component libraries (e.g. MUI, Ant Design, Chakra) — use Tailwind only.
