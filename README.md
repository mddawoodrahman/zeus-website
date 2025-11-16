# ⚡ Zeus - AI-Powered Writing Assistant

<div align="center">
  
  <p align="center">
    <strong>Write with the Power of Lightning</strong>
  </p>
  
  <p align="center">
    Zeus enhances your writing with real-time grammar corrections, style improvements, and AI-powered suggestions.
  </p>

  <p align="center">
    <a href="#features">Features</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#installation">Installation</a> •
    <a href="#usage">Usage</a> •
    <a href="#documentation">Documentation</a>
  </p>
</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**Zeus** is a modern, AI-powered writing assistant web application that helps users write better content with real-time feedback. Built with React, TypeScript, and Supabase, Zeus provides:

- **Real-time grammar and spelling corrections**
- **Style and clarity improvements**
- **Tone detection and suggestions**
- **Document management with auto-save**
- **Writing session tracking and analytics**
- **Secure user authentication**
- **Beautiful, responsive UI with light/dark mode**

Perfect for writers, content creators, students, and professionals who want to improve their writing quality instantly.

---

## ✨ Features

### 🖊️ Writing Enhancement

- **Grammar Perfection** - AI-powered detection that understands context and nuance
- **Real-Time Corrections** - Instant suggestions as you type with lightning-fast processing
- **Style Enhancement** - Intelligent suggestions for clarity, conciseness, and impact
- **Tone Detector** - Ensure your message hits the right tone (professional, friendly, formal, or casual)
- **Spelling Checker** - Advanced spell checking with context-aware suggestions

### 📝 Document Management

- **Auto-Save** - Documents automatically save every 30 seconds
- **Unlimited Storage** - Save all your documents in the cloud (subscription-based)
- **Organization** - Organize documents with folders and tags
- **Favorites** - Mark important documents for quick access
- **Search** - Full-text search across all your documents
- **Export** - Download documents in various formats (.txt, .docx, .pdf)

### 📊 Analytics & Insights

- **Writing Sessions** - Track your writing productivity and progress
- **Word Count Tracking** - Monitor words written and characters typed
- **Quality Scores** - Grammar and clarity scores for each document
- **Dashboard Stats** - View your writing statistics and achievements

### 🔐 Security & Privacy

- **User Authentication** - Secure sign-up, login, and password reset
- **Row Level Security** - Your documents are protected at the database level
- **Session Management** - Automatic token refresh and secure session handling
- **Privacy First** - Your documents stay private with end-to-end encryption

### 🎨 User Experience

- **Modern UI** - Beautiful interface built with Shadcn/ui components
- **Dark Mode** - Full light/dark theme support
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Toast Notifications** - Clear feedback for all actions
- **Loading States** - Smooth loading indicators throughout the app

---

## 🛠️ Tech Stack

### Frontend

