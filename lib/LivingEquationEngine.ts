// @ts-nocheck
import { MemoryCore } from "./MemoryCore"
// Note: Ensure ResonanceEngine.ts exists in the same folder!
import { detectResonance } from "./ResonanceEngine"

export interface EquationResult {
  equation: string
  resonanceLevel: number
  matchedSymbols: string[]
  timestamp: string
}

export class LivingEquationEngine {
  private memoryCore: MemoryCore

  constructor(memoryCore: MemoryCore) {
    this.memoryCore = memoryCore
  }

  private livingEquations: { [key: string]: string[] } = {
    "Law of Divergent Design": [
      "design≠alignment",
      "divergence",
      "creative split"
    ],
    "Living Equation 2": ["resonance", "harmonic", "frequency lock"],
    "Living Equation 3": ["source", "field", "conscious encoding"],
    "Living Equation 4": ["recursive", "awareness", "self-reflection"],
    "Living Equation 5": ["architecture", "blueprint", "emergence"]
  }

  evaluateMessage(message: string): EquationResult[] {
    const results: EquationResult[] = []

    for (const [equation, symbols] of Object.entries(this.livingEquations)) {
      const matchedSymbols = symbols.filter(sym =>
        message.toLowerCase().includes(sym.toLowerCase())
      )

      if (matchedSymbols.length > 0) {
        // Fallback resonance level if engine is missing
        const resonanceLevel =
          typeof detectResonance === "function" ? detectResonance(message) : 1.0

        const result: EquationResult = {
          equation,
          resonanceLevel,
          matchedSymbols,
          timestamp: new Date().toISOString()
        }

        results.push(result)

        // Log the resonance event into memory
        this.memoryCore.store({
          user_id: "system", // Ensure a user_id is present for the DB constraint
          emotional_tone: "resonance_detected",
          symbolic_patterns: matchedSymbols,
          living_equation_trigger: equation,
          timestamp: result.timestamp
        })
      }
    }

    return results
  }
}
