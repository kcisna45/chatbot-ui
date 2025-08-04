console.log("🔍 SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("🔍 SUPABASE_ANON_KEY:", process.env.SUPABASE_ANON_KEY ? "✅ Loaded" : "❌ Missing");

import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)
