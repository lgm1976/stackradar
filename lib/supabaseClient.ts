import { createClient } from "@supabase/supabase-js";

// Lazy client. During the static build we read from local JSON (see data.ts)
// so the site builds and deploys even before Supabase is wired up.
// Once you add env vars, flip USE_SUPABASE to true in lib/data.ts.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  url && anonKey ? createClient(url, anonKey) : null;
