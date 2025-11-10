# Environment Variables Setup

This document explains how to configure environment variables for connecting the frontend to the backend API.

## Backend API URL Configuration

The frontend needs to know where the backend API is located. The backend is deployed at:
- **Production**: `https://evolvix-backend.vercel.app/api`
- **Local Development**: `http://localhost:5000/api`

## Setup Instructions

### For Local Development

1. Create a `.env.local` file in the `evolvix` directory (if it doesn't exist):
   ```bash
   cd evolvix
   touch .env.local
   ```

2. Add the following to `.env.local`:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
   ```

3. Make sure your backend is running locally on port 5000.

### For Vercel Deployment (Production)

**⚠️ REQUIRED**: You MUST set the `NEXT_PUBLIC_API_BASE_URL` environment variable in production. The application will not work without it.

1. **Via Vercel Dashboard (Recommended):**
   - Go to your project settings in Vercel Dashboard
   - Navigate to **Settings** → **Environment Variables**
   - Add a new variable:
     - **Name**: `NEXT_PUBLIC_API_BASE_URL`
     - **Value**: `https://evolvix-backend.vercel.app/api`
     - **Environment**: Production, Preview, Development (as needed)
   - Click **Save**

2. **Via Vercel CLI:**
   ```bash
   vercel env add NEXT_PUBLIC_API_BASE_URL
   # Enter: https://evolvix-backend.vercel.app/api
   # Select environments: Production, Preview, Development
   ```

3. **Redeploy** your frontend after adding the environment variable.

**Note**: The environment variable is **mandatory** in production. The application will throw an error if it's missing.

## Automatic Detection

The API configuration (`src/config/api.ts`):
- **Requires** `NEXT_PUBLIC_API_BASE_URL` to be set in production
- Falls back to `http://localhost:5000/api` only for local development
- **Never hardcodes production URLs** for security reasons

**Important**: The environment variable is **required** in production. The application will fail to start if it's not set.

## Verification

After setting up, verify the connection:

1. Check the browser console for any API errors
2. Try signing in - the error message should disappear
3. Check Network tab in browser DevTools to see API requests going to the correct URL

## Troubleshooting

### Error: "Cannot connect to server"

This means the frontend cannot reach the backend. Check:

1. **Environment Variable**: Ensure `NEXT_PUBLIC_API_BASE_URL` is set correctly in Vercel
2. **Backend Status**: Verify backend is running at `https://evolvix-backend.vercel.app`
3. **CORS**: Ensure backend has `CORS_ORIGIN` set to include your frontend URL
4. **Network**: Check browser console for specific error messages

### CORS Errors

If you see CORS errors, ensure the backend has your frontend URL in its `CORS_ORIGIN` environment variable:
- Frontend URL: `https://evolvix-iota.vercel.app`
- Backend should allow: `https://evolvix-iota.vercel.app` or `https://*.vercel.app`

## Environment Variables Reference

### Required for Frontend

- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL
  - **Required** in production
  - Optional in development (defaults to `http://localhost:5000/api`)
  - Example: `https://evolvix-backend.vercel.app/api`

### Required for Backend

- `MONGO_DB` or `MONGODB_URI` - MongoDB connection string
- `CORS_ORIGIN` - Frontend URL(s) for CORS (e.g., `https://evolvix-iota.vercel.app`)
- `NODE_ENV` - Set to `production` for deployed backend

## Notes

- Environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Changes to environment variables require a redeploy
- For local development, `.env.local` is automatically loaded by Next.js
- Never commit `.env.local` to git (it's in `.gitignore`)

