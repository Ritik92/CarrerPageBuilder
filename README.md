# Talent Hub - Careers Page Builder

A platform that lets companies create beautiful, branded careers pages in minutes. Recruiters can customize everything, candidates can find jobs easily.

**Live Demo:** https://talenthub.ritikcrafts.org/

## What I Built

A full-stack careers page builder with:
- Custom hero sections with gradients
- Drag-and-drop content sections
- Job listings with smart filters
- Mobile-responsive design
- Company branding (colors, logos, banners)
- Preview before publishing

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **UI:** Tailwind CSS + shadcn/ui
- **Auth:** NextAuth.js
- **Deployment:** Vercel

## Quick Start

1. Clone the repo
```bash
git clone https://github.com/Ritik92/CarrerPageBuilder.git
cd CarrerPageBuilder
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Create .env file
DATABASE_URL="your-postgres-url"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
AWS_ACCESS_KEY_ID=your-access-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=your-region
AWS_S3_BUCKET=bucket-name
```

4. Set up database
```bash
npx prisma generate
npx prisma db push
```

5. Run locally
```bash
npm run dev
```

Visit http://localhost:3000

## User Guide

### For Recruiters

1. **Sign Up**
   - Go to homepage → "Get Started"
   - Enter email, password, company name
   - Your slug becomes your URL: `/your-company/careers`

2. **Edit Your Page**
   - Click "Manage Dashboard"
   - **Branding Tab:** Upload logo, banner, set colors, add culture video
   - **Content Tab:** Add sections like "About Us", "Benefits", etc.
   - **Jobs Tab:** View all jobs (add via API/CSV)
   - **Settings Tab:** SEO, company description, publish/unpublish

3. **Preview & Publish**
   - Click "Preview" to see changes
   - Toggle "Publish" in Settings when ready
   - Share your careers page URL

### For Candidates

1. Visit any company's careers page: `/company-slug/careers`
2. Browse jobs with filters (location, department, job type)
3. Search by job title
4. Click on jobs to see details

## Project Structure
```
├── app/
│   ├── (auth)/          # Login, signup pages
│   ├── [slug]/          # Dynamic company pages
│   │   ├── careers/     # Public careers page
│   │   ├── edit/        # Recruiter dashboard
│   │   └── preview/     # Preview mode
│   ├── api/             # REST API routes
│   └── page.tsx         # Landing page
├── components/
│   ├── ui/              # shadcn components
│   └── careers/         # Careers page components
├── lib/
│   ├── prisma.ts        # DB client
│   └── validations/     # Zod schemas
└── prisma/
    └── schema.prisma    # Database schema
```

## Key Features
 
 Rich text content sections  
 Job filtering & search  
 Mobile-first design  
 Custom branding per company  
 Preview before publish  
 SEO-ready (meta tags)

## What Could Be Better

**Authentication:**
- Add OAuth (Google, LinkedIn)
- Email verification
- Password reset

**Jobs:**
- Bulk CSV upload via UI
- Job application form
- Applicant tracking

## Database Schema

See `prisma/schema.prisma` for full details.

**Key models:**
- `Company` - Company info, branding, settings
- `Job` - Job listings with filters
- `ContentSection` - Dynamic page sections
- `User` - Recruiter accounts

## API Endpoints
```
GET/POST    /api/companies
GET/PATCH   /api/companies/:id
POST        /api/companies/:id/jobs
GET         /api/companies/:id/sections
PATCH       /api/sections/:id
```
