import { createBrowserClient } from "@supabase/ssr";

// Used in Client Components (anything with "use client") — this is the
// client your login form and the main app component will import.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
