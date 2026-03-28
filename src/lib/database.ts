type SubscriptionTier = "basic" | "pro" | "premium";
type SubscriptionStatus = "active" | "cancelled" | "expired";

type SuggestionType = "grammar" | "style" | "tone" | "clarity" | "spelling";
type SuggestionSeverity = "error" | "warning" | "info";

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  subscription_tier: SubscriptionTier;
  subscription_status: SubscriptionStatus;
  words_analyzed: number;
  documents_created: number;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  title: string;
  content: string;
  word_count: number;
  character_count: number;
  grammar_score: number;
  clarity_score: number;
  tone: string;
  is_favorite: boolean;
  folder: string;
  tags: string[];
  last_analyzed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WritingSession {
  id: string;
  user_id: string;
  document_id: string | null;
  words_written: number;
  characters_typed: number;
  duration_seconds: number;
  suggestions_applied: number;
  session_start: string;
  session_end: string | null;
  created_at: string;
}

export interface Suggestion {
  id: string;
  document_id: string;
  user_id: string;
  suggestion_type: SuggestionType;
  severity: SuggestionSeverity;
  original_text: string;
  suggested_text: string;
  explanation: string | null;
  position_start: number;
  position_end: number;
  is_applied: boolean;
  is_dismissed: boolean;
  applied_at: string | null;
  created_at: string;
}

export interface AnalyticsEvent {
  id: string;
  user_id: string;
  event_type: string;
  event_data: Record<string, unknown>;
  created_at: string;
}

export interface DashboardStats {
  user_id: string;
  full_name: string | null;
  subscription_tier: string;
  words_analyzed: number;
  documents_created: number;
  total_documents: number;
  total_sessions: number;
  total_words_written: number;
  avg_grammar_score: number;
  avg_clarity_score: number;
}

interface LocalStore {
  documents: Document[];
  sessions: WritingSession[];
  suggestions: Suggestion[];
  analytics: AnalyticsEvent[];
  profiles: UserProfile[];
}

const STORE_KEY = "zeus_local_store_v1";

const defaultStore = (): LocalStore => ({
  documents: [],
  sessions: [],
  suggestions: [],
  analytics: [],
  profiles: [],
});

const getWordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

const generateId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const withStore = async <T>(fn: (store: LocalStore) => T | Promise<T>): Promise<T> => {
  if (typeof window === "undefined") {
    return fn(defaultStore());
  }

  let store = defaultStore();
  const raw = window.localStorage.getItem(STORE_KEY);

  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Partial<LocalStore>;
      store = {
        documents: parsed.documents || [],
        sessions: parsed.sessions || [],
        suggestions: parsed.suggestions || [],
        analytics: parsed.analytics || [],
        profiles: parsed.profiles || [],
      };
    } catch {
      store = defaultStore();
    }
  }

  const result = await fn(store);
  window.localStorage.setItem(STORE_KEY, JSON.stringify(store));
  return result;
};

const ensureProfile = (store: LocalStore, userId: string): UserProfile => {
  const existing = store.profiles.find((profile) => profile.id === userId);
  if (existing) {
    return existing;
  }

  const now = new Date().toISOString();
  const created: UserProfile = {
    id: userId,
    full_name: null,
    avatar_url: null,
    subscription_tier: "basic",
    subscription_status: "active",
    words_analyzed: 0,
    documents_created: 0,
    created_at: now,
    updated_at: now,
  };

  store.profiles.push(created);
  return created;
};

export async function getUserProfile(userId: string) {
  return withStore((store) => ensureProfile(store, userId));
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  return withStore((store) => {
    const profile = ensureProfile(store, userId);
    Object.assign(profile, updates, { updated_at: new Date().toISOString() });
    return profile;
  });
}

