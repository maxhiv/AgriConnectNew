# Vantage South Design Guidelines

## Design Approach
**Reference-Based:** Modern tech product showcase (Tesla, Apple product pages) adapted for agricultural equipment. Emphasis on clean presentation, high-quality imagery, and intuitive filtering.

## Typography
- **Primary Font:** Inter (Google Fonts) - modern, technical precision
- **Hierarchy:**
  - Hero headline: 4xl-6xl, bold (font-bold)
  - Section headers: 3xl-4xl, semibold
  - Product titles: xl-2xl, semibold
  - Body: base-lg, regular
  - Labels/metadata: sm, medium

## Layout System
**Spacing Primitives:** Tailwind units 4, 6, 8, 12, 16, 24
- Section padding: py-16 to py-24
- Component gaps: gap-6 to gap-8
- Card padding: p-6 to p-8
- Tight groupings: space-y-4

## Core Components

### Hero Section
- Full-width, 70vh height with high-quality agricultural field/equipment photography
- Centered content overlay with glassmorphism container (backdrop-blur-md, bg-white/10)
- Headline + subheadline + dual CTAs (primary "Explore Equipment", secondary "Contact Sales")
- CTA buttons with backdrop-blur-sm and semi-transparent backgrounds

### Product Catalog Interface
**Filter Sidebar (left, sticky):**
- Brand checkboxes (all 6 brands listed)
- Equipment category filters
- Price range slider
- Search input at top
- Clear filters button
- Width: w-64 on desktop, collapsible drawer on mobile

**Product Grid (main):**
- 3-column grid (lg:grid-cols-3 md:grid-cols-2 grid-cols-1)
- Cards with square corners, glassmorphism effect (backdrop-blur-sm border border-white/20)
- Each card: Equipment image, brand logo badge, product name, key specs list, price, "View Details" link
- Hover: subtle lift (hover:translate-y-[-4px])

### Brand Showcase Section
- 6-column grid displaying brand logos (grid-cols-2 md:grid-cols-3 lg:grid-cols-6)
- Equal-height containers with glassmorphism backgrounds
- Each logo clickable to filter catalog

### Features/Benefits Grid
- 3-column layout showcasing precision farming benefits
- Icons (Heroicons), headline, description
- Glassmorphism cards with square corners

### Footer
- 4-column layout: About, Products (brand links), Resources, Contact
- Newsletter signup with inline form
- Social links, certifications/partnerships
- Dealer locator link

## Glassmorphism Implementation
**Standard Card Pattern:**
- backdrop-blur-md or backdrop-blur-sm
- bg-white/10 or bg-white/5 depending on depth
- border border-white/20
- Square corners (no rounded classes)

## Navigation
- Sticky header with glassmorphism (backdrop-blur-lg bg-white/90)
- Logo left, nav center (Products, Brands, Support, About), CTA right
- Mega-menu dropdown for Products showing all brands

## Images Section
**Required Images:**
1. **Hero:** Wide aerial shot of precision farming operation (drone, modern tractor with GPS, organized crop rows) - 1920x1080px minimum
2. **Product Photos:** Professional equipment shots with white backgrounds (6-12 per brand)
3. **Brand Logos:** All 6 partner brand logos (PTx Trimble, XAG, Ag Leader, SurePoint Ag, Salford, AMAZONE)
4. **Feature Icons:** Use Heroicons for precision, connectivity, efficiency icons
5. **About Section:** Team/facility photos showing expertise

## Animations
**Minimal, purposeful only:**
- Scroll-triggered fade-ins for product cards (stagger effect)
- Smooth filter transitions (200ms duration)
- Navigation glassmorphism on scroll

## Accessibility
- Filter controls with proper labels
- Keyboard navigation for product grid
- Focus states with visible outlines
- Alt text for all equipment images
- ARIA labels for brand filters