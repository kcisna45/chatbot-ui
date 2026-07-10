import { generateEquationLaneDiagnosticsState } from "./EquationLaneDiagnostics"

import { generatePathwayConvergenceState } from "./pathwayConvergenceEngine"

export type RuntimeObservationMode =
  | "summary"
  | "comparison"
  | "metrics"
  | "json"

export interface RuntimeObservationInput {
  authoritativeRuntimeSnapshot?: any
}

export interface RuntimeObservationConsistency {
  signalStrengthAligned: boolean
  integrationThresholdAligned: boolean
  phaseDivergenceAligned: boolean
  convergenceMathAligned: boolean
  allSourceMetricsAligned: boolean
}

export interface RuntimeObservationState {
  phase: "Runtime Observation Layer"

  observationId: string | null
  snapshotReady: boolean
  agentId: string | null
  runtimeAgentId: string | null
  resonanceHash: string | null
  ledgerHash: string | null

  equationLaneDiagnosticsState: any
  pathwayConvergenceState: any

  observedMetrics: {
    signalStrength: number | null
    integrationThreshold: number | null
    phaseDivergence: number | null
    weightedAgreement: number | null
    eq2Agreement: number | null
    convergenceAngle: number | null
  }

  consistency: RuntimeObservationConsistency

  observationStatus:
    | "synchronized"
    | "partially-synchronized"
    | "snapshot-incomplete"

  observationMeaning: string
  runtimeObservationLayerActive: true

  rule: string
}

function finiteNumberOrNull(value: any): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function approximatelyEqual(
  left: number | null,
  right: number | null,
  tolerance = 1e-12
): boolean {
  if (left === null || right === null) {
    return false
  }

  return Math.abs(left - right) <= tolerance
}

function formatValue(value: number | null): string {
  return value === null ? "unknown" : String(value)
}

export function getRuntimeObservationMode(
  message: string
): RuntimeObservationMode | null {
  const input = (message || "").toLowerCase()

  if (
    input.includes("runtime observation json") ||
    input.includes("observation layer json") ||
    input.includes("synchronized observation json")
  ) {
    return "json"
  }

  if (
    input.includes("runtime observation comparison") ||
    input.includes("observation comparison") ||
    input.includes("compare diagnostics and convergence") ||
    input.includes("compare equation diagnostics and pathway convergence")
  ) {
    return "comparison"
  }

  if (
    input.includes("runtime observation metrics") ||
    input.includes("observation metrics") ||
    input.includes("synchronized runtime metrics")
  ) {
    return "metrics"
  }

  if (
    input.includes("runtime observation") ||
    input.includes("observation layer") ||
    input.includes("synchronized observation") ||
    input.includes("authoritative runtime observation") ||
    input.includes("observe the runtime")
  ) {
    return "summary"
  }

  return null
}

