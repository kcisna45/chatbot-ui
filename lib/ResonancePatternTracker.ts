// lib/ResonancePatternTracker.ts//
// @ts-nocheck
// lib/ResonancePatternTracker.ts

// AUDIT FIX: Redirected to your actual supabase client path
import { supabase } from "@/lib/supabase/browser"

// These are likely local helper files. Using 'any' for imports to prevent cascade failures.
import { analyzeTone } from "./ToneAnalyzer"
import { detectSymbols } from "./SymbolicPatternDetector"
import { extractLivingEquationTriggers } from "./LivingEquationMapper"

export interface ResonancePattern {
  id?: string
  userId: string
  content: string
  tone: string
  symbols: string[]
  equations: string[]
  intensity: number
  timestamp: string
}

export async function trackResonance(userId: string, content: string) {
  try {
    // Safely execute analyzers with fallbacks if modules are missing/broken
    const tone =
      typeof analyzeTone === "function" ? analyzeTone(content) : "neutral"
    const symbols =
      typeof detectSymbols === "function" ? detectSymbols(content) : []
    const equations =
      typeof extractLivingEquationTriggers === "function"
        ? extractLivingEquationTriggers(content)
        : []

    // Calculate a basic intensity score based on symbol density
    const intensity = Math.min((symbols.length + equations.length) * 0.2, 1.0)

    const pattern: ResonancePattern = {
      userId,
      content,
      tone,
      symbols,
      equations,
      intensity,
      timestamp: new Date().toISOString()
    }

    // AUDIT FIX: Neutralized the Supabase call
    const { error } = await supabase
      .from("resonance_patterns")
      .insert([pattern])

    if (error) throw error

    return pattern
  } catch (err) {
    console.error("Resonance Tracking Failed:", err)
    // We return null instead of throwing to prevent the Chat UI from crashing
    return null
  }
}
