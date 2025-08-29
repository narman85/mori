# Claude Context - Mori Tea Frontend

## Project Overview
- **Name**: Mori Tea - E-commerce tea shop frontend
- **Tech Stack**: React, TypeScript, Vite, Tailwind CSS
- **Database**: Turso (SQLite edge database)
- **Image Storage**: Cloudinary
- **Deployment**: Cloudflare Pages
- **Authentication**: Clerk (partially integrated)

## Recent Major Changes (2025-08-29)
- ✅ Migrated from PocketBase to Turso database completely
- ✅ Added Cloudinary integration for image uploads
- ✅ Fixed ProductDetail page with image gallery (like Jingtea)
- ✅ Fixed EditProduct page to work with Turso + Cloudinary
- ✅ All images stored as JSON array in database
- ✅ Removed all PocketBase dependencies

## Current Architecture

### Database (Turso)
- URL: libsql://tea-store-db-haji.aws-eu-west-1.turso.io
- Client: `src/integrations/turso/client.ts`
- Images stored as JSON in `image_url` field
- No separate `additional_images` column

### Image Management (Cloudinary)
- Cloud Name: dfbl90z6s
- Upload Preset: tea_upload
- Utility: `src/utils/cloudinary.ts`
- All product images uploaded to Cloudinary

### Frontend Routes
- `/` - Homepage with ProductGrid
- `/product/:id` - Product detail with image gallery
- `/admin/products` - Products management
- `/admin/products/new` - Add new product
- `/admin/products/edit/:id` - Edit product

## Development Commands
- `npm run dev` - Start development server (port 8082)
- `npm run build` - Build for production
- `npx wrangler pages deploy dist --project-name=tea-store-frontend` - Deploy to Cloudflare

## Key Components
- **ProductGrid.tsx** - Uses `tursoDb.getProducts()`
- **ProductDetail.tsx** - Has image gallery with thumbnails
- **AddProduct.tsx** - Cloudinary upload for new products
- **EditProduct.tsx** - Edit with Cloudinary image management

## Known Issues Fixed
- ✅ Products not showing on homepage - Fixed tursoDb usage
- ✅ Edit button not working - Fixed PocketBase to Turso migration
- ✅ Images not showing in edit - Fixed URL handling
- ✅ New images not saving properly - Fixed JSON storage

## Environment Variables (.env)
```
VITE_TURSO_DATABASE_URL=libsql://tea-store-db-haji.aws-eu-west-1.turso.io
VITE_TURSO_AUTH_TOKEN=...
VITE_CLOUDINARY_CLOUD_NAME=dfbl90z6s
VITE_CLOUDINARY_UPLOAD_PRESET=tea_upload
```

## User Notes
- User prefers direct communication
- Dislikes unnecessary commits
- Wants deployment without extra steps
- Uses Azerbaijani language often