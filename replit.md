# Overview

This is a modern full-stack web application for Vantage South, a precision agriculture company serving the Southeast US. The application features a comprehensive SEO-first location page system covering 4 territories (Alabama, Mississippi, NW Florida, Central Tennessee), 32 tier-1 county pages, and 65+ city pages, along with service pages, crop pages, product catalog with manufacturer enrichment, and field demo scheduling. Built with React frontend and Express backend with professional agricultural business presence.

# User Preferences

Preferred communication style: Simple, everyday language.
Design style: Clean professional design with square corners, white background, glassmorphism effects.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible design
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **State Management**: TanStack React Query for server state management and API calls
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js framework for REST API
- **Language**: TypeScript for type safety across the stack
- **API Design**: RESTful endpoints following conventional HTTP methods
- **Request Handling**: Express middleware for JSON parsing, URL encoding, and request logging
- **Error Handling**: Centralized error middleware with proper HTTP status codes

## Data Storage Solutions
- **Database**: PostgreSQL configured through Drizzle ORM
- **ORM**: Drizzle ORM for type-safe database operations and schema management
- **Schema**: Shared schema definitions between frontend and backend using TypeScript
- **Fallback Storage**: In-memory storage implementation for development/testing
- **Validation**: Zod schema validation for data integrity and type safety

## SEO Location Page System

### Data Files
- **shared/targetLocations.json**: Contains 4 territories, 32 tier-1 counties, 65+ cities with metadata (primary crops, emphasis text)
- **shared/seoMeta.json**: Title and description for all programmatic SEO pages

### Route Architecture
- Territory Hub Pages: `/{territory-slug}` (e.g., /alabama-precision-agriculture)
- County Pages: `/{state}/{county-slug}/precision-agriculture` (e.g., /alabama/houston-county/precision-agriculture)
- City Pages: `/{state}/{city-slug}/precision-agriculture` (e.g., /alabama/dothan/precision-agriculture)
- Service Pages: `/services/{service-slug}` (5 services)
- Crop Pages: `/crops/{crop-slug}` (5 crops)
- Field Demo: `/schedule-field-demo`

### JSON-LD Schema Markup (client/src/lib/seo.tsx)
- Organization schema on hub pages
- LocalBusiness schema on territory and location pages
- Service schema on service and location pages
- Product schema on product pages
- FAQ schema on territory hub pages
- Breadcrumb schema on all programmatic pages

### Sitemap & SEO Infrastructure (server/routes.ts)
- Auto-generated /sitemap.xml from targetLocations.json
- /robots.txt with sitemap reference
- useSEO hook injects dynamic title/description from seoMeta.json

### Page Components
- **TerritoryHub.tsx**: 4 territory hub pages with county links, solutions, FAQs
- **LocationPage.tsx**: Unified component for county and city pages (extracts state from useLocation path)
- **ServicePage.tsx**: 5 service pages with features, benefits, CTA
- **CropPage.tsx**: 5 crop pages with challenges, solutions, technology
- **FieldDemo.tsx**: Field demo scheduling form with validation
- **FieldDemoCTA.tsx**: CTA component injected on location pages

### Local SEO Enrichment System
- **Content Directory**: `content/enrichment/{state}/{location}.json` - Localized agricultural history content
- **Generator Script**: `scripts/generateEnrichment.ts` - Creates enrichment content from seed templates
- **Validator Script**: `scripts/validateEnrichment.ts` - Checks 200+ word count, uniqueness, place mentions
- **Seed File**: `content/enrichment/seed.json` - Location metadata (crops, soils, constraints, citations)
- **Types**: `shared/enrichmentTypes.ts` - TypeScript interfaces for enrichment data
- **Backend Service**: `server/enrichmentService.ts` - Loads and serves enrichment content
- **API Endpoint**: `/api/enrichment/:state/:slug` - Returns enrichment JSON for location
- **React Component**: `client/src/components/LocalAgContext.tsx` - Displays enrichment with FAQ, citations, CTA

Content angles include: crop-evolution, soils-water, infrastructure, technology-adoption, resilience-weather, economics-operations

## Product Catalog
- 79 products from productData.ts with categories
- Product enrichment system: 55/79 products have manufacturer images and descriptions
- Product detail pages with schema markup

## Component Structure
- **Layout**: Single-page application with navigation, hero section, and multiple content sections
- **Sections**: Modular components for About, Services, Products, News, and Contact
- **Form Handling**: React Hook Form with Zod validation for contact form and field demo form
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

## Development Environment
- **Hot Reload**: Vite development server with fast refresh
- **TypeScript**: Strict mode enabled for maximum type safety
- **Path Aliases**: Configured aliases for clean imports (@/, @shared/, @assets/)
- **Asset Handling**: Support for static assets and Unsplash image integration

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Router (Wouter)
- **State Management**: TanStack React Query for API state management
- **Form Management**: React Hook Form with Hookform Resolvers

## UI and Styling
- **Component Library**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with PostCSS and Autoprefixer
- **Icons**: Lucide React for consistent iconography
- **Utility Libraries**: clsx and tailwind-merge for conditional styling

## Backend Infrastructure
- **Database**: Neon Database (PostgreSQL) for cloud-hosted database
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Validation**: Zod for runtime type checking and validation
- **Session Management**: connect-pg-simple for PostgreSQL session storage

## Development Tools
- **Build Tools**: Vite with React plugin and TypeScript support
- **Replit Integration**: Custom Vite plugins for Replit development environment
- **Development Server**: Express with Vite middleware for full-stack development

## External Services
- **Image CDN**: Unsplash for high-quality agricultural imagery
- **Database Hosting**: Neon Database for PostgreSQL hosting
- **Font Loading**: Google Fonts for typography (Inter, DM Sans, Fira Code, Geist Mono)

## Utilities and Helpers
- **Date Handling**: date-fns for date manipulation and formatting
- **Unique IDs**: nanoid for generating unique identifiers
- **Class Management**: class-variance-authority for component variant handling

# Recent Changes

- December 2024: Implemented comprehensive SEO location page system with 4 territories, 32 counties, 65+ cities
- December 2024: Added JSON-LD schema generators (Organization, LocalBusiness, Service, Product, FAQ, Breadcrumb)
- December 2024: Built auto-generated sitemap.xml and robots.txt endpoints
- December 2024: Created unified LocationPage component handling county and city routes
- December 2024: Added FieldDemoCTA components with multiple variants (compact, default, full)
- December 2024: Enriched 55/79 products with manufacturer images and descriptions
- December 2024: Created Local SEO Enrichment system with generator, validator, API endpoint, and React component
- December 2024: Generated 8 enrichment files for Alabama and Mississippi locations