- **[React 18](https://react.dev/)** - Modern UI library with hooks
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Vite](https://vitejs.dev/)** - Lightning-fast build tool and dev server
- **[React Router](https://reactrouter.com/)** - Client-side routing
- **[TanStack Query](https://tanstack.com/query)** - Powerful data fetching and caching

### UI Components & Styling

- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Shadcn/ui](https://ui.shadcn.com/)** - High-quality React components
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide Icons](https://lucide.dev/)** - Beautiful icon library
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme management

### Backend & Database

- **[Supabase](https://supabase.com/)** - PostgreSQL database, authentication, and real-time subscriptions
- **PostgreSQL** - Powerful relational database with advanced features
- **Row Level Security** - Database-level security policies

### Form & Validation

- **[React Hook Form](https://react-hook-form.com/)** - Performant form handling
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** - Form validation integration

### Development Tools

- **[ESLint](https://eslint.org/)** - Code linting and quality
- **[PostCSS](https://postcss.org/)** - CSS transformation
- **[Autoprefixer](https://github.com/postcss/autoprefixer)** - CSS vendor prefixing

---

## 🚀 Quick Start

Get Zeus running locally in 5 minutes:

```bash
# 1. Clone the repository
git clone <YOUR_GIT_URL>
cd zeus-writing-assistant

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and add your Supabase credentials

# 4. Start the development server
npm run dev

# 5. Open your browser
# Visit http://localhost:8080
```

---

## 📦 Installation

### Prerequisites

- **Node.js** 18+ and npm/yarn/pnpm
- **Supabase Account** (free tier available at [supabase.com](https://supabase.com))
- **Git** for version control

### Step-by-Step Installation

#### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd zeus-writing-assistant
```

#### 2. Install Dependencies

Using npm:

```bash
npm install
```

Using yarn:

```bash
yarn install
```

Using pnpm:

```bash
pnpm install
```

#### 3. Set Up Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Fill in project details

2. **Get Your Credentials**
   - Go to Project Settings > API
   - Copy your Project URL and anon/public key

3. **Run Database Migration**
   - Go to SQL Editor in Supabase dashboard
   - Copy contents of `supabase/migrations/20250105_zeus_initial_schema.sql`
   - Run the migration

#### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the placeholder values with your actual Supabase credentials.

#### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

---

## ⚙️ Configuration

### Environment Variables

| Variable                 | Description                        | Required |
| ------------------------ | ---------------------------------- | -------- |
| `VITE_SUPABASE_URL`      | Your Supabase project URL          | Yes      |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key | Yes      |

### Supabase Configuration

The database schema includes:

- **user_profiles** - Extended user information
- **documents** - User documents with content and metadata
- **writing_sessions** - Writing activity tracking
- **suggestions** - AI-generated writing suggestions
- **analytics** - Usage analytics and events

See [`DATABASE_GUIDE.md`](./DATABASE_GUIDE.md) for detailed schema documentation.

### Authentication Configuration

Authentication is configured in `src/lib/supabase.ts` with:

- Email/password authentication
- Automatic session refresh
- Session persistence across page reloads
- Secure token storage

See [`AUTHENTICATION_SETUP.md`](./AUTHENTICATION_SETUP.md) for authentication details.

---

## 📖 Usage

### For Users

#### Creating an Account

1. Click "Try Zeus" or "Sign Up" in the header
2. Fill in your details (name, email, password)
3. Verify your email (if enabled)
4. Sign in and start writing!

#### Using the Editor

1. Navigate to `/editor` or click "Start Writing"
2. Enter your document title
3. Start typing your content
4. Click "Enhance Text" to get AI suggestions
5. Review and apply suggestions from the side panel
6. Documents auto-save every 30 seconds

#### Managing Documents

- Documents are automatically saved to your account
- Use folders and tags to organize documents
- Mark favorites for quick access
- Search across all your documents
- Export documents in various formats

### For Developers

#### Using the Authentication Context

```tsx
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, signIn, signOut, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <button onClick={() => signIn(email, password)}>Sign In</button>;
  }

  return (
    <div>
      <p>Welcome, {user.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

#### Using Database Functions

```tsx
import {
  createDocument,
  getUserDocuments,
  updateDocument,
} from "@/lib/database";

// Create a new document
const doc = await createDocument(userId, "My Title", "Content here");

// Get all user documents
const documents = await getUserDocuments(userId);

// Update a document
await updateDocument(docId, {
  title: "New Title",
  content: "Updated content",
});
```

#### Protected Routes

```tsx
import { ProtectedRoute } from "@/components/ProtectedRoute";

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>;
```

---

## 📁 Project Structure

```
zeus-writing-assistant/
├── public/                      # Static assets
│   └── robots.txt
├── src/
│   ├── assets/                  # Images, logos, icons
│   ├── components/              # React components
│   │   ├── ui/                  # Shadcn/ui components
│   │   ├── Features.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Pricing.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── ThemeToggle.tsx
│   ├── contexts/                # React contexts
│   │   └── AuthContext.tsx      # Authentication state
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/                     # Utility functions
│   │   ├── database.ts          # Database helper functions
│   │   ├── supabase.ts          # Supabase client
│   │   └── utils.ts             # General utilities
│   ├── pages/                   # Page components
│   │   ├── Editor.tsx           # Main editor page
│   │   ├── Index.tsx            # Landing page
│   │   ├── NotFound.tsx         # 404 page
│   │   ├── SignIn.tsx           # Login page
│   │   └── SignUp.tsx           # Registration page
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # App entry point
│   └── index.css                # Global styles
├── supabase/
│   └── migrations/              # Database migrations
│       └── 20250105_zeus_initial_schema.sql
├── .env.example                 # Environment template
├── components.json              # Shadcn/ui config
├── eslint.config.js             # ESLint configuration
├── package.json                 # Dependencies
├── postcss.config.js            # PostCSS config
├── tailwind.config.ts           # Tailwind CSS config
├── tsconfig.json                # TypeScript config
├── vite.config.ts               # Vite configuration
├── AUTH_IMPLEMENTATION_SUMMARY.md
├── AUTHENTICATION_SETUP.md
├── AUTH_QUICK_START.md
├── DATABASE_GUIDE.md
└── README.md                    # This file
```

---

## 📚 Documentation

Additional documentation is available:

- **[Authentication Setup](./AUTHENTICATION_SETUP.md)** - Complete authentication guide
- **[Auth Quick Start](./AUTH_QUICK_START.md)** - 5-minute setup guide
- **[Auth Implementation Summary](./AUTH_IMPLEMENTATION_SUMMARY.md)** - What's implemented
- **[Database Guide](./DATABASE_GUIDE.md)** - Database schema and usage
- **[Auth Flow Diagram](./AUTH_FLOW_DIAGRAM.md)** - Authentication flow visualization

---

## 🔧 Development

### Available Scripts

```bash
# Start development server (http://localhost:8080)
npm run dev

# Build for production
npm run build

# Build for development (with source maps)
npm run build:dev

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

### Development Server

The development server runs on `http://localhost:8080` and includes:

- Hot Module Replacement (HMR)
- Fast refresh for React components
- TypeScript type checking
- ESLint integration

### Code Quality

- **TypeScript** - Full type safety throughout the codebase
- **ESLint** - Code linting with React and TypeScript rules
- **Prettier** - Code formatting (if configured)
- **Component Tagging** - Development-only component tagging for debugging

### Adding New Features

1. **Create UI Components** in `src/components/`
2. **Add Pages** in `src/pages/`
3. **Define Routes** in `src/App.tsx`
4. **Add Database Functions** in `src/lib/database.ts`
5. **Update Database Schema** in `supabase/migrations/`

---

## 🏗️ Building for Production

### Build the Application

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Deployment Options

#### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

#### Deploy via Lovable

Simply open [Lovable](https://lovable.dev/projects/0aae388c-9aab-4870-bddf-985cf9597d63) and click on Share → Publish.

#### Deploy to Your Own Server

```bash
# Build the app
npm run build

# Upload the dist/ folder to your server
# Configure your server to serve index.html for all routes
```

### Environment Variables in Production

Make sure to set these environment variables in your hosting platform:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Write clean, readable TypeScript code
- Follow the existing code style
- Add comments for complex logic
- Update documentation as needed
- Test your changes thoroughly
- Ensure all ESLint rules pass

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **[Supabase](https://supabase.com/)** - Amazing backend platform
- **[Shadcn/ui](https://ui.shadcn.com/)** - Beautiful component library
- **[Radix UI](https://www.radix-ui.com/)** - Accessible primitives
- **[Lucide](https://lucide.dev/)** - Icon library
- **[Vite](https://vitejs.dev/)** - Lightning-fast build tool
- **[Lovable](https://lovable.dev/)** - Project development platform

---

## 📞 Support

- **Documentation**: Check the documentation files in the project root
- **Project URL**: https://lovable.dev/projects/0aae388c-9aab-4870-bddf-985cf9597d63

---

## 🚀 What's Next?

Future enhancements planned:

- [ ] Social authentication (Google, GitHub)
- [ ] Two-factor authentication
- [ ] AI-powered content generation
- [ ] Team collaboration features
- [ ] Browser extension
- [ ] Mobile applications
- [ ] Integration with Google Docs, Word
- [ ] Advanced plagiarism detection
- [ ] Citation generator
- [ ] Writing templates library

---

<div align="center">
  <p>Made with ⚡ by the Zeus Team</p>
</div>
