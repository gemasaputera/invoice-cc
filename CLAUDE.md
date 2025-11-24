# Invoice Management System - Development Guide

## Project Overview

This is a modern invoice management application built for freelancers and influencers to create, manage, and export professional service-based invoices. The application uses Next.js 16 with React 19, TypeScript, Prisma with Neon PostgreSQL, and shadcn/ui components.

**Target Users**: Freelancers and influencers who need quick, professional invoice creation and management
**Core Features**: Invoice CRUD operations, client management, PDF export, user authentication
**Architecture**: Full-stack TypeScript application with API routes and server-side rendering

## Technology Stack

### Frontend
- **Framework**: Next.js 16.0.3 with App Router
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **State Management**: Zustand
- **Date Handling**: Day.js
- **PDF Generation**: @react-pdf/renderer
- **Toast Notifications**: Sonner
- **File Upload**: React Dropzone
- **Data Tables**: @tanstack/react-table

### Backend
- **Database**: Neon PostgreSQL
- **ORM**: Prisma v5.22.0
- **Authentication**: Better Auth v1.4.1
- **API**: Next.js API routes with RESTful patterns

### Development Tools
- **Language**: TypeScript v5
- **Package Manager**: npm
- **Linting**: ESLint with Next.js config
- **Component Library**: shadcn/ui (New York style)

## Essential Development Commands

```bash
# Development
npm run dev                    # Start development server (localhost:3000)
npm run build                  # Build production application
npm run start                  # Start production server
npm run lint                   # Run ESLint

# Database Operations
npx prisma studio              # Open Prisma Studio for database inspection
npx prisma migrate dev         # Create and apply new migrations
npx prisma migrate deploy      # Deploy migrations to production
npx prisma generate            # Generate Prisma client
npx prisma db push             # Push schema changes to database (development)
npx prisma db seed             # Seed database with initial data (if seed script exists)
npx prisma migrate reset       # Reset database and reapply migrations (development only)
```

## Project Structure

```
invoice-cc/
├── app/                        # Next.js 16 App Router
│   ├── [auth]/                # Better Auth catch-all routes
│   ├── api/                   # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── clients/           # Client CRUD operations
│   │   ├── invoices/          # Invoice CRUD + PDF generation
│   │   └── users/             # User profile and settings
│   ├── clients/               # Client management pages
│   ├── dashboard/             # Main dashboard
│   ├── invoices/              # Invoice pages (list, new, detail)
│   ├── settings/              # User settings
│   ├── layout.tsx             # Root layout with providers
│   └── page.tsx               # Landing/home page
├── components/                # React components
│   ├── ui/                    # shadcn/ui base components
│   ├── auth/                  # Authentication components
│   ├── clients/               # Client-related components
│   ├── forms/                 # Form components (invoice, client, settings)
│   ├── invoices/              # Invoice components (list, PDF, preview)
│   └── layout/                # Layout components (header, sidebar)
├── lib/                       # Utility libraries
│   ├── auth.ts                # Better Auth configuration
│   ├── db.ts                  # Prisma client singleton
│   ├── validations.ts         # Zod schemas
│   └── utils.ts               # General utilities
├── prisma/                    # Database schema and migrations
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── migrations.sql         # Generated SQL
└── public/                    # Static assets
```

## Database Architecture

### Core Models

**User Model**: Extended Better Auth schema with invoice-specific fields
- Authentication handled by Better Auth (email/password + Google OAuth)
- Invoice settings: prefix, nextInvoiceNum
- Business details: businessName, phone, address, taxId

**Client Model**: Customer/client information
- Unique constraint on [userId, name] to prevent duplicates per user
- Supports optional email, phone, company, address, notes

**Invoice Model**: Main invoice entity
- Auto-generated invoice numbers with user-defined prefix
- Financial calculations: subtotal, taxRate, taxAmount, total
- Status tracking: DRAFT, SENT, PAID, OVERDUE, CANCELLED
- Currency support (default: USD)

**InvoiceItem Model**: Line items for invoices
- Links to invoices with cascade delete
- Stores description, quantity, unitPrice, calculated total

### Key Relationships
- User → Clients (one-to-many)
- User → Invoices (one-to-many)
- Client → Invoices (one-to-many)
- Invoice → InvoiceItems (one-to-many)

### Important Database Patterns
- All user-specific data includes `userId` for multi-tenancy
- Cascade deletes maintain data integrity
- Unique constraints prevent duplicate invoice numbers per user
- Decimal fields for precise financial calculations

## Authentication Flow

### Better Auth Configuration
- Email/password authentication with 8+ character passwords
- Optional Google OAuth integration (requires GOOGLE_CLIENT_ID/SECRET)
- Session management: 7-day expiry with 1-day update
- Prisma adapter for database storage
- Account linking support for social providers

