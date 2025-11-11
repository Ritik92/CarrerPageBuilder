# Tech Spec

## Stack

- **Next.js 15** - App Router for server components, built-in API routes
- **PostgreSQL + Prisma** - Relational DB, type-safe queries
- **NextAuth** - Session management
- **Tailwind + shadcn/ui** - Styling and components

## Database Design

Three main tables:

**Company** - Stores branding, colors, slug (unique URL), published status
**Job** - Job listings linked to company. Indexed on location, jobType, status
**ContentSection** - Flexible content blocks. Has a JSON field for hero section data
**User** - Recruiter accounts with bcrypt passwords

Multi-tenant: One DB, companies separated by `companyId` foreign key.

## How It Works

### Sign Up
1. User creates account
2. Generates company + unique slug
3. NextAuth creates session with company slug

### Editing
1. Server fetches company data by slug
2. Tabs for branding, content, jobs, settings
3. Form submit → API validates with Zod → Updates DB → Page refreshes

### Public Page
1. Candidate visits `/slug/careers`
2. Server checks if published
3. Fetches jobs and sections
4. Client-side React filters for instant search

### Hero Section
Special ContentSection with `type: 'hero'` and JSON data field for custom stuff like gradients and button text.


## What I'd Add Next

- Rich text editor
- Job application form
- Email notifications
- Rate limiting
- Multiple users per company with roles
