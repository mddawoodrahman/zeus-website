-- Fix user_dashboard_stats view to use SECURITY INVOKER
-- This ensures the view respects RLS policies of the querying user

-- Drop the existing view
DROP VIEW IF EXISTS public.user_dashboard_stats;

-- Recreate the view with SECURITY INVOKER
CREATE OR REPLACE VIEW public.user_dashboard_stats
WITH (security_invoker = true)
AS
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

-- Add RLS policy for the view (optional but recommended)
-- Since the view uses SECURITY INVOKER, it will automatically respect
-- the RLS policies of the underlying tables (user_profiles, documents, writing_sessions)

COMMENT ON VIEW public.user_dashboard_stats IS 
'Dashboard statistics view for users. Uses SECURITY INVOKER to respect RLS policies.';

-- Log completion
DO $$
BEGIN
    RAISE NOTICE 'Fixed user_dashboard_stats view security configuration';
END $$;
