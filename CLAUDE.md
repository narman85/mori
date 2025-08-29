# Claude Context - Mori Tea Frontend

## Project Overview
- **Name**: Mori Tea - E-commerce tea shop frontend
- **Tech Stack**: React, TypeScript, Vite, Tailwind CSS
- **Database**: Recently migrated from PocketBase to Turso
- **Deployment**: Railway (frontend), Fly.io (backend previously)

## Recent Major Changes
- Migrated from PocketBase to Turso database
- Cleaned up authentication system 
- Removed unused components (CartSidebar, ProductCard, SearchPopup)
- Updated database connection and queries
- Added Clerk authentication integration

## Current Status
- Main branch with recent Turso migration commit
- Several modified files in staging
- Test HTML files present for development
- New integrations folder for Turso

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run linting
- `npm run typecheck` - TypeScript checking

## Key Components
- ProductGrid.tsx - Main product display grid
- ProductCardSimple.tsx - Simplified product cards
- Header.tsx - Navigation header
- CartContext.tsx - Shopping cart state management

## Database Integration
- Located in `src/integrations/turso/`
- Connection setup in `src/lib/database.ts`

## Admin Panel
- Products management
- User management
- Order tracking

## User Features
- Product browsing and search
- Shopping cart functionality
- User authentication
- Order history