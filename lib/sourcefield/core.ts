// lib/sourcefield/core.ts

export interface BaselineState {
  C0: number
  deltaPhi0: number
  S0Energy: number
}

export interface ResonanceState {
  coherence: number
  phaseDivergence: number
  integrationThreshold: number
  stateEnergy: number
  xi: number
  flag: string
}

const EPSILON = 1e-8

// ============================================================
// Equation 1
// Root Standing Wave
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
// Equation 2
// Coherence
// ============================================================

export function computeCoherence(signal: number[], root: number[]): number {
  const dot = signal.reduce((sum, value, i) => sum + value * root[i], 0)

  const magSignal = Math.sqrt(signal.reduce((s, v) => s + v * v, 0))

  const magRoot = Math.sqrt(root.reduce((s, v) => s + v * v, 0))

  return dot / (magSignal * magRoot + EPSILON)
}

// ============================================================
// Equation 3
// Phase Divergence
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
// Equation 5
// Integration Threshold
// ============================================================

export function computeIntegrationThreshold(
  coherence: number,
  phase: number,
  stateEnergy: number,
  baseline: BaselineState,
  beta = 1.0073
): number {
  return (
    (coherence / (baseline.C0 + EPSILON)) *
    Math.pow(
      (Math.PI - phase) / (Math.PI - baseline.deltaPhi0 + EPSILON),
      beta
    ) *
    (stateEnergy / (baseline.S0Energy + EPSILON))
  )
}

// ============================================================
// Xi State
// ============================================================

export function computeXi(chi: number, rho: number): number {
  if (rho === 0) return 0

  return chi * Math.sign(rho)
}

// ============================================================
// Classification
// ============================================================

export function classifyState(
  coherence: number,
  phase: number,
  chi: number
): string {
  if (coherence > 0.9 && phase < 0.2 && chi > 0.9) {
    return "COHERENT"
  }

  if (coherence > 0.5 && chi > 0.5) {
    return "RECOVERING"
  }

  return "DRIFTED"
}
