# Zeus Authentication Setup Guide

This guide will walk you through setting up Supabase authentication for the Zeus application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Environment Configuration](#environment-configuration)
4. [Features](#features)
5. [File Structure](#file-structure)
6. [Usage Examples](#usage-examples)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Node.js v18+ installed
- A Supabase account (sign up at https://supabase.com)
- This Zeus project cloned and dependencies installed

---

## Supabase Setup

### Step 1: Create a Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in your project details:
   - **Name**: Zeus (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. Click "Create new project" (this takes ~2 minutes)

### Step 2: Enable Email Authentication

1. In your Supabase dashboard, navigate to **Authentication** → **Providers**
2. Ensure **Email** is enabled (it's enabled by default)
3. Configure email settings:
   - Scroll down to **Email Auth**
   - Toggle "Enable email confirmations" if you want users to verify their email
   - Toggle "Enable email change confirmations" for security

### Step 3: Get Your API Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

### Step 4: Configure Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize the following templates to match Zeus branding:
   - **Confirm signup**
   - **Reset password**
   - **Magic Link**
   - **Change Email Address**

---

## Environment Configuration

### Step 1: Create .env File

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Step 2: Verify Configuration

The application will automatically use these environment variables. If they're missing, you'll see a warning in the browser console.

---

## Features

### ✅ Implemented Authentication Features

- **User Registration** (`/signup`)
  - Full name, email, and password
  - Password strength validation (min 8 chars, uppercase, lowercase, number)
  - Email verification support
  - Terms of service agreement

- **User Login** (`/signin`)
  - Email and password authentication
  - "Remember me" functionality (via Supabase session persistence)
  - Password reset flow

- **Password Reset**
  - Forgot password functionality
  - Email-based password reset link
  - Secure token-based reset process

- **Session Management**
  - Automatic session refresh
  - Persistent sessions across browser restarts
  - Session detection in URL (for email verification)

- **User Profile**
  - Display user information in header
  - User avatar with initials
  - Dropdown menu with user actions

- **Protected Routes**
  - Ready-to-use auth context
  - Easy integration for route protection

### 🎨 UI/UX Features

- **Consistent Design**
  - Matches Zeus brand colors (electric blue, gold accents)
  - Gradient backgrounds matching the main site
  - Responsive design for all screen sizes

- **Form Validation**
  - Real-time field validation
  - Clear error messages
  - Visual feedback for all states

- **Loading States**
  - Loading spinners during authentication
  - Disabled form fields while processing
  - Toast notifications for success/error

---

## File Structure

```
src/
├── lib/
│   └── supabase.ts              # Supabase client configuration
├── contexts/
│   └── AuthContext.tsx          # Authentication context & hooks
├── pages/
│   ├── SignIn.tsx               # Sign in page
│   ├── SignUp.tsx               # Sign up page
│   └── Editor.tsx               # Example protected page
├── components/
│   ├── Header.tsx               # Updated with auth status
│   └── ui/                      # Shadcn UI components
└── App.tsx                      # App with AuthProvider

.env                             # Environment variables (create this)
.env.example                     # Environment template
AUTHENTICATION_SETUP.md          # This file
```

---

## Usage Examples

### Using Authentication in Components

```tsx
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <p>Welcome, {user.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Creating Protected Routes

```tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}

// In App.tsx
<Route
  path="/editor"
  element={
    <ProtectedRoute>
      <Editor />
    </ProtectedRoute>
  }
/>;
```

### Accessing User Data

```tsx
const { user } = useAuth();

// User ID
console.log(user?.id);

// User email
console.log(user?.email);

// User metadata (full_name, etc.)
console.log(user?.user_metadata?.full_name);
```

---

## Troubleshooting

### Issue: "Failed to fetch" or CORS errors

**Solution**: Make sure you've added your local development URL to Supabase's allowed origins:

1. Go to **Authentication** → **URL Configuration**
2. Add `http://localhost:8080` to **Site URL** and **Redirect URLs**

### Issue: Email confirmation not working

**Solution**:

1. Check your Supabase project's email settings
2. For development, you can disable email confirmation in **Authentication** → **Providers** → **Email** → Toggle off "Enable email confirmations"
3. Check your spam folder for confirmation emails

### Issue: Session not persisting

**Solution**:

1. Make sure your `.env` file has the correct credentials
2. Clear browser localStorage and cookies
3. Check browser console for any Supabase errors

### Issue: "Invalid API key" error

**Solution**:

1. Verify you're using the **anon/public** key, not the service_role key
2. Make sure there are no extra spaces in your `.env` file
3. Restart your development server after changing `.env`

### Issue: Password reset email not arriving

**Solution**:

1. Check Supabase dashboard → **Authentication** → **Email Templates**
2. Verify your SMTP settings or use Supabase's default email service
3. For development, check the Supabase dashboard logs for email delivery status

---

## Additional Configuration

### Custom Email Templates

Customize your email templates in Supabase:

1. **Authentication** → **Email Templates**
2. Edit templates with these variables:
   - `{{ .ConfirmationURL }}` - Email confirmation link
   - `{{ .Token }}` - Confirmation token
   - `{{ .TokenHash }}` - Token hash
   - `{{ .SiteURL }}` - Your site URL

### Security Best Practices

1. **Never commit `.env` to version control**
   - Already in `.gitignore`

2. **Use Row Level Security (RLS)**
   - Enable RLS on all tables that store user data
   - Example policy:
     ```sql
     CREATE POLICY "Users can only see their own data"
     ON user_data
     FOR SELECT
     USING (auth.uid() = user_id);
     ```

3. **Validate on the backend**
   - While we validate on the frontend, always validate on Supabase/backend too

4. **Use environment-specific credentials**
   - Development: One Supabase project
   - Production: Separate Supabase project

---

## Testing

### Test User Registration

1. Navigate to `http://localhost:8080/signup`
2. Fill in the form with valid data
3. Check your email for confirmation (if enabled)
4. Verify user appears in Supabase **Authentication** → **Users**

### Test User Login

1. Navigate to `http://localhost:8080/signin`
2. Enter credentials of a registered user
3. Verify redirect to home page
4. Check header shows user avatar/menu

### Test Password Reset

1. Navigate to `http://localhost:8080/signin`
2. Click "Forgot password?"
3. Enter email and request reset
4. Check email for reset link
5. Follow link and set new password

---

## Next Steps

1. **Customize Email Templates**: Brand your authentication emails
2. **Add Social Auth**: Enable Google, GitHub, etc. in Supabase
3. **Profile Page**: Create a dedicated user profile page
4. **User Settings**: Allow users to update their information
5. **Two-Factor Authentication**: Enable 2FA in Supabase for enhanced security

---

## Support

- **Supabase Documentation**: https://supabase.com/docs/guides/auth
- **Zeus GitHub Issues**: [Your repository issues page]
- **Supabase Discord**: https://discord.supabase.com

---

## License

This authentication implementation is part of the Zeus project and follows the same license.
