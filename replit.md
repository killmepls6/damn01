# MangaVerse - Manga & Manhwa Discovery Platform

## Overview
MangaVerse is a full-stack TypeScript web application designed for discovering and exploring manga and manhwa. It features a dark, anime-inspired design and emphasizes offline functionality, portability, and robust monetization. The platform includes comprehensive ads management and is built for production readiness, focusing on performance, security, and an optimized user experience, including world-class SEO infrastructure for top search engine rankings.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript and Vite.
- **Styling**: Tailwind CSS with a custom dark, anime-inspired theme, utilizing Radix UI primitives and shadcn/ui for components.
- **State Management**: TanStack Query for server state.
- **Routing**: Wouter for lightweight client-side routing.
- **UI/UX Decisions**: Incorporates skeleton components, lazy loading, WebP/AVIF image support with blur placeholders, and touch-friendly carousels. Optimized for Core Web Vitals, including image dimension attributes to prevent CLS.

### Backend
- **Runtime**: Node.js with Express.js for a REST API.
- **Language**: TypeScript with ES modules.
- **Database ORM**: Drizzle ORM for type-safe operations.
- **Storage**: SQLite for offline functionality and portability, using local files.
- **Security**: Strict CSP, bcrypt for password hashing, account enumeration protection, and SQLite-backed session management.
- **Real-Time Updates**: WebSocket broadcast system for instant updates across the platform, covering 7 event types (subscription, battlepass, flashsale, coupon, package, role, currency).

### Data Architecture
- **Database**: SQLite (better-sqlite3 and Drizzle ORM) with an offline-first design, supporting user management, authentication, admin system, content, and monetization data. Configured with WAL mode and comprehensive indexing for performance.
- **Validation**: Zod schemas for runtime type validation.
- **Backup System**: Automated database backup and restore.

### Authentication & Admin System
- **Authentication**: Supports username/password and Replit OIDC.
- **Authorization**: Role-based access control (RBAC) middleware.
- **Admin Features**: Comprehensive admin panel for managing users, content, analytics, system settings, currency, ads, and monetization. Includes a unified monetization dashboard with revenue analytics, package/coupon management, and Stripe integration. Also features an Admin SEO Management UI for metadata optimization and a master ad-free toggle with a 5-level intensity system.

### Key Features
- **Core Functionality**: User profiles, content browsing, reading lists, and real-time updates.
- **Monetization System**: Coin economy, VIP memberships (3 tiers), Battle Pass, Flash Sales, Daily Rewards, Achievements, Referral System, Loyalty Program, Wallet with transaction history, all integrated with Stripe.
- **Ads Management System**: Global ON/OFF toggle with 5-level intensity control (Minimal to Maximum), dynamic ad quantity, and popup filtering, managed via admin panel with real-time updates.
- **Performance & Optimization**: Icon tree-shaking, console log stripping, bundle reduction (target <1MB gzipped), WebP/AVIF image support, extensive caching, service worker for offline support, and React.memo/useMemo/useCallback for rendering efficiency.
- **SEO Infrastructure**: Prerender-for-bots middleware to serve fully-rendered HTML to crawlers (Googlebot, Bingbot, etc.), dynamic sitemap.xml with image support and priority ranking, JSON-LD structured data (CreativeWorkSeries & ComicStory), comprehensive meta tags (Open Graph, Twitter Card), SEO health monitoring, robots.txt, internal linking API, and a database-backed system for managing SEO metadata per series/chapter.
- **Security Hardening**: Helmet security headers, secure session cookies, 6-tier rate limiting system, and Zod validation on all input schemas.
- **Error Handling**: Robust error handling with React error boundaries and toast notifications.

## External Dependencies

### Core Framework Dependencies
- **@tanstack/react-query**: Data fetching and caching.
- **wouter**: Lightweight React router.
- **drizzle-orm**: Type-safe ORM.
- **better-sqlite3**: SQLite database driver for Node.js.

### UI and Styling
- **@radix-ui/react-***: Headless UI components.
- **tailwindcss**: Utility-first CSS framework.
- **shadcn/ui**: Reusable UI components.
- **embla-carousel-react**: Touch-friendly carousel.
- **Chart.js**: Charting library for analytics visualizations.

### Development and Build Tools
- **vite**: Frontend build tool and dev server.
- **tsx**: TypeScript execution for development scripts.
- **esbuild**: JavaScript bundler for backend.

### Database and Validation
- **drizzle-kit**: Database migration and introspection tools.
- **zod**: Runtime type validation library.

### Utility Libraries
- **date-fns**: Date manipulation utility.
- **nanoid**: Unique string ID generator.
- **clsx** and **tailwind-merge**: Utilities for conditionally joining CSS class names.
- **bcrypt**: Password hashing.