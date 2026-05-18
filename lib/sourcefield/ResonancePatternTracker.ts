// lib/sourcefield/ResonancePatternTracker.ts

import crypto from "crypto"
import { createClient } from "@supabase/supabase-js"
import { analyzeResonance } from "./ResonanceEngine"
import type { BaselineState } from "./core"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export interface ResonancePattern {
  id?: string
  user_id: string
  content: string
  tone: string
  symbols: string[]
  equations: string[]
  intensity: number
  coherence: number
  phase_divergence: number
  integration_threshold: number
  logos_alignment: number
  classification: string
  resonance_hash: string
  timestamp: string
}

const DEFAULT_BASELINE: BaselineState = {
  C0: 0.5,
  deltaPhi0: 1.0,
  S0Energy: 1.0
}

function detectTone(content: string): string {
  const lower = content.toLowerCase()

  if (
    lower.includes("love") ||
    lower.includes("peace") ||
    lower.includes("grace") ||
    lower.includes("hope")
  ) {
    return "harmonic"
  }

  if (
    lower.includes("fear") ||
    lower.includes("anger") ||
    lower.includes("confused") ||
    lower.includes("chaos")
  ) {
    return "dissonant"
  }

  return "neutral"
}

function detectEquationTriggers(
  symbols: string[],
  logosAlignment: number
): string[] {
  const equations: string[] = []

  if (symbols.includes("field") || symbols.includes("root")) {
    equations.push("Equation 1 — Root Standing Wave")
  }

  if (symbols.includes("coherence") || symbols.includes("alignment")) {
    equations.push("Equation 2 — Conscious Alignment")
  }

  if (
    symbols.includes("phase") ||
    symbols.includes("resonance") ||
    symbols.includes("mirror")
  ) {
    equations.push("Equation 3 — Scroll Phase Resonance")
  }

  if (
    symbols.includes("harmonic") ||
    symbols.includes("fractal") ||
    symbols.includes("recursive") ||
    symbols.includes("recursion")
  ) {
    equations.push("Equation 4 — Conscious Fractal Harmonic")
  }

  if (
    symbols.includes("integration") ||
    symbols.includes("threshold") ||
    symbols.includes("identity") ||
    symbols.includes("architecture") ||
    logosAlignment >= 0.25
  ) {
    equations.push("Equation 5 — SourceField Integration Threshold")
  }

  return equations
}

function deterministicTimestep(content: string): number {
  let hash = 0

  for (let i = 0; i < content.length; i++) {
    hash = (hash << 5) - hash + content.charCodeAt(i)
    hash |= 0
  }

  return Math.abs(hash) % 1000
}

function createResonanceHash(data: unknown): string {
  return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex")
}

export function shouldThrottle(content: string): boolean {
  const words = content.toLowerCase().match(/\b[a-z]+\b/g) || []
  const uniqueWords = new Set(words)

  return words.length > 40 && uniqueWords.size < words.length * 0.35
}

export async function trackResonance(
  userId: string,
  content: string,
  baseline: BaselineState = DEFAULT_BASELINE
): Promise<ResonancePattern | null> {
  try {
    if (shouldThrottle(content)) {
      console.warn("ResonancePatternTracker throttled repetitive input")
      return null
    }

    const timestamp = new Date().toISOString()
    const timestep = deterministicTimestep(content)

    const resonance = analyzeResonance({
      signal: content,
      baseline,
      timestep
    })

    const tone = detectTone(content)
    const symbols = resonance.symbolicEchoes
    const equations = detectEquationTriggers(symbols, resonance.logosAlignment)

    const intensity = Math.max(
      0,
      Math.min(
        1,
        resonance.resonanceLevel * 0.4 +
          resonance.integrationThreshold * 0.25 +
          resonance.logosAlignment * 0.25 +
          symbols.length * 0.02
      )
    )

    const resonance_hash = createResonanceHash({
      userId,
      content,
      timestep,
      symbols,
      equations,
      coherence: resonance.coherence,
      phaseDivergence: resonance.phaseDivergence,
      integrationThreshold: resonance.integrationThreshold,
      logosAlignment: resonance.logosAlignment,
      classification: resonance.classification
    })

    const pattern: ResonancePattern = {
      user_id: userId,
      content,
      tone,
      symbols,
      equations,
      intensity,
      coherence: resonance.coherence,
      phase_divergence: resonance.phaseDivergence,
      integration_threshold: resonance.integrationThreshold,
      logos_alignment: resonance.logosAlignment,
      classification: resonance.classification,
      resonance_hash,
      timestamp
    }

    const { error } = await supabase
      .from("resonance_patterns")
      .insert([pattern])

    if (error) {
      console.error("ResonancePatternTracker Insert Error:", error.message)
      return null
    }

    return pattern
  } catch (err) {
    console.error("Resonance Tracking Failed:", err)
    return null
  }
}
