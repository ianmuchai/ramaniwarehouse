# Ramani Warehouse Ecommerce

React + Vite storefront with an Express API for Ramani Warehouse.

The Vite app now lives at the repository root so Vercel should not auto-select a `client` folder.

## Local Development

From the project root:

```powershell
npm.cmd install
npm.cmd run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

Admin access code defaults to:

```text
ramani-admin
```

Set a production admin key with `ADMIN_KEY`.

## Vercel Deployment

Import the GitHub repository normally. Vercel should now detect the root Vite app.

Use these Vercel settings if Vercel asks:

| Setting | Value |
| --- | --- |
| Framework Preset | Vite |
| Root Directory | leave blank / repository root |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

The included `vercel.json` handles:

- Vite build output from `dist`
- `/api/*` requests through the Express serverless entry
- `/images/*` requests for uploaded/static images
- SPA refresh fallback to `index.html`

## Required Environment Variables

Recommended in Vercel Project Settings > Environment Variables:

```env
ADMIN_KEY=choose-a-private-admin-password
CLIENT_URL=https://your-vercel-domain.vercel.app
```

Optional Stripe checkout:

```env
STRIPE_SECRET_KEY=your_stripe_secret_key
```

Without Stripe, checkout returns a demo order response.

## Image Uploads and Vercel

Existing images committed in `server/public/images` will render on Vercel.

Important: Vercel serverless functions do not provide permanent writable file storage. Admin uploads can work locally, but production uploads need a persistent storage service such as Vercel Blob, Cloudinary, S3, or Supabase Storage if you want uploaded files to remain permanently after deployment/redeploys.

## Poster Dimensions

| Placement | Size | Ratio | Safe area |
| --- | --- | --- | --- |
| Homepage hero carousel | 1600 x 820 px | 80:41 | Keep text-free subject matter inside the center 1280 x 620 px area. |
| Category carousel poster | 1200 x 720 px | 5:3 | Keep product/category focus inside the center 980 x 560 px area. |
| Product card image | 900 x 720 px | 5:4 | Keep product fully visible inside the center 760 x 600 px area. |
| Promo strip banner | 1600 x 560 px | 20:7 | Keep offer copy inside the center 1320 x 420 px area. |
