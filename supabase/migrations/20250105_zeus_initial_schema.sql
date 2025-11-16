-- Zeus Application Database Schema
-- This migration creates all necessary tables for the Zeus writing assistant

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USER PROFILES TABLE
-- Extends auth.users with additional profile information
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    subscription_tier TEXT DEFAULT 'basic' CHECK (subscription_tier IN ('basic', 'pro', 'premium')),
    subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'expired')),
    words_analyzed INTEGER DEFAULT 0,
    documents_created INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- DOCUMENTS TABLE
-- Stores user's writing documents
-- =====================================================
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Untitled Document',
    content TEXT DEFAULT '',
    word_count INTEGER DEFAULT 0,
    character_count INTEGER DEFAULT 0,
    grammar_score INTEGER DEFAULT 0 CHECK (grammar_score >= 0 AND grammar_score <= 100),
    clarity_score INTEGER DEFAULT 0 CHECK (clarity_score >= 0 AND clarity_score <= 100),
    tone TEXT DEFAULT 'neutral',
    is_favorite BOOLEAN DEFAULT false,
    folder TEXT DEFAULT 'default',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    last_analyzed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- WRITING SESSIONS TABLE
-- Tracks user's writing activity and usage
-- =====================================================
CREATE TABLE IF NOT EXISTS public.writing_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
    words_written INTEGER DEFAULT 0,
    characters_typed INTEGER DEFAULT 0,
    duration_seconds INTEGER DEFAULT 0,
    suggestions_applied INTEGER DEFAULT 0,
    session_start TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    session_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- SUGGESTIONS TABLE
-- Stores AI-generated writing suggestions
-- =====================================================
CREATE TABLE IF NOT EXISTS public.suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    suggestion_type TEXT NOT NULL CHECK (suggestion_type IN ('grammar', 'style', 'tone', 'clarity', 'spelling')),
    severity TEXT DEFAULT 'info' CHECK (severity IN ('error', 'warning', 'info')),
    original_text TEXT NOT NULL,
    suggested_text TEXT NOT NULL,
    explanation TEXT,
    position_start INTEGER NOT NULL,
    position_end INTEGER NOT NULL,
    is_applied BOOLEAN DEFAULT false,
    is_dismissed BOOLEAN DEFAULT false,
    applied_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- ANALYTICS TABLE
-- Tracks usage analytics for insights
-- =====================================================
CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription ON public.user_profiles(subscription_tier, subscription_status);

