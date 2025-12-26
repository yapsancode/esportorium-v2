import { createBrowserClient } from '@supabase/ssr';

export const createSupabaseBrowserClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

// Optional: Singleton for convenience (most people use this)
let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export const supabaseBrowser = () => {
  if (!browserClient) {
    browserClient = createSupabaseBrowserClient();
  }
  return browserClient;
};