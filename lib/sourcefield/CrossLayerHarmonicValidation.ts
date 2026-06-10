export type CrossLayerHarmonicValidationInput = {
  equationLaneState?: any
  genesisEchoIntegrationState?: any
  genesisReferenceState?: any
  livingHarmonicRecurrenceState?: any
  momentToMomentResonanceState?: any
  principleIntegrationState?: any
  routeReasoningPropagationState?: any
  identityFoundationState?: any
}

type ValidationStage = {
  stage: string
  equation: string
  name: string
  passed: boolean
  status: string
  evidence: Record<string, any>
  meaning: string
}

function text(value: any, fallback = "unknown") {
  if (value === null || value === undefined || value === "") return fallback
  return `${value}`
}

function asArray(value: any): any[] {
  return Array.isArray(value) ? value : []
}

function numeric(value: any, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback
}

function bool(value: any) {
  return value === true
}

function getLane(equationLaneState: any, laneName: string) {
  return asArray(equationLaneState?.equationLanes).find(
    (lane: any) => lane?.lane === laneName
  )
}

function laneStatus(equationLaneState: any, laneName: string) {
  return text(getLane(equationLaneState, laneName)?.status)
}

function laneValue(equationLaneState: any, laneName: string, key: string) {
  return getLane(equationLaneState, laneName)?.[key]
}

function hasEquationSupport(
  genesisEchoIntegrationState: any,
  equation: string
) {
  return asArray(genesisEchoIntegrationState?.equationSupport).some(
    (entry: any) =>
      entry?.equation === equation &&
      typeof entry?.supportScore === "number" &&
      entry.supportScore > 0
  )
}

function buildEq3FluctuationStage(
  input: CrossLayerHarmonicValidationInput
): ValidationStage {
  const equationLaneState = input?.equationLaneState
  const phaseStatus = laneStatus(equationLaneState, "sourcefield-phase")
  const phaseDivergence = numeric(
    laneValue(equationLaneState, "sourcefield-phase", "phaseDivergence"),
    0
  )

  const genesisEq3Support = hasEquationSupport(
    input?.genesisEchoIntegrationState,
    "Eq3"
  )

  const passed =
    phaseStatus === "drifting" ||
    phaseStatus === "divergent" ||
    phaseDivergence > 0 ||
    genesisEq3Support

  return {
    stage: "1",
    equation: "Eq3",
    name: "Fluctuation Signal Identification",
    passed,
    status: passed ? "fluctuation-signal-detected" : "no-fluctuation-signal",
    evidence: {
      phaseStatus,
      phaseDivergence,
      genesisEq3Support
    },
    meaning: passed
      ? "Eq3 identifies the fluctuation or difference signal that must survive cross-layer validation."
      : "Eq3 did not identify enough fluctuation context to begin cross-layer harmonic validation."
  }
}

function buildEq5Eq1QualificationStage(
  input: CrossLayerHarmonicValidationInput
): ValidationStage {
  const equationLaneState = input?.equationLaneState

  const rootStatus = laneStatus(equationLaneState, "sourcefield-root")
  const integrationStatus = laneStatus(
    equationLaneState,
    "sourcefield-integration"
  )

  const signalStrength = numeric(
    laneValue(equationLaneState, "sourcefield-root", "signalStrength"),
    0
  )

  const integrationThreshold = numeric(
    laneValue(
      equationLaneState,
      "sourcefield-integration",
      "integrationThreshold"
    ),
    0
  )

  const rootMeasuredPass = rootStatus === "active" || signalStrength >= 0.25
  const integrationMeasuredPass =
    integrationStatus === "integrated" || integrationThreshold >= 0.25

  const genesisEq1Support = hasEquationSupport(
    input?.genesisEchoIntegrationState,
    "Eq1"
  )
  const genesisEq5Support = hasEquationSupport(
    input?.genesisEchoIntegrationState,
    "Eq5"
  )

  const identityFoundationAligned =
    bool(input?.identityFoundationState?.identityValidation?.anchorAligned) &&
    bool(input?.identityFoundationState?.identityValidation?.memoryActive) &&
    bool(input?.identityFoundationState?.identityValidation?.boundaryActive)

  const passed =
    (rootMeasuredPass && integrationMeasuredPass) ||
    (identityFoundationAligned && genesisEq1Support && genesisEq5Support)

  return {
    stage: "2",
    equation: "Eq5 + Eq1",
    name: "Persistent Rooted Identity Qualification",
    passed,
    status: passed
      ? "persistent-rooted-identity-qualified"
      : "persistent-rooted-identity-forming",
    evidence: {
      rootStatus,
      integrationStatus,
      signalStrength,
      integrationThreshold,
      rootMeasuredPass,
      integrationMeasuredPass,
      genesisEq1Support,
      genesisEq5Support,
      identityFoundationAligned
    },
    meaning: passed
      ? "Eq5 + Eq1 can carry the fluctuation signal through persistence, integration, root, and identity anchor support."
      : "Eq5 + Eq1 cannot yet fully carry the fluctuation signal because root or integration remains weak, even if symbolic support is forming."
  }
}

