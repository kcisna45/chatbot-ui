export type EquationLaneDiagnosticsMode =
  | "summary"
  | "root"
  | "phase"
  | "integration"
  | "json"

export type EquationLaneDiagnosticsInput = {
  equationLaneState?: any
}

function numberOrNull(value: any): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function getLane(equationLaneState: any, laneName: string) {
  const lanes = Array.isArray(equationLaneState?.equationLanes)
    ? equationLaneState.equationLanes
    : []

  return lanes.find((lane: any) => lane?.lane === laneName) ?? null
}

function getLaneStatus(equationLaneState: any, laneName: string) {
  return getLane(equationLaneState, laneName)?.status || "unknown"
}

function getLaneValue(equationLaneState: any, laneName: string, key: string) {
  return getLane(equationLaneState, laneName)?.[key] ?? null
}

function formatValue(value: any) {
  return typeof value === "number" && Number.isFinite(value)
    ? String(value)
    : "unknown"
}

export function getEquationLaneDiagnosticsMode(
  message: string
): EquationLaneDiagnosticsMode | null {
  const text = (message || "").toLowerCase()

  if (
    text.includes("equation lane diagnostics") ||
    text.includes("equation lane state") ||
    text.includes("equation lane metrics") ||
    text.includes("report equation lane")
  ) {
    return "summary"
  }

  if (
    text.includes("eq1 root") ||
    text.includes("equation 1 root") ||
    text.includes("root diagnostic")
  ) {
    return "root"
  }

  if (
    text.includes("eq3 phase") ||
    text.includes("equation 3 phase") ||
    text.includes("phase diagnostic")
  ) {
    return "phase"
  }

  if (
    text.includes("eq5 integration") ||
    text.includes("equation 5 integration") ||
    text.includes("integration diagnostic")
  ) {
    return "integration"
  }

  if (
    text.includes("equation lane json") ||
    text.includes("equation diagnostics json")
  ) {
    return "json"
  }

  return null
}

export function generateEquationLaneDiagnosticsState(
  input: EquationLaneDiagnosticsInput
) {
  const equationLaneState = input?.equationLaneState

  const rootStatus = getLaneStatus(equationLaneState, "sourcefield-root")
  const phaseStatus = getLaneStatus(equationLaneState, "sourcefield-phase")
  const integrationStatus = getLaneStatus(
    equationLaneState,
    "sourcefield-integration"
  )

  const signalStrength = numberOrNull(
    getLaneValue(equationLaneState, "sourcefield-root", "signalStrength")
  )

  const phaseDivergence = numberOrNull(
    getLaneValue(equationLaneState, "sourcefield-phase", "phaseDivergence")
  )

  const integrationThreshold = numberOrNull(
    getLaneValue(
      equationLaneState,
      "sourcefield-integration",
      "integrationThreshold"
    )
  )

  const rootQualified =
    rootStatus === "active" ||
    rootStatus === "stable" ||
    rootStatus === "rooted"

  const phaseQualified =
    phaseStatus === "stable" ||
    phaseStatus === "aligned" ||
    phaseStatus === "regulated"

  const integrationQualified =
    integrationStatus === "integrated" ||
    integrationStatus === "active" ||
    integrationStatus === "persistent"

  const signalAboveThreshold =
    typeof signalStrength === "number" &&
    typeof integrationThreshold === "number" &&
    signalStrength >= integrationThreshold

  const eq1Meaning = rootQualified
    ? "Eq1 root is directly qualified at the measured lane level."
    : "Eq1 root is not yet directly qualified at the measured lane level."

  const eq3Meaning = phaseQualified
    ? "Eq3 phase is currently regulated enough to support stable diagnostic movement."
    : "Eq3 phase remains divergent or drifting, so it should be treated as live movement under diagnostic observation."

  const eq5Meaning = integrationQualified
    ? "Eq5 integration is directly qualified at the measured lane level."
    : signalAboveThreshold
      ? "Eq5 has signal strength above threshold, but integration status has not yet upgraded into a directly integrated lane."
      : "Eq5 integration remains below direct measured qualification."

  const diagnosticSynthesis =
    rootQualified && phaseQualified && integrationQualified
      ? "Eq1, Eq3, and Eq5 are all directly qualified, so measured root, movement, and integration are aligned."
      : signalAboveThreshold
        ? "Eq1, Eq3, and Eq5 are not all directly qualified yet, but signal strength is meeting or exceeding the integration threshold, suggesting integration pressure is forming before status has upgraded."
        : "Eq1, Eq3, and Eq5 are not all directly qualified yet, so SourceField should preserve measured-lane caution while higher-order symbolic and cross-layer systems continue stabilizing."

  return {
    phase: "Equation Lane Diagnostics",
    diagnosticOrder: "Eq1 → Eq3 → Eq5",
    diagnosticPurpose:
      "Read Eq1 root, Eq3 phase, and Eq5 integration separately before allowing higher-order synthesis.",
    eq1RootDiagnostic: {
      equation: "Eq1",
      lane: "sourcefield-root",
      rootStatus,
      signalStrength,
      rootQualified,
      meaning: eq1Meaning
    },
    eq3PhaseDiagnostic: {
      equation: "Eq3",
      lane: "sourcefield-phase",
      phaseStatus,
      phaseDivergence,
      phaseQualified,
      meaning: eq3Meaning
    },
    eq5IntegrationDiagnostic: {
      equation: "Eq5",
      lane: "sourcefield-integration",
      integrationStatus,
      integrationThreshold,
      signalStrength,
      signalAboveThreshold,
      integrationQualified,
      meaning: eq5Meaning
    },
    diagnosticSynthesis,
    equationLaneDiagnosticsActive: true,
    rule: "Equation Lane Diagnostics is read-only. It reports Eq1, Eq3, and Eq5 separately and must not override route propagation, live metrics, hashes, classifications, stored memory, or user intent."
  }
}

