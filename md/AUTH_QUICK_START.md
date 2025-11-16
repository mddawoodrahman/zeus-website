# 🚀 Quick Start - Authentication Setup (5 Minutes)

Follow these steps to get authentication working immediately.

## Step 1: Create Supabase Project (2 min)

1. Go to https://app.supabase.com and sign up/login
2. Click **"New Project"**
3. Enter project name: `Zeus` (or any name)
4. Set a strong database password (save it!)
5. Choose your region
6. Click **"Create new project"** (wait ~2 minutes)

## Step 2: Get Your Credentials (1 min)

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string under "Project API keys")

## Step 3: Configure Your App (1 min)

1. Open the `.env` file in your project root
2. Replace the placeholder values:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
   ```
3. Save the file

## Step 4: Run Your App (1 min)

```bash
npm run dev
```

Visit: http://localhost:8080

## ✅ Test It Out

### Test Sign Up

1. Click **"Try Zeus"** or go to http://localhost:8080/signup
2. Fill in:
   - Full Name: Test User
   - Email: test@example.com
   - Password: Test1234 (or any strong password)
   - Check "I agree to terms"
3. Click **"Create Account"**
4. ✨ You'll see a success message!

### Test Sign In

1. Go to http://localhost:8080/signin
2. Enter the email and password you just created
3. Click **"Sign In"**
4. ✨ You're logged in! See your avatar in the header

### Test Sign Out

1. Click on your avatar (circle with your initial) in the header
2. Click **"Sign Out"**
3. ✨ You're signed out!

## 🎯 What You Get

- ✅ **Sign Up Page** - Beautiful registration form
- ✅ **Sign In Page** - Secure login form
- ✅ **Password Reset** - Forgot password functionality
- ✅ **User Profile** - Avatar and dropdown menu
- ✅ **Session Persistence** - Stay logged in
- ✅ **Form Validation** - Real-time error checking
- ✅ **Toast Notifications** - User feedback
- ✅ **Theme Support** - Light/dark mode compatible

## 📱 What Pages Are Available?

- `/` - Home page
- `/signup` - Create new account
- `/signin` - Login to existing account
- `/editor` - Writing editor (accessible to all)

## 🔐 Security Notes

- Passwords are hashed by Supabase automatically
- Sessions are stored securely in browser
- Email verification can be enabled in Supabase dashboard
- All authentication happens over HTTPS in production

## ⚙️ Optional: Enable Email Verification

1. In Supabase: **Authentication** → **Providers** → **Email**
2. Toggle ON: **"Enable email confirmations"**
3. Users will receive a verification email after signup
4. Configure email templates in **Authentication** → **Email Templates**

## 🎨 Customization

All auth pages match your Zeus theme:

- Electric blue primary color
- Gold accent colors
- Gradient backgrounds
- Consistent typography
- Responsive design

## 📚 Need More Help?

- Full documentation: See `AUTHENTICATION_SETUP.md`
- Supabase docs: https://supabase.com/docs/guides/auth
- Having issues? Check the Troubleshooting section in the full docs

## 🚨 Common Issues

**"Failed to fetch"**

- Make sure your `.env` has the correct values
- Restart dev server: `Ctrl+C` then `npm run dev`

**"Invalid API key"**

- Use the **anon public** key, NOT the service_role key
- No extra spaces in `.env`

**Can't sign in after signup**

- If email verification is enabled, check your email
- Or disable it temporarily in Supabase settings

---

**That's it! You're ready to go! 🎉**