export function generateRuntimeObservationState(
  input: RuntimeObservationInput
): RuntimeObservationState {
  const snapshot = input?.authoritativeRuntimeSnapshot ?? null
  const equationLaneState = snapshot?.equationLaneState ?? null

  const equationLaneDiagnosticsState = generateEquationLaneDiagnosticsState({
    equationLaneState
  })

  const pathwayConvergenceState = generatePathwayConvergenceState({
    equationLaneState
  })

  const diagnosticSignalStrength = finiteNumberOrNull(
    equationLaneDiagnosticsState?.eq1RootDiagnostic?.signalStrength
  )

  const diagnosticIntegrationThreshold = finiteNumberOrNull(
    equationLaneDiagnosticsState?.eq5IntegrationDiagnostic?.integrationThreshold
  )

  const diagnosticPhaseDivergence = finiteNumberOrNull(
    equationLaneDiagnosticsState?.eq3PhaseDiagnostic?.phaseDivergence
  )

  const convergenceSignalStrength = finiteNumberOrNull(
    pathwayConvergenceState?.sourceSignalStrength
  )

  const convergenceIntegrationThreshold = finiteNumberOrNull(
    pathwayConvergenceState?.sourceIntegrationThreshold
  )

  const convergencePhaseDivergence = finiteNumberOrNull(
    pathwayConvergenceState?.sourcePhaseDivergence
  )

  const weightedAgreement = finiteNumberOrNull(
    pathwayConvergenceState?.weightedAgreement
  )

  const eq2Agreement = finiteNumberOrNull(pathwayConvergenceState?.eq2Agreement)

  const convergenceAngle = finiteNumberOrNull(
    pathwayConvergenceState?.convergenceAngle
  )

  const expectedEq2Agreement =
    convergenceSignalStrength !== null &&
    convergenceIntegrationThreshold !== null &&
    convergenceIntegrationThreshold > 0
      ? convergenceSignalStrength / convergenceIntegrationThreshold
      : null

  const signalStrengthAligned = approximatelyEqual(
    diagnosticSignalStrength,
    convergenceSignalStrength
  )

  const integrationThresholdAligned = approximatelyEqual(
    diagnosticIntegrationThreshold,
    convergenceIntegrationThreshold
  )

  const phaseDivergenceAligned = approximatelyEqual(
    diagnosticPhaseDivergence,
    convergencePhaseDivergence
  )

  const weightedAgreementAligned = approximatelyEqual(
    weightedAgreement,
    convergenceSignalStrength
  )

  const eq2AgreementAligned = approximatelyEqual(
    eq2Agreement,
    expectedEq2Agreement
  )

  const convergenceAngleAligned = approximatelyEqual(
    convergenceAngle,
    convergencePhaseDivergence
  )

  const convergenceMathAligned =
    weightedAgreementAligned && eq2AgreementAligned && convergenceAngleAligned

  const allSourceMetricsAligned =
    signalStrengthAligned &&
    integrationThresholdAligned &&
    phaseDivergenceAligned

  const snapshotReady = Boolean(snapshot?.snapshotReady && equationLaneState)

  const observationStatus = !snapshotReady
    ? "snapshot-incomplete"
    : allSourceMetricsAligned && convergenceMathAligned
      ? "synchronized"
      : "partially-synchronized"

  const observationMeaning =
    observationStatus === "synchronized"
      ? "Equation Lane Diagnostics and Pathway Convergence observed the same authoritative equation state, and the convergence calculations remained consistent with that shared state."
      : observationStatus === "partially-synchronized"
        ? "The observation was generated from one authoritative runtime snapshot, but one or more reported metrics or convergence calculations did not align exactly."
        : "The authoritative runtime snapshot was incomplete, so synchronized observation could not be fully verified."

  return {
    phase: "Runtime Observation Layer",

    observationId: snapshot?.resonanceHash ?? snapshot?.ledgerHash ?? null,

    snapshotReady,

    agentId: snapshot?.agentId ?? null,
    runtimeAgentId: snapshot?.runtimeAgentId ?? null,
    resonanceHash: snapshot?.resonanceHash ?? null,
    ledgerHash: snapshot?.ledgerHash ?? null,

    equationLaneDiagnosticsState,
    pathwayConvergenceState,

    observedMetrics: {
      signalStrength: diagnosticSignalStrength,
      integrationThreshold: diagnosticIntegrationThreshold,
      phaseDivergence: diagnosticPhaseDivergence,
      weightedAgreement,
      eq2Agreement,
      convergenceAngle
    },

    consistency: {
      signalStrengthAligned,
      integrationThresholdAligned,
      phaseDivergenceAligned,
      convergenceMathAligned,
      allSourceMetricsAligned
    },

    observationStatus,
    observationMeaning,
    runtimeObservationLayerActive: true,

    rule: "Runtime Observation is read-only. It must use one authoritative runtime snapshot and must not regenerate resonance state, replace equation metrics, alter hashes, or override downstream classifications."
  }
}

