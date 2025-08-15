# Overview

This is a modern full-stack web application for an agricultural business called "GreenHarvest". The application serves as a company website showcasing agricultural services, equipment, and products, with a contact form for customer inquiries. Built with React frontend and Express backend, it demonstrates a professional agricultural business presence with modern web technologies.

# User Preferences

Preferred communication style: Simple, everyday language.

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

## Component Structure
- **Layout**: Single-page application with navigation, hero section, and multiple content sections
- **Sections**: Modular components for About, Services, Products, News, and Contact
- **Form Handling**: React Hook Form with Zod validation for contact form
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