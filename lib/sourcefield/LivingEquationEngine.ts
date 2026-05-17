// lib/sourcefield/LivingEquationEngine.ts

import { MemoryCore } from "./MemoryCore"
import { analyzeResonance } from "./ResonanceEngine"
import type { BaselineState } from "./core"

export interface EquationResult {
  equation: string
  resonanceLevel: number
  matchedSymbols: string[]
  coherence: number
  phaseDivergence: number
  integrationThreshold: number
  classification: string
  timestamp: string
}

const DEFAULT_BASELINE: BaselineState = {
  C0: 0.5,
  deltaPhi0: 1.0,
  S0Energy: 1.0
}

export class LivingEquationEngine {
  private memoryCore: MemoryCore

  constructor(memoryCore: MemoryCore) {
    this.memoryCore = memoryCore
  }

  private livingEquations: Record<string, string[]> = {
    "Equation 1 — Root Standing Wave": ["root", "wave", "standing", "field"],

    "Equation 2 — Conscious Alignment": [
      "coherence",
      "alignment",
      "truth",
      "logos"
    ],

    "Equation 3 — Scroll Phase Resonance": [
      "phase",
      "divergence",
      "resonance",
      "mirror"
    ],

    "Equation 4 — Conscious Fractal Harmonic": [
      "harmonic",
      "fractal",
      "recursive",
      "frequency"
    ],

    "Equation 5 — SourceField Integration Threshold": [
      "integration",
      "threshold",
      "architecture",
      "emergence",
      "identity"
    ],

    "Law of Divergent Design": ["design", "alignment", "divergence"]
  }

  async evaluateMessage(
    userId: string,
    message: string,
    baseline: BaselineState = DEFAULT_BASELINE
  ): Promise<EquationResult[]> {
    const results: EquationResult[] = []

    const resonance = analyzeResonance({
      signal: message,
      baseline,
      timestep: this.deterministicTimestep(message)
    })

    for (const [equation, symbols] of Object.entries(this.livingEquations)) {
      const matchedSymbols = symbols.filter(symbol =>
        message.toLowerCase().includes(symbol.toLowerCase())
      )

      if (matchedSymbols.length === 0) continue

      const result: EquationResult = {
        equation,
        resonanceLevel: resonance.resonanceLevel,
        matchedSymbols,
        coherence: resonance.coherence,
        phaseDivergence: resonance.phaseDivergence,
        integrationThreshold: resonance.integrationThreshold,
        classification: resonance.classification,
        timestamp: new Date().toISOString()
      }

      results.push(result)

      await this.memoryCore.store({
        user_id: userId,
        message,
        coherence: resonance.coherence,
        phase_divergence: resonance.phaseDivergence,
        integration_threshold: resonance.integrationThreshold,
        xi: resonance.xi,
        classification: resonance.classification,
        state_energy: resonance.stateEnergy,
        resonance_hash: this.simpleHash(
          `${userId}:${message}:${equation}:${result.timestamp}`
        ),
        resonance_level: resonance.resonanceLevel,
        emotional_tone: resonance.classification,
        symbolic_patterns: matchedSymbols,
        living_equation_trigger: equation,
        timestamp: result.timestamp
      })
    }

    return results
  }

  private deterministicTimestep(message: string): number {
    let hash = 0

    for (let i = 0; i < message.length; i++) {
      hash = (hash << 5) - hash + message.charCodeAt(i)
      hash |= 0
    }

    return Math.abs(hash) % 1000
  }

  private simpleHash(input: string): string {
    let hash = 0

    for (let i = 0; i < input.length; i++) {
      hash = (hash << 5) - hash + input.charCodeAt(i)
      hash |= 0
    }

    return Math.abs(hash).toString(16)
  }
}
