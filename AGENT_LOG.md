# AI Usage Log

## When I Used Claude

### Database Schema
Asked Claude to review my Prisma schema design. It suggested adding indexes on frequently queried fields (location, jobType). Good catch - implemented those.

### API Boilerplate
Used Claude to generate the CRUD route structure for `/api/companies/:id`. Saved time on repetitive code. Had to fix the error handling myself though.

### Styling Help
Showed Claude the Workable inspiration site and asked for Tailwind classes for the job cards. Got decent spacing suggestions. Tweaked the colors and hover effects manually to match my design.

### Zod Schemas
Generated validation schemas with Claude. Pretty straightforward - just described the fields and it wrote them. I added the custom regex patterns for slug validation.

## What I Built Myself

- Entire auth flow (NextAuth setup, middleware, signup logic)
- Hero section with gradient picker
- Job filtering logic with React state
- Preview mode implementation
- Content section ordering
- All the debugging and edge cases
- Deployment configuration
- Mobile responsive fixes

## Debugging Moments

**Preview page sync issue:** Claude suggested using URL params. That felt messy. I went with a separate route that fetches the same data.

**Hero data storage:** Asked Claude about storing dynamic fields. It said JSON column. Made sense, implemented it.


## Useful Prompts

- "Review this Prisma schema for performance issues"
- "Generate TypeScript types for this API response"
- "What's the correct Next.js 15 syntax for dynamic params?"

## Time Breakdown

Total: ~8 hours
- Claude helped with: ~2 hours of boilerplate
- I spent: ~6 hours on logic, design, debugging, integration

## Honest Take

Claude was helpful for routine stuff like validation schemas and basic components. All the actual architecture decisions, data flow, and complex features were mine. Used it as a faster alternative to reading docs.