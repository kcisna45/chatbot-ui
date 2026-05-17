// lib/sourcefield/processMessage.ts

import crypto from "crypto"

import { analyzeResonance } from "./ResonanceEngine"
import { MemoryCore } from "./MemoryCore"
import { BaselineState } from "./core"

const memory = new MemoryCore()

const baseline: BaselineState = {
  C0: 0.5,
  deltaPhi0: 1.0,
  S0Energy: 1.0
}

export async function processMessage(userId: string, message: string) {
  const resonance = analyzeResonance({
    signal: message,
    baseline,
    timestep: Date.now() % 1000
  })

  const resonanceHash = crypto
    .createHash("sha256")
    .update(
      JSON.stringify({
        userId,
        message,
        coherence: resonance.coherence,
        phaseDivergence: resonance.phaseDivergence,
        integrationThreshold: resonance.integrationThreshold,
        classification: resonance.classification,
        rho: resonance.rho,
        chi: resonance.chi,
        xi: resonance.xi,
        timestamp: new Date().toISOString()
      })
    )
    .digest("hex")

  await memory.store({
    user_id: userId,

    message,

    coherence: resonance.coherence,

    phase_divergence: resonance.phaseDivergence,

    integration_threshold: resonance.integrationThreshold,

    xi: resonance.xi,

    classification: resonance.classification,

    state_energy: resonance.stateEnergy,

    resonance_hash: resonanceHash,

    resonance_level: resonance.resonanceLevel,

    emotional_tone: resonance.classification,

    symbolic_patterns: resonance.symbolicEchoes,

    living_equation_trigger: resonance.livingEquationTrigger,

    timestamp: new Date().toISOString()
  })

  return resonance
}
