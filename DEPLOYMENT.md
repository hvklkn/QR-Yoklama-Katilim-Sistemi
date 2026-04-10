# Vercel Deployment Guide

This document explains how to deploy the QR Attendance System on Vercel and configure admin authentication.

---

## 🌐 Environment Variables

### Production (Vercel Dashboard)

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add the following variables:

```env
ADMIN_EMAIL=admin@yoklama.com
ADMIN_PASSWORD=strong-password
DATABASE_URL=<your_neon_database_url>
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://<your-domain>.vercel.app
```

---

## ⚠️ Important Notes

* Variable names must be **exactly the same**
* Do NOT use `NEXT_PUBLIC_` for admin credentials
* `DATABASE_URL` must point to your production database (Neon PostgreSQL)
* After adding variables, **redeploy the application**

---

## 💻 Local Development

Create a `.env.local` file:

```env
ADMIN_EMAIL=admin@yoklama.com
ADMIN_PASSWORD=change-me
DATABASE_URL=file:./prisma/dev.db
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

> ⚠️ `.env.local` is ignored by git and should NOT be committed

---

## 🔐 Admin Login Test

* Development:
  http://localhost:3000/admin/login

* Production:
  https://your-domain.vercel.app/admin/login

Use credentials defined in environment variables.

---

## 🐞 Debugging

Check browser console logs:

* `[LoginForm]` → Client-side form
* `[AdminLogin]` → API logs
* `[Middleware]` → Route protection
* `[AdminAuth]` → Authentication logic
* `[AdminLogout]` → Logout process

---

## ⚠️ Common Issues

### 1. Credentials Always Incorrect

✔ Check environment variables in Vercel
✔ Make sure redeploy is done

---

### 2. Login Works but Redirects Back

✔ Check if `admin_session` cookie is created
✔ Inspect via DevTools → Application → Cookies

---

### 3. Login Request Fails

✔ Check browser console errors
✔ Check API route logs

---

## 🔄 Session Management

* Sessions are stored **in-memory**
* Expiry: **24 hours**
* Server restart → sessions reset

> For production scaling, a database or Redis-based session store is recommended.

---

## 🚀 Deployment

```bash
vercel
```

---

## ✅ Deployment Checklist

* [ ] Environment variables added
* [ ] Application redeployed
* [ ] Admin login works
* [ ] Cookies are set correctly
* [ ] API endpoints responding

---

## 🎯 Summary

This setup enables secure admin authentication using environment variables and session-based access control, optimized for serverless deployment on Vercel.
