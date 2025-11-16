import { supabase } from "./supabase";

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  subscription_tier: "basic" | "pro" | "premium";
  subscription_status: "active" | "cancelled" | "expired";
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
  suggestion_type: "grammar" | "style" | "tone" | "clarity" | "spelling";
  severity: "error" | "warning" | "info";
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

// =====================================================
// USER PROFILE FUNCTIONS
// =====================================================

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data as UserProfile;
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>,
) {
  const { data, error } = await supabase
    .from("user_profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data as UserProfile;
}

export async function getDashboardStats(userId: string) {
  const { data, error } = await supabase
    .from("user_dashboard_stats")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  return data as DashboardStats;
}

// =====================================================
// DOCUMENT FUNCTIONS
// =====================================================

export async function createDocument(
  userId: string,
  title: string,
  content = "",
) {
  const { data, error } = await supabase
    .from("documents")
    .insert({
      user_id: userId,
      title,
      content,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Document;
}

export async function getDocument(documentId: string) {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .single();

  if (error) throw error;
  return data as Document;
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
  let query = supabase
    .from("documents")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (options?.folder) {
    query = query.eq("folder", options.folder);
  }

  if (options?.favorites) {
    query = query.eq("is_favorite", true);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(
      options.offset,
      options.offset + (options.limit || 10) - 1,
    );
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Document[];
}

export async function updateDocument(
  documentId: string,
  updates: Partial<Document>,
) {
  const { data, error } = await supabase
    .from("documents")
    .update(updates)
    .eq("id", documentId)
    .select()
    .single();

  if (error) throw error;
  return data as Document;
}

export async function deleteDocument(documentId: string) {
  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", documentId);

  if (error) throw error;
}

export async function toggleDocumentFavorite(documentId: string) {
  const doc = await getDocument(documentId);
  return updateDocument(documentId, { is_favorite: !doc.is_favorite });
}

export async function searchDocuments(userId: string, searchQuery: string) {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", userId)
    .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data as Document[];
}

// =====================================================
// WRITING SESSION FUNCTIONS
// =====================================================

export async function startWritingSession(userId: string, documentId?: string) {
  const { data, error } = await supabase
    .from("writing_sessions")
    .insert({
      user_id: userId,
      document_id: documentId || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as WritingSession;
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
  const { data, error } = await supabase
    .from("writing_sessions")
    .update({
      ...stats,
      session_end: new Date().toISOString(),
    })
    .eq("id", sessionId)
    .select()
    .single();

  if (error) throw error;
  return data as WritingSession;
}

export async function getUserSessions(userId: string, limit = 10) {
  const { data, error } = await supabase
    .from("writing_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as WritingSession[];
}

// =====================================================
// SUGGESTION FUNCTIONS
// =====================================================

export async function createSuggestion(
  suggestion: Omit<Suggestion, "id" | "created_at">,
) {
  const { data, error } = await supabase
    .from("suggestions")
    .insert(suggestion)
    .select()
    .single();

  if (error) throw error;
  return data as Suggestion;
}

export async function getDocumentSuggestions(
  documentId: string,
  includeApplied = false,
) {
  let query = supabase
    .from("suggestions")
    .select("*")
    .eq("document_id", documentId)
    .eq("is_dismissed", false)
    .order("position_start", { ascending: true });

  if (!includeApplied) {
    query = query.eq("is_applied", false);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Suggestion[];
}

export async function applySuggestion(suggestionId: string) {
  const { data, error } = await supabase
    .from("suggestions")
    .update({
      is_applied: true,
      applied_at: new Date().toISOString(),
    })
    .eq("id", suggestionId)
    .select()
    .single();

  if (error) throw error;
  return data as Suggestion;
}

export async function dismissSuggestion(suggestionId: string) {
  const { data, error } = await supabase
    .from("suggestions")
    .update({ is_dismissed: true })
    .eq("id", suggestionId)
    .select()
    .single();

  if (error) throw error;
  return data as Suggestion;
}

export async function clearDocumentSuggestions(documentId: string) {
  const { error } = await supabase
    .from("suggestions")
    .delete()
    .eq("document_id", documentId);

  if (error) throw error;
}

// =====================================================
// ANALYTICS FUNCTIONS
// =====================================================

export async function trackEvent(
  userId: string,
  eventType: string,
  eventData: Record<string, unknown> = {},
) {
  const { data, error } = await supabase
    .from("analytics")
    .insert({
      user_id: userId,
      event_type: eventType,
      event_data: eventData,
    })
    .select()
    .single();

  if (error) throw error;
  return data as AnalyticsEvent;
}

export async function getUserAnalytics(
  userId: string,
  eventType?: string,
  limit = 100,
) {
  let query = supabase
    .from("analytics")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (eventType) {
    query = query.eq("event_type", eventType);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as AnalyticsEvent[];
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

export async function getDocumentFolders(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("documents")
    .select("folder")
    .eq("user_id", userId);

  if (error) throw error;

  // Get unique folders
  const folders = [...new Set(data.map((d) => d.folder))];
  return folders;
}

export async function getDocumentTags(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("documents")
    .select("tags")
    .eq("user_id", userId);

  if (error) throw error;

  // Flatten and get unique tags
  const allTags = data.flatMap((d) => d.tags || []);
  const uniqueTags = [...new Set(allTags)];
  return uniqueTags;
}

export async function bulkDeleteDocuments(documentIds: string[]) {
  const { error } = await supabase
    .from("documents")
    .delete()
    .in("id", documentIds);

  if (error) throw error;
}
