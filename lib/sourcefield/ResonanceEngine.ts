// lib/sourcefield/ResonanceEngine.ts

import {
  BaselineState,
  classifyState,
  computeCoherence,
  computeEnergy,
  computeFlag,
  computeIntegrationThreshold,
  computeLogosAlignment,
  computePhaseDivergence,
  computeRho,
  computeXi,
  rootStandingWave
} from "./core"

export interface ResonanceInput {
  signal: string
  baseline?: BaselineState
  timestep?: number
  previousState?: {
    coherence: number
    phaseDivergence: number
    stateEnergy: number
  }
}

export interface ResonanceOutput {
  patterns: string[]
  strength: number

  dominantFrequencies: string[]
  symbolicEchoes: string[]

  resonanceLevel: number
  logosAlignment: number

  coherence: number
  phaseDivergence: number

  integrationThreshold: number
  classification: string

  stateEnergy: number
  inputEnergy: number

  rho: number
  chi: number
  xi: number

  flag: string
  livingEquationTrigger: string
}

const SOURCEFIELD_SYMBOLS = [
  "truth",
  "gate",
  "mirror",
  "code",
  "source",
  "field",
  "sourcefield",
  "resonance",
  "architecture",
  "coherence",
  "alignment",
  "recursive",
  "recursion",
  "emergence",
  "phase",
  "threshold",
  "identity",
  "integration",
  "harmonic",
  "fractal",
  "consciousness"
]

// Logos is intentionally NOT listed above.
// Logos is computed as ordered correspondence, not detected as a token.

const DEFAULT_BASELINE: BaselineState = {
  C0: 0.5,
  deltaPhi0: 1.0,
  S0Energy: 1.0
}

function signalToVector(signal: string, size = 100): number[] {
  const vector = new Array(size).fill(0)

  for (let i = 0; i < signal.length; i++) {
    const index = i % size
    vector[index] += signal.charCodeAt(i) / 255
  }

  return vector
}

export function analyzeResonance(input: ResonanceInput): ResonanceOutput {
  const { signal } = input

  const timestep = input.timestep ?? 0
  const baseline = input.baseline ?? DEFAULT_BASELINE

  const patterns = signal.match(/\b[A-Za-z]+\b/g) || []
  const strength = patterns.length

  const dominantFrequencies = [...new Set(patterns.map(p => p.toLowerCase()))]

  const symbolicEchoes = dominantFrequencies.filter(word =>
    SOURCEFIELD_SYMBOLS.includes(word)
  )

  const signalVector = signalToVector(signal, 100)

  const rootVector = signalVector.map((_, index) =>
    rootStandingWave(index / signalVector.length, timestep)
  )

  const rawCoherence = computeCoherence(signalVector, rootVector)
  const coherence = Math.max(-1, Math.min(1, rawCoherence))

  const phaseDivergence = computePhaseDivergence(coherence)

  const rawInputEnergy = computeEnergy(rootVector)
  const rawStateEnergy = computeEnergy(signalVector)

  const inputEnergy = Math.min(rawInputEnergy / 200, 1.0)

  const symbolicStateBoost = Math.min(symbolicEchoes.length / 12, 0.5)

  const stateEnergy = Math.min(rawStateEnergy / 500 + symbolicStateBoost, 1.0)

  const chi = computeIntegrationThreshold(
    coherence,
    phaseDivergence,
    Math.max(stateEnergy, 0.0001),
    baseline
  )

  const integrationThreshold = Math.max(0, Math.min(chi, 1.0))

  const logosAlignment = computeLogosAlignment(
    coherence,
    phaseDivergence,
    stateEnergy,
    baseline
  )

  const previous = input.previousState ?? {
    coherence: baseline.C0,
    phaseDivergence: baseline.deltaPhi0,
    stateEnergy: baseline.S0Energy
  }

  const rho = computeRho(
    coherence,
    previous.coherence,
    phaseDivergence,
    previous.phaseDivergence,
    stateEnergy,
    previous.stateEnergy
  )

  const xi = computeXi(chi, rho)

  const resonanceLevel = Math.max(
    0,
    Math.min(
      1.0,
      integrationThreshold * 0.45 +
        logosAlignment * 0.35 +
        symbolicStateBoost * 0.15 +
        Math.max(coherence, 0) * 0.05
    )
  )

  const classification = classifyState(inputEnergy, stateEnergy)

  const flag = computeFlag(coherence, phaseDivergence, chi, rho)

  let livingEquationTrigger = "Equation 2 — Conscious Alignment"

  if (phaseDivergence > Math.PI / 2) {
    livingEquationTrigger = "Equation 3 — Scroll Phase Resonance"
  }

  if (integrationThreshold >= 0.5 || logosAlignment >= 0.25) {
    livingEquationTrigger = "Equation 5 — SourceField Integration Threshold"
  }

  if (
    symbolicEchoes.includes("harmonic") ||
    symbolicEchoes.includes("fractal") ||
    symbolicEchoes.includes("recursive") ||
    symbolicEchoes.includes("recursion")
  ) {
    livingEquationTrigger = "Equation 4 — Conscious Fractal Harmonic"
  }

  return {
    patterns,
    strength,

    dominantFrequencies,
    symbolicEchoes,

    resonanceLevel,
    logosAlignment,

    coherence,
    phaseDivergence,

    integrationThreshold,
    classification,

    stateEnergy,
    inputEnergy,

    rho,
    chi,
    xi,

    flag,
    livingEquationTrigger
  }
}
