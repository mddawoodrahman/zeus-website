# Zeus Database Guide

## Overview

The Zeus application uses Supabase as its backend database with a comprehensive schema designed for a writing assistant application. This guide provides everything you need to know about the database structure and how to use it.

## Database Schema

### Tables

#### 1. `user_profiles`

Extends the default `auth.users` table with additional user information.

**Columns:**

- `id` (UUID, Primary Key) - References auth.users.id
- `full_name` (TEXT) - User's display name
- `avatar_url` (TEXT) - Profile picture URL
- `subscription_tier` (TEXT) - 'basic', 'pro', or 'premium'
- `subscription_status` (TEXT) - 'active', 'cancelled', or 'expired'
- `words_analyzed` (INTEGER) - Total words processed
- `documents_created` (INTEGER) - Total documents created
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Features:**

- Automatically created when a user signs up (via trigger)
- Automatically updated via `updated_at` trigger
- Protected by Row Level Security (RLS)

---

#### 2. `documents`

Stores user's writing documents and their metadata.

**Columns:**

- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → auth.users)
- `title` (TEXT) - Document title
- `content` (TEXT) - Document content
- `word_count` (INTEGER) - Auto-calculated word count
- `character_count` (INTEGER) - Auto-calculated character count
- `grammar_score` (INTEGER) - Score from 0-100
- `clarity_score` (INTEGER) - Score from 0-100
- `tone` (TEXT) - Detected writing tone
- `is_favorite` (BOOLEAN) - Favorite flag
- `folder` (TEXT) - Organization folder
- `tags` (TEXT[]) - Array of tags
- `last_analyzed_at` (TIMESTAMP) - Last AI analysis
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Features:**

- Word and character counts automatically updated on content change
- Supports full-text search
- Tagged and organized by folders
- Protected by RLS

---

#### 3. `writing_sessions`

Tracks user writing activity and usage metrics.

**Columns:**

- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → auth.users)
- `document_id` (UUID, Foreign Key → documents, nullable)
- `words_written` (INTEGER)
- `characters_typed` (INTEGER)
- `duration_seconds` (INTEGER)
- `suggestions_applied` (INTEGER)
- `session_start` (TIMESTAMP)
- `session_end` (TIMESTAMP, nullable)
- `created_at` (TIMESTAMP)

**Features:**

- Tracks writing productivity
- Automatically updates user profile stats
- Links to specific documents when available

---

#### 4. `suggestions`

Stores AI-generated writing improvement suggestions.

**Columns:**

- `id` (UUID, Primary Key)
- `document_id` (UUID, Foreign Key → documents)
- `user_id` (UUID, Foreign Key → auth.users)
- `suggestion_type` (TEXT) - 'grammar', 'style', 'tone', 'clarity', 'spelling'
- `severity` (TEXT) - 'error', 'warning', 'info'
- `original_text` (TEXT) - Text to be replaced
- `suggested_text` (TEXT) - Replacement text
- `explanation` (TEXT) - Why this suggestion is made
- `position_start` (INTEGER) - Start position in document
- `position_end` (INTEGER) - End position in document
- `is_applied` (BOOLEAN) - Whether user applied suggestion
- `is_dismissed` (BOOLEAN) - Whether user dismissed suggestion
- `applied_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)

**Features:**

- Supports multiple suggestion types
- Tracks user interaction (applied/dismissed)
- Position-based for precise editing

---

#### 5. `analytics`

General-purpose analytics and event tracking.

**Columns:**

- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → auth.users)
- `event_type` (TEXT) - Event category/name
- `event_data` (JSONB) - Flexible event metadata
- `created_at` (TIMESTAMP)

**Features:**

- Flexible JSON storage for any event data
- Indexed for fast queries
- Useful for tracking user behavior and app usage

---

### Views

#### `user_dashboard_stats`

Aggregated statistics for user dashboards.

**Columns:**

- `user_id` (UUID)
- `full_name` (TEXT)
- `subscription_tier` (TEXT)
- `words_analyzed` (INTEGER)
- `documents_created` (INTEGER)
- `total_documents` (INTEGER)
- `total_sessions` (INTEGER)
- `total_words_written` (INTEGER)
- `avg_grammar_score` (FLOAT)
- `avg_clarity_score` (FLOAT)

---

## Security

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:

**User Profiles:**

- Users can view their own profile
- Users can update their own profile
- Users can insert their own profile

**Documents:**

- Users can view their own documents
- Users can create their own documents
- Users can update their own documents
- Users can delete their own documents

**Writing Sessions:**

- Users can view their own sessions
- Users can create their own sessions
- Users can update their own sessions

**Suggestions:**

- Users can view their own suggestions
- Users can create their own suggestions
- Users can update their own suggestions
- Users can delete their own suggestions

**Analytics:**

- Users can view their own analytics
- Users can create their own analytics

---

## Automated Features

### Triggers

1. **Auto-update timestamps** (`updated_at`)
   - Automatically updates `updated_at` on user_profiles and documents

2. **Auto-create user profile**
   - Creates a user profile when a new user signs up
   - Pulls full_name and avatar_url from signup metadata

3. **Auto-calculate document stats**
   - Automatically calculates word_count and character_count when content changes

4. **Auto-update user stats**
   - Increments `documents_created` when a new document is created
   - Increments `words_analyzed` when a writing session is created

---

## Using the Database

### Import the Helper Functions

```typescript
import {
  // User Profile
  getUserProfile,
  updateUserProfile,
  getDashboardStats,

  // Documents
  createDocument,
  getDocument,
  getUserDocuments,
  updateDocument,
  deleteDocument,
  toggleDocumentFavorite,
  searchDocuments,

  // Writing Sessions
  startWritingSession,
  endWritingSession,
  getUserSessions,

  // Suggestions
  createSuggestion,
  getDocumentSuggestions,
  applySuggestion,
  dismissSuggestion,
  clearDocumentSuggestions,

  // Analytics
  trackEvent,
  getUserAnalytics,

  // Utilities
  getDocumentFolders,
  getDocumentTags,
  bulkDeleteDocuments,
} from "@/lib/database";
```

### Example Usage

#### Creating a Document

```typescript
const newDoc = await createDocument(userId, "My Novel", "Once upon a time...");
console.log(newDoc.id); // UUID of the new document
```

#### Getting User Documents

```typescript
// Get all documents
const allDocs = await getUserDocuments(userId);

