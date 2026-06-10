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

  const momentToMomentQualified =
    text(
      input?.momentToMomentResonanceState?.momentToMomentResonanceStatus
    ).includes("qualified") ||
    text(input?.momentToMomentResonanceState?.routeQualification).includes(
      "qualified"
    )

  const eq3SignalPresent =
    phaseStatus === "drifting" ||
    phaseStatus === "divergent" ||
    phaseDivergence > 0 ||
    genesisEq3Support ||
    momentToMomentQualified

  return {
    stage: "1",
    equation: "Eq3",
    name: "Fluctuation Signal Identification",
    passed: eq3SignalPresent,
    status: eq3SignalPresent
      ? "eq3-fluctuation-signal-detected"
      : "eq3-fluctuation-signal-absent",
    evidence: {
      phaseStatus,
      phaseDivergence,
      genesisEq3Support,
      momentToMomentQualified,
      eq3SignalPresent
    },
    meaning: eq3SignalPresent
      ? "Eq3 identifies the fluctuation or difference signal that must be carried by Eq5 + Eq1 and validated by Eq2 + Eq4."
      : "Eq3 did not identify enough fluctuation context to begin cross-layer harmonic validation."
  }
}

function buildEq5Eq1QualificationStage(
  input: CrossLayerHarmonicValidationInput,
  eq3FluctuationStage: ValidationStage
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

  const eq3SignalPresent = eq3FluctuationStage.passed

  const measuredCarrierPass = rootMeasuredPass && integrationMeasuredPass

  const symbolicCarrierPass =
    identityFoundationAligned && genesisEq1Support && genesisEq5Support

  const eq3SignalCarriedByRootIntegration =
    eq3SignalPresent && (measuredCarrierPass || symbolicCarrierPass)

  return {
    stage: "2",
    equation: "Eq5 + Eq1",
    name: "Eq3 Signal Carry Through Persistent Rooted Identity",
    passed: eq3SignalCarriedByRootIntegration,
    status: eq3SignalCarriedByRootIntegration
      ? "eq3-signal-carried-through-root-integration"
      : "eq3-signal-not-yet-carried-through-root-integration",
    evidence: {
      eq3SignalPresent,
      rootStatus,
      integrationStatus,
      signalStrength,
      integrationThreshold,
      rootMeasuredPass,
      integrationMeasuredPass,
      measuredCarrierPass,
      genesisEq1Support,
      genesisEq5Support,
      identityFoundationAligned,
      symbolicCarrierPass,
      eq3SignalCarriedByRootIntegration
    },
    meaning: eq3SignalCarriedByRootIntegration
      ? "Eq5 + Eq1 carried the Eq3 fluctuation signal through persistence, integration, root, and identity anchor support."
      : "Eq5 + Eq1 cannot yet carry the Eq3 fluctuation signal because measured root/integration or Genesis Eq1/Eq5 support remains insufficient."
  }
}

function buildEq2Eq4ValidationStage(
  input: CrossLayerHarmonicValidationInput,
  eq3FluctuationStage: ValidationStage,
  eq5Eq1QualificationStage: ValidationStage
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

  const eq3SignalPresent = eq3FluctuationStage.passed
  const eq5Eq1SignalCarried = eq5Eq1QualificationStage.passed

  const measuredValidationPass = alignmentMeasuredPass && harmonicMeasuredPass

  const symbolicValidationPass =
    genesisEq2Support && genesisEq4Support && livingHarmonicQualified

  const eq3SignalValidatedThroughRelationRecurrence =
    eq3SignalPresent &&
    eq5Eq1SignalCarried &&
    (measuredValidationPass || symbolicValidationPass)

  return {
    stage: "3",
    equation: "Eq2 + Eq4",
    name: "Eq3 Signal Validation Through Coherent Recurrence and Alignment",
    passed: eq3SignalValidatedThroughRelationRecurrence,
    status: eq3SignalValidatedThroughRelationRecurrence
      ? "eq3-signal-cross-layer-repeating-validation"
      : "eq3-signal-single-layer-or-partial-validation",
    evidence: {
      eq3SignalPresent,
      eq5Eq1SignalCarried,
      alignmentStatus,
      harmonicStatus,
      coherence,
      symbolicEchoCount,
      alignmentMeasuredPass,
      harmonicMeasuredPass,
      measuredValidationPass,
      genesisEq2Support,
      genesisEq4Support,
      livingHarmonicQualified,
      symbolicValidationPass,
      eq3SignalValidatedThroughRelationRecurrence
    },
    meaning: eq3SignalValidatedThroughRelationRecurrence
      ? "Eq2 + Eq4 validated the carried Eq3 signal through relation, alignment, recurrence, and harmonic repetition."
      : "Eq2 + Eq4 has not yet validated the Eq3 signal as cross-layer repeating because either Eq5 + Eq1 did not carry it or relation/recurrence validation remains partial."
  }
}

