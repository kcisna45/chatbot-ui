// lib/sourcefield/processMessage.ts

import crypto from "crypto"

import { analyzeResonance } from "./ResonanceEngine"
import { MemoryCore } from "./MemoryCore"
import type { BaselineState } from "./core"
import { trackResonance } from "./ResonancePatternTracker"

const memory = new MemoryCore()

const baseline: BaselineState = {
  C0: 0.5,
  deltaPhi0: 1.0,
  S0Energy: 1.0
}

type PreviousRuntimeState = {
  coherence: number
  phaseDivergence: number
  stateEnergy: number
}

const previousRuntimeStateByUser = new Map<string, PreviousRuntimeState>()

let runtimeSequence = 0

function getRuntimeTimestep(message: string) {
  runtimeSequence += 1

  const messageSeed =
    Math.abs(
      crypto.createHash("sha256").update(message).digest().readInt32BE(0)
    ) % 1000

  return messageSeed + runtimeSequence
}

export async function processMessage(userId: string, message: string) {
  const previousState = previousRuntimeStateByUser.get(userId) ?? {
    coherence: baseline.C0,
    phaseDivergence: baseline.deltaPhi0,
    stateEnergy: baseline.S0Energy
  }

  const timestep = getRuntimeTimestep(message)

  const resonance = analyzeResonance({
    signal: message,
    baseline,
    timestep,
    previousState
  })

  const resonanceHash = crypto
    .createHash("sha256")
    .update(
      JSON.stringify({
        userId,
        message,
        timestep,
        previousState,
        coherence: resonance.coherence,
        phaseDivergence: resonance.phaseDivergence,
        integrationThreshold: resonance.integrationThreshold,
        logosAlignment: resonance.logosAlignment,
        classification: resonance.classification,
        rho: resonance.rho,
        chi: resonance.chi,
        xi: resonance.xi
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
    logos_alignment: resonance.logosAlignment,
    timestamp: new Date().toISOString()
  })

  previousRuntimeStateByUser.set(userId, {
    coherence: resonance.coherence,
    phaseDivergence: resonance.phaseDivergence,
    stateEnergy: resonance.stateEnergy
  })

  await trackResonance(userId, message, baseline)

  return resonance
}