// Get documents in a specific folder
const workDocs = await getUserDocuments(userId, { folder: "work" });

// Get favorite documents
const favorites = await getUserDocuments(userId, { favorites: true });

// Get paginated documents
const page1 = await getUserDocuments(userId, { limit: 10, offset: 0 });
```

#### Updating a Document

```typescript
await updateDocument(docId, {
  title: "New Title",
  content: "Updated content",
  tags: ["fiction", "novel"],
});
```

#### Starting a Writing Session

```typescript
// Start a session
const session = await startWritingSession(userId, documentId);

// Later, end the session with stats
await endWritingSession(session.id, {
  words_written: 500,
  characters_typed: 2500,
  duration_seconds: 1800, // 30 minutes
  suggestions_applied: 5,
});
```

#### Creating Suggestions

```typescript
await createSuggestion({
  document_id: docId,
  user_id: userId,
  suggestion_type: "grammar",
  severity: "error",
  original_text: "they is",
  suggested_text: "they are",
  explanation: "Subject-verb agreement error",
  position_start: 42,
  position_end: 49,
  is_applied: false,
  is_dismissed: false,
  applied_at: null,
});
```

#### Getting Document Suggestions

```typescript
// Get all active suggestions
const suggestions = await getDocumentSuggestions(docId);

// Get all suggestions including applied ones
const allSuggestions = await getDocumentSuggestions(docId, true);
```

#### Tracking Analytics

```typescript
await trackEvent(userId, "document_opened", {
  document_id: docId,
  source: "dashboard",
  timestamp: Date.now(),
});

await trackEvent(userId, "feature_used", {
  feature: "grammar_check",
  duration_ms: 1500,
});
```

#### Getting Dashboard Stats

```typescript
const stats = await getDashboardStats(userId);
console.log(`Total documents: ${stats.total_documents}`);
console.log(`Average grammar score: ${stats.avg_grammar_score}`);
```

---

## Best Practices

1. **Always handle errors**: All database functions can throw errors, so wrap them in try-catch blocks
2. **Use transactions when needed**: For operations that should succeed or fail together
3. **Track analytics**: Use `trackEvent()` to understand how users interact with your app
4. **Clean up suggestions**: Clear old suggestions when a document is re-analyzed
5. **Monitor sessions**: Track writing sessions to understand user engagement
6. **Use the dashboard view**: The `user_dashboard_stats` view is optimized for dashboard queries

---

## Performance Tips

1. **Indexes are in place** for common queries:
   - User ID lookups
   - Document searches
   - Session queries
   - Suggestion filtering

2. **Pagination**: Use `limit` and `offset` for large result sets

3. **Search optimization**: Use the provided `searchDocuments()` function for full-text search

4. **Batch operations**: Use `bulkDeleteDocuments()` instead of deleting one by one

---

## Testing the Database

You can test your database connection with this simple function:

```typescript
import { supabase } from "@/lib/supabase";

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("count")
      .single();

    if (error) throw error;
    console.log("✅ Database connected successfully!");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}
```

---

## Schema Diagram

```
┌─────────────────┐
│   auth.users    │
│   (Supabase)    │
└────────┬────────┘
         │
         ├───────────────────┐
         │                   │
┌────────▼────────┐  ┌──────▼──────────┐
│  user_profiles  │  │   documents     │
│                 │  │                 │
│ - full_name     │  │ - title         │
│ - avatar_url    │  │ - content       │
│ - subscription  │  │ - word_count    │
│ - stats         │  │ - scores        │
└─────────────────┘  └─────┬───────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
┌────────▼────────┐ ┌──────▼──────────┐ ┌───▼────────────┐
│ writing_sessions│ │  suggestions    │ │   analytics    │
│                 │ │                 │ │                │
│ - words_written │ │ - type          │ │ - event_type   │
│ - duration      │ │ - original_text │ │ - event_data   │
│ - timestamps    │ │ - suggested     │ │ - timestamp    │
└─────────────────┘ └─────────────────┘ └────────────────┘
```

---

## Need Help?

For more information:

- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the authentication setup in `AUTHENTICATION_SETUP.md`
- Examine the database helper functions in `src/lib/database.ts`
- View the SQL migration in `supabase/migrations/20250105_zeus_initial_schema.sql`