export async function getDashboardStats(userId: string) {
  return withStore((store) => {
    const profile = ensureProfile(store, userId);
    const documents = store.documents.filter((doc) => doc.user_id === userId);
    const sessions = store.sessions.filter((session) => session.user_id === userId);

    const totalWordsWritten = sessions.reduce((sum, session) => sum + session.words_written, 0);
    const avgGrammar = documents.length
      ? documents.reduce((sum, doc) => sum + doc.grammar_score, 0) / documents.length
      : 0;
    const avgClarity = documents.length
      ? documents.reduce((sum, doc) => sum + doc.clarity_score, 0) / documents.length
      : 0;

    return {
      user_id: userId,
      full_name: profile.full_name,
      subscription_tier: profile.subscription_tier,
      words_analyzed: profile.words_analyzed,
      documents_created: profile.documents_created,
      total_documents: documents.length,
      total_sessions: sessions.length,
      total_words_written: totalWordsWritten,
      avg_grammar_score: Number(avgGrammar.toFixed(2)),
      avg_clarity_score: Number(avgClarity.toFixed(2)),
    } as DashboardStats;
  });
}

export async function createDocument(userId: string, title: string, content = "") {
  return withStore((store) => {
    const now = new Date().toISOString();
    const doc: Document = {
      id: generateId(),
      user_id: userId,
      title,
      content,
      word_count: getWordCount(content),
      character_count: content.length,
      grammar_score: 0,
      clarity_score: 0,
      tone: "neutral",
      is_favorite: false,
      folder: "General",
      tags: [],
      last_analyzed_at: null,
      created_at: now,
      updated_at: now,
    };

    store.documents.push(doc);

    const profile = ensureProfile(store, userId);
    profile.documents_created += 1;
    profile.updated_at = now;

    return doc;
  });
}

export async function getDocument(documentId: string) {
  return withStore((store) => {
    const doc = store.documents.find((item) => item.id === documentId);
    if (!doc) {
      throw new Error("Document not found");
    }
    return doc;
  });
}

export async function getUserDocuments(
  userId: string,
  options?: {
    folder?: string;
    favorites?: boolean;
    limit?: number;
    offset?: number;
  },
) {
  return withStore((store) => {
    let docs = store.documents
      .filter((doc) => doc.user_id === userId)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    if (options?.folder) {
      docs = docs.filter((doc) => doc.folder === options.folder);
    }

    if (options?.favorites) {
      docs = docs.filter((doc) => doc.is_favorite);
    }

    if (typeof options?.offset === "number") {
      docs = docs.slice(options.offset);
    }

    if (typeof options?.limit === "number") {
      docs = docs.slice(0, options.limit);
    }

    return docs;
  });
}

export async function updateDocument(documentId: string, updates: Partial<Document>) {
  return withStore((store) => {
    const doc = store.documents.find((item) => item.id === documentId);
    if (!doc) {
      throw new Error("Document not found");
    }

    const nextContent = updates.content ?? doc.content;

    Object.assign(doc, updates, {
      word_count: getWordCount(nextContent),
      character_count: nextContent.length,
      updated_at: new Date().toISOString(),
    });

    return doc;
  });
}

export async function deleteDocument(documentId: string) {
  return withStore((store) => {
    store.documents = store.documents.filter((doc) => doc.id !== documentId);
    store.suggestions = store.suggestions.filter((item) => item.document_id !== documentId);
  });
}

export async function toggleDocumentFavorite(documentId: string) {
  const doc = await getDocument(documentId);
  return updateDocument(documentId, { is_favorite: !doc.is_favorite });
}

export async function searchDocuments(userId: string, searchQuery: string) {
  return withStore((store) => {
    const query = searchQuery.toLowerCase();
    return store.documents
      .filter((doc) => doc.user_id === userId)
      .filter((doc) => doc.title.toLowerCase().includes(query) || doc.content.toLowerCase().includes(query));
  });
}

