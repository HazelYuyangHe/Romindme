# 💕 RomindMe

A personal dating management web app that helps users track multiple dating candidates with profiles, a date calendar, reminders, and a private story journal.

**Live Demo:** https://romindme.vercel.app

**Team:** Yuyang He, Ningxi Yang

---

## Tech Stack

- **Frontend:** Next.js 18 + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL (Supabase) + Prisma ORM
- **Auth:** NextAuth.js (JWT)
- **Deployment:** Vercel
- **CI/CD:** GitHub Actions

---

## Features

- 👤 **Person Profiles** — Add/edit/delete dating candidates with name, birthday, height, zodiac (auto-calculated), occupation, personality tags, and spark rating
- 📅 **Date Calendar** — Log past and upcoming dates with location and mood rating
- ⏰ **Reminders** — Birthday countdowns and upcoming date alerts
- 📖 **Story Journal** — Private narrative entries per person with mood tags

---

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database (Supabase recommended)

### Installation
```bash
git clone https://github.com/HazelYuyangHe/romindme.git
cd romindme
npm install
```

### Environment Variables

Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### Database Setup
```bash
npx prisma db push
npx prisma generate
```

### Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## API Documentation

### Authentication

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "string",
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response:** `{ "id": "string", "email": "string" }`

#### POST /api/auth/signin
Sign in with credentials via NextAuth.js.

---

### People

#### GET /api/people
Get all person profiles for the authenticated user.

**Response:** `Person[]`

#### POST /api/people
Create a new person profile.

**Request Body:**
```json
{
  "name": "string (required)",
  "nickname": "string",
  "height": "number",
  "birthday": "YYYY-MM-DD",
  "occupation": "string",
  "contact": "string",
  "color": "string (hex)",
  "tags": "string[]",
  "sparkRating": "number (1-5)",
  "notes": "string"
}
```

#### PUT /api/people/:id
Update an existing person profile.

#### DELETE /api/people/:id
Delete a person profile and all associated data.

---

### Dates

#### GET /api/dates
Get all date entries for the authenticated user.

#### POST /api/dates
Create a new date entry.

**Request Body:**
```json
{
  "personId": "string (required)",
  "date": "YYYY-MM-DD (required)",
  "time": "HH:MM",
  "location": "string",
  "mood": "loved | good | neutral | awkward | bad",
  "notes": "string"
}
```

#### DELETE /api/dates/:id
Delete a date entry.

---

### Stories

#### GET /api/stories
Get all story entries for the authenticated user.

#### POST /api/stories
Create a new story entry.

**Request Body:**
```json
{
  "personId": "string (required)",
  "content": "string (required)",
  "date": "YYYY-MM-DD",
  "moodTag": "sweet | awkward | funny | red-flag | memorable"
}
```

#### DELETE /api/stories/:id
Delete a story entry.

---

## Project Structure
```
romindme/
├── src/
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── dashboard/    # Main app page
│   │   ├── login/        # Login page
│   │   └── register/     # Register page
│   ├── lib/              # Prisma client + NextAuth config
│   ├── types/            # TypeScript interfaces
│   └── utils/            # Zodiac + date helpers
├── prisma/
│   └── schema.prisma     # Database schema
├── .github/workflows/    # CI/CD pipeline
└── CLAUDE.md             # AI development rules
```

---

## Agile Process

- **Sprint 1:** Profiles, Calendar, Authentication, Project setup
- **Sprint 2:** Story Journal, Reminders, Testing, CI/CD, Documentation

See GitHub Issues and Project Board for full sprint details.