### Authentication Components
- `AuthProvider`: Wrap app with session context
- `AuthGuard`: Protect routes requiring authentication
- Session management handled by Better Auth cookies

### API Authentication
- All API routes require valid session
- Session extracted via `auth.api.getSession({ headers: request.headers })`
- User isolation enforced by checking `session.user.id`

## API Architecture

### RESTful Patterns
```
GET    /api/clients           # List user's clients
POST   /api/clients           # Create new client
GET    /api/clients/[id]      # Get specific client
PUT    /api/clients/[id]      # Update client
DELETE /api/clients/[id]      # Delete client

GET    /api/invoices          # List user's invoices
POST   /api/invoices          # Create new invoice
GET    /api/invoices/[id]     # Get specific invoice
PUT    /api/invoices/[id]     # Update invoice
DELETE /api/invoices/[id]     # Delete invoice
GET    /api/invoices/[id]/pdf # Generate PDF download
PUT    /api/invoices/[id]/status # Update invoice status

GET    /api/users/profile     # Get user profile
PUT    /api/users/profile     # Update user profile
```

### Response Patterns
- Success: JSON data with appropriate status codes
- Errors: `{ error: string }` with proper HTTP status codes
- Authentication: 401 for missing/invalid sessions
- Authorization: 403/404 for data access violations
- Validation: 400 with detailed error messages

## Component Architecture

### shadcn/ui Integration
- Configured with "new-york" style and neutral base colors
- Components in `/components/ui/` follow shadcn patterns
- Custom aliases: `@/components`, `@/lib`, `@/ui`
- CSS variables enabled for theming

### Form Patterns
- React Hook Form with Zod validation schemas
- Client and server-side validation
- TypeScript types generated from Zod schemas
- Consistent error handling and display

### PDF Generation
- Server-side PDF generation using @react-pdf/renderer
- Professional invoice template with company/client info
- Automatic file download with proper headers
- Error handling for generation failures

## Development Workflows

### Adding New Features
1. **Database Changes**: Update `schema.prisma`, run `npx prisma migrate dev`
2. **Validation**: Add/update schemas in `lib/validations.ts`
3. **API Routes**: Create endpoints in `app/api/` following RESTful patterns
4. **Components**: Build UI components in appropriate subdirectories
5. **Pages**: Create App Router pages in `app/` directory

### Invoice Number Generation
```typescript
// Pattern: {user-defined prefix}{auto-incrementing number}
// Example: INV001, INV002, INV003
// Managed per user in User.nextInvoiceNum field
```

### Financial Calculations
```typescript
// Calculate subtotal from invoice items
subtotal = sum(item.quantity * item.unitPrice for all items)

// Calculate tax amount
taxAmount = subtotal * (taxRate / 100)

// Calculate total
total = subtotal + taxAmount
```

### Error Handling Patterns
- Client: Toast notifications using Sonner
- API: Consistent error response format
- Database: Prisma error handling with user-friendly messages
- PDF: Try-catch with proper HTTP error responses

## Important Technical Details

### Environment Variables Required
```env
DATABASE_URL=           # Neon PostgreSQL connection string
NEXTAUTH_SECRET=        # Session encryption secret
NEXTAUTH_URL=           # Application URL
GOOGLE_CLIENT_ID=       # Google OAuth (optional)
GOOGLE_CLIENT_SECRET=   # Google OAuth (optional)
```

### Database Connection
- Prisma client singleton pattern in `lib/db.ts`
- Global connection reuse in development
- Neon PostgreSQL with connection pooling

### TypeScript Configuration
- Strict mode enabled
- Path alias `@/*` maps to project root
- Next.js plugin for optimal bundling
- Incremental builds enabled

### Performance Considerations
- React PDF generation can be resource-intensive
- Consider caching for frequently accessed data
- Database indexes on user foreign keys and invoice numbers
- Next.js Image optimization for any future images

## Development Best Practices

### Code Organization
- Keep components focused and reusable
- Use TypeScript interfaces for all data structures
- Implement proper error boundaries
- Follow React Hook Form patterns for forms

### Security
- All API routes require authentication
- User data isolation enforced at database level
- Input validation on both client and server
- Environment variables for sensitive data

### Testing Strategy
- Component testing with React Testing Library
- API endpoint testing
- Database operations testing
- PDF generation testing

### Deployment Notes
- Optimized for Vercel deployment
- Database migrations required for production
- Environment variables must be configured
- Build process includes Prisma client generation

## Current Implementation Status

Based on the codebase analysis, this is a functional MVP with:
- ✅ Complete authentication system
- ✅ Client management (CRUD operations)
- ✅ Invoice creation and management
- ✅ PDF generation and download
- ✅ User profile and settings
- ✅ Responsive UI with shadcn/ui components
- ✅ Database schema with migrations
- ✅ API routes following RESTful patterns

The application appears to be production-ready for the core invoice management functionality outlined in the PRD.