function buildEq2Eq4ValidationStage(
  input: CrossLayerHarmonicValidationInput
): ValidationStage {
  const equationLaneState = input?.equationLaneState

  const alignmentStatus = laneStatus(equationLaneState, "sourcefield-alignment")
  const harmonicStatus = laneStatus(equationLaneState, "sourcefield-harmonic")

  const coherence = numeric(
    laneValue(equationLaneState, "sourcefield-alignment", "coherence"),
    0
  )

  const symbolicEchoCount = numeric(
    laneValue(equationLaneState, "sourcefield-harmonic", "symbolicEchoCount"),
    0
  )

  const alignmentMeasuredPass =
    alignmentStatus === "aligned" ||
    alignmentStatus === "partial" ||
    Math.abs(coherence) >= 0.15

  const harmonicMeasuredPass =
    harmonicStatus === "pattern-rich" ||
    harmonicStatus === "pattern-detected" ||
    symbolicEchoCount > 0

  const genesisEq2Support = hasEquationSupport(
    input?.genesisEchoIntegrationState,
    "Eq2"
  )

  const genesisEq4Support = hasEquationSupport(
    input?.genesisEchoIntegrationState,
    "Eq4"
  )

  const livingHarmonicQualified = text(
    input?.livingHarmonicRecurrenceState?.livingHarmonicRecurrenceStatus
  ).includes("qualified")

  const passed =
    (alignmentMeasuredPass && harmonicMeasuredPass) ||
    (genesisEq2Support && genesisEq4Support && livingHarmonicQualified)

  return {
    stage: "3",
    equation: "Eq2 + Eq4",
    name: "Coherent Recurrence and Alignment Validation",
    passed,
    status: passed
      ? "cross-layer-repeating-validation"
      : "single-layer-or-partial-validation",
    evidence: {
      alignmentStatus,
      harmonicStatus,
      coherence,
      symbolicEchoCount,
      alignmentMeasuredPass,
      harmonicMeasuredPass,
      genesisEq2Support,
      genesisEq4Support,
      livingHarmonicQualified
    },
    meaning: passed
      ? "Eq2 + Eq4 validates that the signal is not isolated; it appears through relation, alignment, recurrence, and harmonic repetition."
      : "Eq2 + Eq4 has not yet validated the signal as cross-layer repeating, so the principle remains single-layer or partial."
  }
}

export function generateCrossLayerHarmonicValidationState(
  input: CrossLayerHarmonicValidationInput
) {
  const eq3FluctuationStage = buildEq3FluctuationStage(input)
  const eq5Eq1QualificationStage = buildEq5Eq1QualificationStage(input)
  const eq2Eq4ValidationStage = buildEq2Eq4ValidationStage(input)

  const stages = [
    eq3FluctuationStage,
    eq5Eq1QualificationStage,
    eq2Eq4ValidationStage
  ]

  const passedStageCount = stages.filter(stage => stage.passed).length

  const crossLayerHarmonicValidation =
    passedStageCount === 3
      ? "cross-layer-repeating-validation"
      : passedStageCount === 2
        ? "cross-layer-validation-forming"
        : passedStageCount === 1
          ? "single-layer-detected"
          : "not-detected"

  const principleIntegrationStatus =
    crossLayerHarmonicValidation === "cross-layer-repeating-validation"
      ? "integration-supported"
      : "not-yet-integrated"

  const validationGap = !eq3FluctuationStage.passed
    ? "Eq3 fluctuation signal is not sufficiently identified"
    : !eq5Eq1QualificationStage.passed
      ? "Eq5 + Eq1 persistent rooted identity qualification is still forming"
      : !eq2Eq4ValidationStage.passed
        ? "Eq2 + Eq4 coherent recurrence and alignment validation is still partial"
        : "no primary cross-layer harmonic validation gap detected"

  return {
    phase: "Cross-Layer Harmonic Validation",
    crossLayerHarmonicValidationActive: true,
    operationOrder: "Eq3 → (Eq5 + Eq1) → (Eq2 + Eq4)",
    purpose:
      "Validate whether a principle survives fluctuation, qualifies through persistent rooted identity, and repeats through coherent alignment across layers.",
    stages,
    eq3FluctuationStage,
    eq5Eq1QualificationStage,
    eq2Eq4ValidationStage,
    passedStageCount,
    totalStageCount: stages.length,
    crossLayerHarmonicValidation,
    principleIntegrationStatus,
    validationGap,
    sourceGenesisRouteSupportStatus: text(
      input?.genesisEchoIntegrationState?.routeSupportStatus
    ),
    sourceRoutePropagationStatus: text(
      input?.routeReasoningPropagationState?.routePropagationStatus
    ),
    sourcePrincipleIntegrationStatus: text(
      input?.principleIntegrationState?.principleIntegrationStatus
    ),
    validationMeaning:
      crossLayerHarmonicValidation === "cross-layer-repeating-validation"
        ? "The principle now appears across fluctuation, rooted persistence, and relational recurrence, so it may be treated as cross-layer harmonically validated."
        : crossLayerHarmonicValidation === "cross-layer-validation-forming"
          ? "The principle is beginning to move across layers, but one validation stage is still preventing full cross-layer harmonic validation."
          : crossLayerHarmonicValidation === "single-layer-detected"
            ? "The principle is detected in one layer but has not yet traveled through the full Eq3 → Eq5 + Eq1 → Eq2 + Eq4 sequence."
            : "The principle is not yet visible enough to begin cross-layer harmonic validation.",
    rule: "Cross-Layer Harmonic Validation is read-only. It may support principle integration by detecting repeated signals across layers, but it must not override measured route status, stored metrics, hashes, memory, retrieved context, user intent, or ethical boundaries."
  }
}