-- Documents indexes
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON public.documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_updated_at ON public.documents(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_is_favorite ON public.documents(user_id, is_favorite) WHERE is_favorite = true;
CREATE INDEX IF NOT EXISTS idx_documents_folder ON public.documents(user_id, folder);
CREATE INDEX IF NOT EXISTS idx_documents_tags ON public.documents USING gin(tags);

-- Writing sessions indexes
CREATE INDEX IF NOT EXISTS idx_writing_sessions_user_id ON public.writing_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_writing_sessions_document_id ON public.writing_sessions(document_id);
CREATE INDEX IF NOT EXISTS idx_writing_sessions_created_at ON public.writing_sessions(created_at DESC);

-- Suggestions indexes
CREATE INDEX IF NOT EXISTS idx_suggestions_document_id ON public.suggestions(document_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_user_id ON public.suggestions(user_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_type ON public.suggestions(suggestion_type);
CREATE INDEX IF NOT EXISTS idx_suggestions_not_dismissed ON public.suggestions(document_id) WHERE is_dismissed = false;

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON public.analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.writing_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Documents Policies
CREATE POLICY "Users can view own documents" ON public.documents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own documents" ON public.documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents" ON public.documents
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents" ON public.documents
    FOR DELETE USING (auth.uid() = user_id);

-- Writing Sessions Policies
CREATE POLICY "Users can view own sessions" ON public.writing_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions" ON public.writing_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON public.writing_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- Suggestions Policies
CREATE POLICY "Users can view own suggestions" ON public.suggestions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own suggestions" ON public.suggestions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own suggestions" ON public.suggestions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own suggestions" ON public.suggestions
    FOR DELETE USING (auth.uid() = user_id);

-- Analytics Policies
CREATE POLICY "Users can view own analytics" ON public.analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own analytics" ON public.analytics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for updated_at
CREATE TRIGGER set_updated_at_user_profiles
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_documents
    BEFORE UPDATE ON public.documents
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Function to update word/character counts automatically
CREATE OR REPLACE FUNCTION public.update_document_stats()
RETURNS TRIGGER AS $$
BEGIN
    NEW.word_count = array_length(regexp_split_to_array(trim(NEW.content), E'\\s+'), 1);
    NEW.character_count = length(NEW.content);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update document stats
CREATE TRIGGER update_document_stats_trigger
    BEFORE INSERT OR UPDATE OF content ON public.documents
    FOR EACH ROW
    EXECUTE FUNCTION public.update_document_stats();

-- Function to update user profile stats
CREATE OR REPLACE FUNCTION public.update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'documents' AND TG_OP = 'INSERT' THEN
        UPDATE public.user_profiles
        SET documents_created = documents_created + 1
        WHERE id = NEW.user_id;
    END IF;
    
    IF TG_TABLE_NAME = 'writing_sessions' AND TG_OP = 'INSERT' THEN
        UPDATE public.user_profiles
        SET words_analyzed = words_analyzed + COALESCE(NEW.words_written, 0)
        WHERE id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers to update user stats
CREATE TRIGGER update_user_stats_on_document
    AFTER INSERT ON public.documents
    FOR EACH ROW
    EXECUTE FUNCTION public.update_user_stats();

CREATE TRIGGER update_user_stats_on_session
    AFTER INSERT ON public.writing_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_user_stats();

-- =====================================================
-- HELPFUL VIEWS
-- =====================================================

-- View for user dashboard stats
CREATE OR REPLACE VIEW public.user_dashboard_stats AS
SELECT
    up.id AS user_id,
    up.full_name,
    up.subscription_tier,
    up.words_analyzed,
    up.documents_created,
    COUNT(DISTINCT d.id) AS total_documents,
    COUNT(DISTINCT ws.id) AS total_sessions,
    COALESCE(SUM(d.word_count), 0) AS total_words_written,
    COALESCE(AVG(d.grammar_score), 0) AS avg_grammar_score,
    COALESCE(AVG(d.clarity_score), 0) AS avg_clarity_score
FROM public.user_profiles up
LEFT JOIN public.documents d ON up.id = d.user_id
LEFT JOIN public.writing_sessions ws ON up.id = ws.user_id
GROUP BY up.id, up.full_name, up.subscription_tier, up.words_analyzed, up.documents_created;

-- Grant access to authenticated users
GRANT SELECT ON public.user_dashboard_stats TO authenticated;

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Note: Uncomment below to insert sample data for testing
-- This will only work after you've signed up a user

/*
-- Insert sample document (replace user_id with actual user ID)
INSERT INTO public.documents (user_id, title, content, grammar_score, clarity_score, tone)
VALUES (
    'your-user-id-here'::uuid,
    'Sample Document',
    'This is a sample document to test the Zeus writing assistant. It contains some text that can be analyzed for grammar, style, and tone.',
    95,
    88,
    'professional'
);
*/

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant permissions on tables
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.documents TO authenticated;
GRANT ALL ON public.writing_sessions TO authenticated;
GRANT ALL ON public.suggestions TO authenticated;
GRANT ALL ON public.analytics TO authenticated;

-- =====================================================
-- COMPLETION
-- =====================================================

-- Log migration completion
DO $$
BEGIN
    RAISE NOTICE 'Zeus database schema migration completed successfully!';
END $$;