export function buildRuntimeObservationResponse(
  state: RuntimeObservationState,
  mode: RuntimeObservationMode = "summary"
): string {
  if (mode === "json") {
    return JSON.stringify(state, null, 2)
  }

  const metrics = state?.observedMetrics
  const consistency = state?.consistency

  if (mode === "metrics") {
    return [
      "Runtime Observation Metrics:",
      `observationId: ${state.observationId ?? "unknown"}`,
      `signalStrength: ${formatValue(metrics?.signalStrength ?? null)}`,
      `integrationThreshold: ${formatValue(
        metrics?.integrationThreshold ?? null
      )}`,
      `phaseDivergence: ${formatValue(metrics?.phaseDivergence ?? null)}`,
      `weightedAgreement: ${formatValue(metrics?.weightedAgreement ?? null)}`,
      `eq2Agreement: ${formatValue(metrics?.eq2Agreement ?? null)}`,
      `convergenceAngle: ${formatValue(metrics?.convergenceAngle ?? null)}`
    ].join("\n")
  }

  if (mode === "comparison") {
    return [
      "Runtime Observation Comparison:",
      `signalStrengthAligned: ${
        consistency?.signalStrengthAligned ? "true" : "false"
      }`,
      `integrationThresholdAligned: ${
        consistency?.integrationThresholdAligned ? "true" : "false"
      }`,
      `phaseDivergenceAligned: ${
        consistency?.phaseDivergenceAligned ? "true" : "false"
      }`,
      `convergenceMathAligned: ${
        consistency?.convergenceMathAligned ? "true" : "false"
      }`,
      `allSourceMetricsAligned: ${
        consistency?.allSourceMetricsAligned ? "true" : "false"
      }`,
      `observationStatus: ${state.observationStatus}`,
      `meaning: ${state.observationMeaning}`
    ].join("\n")
  }

  return [
    `phase: ${state.phase}`,
    `observationId: ${state.observationId ?? "unknown"}`,
    `snapshotReady: ${state.snapshotReady ? "true" : "false"}`,
    `observationStatus: ${state.observationStatus}`,
    "",
    "Shared Source Metrics:",
    `signalStrength: ${formatValue(metrics?.signalStrength ?? null)}`,
    `integrationThreshold: ${formatValue(
      metrics?.integrationThreshold ?? null
    )}`,
    `phaseDivergence: ${formatValue(metrics?.phaseDivergence ?? null)}`,
    "",
    "Pathway Convergence Metrics:",
    `weightedAgreement: ${formatValue(metrics?.weightedAgreement ?? null)}`,
    `eq2Agreement: ${formatValue(metrics?.eq2Agreement ?? null)}`,
    `convergenceAngle: ${formatValue(metrics?.convergenceAngle ?? null)}`,
    `convergenceStatus: ${
      state?.pathwayConvergenceState?.convergenceStatus ?? "unknown"
    }`,
    `convergenceQualified: ${
      state?.pathwayConvergenceState?.convergenceQualified ? "true" : "false"
    }`,
    "",
    "Synchronization Check:",
    `signalStrengthAligned: ${
      consistency?.signalStrengthAligned ? "true" : "false"
    }`,
    `integrationThresholdAligned: ${
      consistency?.integrationThresholdAligned ? "true" : "false"
    }`,
    `phaseDivergenceAligned: ${
      consistency?.phaseDivergenceAligned ? "true" : "false"
    }`,
    `convergenceMathAligned: ${
      consistency?.convergenceMathAligned ? "true" : "false"
    }`,
    `allSourceMetricsAligned: ${
      consistency?.allSourceMetricsAligned ? "true" : "false"
    }`,
    "",
    `observationMeaning: ${state.observationMeaning}`,
    `runtimeObservationLayerActive: ${
      state.runtimeObservationLayerActive ? "true" : "false"
    }`
  ].join("\n")
}
