# 🔐 Authentication Flow Diagrams

Visual guide to understanding how authentication works in the Zeus application.

## 📱 User Registration Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    User Visits /signup                       │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Sign Up Form Displayed                          │
│  • Full Name                                                 │
│  • Email Address                                             │
│  • Password (with strength requirements)                     │
│  • Confirm Password                                          │
│  • Terms of Service Checkbox                                 │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ User Fills Form & Submits
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Frontend Validation                             │
│  ✓ Email format                                              │
│  ✓ Password strength (8+ chars, uppercase, lowercase, num)  │
│  ✓ Passwords match                                           │
│  ✓ Terms accepted                                            │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ Validation Passed
                            ▼
┌─────────────────────────────────────────────────────────────┐
│           Call AuthContext.signUp()                          │
│           ↓                                                  │
│      Send Request to Supabase                                │
│      supabase.auth.signUp()                                  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                ┌───────────┴────────────┐
                │                        │
           Success                    Error
                │                        │
                ▼                        ▼
┌──────────────────────────┐  ┌────────────────────────┐
│  Account Created!        │  │  Show Error Message     │
│  • Store user data       │  │  • Email already exists │
│  • Send verification     │  │  • Invalid email        │
│    email (if enabled)    │  │  • Weak password        │
│  • Show success toast    │  └────────────────────────┘
│  • Redirect to /signin   │
└──────────────────────────┘
```

## 🔑 User Login Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    User Visits /signin                       │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Sign In Form Displayed                          │
│  • Email Address                                             │
│  • Password                                                  │
│  • Forgot Password Link                                      │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ User Enters Credentials
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Frontend Validation                             │
│  ✓ Email format                                              │
│  ✓ Password not empty                                        │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ Validation Passed
                            ▼
┌─────────────────────────────────────────────────────────────┐
│           Call AuthContext.signIn()                          │
│           ↓                                                  │
│      Send Request to Supabase                                │
│      supabase.auth.signInWithPassword()                      │
└───────────────────────────┬─────────────────────────────────┘
                            │
                ┌───────────┴────────────┐
                │                        │
           Success                    Error
                │                        │
                ▼                        ▼
┌──────────────────────────┐  ┌────────────────────────┐
│  Login Successful!       │  │  Show Error Message     │
│  • Create session        │  │  • Invalid credentials  │
│  • Store session token   │  │  • Email not verified   │
│  • Update AuthContext    │  │  • Account disabled     │
│  • Show welcome toast    │  └────────────────────────┘
│  • Redirect to home      │
│    or intended page      │
└──────────────────────────┘
```

## 🔄 Session Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   App Loads / Refreshes                      │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              AuthProvider Initializes                        │
│              Check for existing session                      │
│              supabase.auth.getSession()                      │
└───────────────────────────┬─────────────────────────────────┘
                            │
                ┌───────────┴────────────┐
                │                        │
        Session Found              No Session
                │                        │
                ▼                        ▼
┌──────────────────────────┐  ┌────────────────────────┐
│  User is Authenticated   │  │  User is Guest          │
│  • Set user state        │  │  • user = null          │
│  • Set session state     │  │  • Show sign in         │
│  • Show avatar in header │  │    buttons              │
│  • Enable protected      │  │  • Redirect protected   │
│    routes                │  │    routes to /signin    │
└──────────┬───────────────┘  └────────────────────────┘
           │
           │ Session Expires?
           ▼
┌─────────────────────────────────────────────────────────────┐
│              Supabase Auto-Refresh                           │
│  • Refresh token sent to Supabase                            │
│  • New access token received                                 │
│  • Session updated automatically                             │
│  • User stays logged in                                      │
└─────────────────────────────────────────────────────────────┘
```

## 🔓 Sign Out Flow

```
┌─────────────────────────────────────────────────────────────┐
│           User Clicks "Sign Out" in Menu                     │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│           Call AuthContext.signOut()                         │
│           ↓                                                  │
│      Send Request to Supabase                                │
│      supabase.auth.signOut()                                 │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Clear Session                                   │
│  • Remove session from localStorage                          │
│  • Clear AuthContext state (user = null)                     │
│  • Update UI (show sign in button)                           │
│  • Show success toast                                        │
│  • Redirect to home page                                     │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Password Reset Flow