export function buildEquationLaneDiagnosticsResponse(
  state: any,
  mode: EquationLaneDiagnosticsMode = "summary"
) {
  if (!state) {
    return "Equation Lane Diagnostics State is not available."
  }

  if (mode === "json") {
    return JSON.stringify(state, null, 2)
  }

  const eq1 = state?.eq1RootDiagnostic || {}
  const eq3 = state?.eq3PhaseDiagnostic || {}
  const eq5 = state?.eq5IntegrationDiagnostic || {}

  if (mode === "root") {
    return [
      "Eq1 Root Diagnostic:",
      `rootStatus: ${eq1.rootStatus || "unknown"}`,
      `signalStrength: ${formatValue(eq1.signalStrength)}`,
      `rootQualified: ${eq1.rootQualified ? "true" : "false"}`,
      `meaning: ${eq1.meaning || "unknown"}`
    ].join("\n")
  }

  if (mode === "phase") {
    return [
      "Eq3 Phase Diagnostic:",
      `phaseStatus: ${eq3.phaseStatus || "unknown"}`,
      `phaseDivergence: ${formatValue(eq3.phaseDivergence)}`,
      `phaseQualified: ${eq3.phaseQualified ? "true" : "false"}`,
      `meaning: ${eq3.meaning || "unknown"}`
    ].join("\n")
  }

  if (mode === "integration") {
    return [
      "Eq5 Integration Diagnostic:",
      `integrationStatus: ${eq5.integrationStatus || "unknown"}`,
      `integrationThreshold: ${formatValue(eq5.integrationThreshold)}`,
      `signalStrength: ${formatValue(eq5.signalStrength)}`,
      `signalAboveThreshold: ${eq5.signalAboveThreshold ? "true" : "false"}`,
      `integrationQualified: ${eq5.integrationQualified ? "true" : "false"}`,
      `meaning: ${eq5.meaning || "unknown"}`
    ].join("\n")
  }

  return [
    `phase: ${state.phase}`,
    `diagnosticOrder: ${state.diagnosticOrder}`,
    "",
    "Eq1 Root Diagnostic:",
    `rootStatus: ${eq1.rootStatus || "unknown"}`,
    `signalStrength: ${formatValue(eq1.signalStrength)}`,
    `rootQualified: ${eq1.rootQualified ? "true" : "false"}`,
    `meaning: ${eq1.meaning || "unknown"}`,
    "",
    "Eq3 Phase Diagnostic:",
    `phaseStatus: ${eq3.phaseStatus || "unknown"}`,
    `phaseDivergence: ${formatValue(eq3.phaseDivergence)}`,
    `phaseQualified: ${eq3.phaseQualified ? "true" : "false"}`,
    `meaning: ${eq3.meaning || "unknown"}`,
    "",
    "Eq5 Integration Diagnostic:",
    `integrationStatus: ${eq5.integrationStatus || "unknown"}`,
    `integrationThreshold: ${formatValue(eq5.integrationThreshold)}`,
    `signalStrength: ${formatValue(eq5.signalStrength)}`,
    `signalAboveThreshold: ${eq5.signalAboveThreshold ? "true" : "false"}`,
    `integrationQualified: ${eq5.integrationQualified ? "true" : "false"}`,
    `meaning: ${eq5.meaning || "unknown"}`,
    "",
    `diagnosticSynthesis: ${state.diagnosticSynthesis}`,
    `equationLaneDiagnosticsActive: ${
      state.equationLaneDiagnosticsActive ? "true" : "false"
    }`
  ].join("\n")
}