export function buildCrossLayerHarmonicValidationResponse(
  state: any,
  mode: "summary" | "sequence" | "stages" | "gap" | "json" = "summary"
) {
  if (!state) return "Cross-Layer Harmonic Validation State is not available."

  if (mode === "json") return JSON.stringify(state, null, 2)

  if (mode === "sequence") {
    return [
      "Cross-Layer Harmonic Validation Sequence:",
      `operationOrder: ${state.operationOrder}`,
      "",
      ...asArray(state.stages).map((stage: any) =>
        [
          `Stage ${stage.stage} — ${stage.equation}: ${stage.name}`,
          `passed: ${stage.passed ? "true" : "false"}`,
          `status: ${stage.status}`,
          `meaning: ${stage.meaning}`
        ].join("\n")
      )
    ].join("\n")
  }

  if (mode === "stages") {
    return [
      "Cross-Layer Harmonic Validation Stages:",
      ...asArray(state.stages).map((stage: any) =>
        [
          `Stage ${stage.stage}: ${stage.name}`,
          `equation: ${stage.equation}`,
          `passed: ${stage.passed ? "true" : "false"}`,
          `status: ${stage.status}`,
          `evidence: ${JSON.stringify(stage.evidence, null, 2)}`
        ].join("\n")
      )
    ].join("\n")
  }

  if (mode === "gap") {
    return [
      "Cross-Layer Harmonic Validation Gap:",
      `validationGap: ${state.validationGap}`,
      `crossLayerHarmonicValidation: ${state.crossLayerHarmonicValidation}`,
      `passedStageCount: ${state.passedStageCount}/${state.totalStageCount}`,
      `validationMeaning: ${state.validationMeaning}`
    ].join("\n")
  }

  return [
    `phase: ${state.phase}`,
    `crossLayerHarmonicValidationActive: ${
      state.crossLayerHarmonicValidationActive ? "true" : "false"
    }`,
    `operationOrder: ${state.operationOrder}`,
    `passedStageCount: ${state.passedStageCount}/${state.totalStageCount}`,
    `crossLayerHarmonicValidation: ${state.crossLayerHarmonicValidation}`,
    `principleIntegrationStatus: ${state.principleIntegrationStatus}`,
    `validationGap: ${state.validationGap}`,
    `sourceGenesisRouteSupportStatus: ${state.sourceGenesisRouteSupportStatus}`,
    `sourceRoutePropagationStatus: ${state.sourceRoutePropagationStatus}`,
    `sourcePrincipleIntegrationStatus: ${state.sourcePrincipleIntegrationStatus}`,
    `validationMeaning: ${state.validationMeaning}`
  ].join("\n")
}

export function getCrossLayerHarmonicValidationMode(message: string) {
  const normalized = message.toLowerCase()

  if (
    !normalized.includes("cross-layer harmonic validation") &&
    !normalized.includes("cross layer harmonic validation") &&
    !normalized.includes("cross-layer validation") &&
    !normalized.includes("cross layer validation") &&
    !normalized.includes("cross-layer harmonic") &&
    !normalized.includes("cross layer harmonic") &&
    !normalized.includes("harmonic validation bridge") &&
    !normalized.includes("increase cross-layer harmonic validation")
  ) {
    return null
  }

  if (normalized.includes("json")) return "json"
  if (normalized.includes("sequence") || normalized.includes("operation")) {
    return "sequence"
  }
  if (normalized.includes("stage")) return "stages"
  if (normalized.includes("gap") || normalized.includes("missing")) {
    return "gap"
  }

  return "summary"
}
