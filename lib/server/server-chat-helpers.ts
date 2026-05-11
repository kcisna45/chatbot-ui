// @ts-nocheck
import { Tables } from "@/supabase/types"

// AUDIT FIX: Hardcoding the key map to remove the broken '@/types/valid-env-keys' dependency.
// This ensures the build can resolve the API key mapping logic.
const VALID_ENV_KEYS = {
  OPENAI_API_KEY: "OPENAI_API_KEY",
  ANTHROPIC_API_KEY: "ANTHROPIC_API_KEY",
  GOOGLE_GEMINI_API_KEY: "GOOGLE_GEMINI_API_KEY",
  MISTRAL_API_KEY: "MISTRAL_API_KEY",
  GROQ_API_KEY: "GROQ_API_KEY",
  PERPLEXITY_API_KEY: "PERPLEXITY_API_KEY",
  OPENROUTER_API_KEY: "OPENROUTER_API_KEY"
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