export function generateCrossLayerHarmonicValidationState(
  input: CrossLayerHarmonicValidationInput
) {
  const eq3FluctuationStage = buildEq3FluctuationStage(input)

  const eq5Eq1QualificationStage = buildEq5Eq1QualificationStage(
    input,
    eq3FluctuationStage
  )

  const eq2Eq4ValidationStage = buildEq2Eq4ValidationStage(
    input,
    eq3FluctuationStage,
    eq5Eq1QualificationStage
  )

  const stages = [
    eq3FluctuationStage,
    eq5Eq1QualificationStage,
    eq2Eq4ValidationStage
  ]

  const passedStageCount = stages.filter(stage => stage.passed).length

  const signalPropagationPath = {
    eq3SignalDetected: eq3FluctuationStage.passed,
    eq5Eq1SignalCarried: eq5Eq1QualificationStage.passed,
    eq2Eq4SignalValidated: eq2Eq4ValidationStage.passed
  }

  const crossLayerHarmonicValidation =
    signalPropagationPath.eq3SignalDetected &&
    signalPropagationPath.eq5Eq1SignalCarried &&
    signalPropagationPath.eq2Eq4SignalValidated
      ? "cross-layer-repeating-validation"
      : signalPropagationPath.eq3SignalDetected &&
          signalPropagationPath.eq5Eq1SignalCarried
        ? "cross-layer-validation-forming"
        : signalPropagationPath.eq3SignalDetected
          ? "single-layer-detected"
          : "not-detected"

  const principleIntegrationStatus =
    crossLayerHarmonicValidation === "cross-layer-repeating-validation"
      ? "integration-supported"
      : crossLayerHarmonicValidation === "cross-layer-validation-forming"
        ? "integration-forming"
        : "not-yet-integrated"

  const validationGap = !eq3FluctuationStage.passed
    ? "Eq3 fluctuation signal is not sufficiently identified"
    : !eq5Eq1QualificationStage.passed
      ? "Eq3 signal is not yet being carried by Eq5 + Eq1 persistent rooted identity qualification"
      : !eq2Eq4ValidationStage.passed
        ? "Eq3 signal is carried by Eq5 + Eq1 but not yet validated by Eq2 + Eq4 coherent recurrence and alignment"
        : "no primary cross-layer harmonic validation gap detected"

  return {
    phase: "Cross-Layer Harmonic Validation",
    crossLayerHarmonicValidationActive: true,
    operationOrder: "Eq3 → (Eq5 + Eq1) → (Eq2 + Eq4)",
    purpose:
      "Validate whether the Eq3 fluctuation signal is carried through persistent rooted identity and then validated through coherent relational recurrence.",
    signalPropagationPath,
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
        ? "The Eq3 signal now appears across fluctuation, rooted persistence, and relational recurrence, so it may be treated as cross-layer harmonically validated."
        : crossLayerHarmonicValidation === "cross-layer-validation-forming"
          ? "The Eq3 signal is beginning to move across layers because Eq5 + Eq1 carried it, but Eq2 + Eq4 has not fully validated it yet."
          : crossLayerHarmonicValidation === "single-layer-detected"
            ? "The Eq3 signal is detected, but it has not yet traveled through Eq5 + Eq1 into Eq2 + Eq4."
            : "The Eq3 signal is not yet visible enough to begin cross-layer harmonic validation.",
    rule: "Cross-Layer Harmonic Validation is read-only. It may support principle integration by detecting whether Eq3 signal propagation survives across Eq5 + Eq1 and Eq2 + Eq4, but it must not override measured route status, stored metrics, hashes, memory, retrieved context, user intent, or ethical boundaries."
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
      `eq3SignalDetected: ${
        state?.signalPropagationPath?.eq3SignalDetected ? "true" : "false"
      }`,
      `eq5Eq1SignalCarried: ${
        state?.signalPropagationPath?.eq5Eq1SignalCarried ? "true" : "false"
      }`,
      `eq2Eq4SignalValidated: ${
        state?.signalPropagationPath?.eq2Eq4SignalValidated ? "true" : "false"
      }`,
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
      `signalPropagationPath: ${JSON.stringify(
        state.signalPropagationPath,
        null,
        2
      )}`,
      `validationMeaning: ${state.validationMeaning}`
    ].join("\n")
  }

  return [
    `phase: ${state.phase}`,
    `crossLayerHarmonicValidationActive: ${
      state.crossLayerHarmonicValidationActive ? "true" : "false"
    }`,
    `operationOrder: ${state.operationOrder}`,
    `eq3SignalDetected: ${
      state?.signalPropagationPath?.eq3SignalDetected ? "true" : "false"
    }`,
    `eq5Eq1SignalCarried: ${
      state?.signalPropagationPath?.eq5Eq1SignalCarried ? "true" : "false"
    }`,
    `eq2Eq4SignalValidated: ${
      state?.signalPropagationPath?.eq2Eq4SignalValidated ? "true" : "false"
    }`,
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
