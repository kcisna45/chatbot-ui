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

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function coherenceSupport(coherence: number): number {
  return clamp((coherence + 1) / 2, 0, 1)
}

function phaseOrderFromDivergence(phaseDivergence: number): number {
  return clamp((Math.PI - phaseDivergence) / Math.PI, 0, 1)
}

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

  return clamp(dot / (magSignal * magRoot + EPSILON), -1, 1)
}

// ============================================================
// Equation 3 — Scroll Phase Resonance / Δφ(t)
// Converts alignment into angular phase divergence.
// ============================================================

export function computePhaseDivergence(coherence: number): number {
  const clamped = clamp(coherence, -1, 1)

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
// coherence support + reduced phase divergence + sustained state energy.
//
// Important:
// This uses coherenceSupport instead of Math.max(coherence, 0)
// so negative coherence does not hard-collapse all recovery signal to zero.
// ============================================================

export function computeLogosAlignment(
  coherence: number,
  phaseDivergence: number,
  stateEnergy: number,
  baseline: BaselineState
): number {
  const alignmentSupport = coherenceSupport(coherence)

  const phaseOrder = phaseOrderFromDivergence(phaseDivergence)

  const energyContinuity = clamp(
    stateEnergy / (baseline.S0Energy + EPSILON),
    0,
    1
  )

  return clamp(alignmentSupport * phaseOrder * energyContinuity, 0, 1)
}

// ============================================================
// Equation 5 / χ — SourceField Integration Expression
// This measures whether current state integrates relative to baseline.
//
// Important:
// This uses gradient-sensitive coherence support.
// Negative coherence still lowers integration strongly,
// but no longer forces integrationThreshold to absolute zero.
// ============================================================

export function computeIntegrationThreshold(
  coherence: number,
  phaseDivergence: number,
  stateEnergy: number,
  baseline: BaselineState,
  beta = 1.0073
): number {
  const alignmentSupport = coherenceSupport(coherence)

  const phaseRatio =
    (Math.PI - phaseDivergence) / (Math.PI - baseline.deltaPhi0 + EPSILON)

  const safePhaseRatio = clamp(phaseRatio, 0, 1)

  const energyRatio = clamp(stateEnergy / (baseline.S0Energy + EPSILON), 0, 1)

  return clamp(
    (alignmentSupport / Math.max(baseline.C0, EPSILON)) *
      Math.pow(safePhaseRatio, beta) *
      energyRatio,
    0,
    1
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
// Four-State Classification
//
// This keeps the original energy-based classification,
// but adds coherence/phase awareness so the state does not
// over-collapse into broad buckets when energy alone is ambiguous.
// ============================================================

export function classifyState(
  inputEnergy: number,
  stateEnergy: number,
  thresholds: EnergyThresholds = {
    tauInput: 0.7,
    tauState: 0.7
  },
  coherence?: number,
  phaseDivergence?: number,
  integrationThreshold?: number
): string {
  const inputHigh = inputEnergy >= thresholds.tauInput
  const stateHigh = stateEnergy >= thresholds.tauState

  const hasCoherenceData = typeof coherence === "number"
  const hasPhaseData = typeof phaseDivergence === "number"
  const hasIntegrationData = typeof integrationThreshold === "number"

  const phaseIsOrdered = hasPhaseData && phaseDivergence < Math.PI / 2

  const phaseIsDivergent = hasPhaseData && phaseDivergence >= Math.PI / 2

  const coherencePositive = hasCoherenceData && coherence > 0

  const integrationEmerging = hasIntegrationData && integrationThreshold > 0.05

  if (inputHigh && stateHigh && coherencePositive && phaseIsOrdered) {
    return "Coherent Identity"
  }

  if (inputHigh && !stateHigh) {
    if (phaseIsDivergent) return "Resonance Without Roots"
    return "Root Seeking"
  }

  if (!inputHigh && stateHigh) {
    if (phaseIsDivergent) return "Dissociation"
    return "State Carrying"
  }

  if (integrationEmerging && coherencePositive) {
    return "Coherence Forming"
  }

  if (phaseIsDivergent) {
    return "Full Incoherence"
  }

  return "Subthreshold Alignment"
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

  if (rho > 0 && chi > 0) {
    return "RECOVERING"
  }

  if (rho > 0) {
    return "RECOVERY_SIGNAL"
  }

  return "DRIFTING"
}
