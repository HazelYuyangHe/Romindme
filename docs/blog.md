# Building RomindMe: A Full-Stack Dating Management App with AI-Assisted Development

**By Yuyang He & Ningxi Yang**

---

## Introduction

Modern dating apps have solved the problem of meeting people, but they have done nothing to help you manage the connections that follow. If you are actively dating multiple people at once, you are on your own — trying to remember birthdays, track conversations, and keep personal details straight across five different chat threads.

RomindMe is our answer to that problem. It is a personal dating management web app that lets users maintain detailed profiles for each person they are dating, log date history, set reminders for birthdays and upcoming dates, and write private story journal entries capturing meaningful moments. In this post, we walk through how we built it, what we learned about full-stack development with AI assistance, and the key technical decisions that shaped the final product.

---

## The Problem We Solved

The idea for RomindMe came from a simple frustration: after matching with someone on a dating app, all the context about that person lives scattered across your memory, your notes app, and their profile. There is no single place to keep it all.

Our app fills that gap. The core insight is that dating, like any relationship-building activity, benefits from organization. RomindMe is not a matching platform. It is a thoughtful personal assistant for the after-match experience.

---

## Tech Stack Decisions

We chose Next.js as our full-stack framework because it allowed us to build both the frontend and backend API in a single codebase, which significantly reduced the complexity of a two-person project with a tight timeline.

For the database, we selected PostgreSQL hosted on Supabase, with Prisma as our ORM. Prisma was a crucial choice — its TypeScript-first approach meant that our database models were automatically typed throughout the entire application, eliminating an entire category of runtime errors. When we defined a Person model in schema.prisma, we got type-safe queries everywhere without any extra work.

Authentication was handled by NextAuth.js with a credentials provider and JWT sessions. This gave us a production-ready auth system in under 50 lines of configuration code, including password hashing with bcrypt and session management.

For deployment, we used Vercel for the Next.js app and Supabase managed PostgreSQL for the database. Both platforms offer generous free tiers, making them ideal for a student project that still needed to meet production deployment requirements.

---

## AI-Assisted Development with CLAUDE.md

One of the most interesting aspects of this project was our use of AI-assisted development through VS Code with Claude. Rather than using AI as a simple autocomplete tool, we invested time upfront in creating a comprehensive CLAUDE.md rules file that gave the AI full context about our project before each session.

The rules file included our TypeScript data models, folder structure conventions, naming standards, and explicit rules. The difference this made was immediately measurable. Without the rules file, Claude generated JavaScript components with inline styles and no persistent storage. With the rules file active, it produced TypeScript files organized across the correct directories, used Tailwind for styling, and implemented the exact data model we had defined.

The most valuable sections of our rules file were the data model definitions and the component architecture patterns. By specifying that localStorage must only be accessed through dedicated store helper functions and never directly inside React components, we got a clean, testable architecture from the first session.

---

## Key Technical Challenges

**Prisma 7 Migration**

We encountered an unexpected challenge when initializing the project: Prisma 7 had removed support for the url and directUrl properties in schema.prisma, requiring connection configuration to be moved to a separate prisma.config.ts file. This breaking change was not reflected in most online tutorials, and resolving it required reading the migration documentation carefully.

**Vercel Deployment**

Our initial Vercel deployment failed because the Prisma client was not being generated during the build process. The fix was adding a postinstall script to package.json that runs prisma generate — but identifying the root cause from the build logs required careful reading of the error stack trace.

**Next.js 16 App Router**

Using the latest Next.js App Router with server components, client components, and API routes simultaneously required a clear mental model of which code runs on the server versus the client. We resolved this by keeping all database access strictly in API route handlers and all interactive UI in client components marked with "use client".

---

## Testing Strategy

We used Jest with ts-jest for unit testing, focusing our coverage on the utility functions that contained the most business logic. Our zodiac calculation utilities — getZodiac(), getAge(), and daysUntilBirthday() — were the highest-value testing targets because they are pure functions with deterministic outputs called throughout the UI.

Our test suite achieved 93% statement coverage and 100% function coverage on the utility layer, exceeding the 80% project requirement.

The key lesson from our testing work was that pure utility functions should be extracted aggressively from components because they are so much easier to test. A function that takes a birthday string and returns a zodiac object is trivially testable. A React component that calculates a zodiac sign internally while also managing form state is not.

---

## Agile Process

We ran two two-week sprints using GitHub Issues and Projects as our task management system. Sprint 1 focused on core infrastructure: authentication, person profiles, and the date calendar. Sprint 2 delivered the story journal, reminders, testing, CI/CD, and documentation.

Each user story was captured as a GitHub Issue with a checklist of acceptance criteria. Our branch naming convention (feature/issue-number-description) and commit format (feat(#1): description) kept every code change traceable back to a specific requirement.

Our CI/CD pipeline runs on GitHub Actions on every push to main. It installs dependencies, generates the Prisma client, runs a TypeScript type check, and builds the production bundle. Vercel listens to the same branch and automatically deploys on successful pushes.

---

## What We Would Do Differently

If we were starting this project again, we would write tests alongside features rather than at the end. We would also invest more time in integration testing for the API routes — our current coverage is strong on utility functions but does not cover the database interaction layer.

We would also spend more time on the CLAUDE.md rules file before writing any code. Starting with a more complete rules file — including concrete code examples rather than just prose descriptions — would have produced better AI-generated code from the very first session.

---

## Conclusion

RomindMe demonstrates that a two-person team can ship a complete full-stack application with authentication, a relational database, CI/CD, and meaningful test coverage in a short sprint cycle. The key enablers were a focused tech stack with minimal moving parts, disciplined use of TypeScript throughout, and AI-assisted development grounded in a well-structured context engineering rules file.

The app is live at https://romindme.vercel.app and the source code is available on GitHub.
