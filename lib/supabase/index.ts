// Client-side Supabase exports
// Import directly from '@/lib/supabase/client' for browser use
// Import directly from '@/lib/supabase/server' for server-side use (Server Components/API routes only)

export { createClient as createBrowserClient, getSupabaseClient } from './client';

// NOTE: Do not re-export server here to avoid "next/headers" errors in client components
// Use: import { createClient } from '@/lib/supabase/server' directly in Server Components