export async function startWritingSession(userId: string, documentId?: string) {
  return withStore((store) => {
    const now = new Date().toISOString();
    const session: WritingSession = {
      id: generateId(),
      user_id: userId,
      document_id: documentId || null,
      words_written: 0,
      characters_typed: 0,
      duration_seconds: 0,
      suggestions_applied: 0,
      session_start: now,
      session_end: null,
      created_at: now,
    };

    store.sessions.push(session);
    return session;
  });
}

export async function endWritingSession(
  sessionId: string,
  stats: {
    words_written?: number;
    characters_typed?: number;
    duration_seconds?: number;
    suggestions_applied?: number;
  },
) {
  return withStore((store) => {
    const session = store.sessions.find((item) => item.id === sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    Object.assign(session, stats, {
      session_end: new Date().toISOString(),
    });

    return session;
  });
}

export async function getUserSessions(userId: string, limit = 10) {
  return withStore((store) =>
    store.sessions
      .filter((session) => session.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit),
  );
}

export async function createSuggestion(suggestion: Omit<Suggestion, "id" | "created_at">) {
  return withStore((store) => {
    const created: Suggestion = {
      ...suggestion,
      id: generateId(),
      created_at: new Date().toISOString(),
    };
    store.suggestions.push(created);
    return created;
  });
}

export async function getDocumentSuggestions(documentId: string, includeApplied = false) {
  return withStore((store) => {
    let suggestions = store.suggestions
      .filter((suggestion) => suggestion.document_id === documentId)
      .filter((suggestion) => !suggestion.is_dismissed)
      .sort((a, b) => a.position_start - b.position_start);

    if (!includeApplied) {
      suggestions = suggestions.filter((suggestion) => !suggestion.is_applied);
    }

    return suggestions;
  });
}

export async function applySuggestion(suggestionId: string) {
  return withStore((store) => {
    const suggestion = store.suggestions.find((item) => item.id === suggestionId);
    if (!suggestion) {
      throw new Error("Suggestion not found");
    }
    suggestion.is_applied = true;
    suggestion.applied_at = new Date().toISOString();
    return suggestion;
  });
}

export async function dismissSuggestion(suggestionId: string) {
  return withStore((store) => {
    const suggestion = store.suggestions.find((item) => item.id === suggestionId);
    if (!suggestion) {
      throw new Error("Suggestion not found");
    }
    suggestion.is_dismissed = true;
    return suggestion;
  });
}

export async function clearDocumentSuggestions(documentId: string) {
  return withStore((store) => {
    store.suggestions = store.suggestions.filter((item) => item.document_id !== documentId);
  });
}

export async function trackEvent(
  userId: string,
  eventType: string,
  eventData: Record<string, unknown> = {},
) {
  return withStore((store) => {
    const event: AnalyticsEvent = {
      id: generateId(),
      user_id: userId,
      event_type: eventType,
      event_data: eventData,
      created_at: new Date().toISOString(),
    };

    store.analytics.push(event);
    return event;
  });
}

export async function getUserAnalytics(userId: string, eventType?: string, limit = 100) {
  return withStore((store) => {
    let events = store.analytics.filter((event) => event.user_id === userId);

    if (eventType) {
      events = events.filter((event) => event.event_type === eventType);
    }

    return events
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  });
}

export async function getDocumentFolders(userId: string): Promise<string[]> {
  return withStore((store) => {
    const folders = store.documents
      .filter((doc) => doc.user_id === userId)
      .map((doc) => doc.folder)
      .filter(Boolean);
    return [...new Set(folders)];
  });
}

export async function getDocumentTags(userId: string): Promise<string[]> {
  return withStore((store) => {
    const allTags = store.documents
      .filter((doc) => doc.user_id === userId)
      .flatMap((doc) => doc.tags || []);
    return [...new Set(allTags)];
  });
}

export async function bulkDeleteDocuments(documentIds: string[]) {
  return withStore((store) => {
    const idSet = new Set(documentIds);
    store.documents = store.documents.filter((doc) => !idSet.has(doc.id));
    store.suggestions = store.suggestions.filter((item) => !idSet.has(item.document_id));
  });
}
