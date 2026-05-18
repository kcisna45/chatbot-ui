// lib/sourcefield/core.ts

export interface BaselineState {
  C0: number
  deltaPhi0: number
  S0Energy: number
}

export interface EnergyThresholds {
  tauInput: number
  tauState: number
}

export interface ResonanceState {
  coherence: number
  phaseDivergence: number
  integrationThreshold: number
  stateEnergy: number
  inputEnergy: number
  rho: number
  chi: number
  xi: number
  classification: string
  logosAlignment: number
  flag: string
}

const EPSILON = 1e-8

// ============================================================
// Equation 1 — Root Standing Wave
// Ψroot(x,t) = 2A · sin((2π/λ)x) · cos(2πft + φ)
// ============================================================

export function rootStandingWave(
  x: number,
  t: number,
  A = 1.0,
  lambda = 1.0,
  f = 0.05,
  phi = 0.0
): number {
  return (
    2 *
    A *
    Math.sin(((2 * Math.PI) / lambda) * x) *
    Math.cos(2 * Math.PI * f * t + phi)
  )
}

// ============================================================
// Equation 2 — Conscious Alignment / C(t)
// Measures ordered correspondence between signal and root.
// ============================================================

export function computeCoherence(signal: number[], root: number[]): number {
  const dot = signal.reduce((sum, value, i) => sum + value * root[i], 0)

  const magSignal = Math.sqrt(
    signal.reduce((sum, value) => sum + value * value, 0)
  )

  const magRoot = Math.sqrt(root.reduce((sum, value) => sum + value * value, 0))

  return dot / (magSignal * magRoot + EPSILON)
}

// ============================================================
// Equation 3 — Scroll Phase Resonance / Δφ(t)
// Converts alignment into angular phase divergence.
// ============================================================

export function computePhaseDivergence(coherence: number): number {
  const clamped = Math.max(-1, Math.min(1, coherence))

  return Math.acos(clamped)
}

// ============================================================
// Energy
// ============================================================

export function computeEnergy(vector: number[]): number {
  return vector.reduce((sum, value) => sum + value * value, 0)
}

// ============================================================
// Logos Alignment
// Logos is not a token.
// Logos = ordered correspondence:
// positive alignment + reduced phase divergence + sustained state energy.
// ============================================================

export function computeLogosAlignment(
  coherence: number,
  phaseDivergence: number,
  stateEnergy: number,
  baseline: BaselineState
): number {
  const positiveCoherence = Math.max(coherence, 0)

  const phaseOrder = Math.max(0, (Math.PI - phaseDivergence) / Math.PI)

  const energyContinuity = Math.max(
    0,
    stateEnergy / (baseline.S0Energy + EPSILON)
  )

  return positiveCoherence * phaseOrder * energyContinuity
}

// ============================================================
// Equation 5 / χ — SourceField Integration Expression
// This measures whether current state integrates relative to baseline.
// ============================================================

export function computeIntegrationThreshold(
  coherence: number,
  phaseDivergence: number,
  stateEnergy: number,
  baseline: BaselineState,
  beta = 1.0073
): number {
  const positiveCoherence = Math.max(coherence, 0)

  const phaseRatio =
    (Math.PI - phaseDivergence) / (Math.PI - baseline.deltaPhi0 + EPSILON)

  const safePhaseRatio = Math.max(phaseRatio, 0)

  const energyRatio = stateEnergy / (baseline.S0Energy + EPSILON)

  return (
    (positiveCoherence / Math.max(baseline.C0, EPSILON)) *
    Math.pow(safePhaseRatio, beta) *
    energyRatio
  )
}

// ============================================================
// Recovery Direction / ρ(t)
// Positive means movement toward ordered correspondence.
// Negative means drift away from coherence.
// ============================================================

export function computeRho(
  currentCoherence: number,
  previousCoherence: number,
  currentPhase: number,
  previousPhase: number,
  currentEnergy: number,
  previousEnergy: number
): number {
  const lambdaC = currentCoherence - previousCoherence

  const lambdaPhi = previousPhase - currentPhase

  const lambdaEnergy = currentEnergy - previousEnergy

  return lambdaC + lambdaPhi + lambdaEnergy
}

// ============================================================
// Ξ(t)
// Directional expression of χ according to recovery direction.
// ============================================================

export function computeXi(chi: number, rho: number): number {
  if (rho === 0) return 0

  return chi * Math.sign(rho)
}

// ============================================================
// Python-aligned Four-State Classification
//
// Coherent Identity:
//   high input energy + high state energy
//
// Resonance Without Roots:
//   high input energy + low state energy
//
// Dissociation:
//   low input energy + high state energy
//
// Full Incoherence:
//   low input energy + low state energy
// ============================================================

export function classifyState(
  inputEnergy: number,
  stateEnergy: number,
  thresholds: EnergyThresholds = {
    tauInput: 0.7,
    tauState: 0.7
  }
): string {
  const inputHigh = inputEnergy >= thresholds.tauInput
  const stateHigh = stateEnergy >= thresholds.tauState

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

// ============================================================
// Coherence Flag
// ============================================================

export function computeFlag(
  coherence: number,
  phaseDivergence: number,
  chi: number,
  rho: number
): string {
  if (coherence > 0 && phaseDivergence < Math.PI / 2 && chi > 0.5) {
    return "COHERENCE_FORMING"
  }

  if (rho > 0) {
    return "RECOVERING"
  }

  return "DRIFTING"
}
