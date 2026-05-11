// @ts-nocheck
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

// ... keep the VALID_ENV_KEYS and addApiKeysToProfile we added earlier ...

const VALID_ENV_KEYS = {
  OPENAI_API_KEY: "OPENAI_API_KEY",
  ANTHROPIC_API_KEY: "ANTHROPIC_API_KEY",
  GOOGLE_GEMINI_API_KEY: "GOOGLE_GEMINI_API_KEY",
  MISTRAL_API_KEY: "MISTRAL_API_KEY",
  GROQ_API_KEY: "GROQ_API_KEY",
  PERPLEXITY_API_KEY: "PERPLEXITY_API_KEY",
  OPENROUTER_API_KEY: "OPENROUTER_API_KEY"
}

// AUDIT FIX: Added missing getServerProfile function
export async function getServerProfile() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        }
      }
    }
  )

  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  return profile
}

export function addApiKeysToProfile(profile: any) {
  const apiKeys = {
    [VALID_ENV_KEYS.OPENAI_API_KEY]: "openai_api_key",
    [VALID_ENV_KEYS.ANTHROPIC_API_KEY]: "anthropic_api_key",
    [VALID_ENV_KEYS.GOOGLE_GEMINI_API_KEY]: "google_gemini_api_key",
    [VALID_ENV_KEYS.MISTRAL_API_KEY]: "mistral_api_key",
    [VALID_ENV_KEYS.GROQ_API_KEY]: "groq_api_key",
    [VALID_ENV_KEYS.PERPLEXITY_API_KEY]: "perplexity_api_key",
    [VALID_ENV_KEYS.OPENROUTER_API_KEY]: "openrouter_api_key"
  }

  for (const [envKey, profileKey] of Object.entries(apiKeys)) {
    if (process.env[envKey]) {
      profile[profileKey] = process.env[envKey]
    }
  }

  return profile
}

export const checkApiKey = (apiKey: string | null, keyName: string) => {
  if (!apiKey) {
    throw new Error(
      `${keyName} API Key not found. Please add it in your settings.`
    )
  }
}
