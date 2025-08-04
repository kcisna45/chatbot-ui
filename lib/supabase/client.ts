import { createClient } from "@supabase/supabase-js";

console.log("✅ Debug: SUPABASE URL =", process.env.SUPABASE_URL);
console.log("✅ Debug: SUPABASE KEY =", process.env.SUPABASE_ANON_KEY ? "Loaded ✅" : "❌ Missing");

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
throw new Error("❌ Supabase URL and Key are required to create a Supabase client! Check your .env.local");
}

export const supabase = createClient(
process.env.SUPABASE_URL,
process.env.SUPABASE_ANON_KEY
);