```
┌─────────────────────────────────────────────────────────────┐
│      User Clicks "Forgot Password?" on Sign In Page          │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│         Forgot Password Section Expands                      │
│         User Enters Email Address                            │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│      Call AuthContext.resetPassword(email)                   │
│      ↓                                                       │
│      supabase.auth.resetPasswordForEmail()                   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│         Supabase Sends Password Reset Email                  │
│         • Contains secure reset link                         │
│         • Link includes token                                │
│         • Expires after set time                             │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ User Clicks Email Link
                            ▼
┌─────────────────────────────────────────────────────────────┐
│         Redirect to Password Reset Page                      │
│         (You can implement this later)                       │
│         • Verify token                                       │
│         • Show new password form                             │
│         • Submit new password to Supabase                    │
│         • Redirect to sign in                                │
└─────────────────────────────────────────────────────────────┘
```

## 🛡️ Protected Route Flow

```
┌─────────────────────────────────────────────────────────────┐
│         User Navigates to Protected Route                    │
│         (e.g., /dashboard)                                   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│         ProtectedRoute Component Renders                     │
│         Check: Is user authenticated?                        │
└───────────────────────────┬─────────────────────────────────┘
                            │
                ┌───────────┴────────────┐
                │                        │
        User Logged In          Not Logged In
                │                        │
                ▼                        ▼
┌──────────────────────────┐  ┌────────────────────────┐
│  Render Protected        │  │  Redirect to /signin    │
│  Content                 │  │  • Save intended route  │
│  • Show dashboard        │  │    in location state    │
│  • Full access           │  │  • Show login form      │
│                          │  │  • After login, redirect│
│                          │  │    back to intended page│
└──────────────────────────┘  └────────────────────────┘
```

## 🎯 Component Communication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        App.tsx                               │
│                           │                                  │
│              ┌────────────┴──────────────┐                   │
│              │                           │                   │
│         AuthProvider                ThemeProvider            │
│              │                           │                   │
│   ┌──────────┴──────────┐                │                   │
│   │                     │                │                   │
│   │   Provides:         │                │                   │
│   │   • user            │                │                   │
│   │   • session         │                │                   │
│   │   • loading         │                │                   │
│   │   • signIn()        │                │                   │
│   │   • signUp()        │                │                   │
│   │   • signOut()       │                │                   │
│   │   • resetPassword() │                │                   │
│   │                     │                │                   │
│   └──────────┬──────────┘                │                   │
│              │                           │                   │
└──────────────┼───────────────────────────┼───────────────────┘
               │                           │
               │                           │
     ┌─────────┴─────────┬─────────────────┴────────┐
     │                   │                          │
     ▼                   ▼                          ▼
┌─────────┐       ┌────────────┐          ┌──────────────┐
│ Header  │       │ SignIn     │          │ SignUp       │
│         │       │            │          │              │
│ Uses:   │       │ Uses:      │          │ Uses:        │
│ • user  │       │ • signIn() │          │ • signUp()   │
│ • signOut()     │ • resetPassword()     │              │
└─────────┘       └────────────┘          └──────────────┘
```

## 📊 Data Flow Example

### Sign Up Data Flow

```
User Input → Form Validation → AuthContext → Supabase → Database
   ↓              ↓                 ↓           ↓           ↓
fullName      Zod Schema      signUp()     API Call    User Table
email         validate()    supabase.auth  /signup   (stores user)
password      success/fail   .signUp()    (secure)       ↓
                                            ↓         Email Sent
                                        Session       Verification
                                        Created           ↓
                                            ↓          Complete!
                                        Toast
                                        Shown
```

### Sign In Data Flow

```
User Input → Form Validation → AuthContext → Supabase → Session
   ↓              ↓                 ↓           ↓           ↓
email         Zod Schema       signIn()     API Call    Validate
password      validate()    supabase.auth   /token     Credentials
              success/fail  .signInWith...  (secure)       ↓
                                ↓                      Create Token
                            Update                          ↓
                            Context                    Store in
                                ↓                      Browser
                            Update UI                       ↓
                                ↓                      Return to
                            Redirect                    Frontend
                                ↓                           ↓
                            Success!                   User State
                                                       Updated
```

---

## 🔍 Key Takeaways

1. **AuthContext** is the central hub for all authentication logic
2. **Supabase** handles the heavy lifting (security, sessions, tokens)
3. **React Hook Form + Zod** provide robust form validation
4. **Session persistence** happens automatically via Supabase
5. **Protected routes** check auth state before rendering
6. **Toast notifications** provide user feedback at every step
7. **Type safety** ensures reliable data flow

---

## 🎓 Understanding the Flow

The authentication system follows these principles:

1. **Single Source of Truth**: AuthContext manages all auth state
2. **Automatic Session Management**: Supabase handles token refresh
3. **Optimistic UI**: Show loading states for better UX
4. **Error Handling**: Every action has success/error feedback
5. **Security First**: Passwords never stored in frontend, tokens are secure
6. **Seamless UX**: Users stay logged in across sessions

---

This visual guide should help you understand how all the pieces fit together!
