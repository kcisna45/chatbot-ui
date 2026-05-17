// lib/sourcefield/ResonanceEngine.ts

import {
  BaselineState,
  computeCoherence,
  computeEnergy,
  computeIntegrationThreshold,
  computePhaseDivergence,
  computeXi,
  rootStandingWave
} from "./core"

export interface ResonanceInput {
  signal: string
  baseline?: BaselineState
  timestep?: number
}

export interface ResonanceOutput {
  patterns: string[]
  strength: number

  dominantFrequencies: string[]
  symbolicEchoes: string[]

  resonanceLevel: number

  coherence: number
  phaseDivergence: number

  integrationThreshold: number
  classification: string

  stateEnergy: number
  inputEnergy: number

  rho: number
  chi: number
  xi: number

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
  "logos",
  "phase",
  "threshold",
  "identity",
  "integration",
  "harmonic",
  "fractal",
  "consciousness"
]

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

function classifyState(inputEnergy: number, stateEnergy: number): string {
  const inputHigh = inputEnergy >= 0.7
  const stateHigh = stateEnergy >= 0.7

  if (inputHigh && stateHigh) {
    return "Coherent Identity"
  }

  if (inputHigh && !stateHigh) {
    return "Resonance Without Roots"
  }

  if (!inputHigh && stateHigh) {
    return "Dissociation"
  }

  return "Full Incoherence"
}

export function analyzeResonance(input: ResonanceInput): ResonanceOutput {
  const { signal } = input

  const timestep = input.timestep ?? 0
  const baseline = input.baseline ?? DEFAULT_BASELINE

  // ============================================================
  // Pattern Extraction
  // ============================================================

  const patterns = signal.match(/\b[A-Za-z]+\b/g) || []
  const strength = patterns.length

  const dominantFrequencies = [...new Set(patterns.map(p => p.toLowerCase()))]

  const symbolicEchoes = dominantFrequencies.filter(word =>
    SOURCEFIELD_SYMBOLS.includes(word)
  )

  // ============================================================
  // Vectorization Layer
  // ============================================================

  const signalVector = signalToVector(signal, 100)

  const rootVector = signalVector.map((_, index) =>
    rootStandingWave(index / signalVector.length, timestep)
  )

  // ============================================================
  // Equation 2 — Conscious Alignment / Coherence
  // ============================================================

  const rawCoherence = computeCoherence(signalVector, rootVector)

  const coherence = Math.max(-1, Math.min(1, rawCoherence))

  // ============================================================
  // Equation 3 — Scroll Phase Resonance / Phase Divergence
  // ============================================================

  const phaseDivergence = computePhaseDivergence(coherence)

  // ============================================================
  // Energy States
  // ============================================================

  const rawInputEnergy = computeEnergy(rootVector)
  const rawStateEnergy = computeEnergy(signalVector)

  const inputEnergy = Math.min(rawInputEnergy / 200, 1.0)
  const symbolicStateBoost = Math.min(symbolicEchoes.length / 10, 1.0)
  const stateEnergy = Math.min(rawStateEnergy / 500 + symbolicStateBoost, 1.0)

  // ============================================================
  // Equation 5 / Chi — Integration Threshold
  // ============================================================

  const chi = computeIntegrationThreshold(
    Math.max(coherence, 0),
    phaseDivergence,
    Math.max(stateEnergy, 0.0001),
    baseline
  )

  const integrationThreshold = Math.max(0, Math.min(chi, 1.0))

  // ============================================================
  // Recovery Direction — Rho
  // ============================================================

  const rho = coherence - phaseDivergence / Math.PI

  // ============================================================
  // Xi
  // ============================================================

  const xi = computeXi(chi, rho)

  // ============================================================
  // Resonance Level
  // ============================================================

  const resonanceLevel = Math.max(
    0,
    Math.min(
      1.0,
      integrationThreshold * 0.6 +
        symbolicStateBoost * 0.25 +
        Math.max(coherence, 0) * 0.15
    )
  )

  // ============================================================
  // Classification — Python-Aligned Labels
  // ============================================================

  const classification = classifyState(inputEnergy, stateEnergy)

  // ============================================================
  // Living Equation Trigger
  // ============================================================

  let livingEquationTrigger = "Equation 2"

  if (phaseDivergence > 1.4) {
    livingEquationTrigger = "Equation 3"
  }

  if (integrationThreshold >= 0.5) {
    livingEquationTrigger = "Equation 5"
  }

  if (
    symbolicEchoes.includes("harmonic") ||
    symbolicEchoes.includes("fractal")
  ) {
    livingEquationTrigger = "Equation 4"
  }

  return {
    patterns,
    strength,

    dominantFrequencies,
    symbolicEchoes,

    resonanceLevel,

    coherence,
    phaseDivergence,

    integrationThreshold,
    classification,

    stateEnergy,
    inputEnergy,

    rho,
    chi,
    xi,

    livingEquationTrigger
  }
}
