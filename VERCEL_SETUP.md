# Vercel Deployment Guide - Admin Authentication

## Environment Variables Setup

### For Production (Vercel Dashboard)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following environment variables:

```
ADMIN_EMAIL = admin@yoklama.com
ADMIN_PASSWORD = yoklama123
DATABASE_URL = <your_neon_db_url>
NODE_ENV = production
NEXT_PUBLIC_API_URL = https://<your-domain>.vercel.app
```

### Important Notes

- **Make sure variable names are EXACTLY as shown** (not `ADMIN_USERNAME`, not `NEXT_PUBLIC_ADMIN_PASSWORD`)
- Do NOT add `NEXT_PUBLIC_` prefix to `ADMIN_EMAIL` or `ADMIN_PASSWORD` (keep them as secrets)
- `DATABASE_URL` must be set to your production database (e.g., Neon PostgreSQL URL)
- After setting environment variables, **redeploy your application** for changes to take effect

## Local Development (.env file)

The `.env` file is required locally and should contain:

```
ADMIN_EMAIL=admin@yoklama.com
ADMIN_PASSWORD=yoklama123
DATABASE_URL=file:./prisma/dev.db
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Important**: The `.env` file is already in `.gitignore` and should NOT be committed to git.

## Testing Admin Login

1. Development: `npm run dev` and navigate to `http://localhost:3000/admin/login`
2. Production: Navigate to your Vercel domain `/admin/login`

Use credentials set in environment variables:
- Email: `admin@yoklama.com`
- Password: `yoklama123`

## Debugging

Check browser console for logs:
- `[LoginForm]` - Client-side form submission logs
- `[AdminLogin]` - Server-side API logs  
- `[Middleware]` - Route protection logs
- `[AdminAuth]` - Credential validation logs
- `[AdminLogout]` - Logout logs

## Common Issues

### 1. Credentials Always Wrong
**Check**: Are `ADMIN_EMAIL` and `ADMIN_PASSWORD` set in Vercel environment variables?

### 2. Login Page Shows But Can't Submit
**Check**: Is the browser console showing any errors? Are cookies being set?

### 3. Redirects to Login After Successful Login
**Check**: Does the `admin_session` cookie get set? Check Application → Cookies in browser DevTools

## Session Management

- Sessions are stored in-memory (24 hours expiry)
- **Note**: This means sessions are lost when the server restarts (normal for serverless)
- For production persistence, consider using a database-backed session store

## Next Steps

1. Set environment variables in Vercel dashboard
2. Redeploy your application
3. Test admin login with new credentials
4. Check browser console for debug logs if issues persist
