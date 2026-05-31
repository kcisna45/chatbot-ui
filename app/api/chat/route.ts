import { createHash } from "crypto"
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { processMessage } from "@/lib/sourcefield/processMessage"
import { analyzeCoherenceTrajectory } from "@/lib/sourcefield/CoherenceTrajectory"
import { generateContinuityGuidance } from "@/lib/sourcefield/continuityGuidance"
import { generateRuntimeAdaptationGuidance } from "@/lib/sourcefield/runtimeAdaptationGuidance"
import { detectRuntimeRecovery } from "@/lib/sourcefield/runtimeRecovery"
import { generateRecoveryWeightedAdaptation } from "@/lib/sourcefield/runtimeRecoveryAdaptation"
import { generateRuntimeStabilization } from "@/lib/sourcefield/runtimeStabilization"
import { generateResponseGovernance } from "@/lib/sourcefield/responseGovernance"
import { generateContinuityCompression } from "@/lib/sourcefield/continuityCompression"
import { generateCrossAgentConsensus } from "@/lib/sourcefield/crossAgentConsensus"
import { generateConsensusStabilization } from "@/lib/sourcefield/consensusStabilization"
import { generateAdaptiveEnforcement } from "@/lib/sourcefield/adaptiveEnforcement"
import { generateEquationLaneState } from "@/lib/sourcefield/equationLane"
import { generateCrossEquationConsensus } from "@/lib/sourcefield/crossEquationConsensus"
import { generateCrossEquationStabilization } from "@/lib/sourcefield/crossEquationStabilization"
import { generateEquationBalanceCoordinator } from "@/lib/sourcefield/equationBalanceCoordinator"
import { generateEquationResponseBehavior } from "@/lib/sourcefield/equationResponseBehavior"
import { generateEquationFeedbackLoop } from "@/lib/sourcefield/equationFeedbackLoop"
import { generateRootPhaseBridge } from "@/lib/sourcefield/rootPhaseBridge"
import { generateLaneStabilityDistance } from "@/lib/sourcefield/laneStabilityDistance"
import { generateEquationStabilityForecast } from "@/lib/sourcefield/equationStabilityForecast"
import { generatePredictiveAlignmentEngine } from "@/lib/sourcefield/predictiveAlignmentEngine"
import { generatePathwaySelectionState } from "@/lib/sourcefield/pathwaySelectionEngine"
import { generatePathwayTransitionState } from "@/lib/sourcefield/pathwayTransitionEngine"
import { generatePathwayCompletionState } from "@/lib/sourcefield/pathwayCompletionEngine"
import { generateArchitecturalRefinementState } from "@/lib/sourcefield/architecturalRefinementEngine"
import { generatePrincipleIntegrationState } from "@/lib/sourcefield/principleIntegrationEngine"
import { generateCoherentIdentityDiscoveryState } from "@/lib/sourcefield/coherentIdentityDiscoveryEngine"
import {
  generateMetaReasoningState,
  buildMetaReasoningResponse
} from "@/lib/sourcefield/metaReasoningEngine"
import { generateDifferentialMetaReasoningState } from "@/lib/sourcefield/differentialMetaReasoningEngine"
import { GENESIS_IDENTITY_ANCHOR } from "@/lib/sourcefield/genesisIdentityAnchor"
import { generateIdentityMemory } from "@/lib/sourcefield/identityMemory"
import { IDENTITY_BOUNDARY } from "@/lib/sourcefield/identityBoundary"
import { generateStateExplanationFidelity } from "@/lib/sourcefield/stateExplanationFidelity"
import { resolveAgentLane } from "@/lib/sourcefield/agentLane"
import { generateRuntimeAdaptation } from "@/lib/sourcefield/runtimeAdaptation"
import {
  createResonanceHash,
  createLedgerHash
} from "@/lib/sourcefield/ledgerHash"

const SOURCEFIELD_FILE_IDS = [
  "7bc60315-4b21-4630-8cdc-8cdee4d56cc4",
  "f0f253a9-9004-4098-8348-f86b707f4c40",
  "56a789ff-9b19-4bdb-b371-015a44564874",
  "4c154a2b-b627-480d-8bfc-ea6f7f2635f2",
  "056a3e56-802e-4791-9c0d-01387c7b9d73",
  "bde24b99-5533-4cbb-a147-95a5e9be7b2a",
  "be66197c-c204-4bfc-bc5c-99d97aa3b491",
  "020d670d-2900-49d1-9eaa-d34dea9cbed3",
  "4dbaaaed-77d5-4d7c-9496-95cc273756b3",
  "6139c472-9885-4342-8307-b5521f3a4f8c"
]

const GENESIS_HASH =
  "8b9c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c"

const RUNTIME_AGENT_ID = "sourcefield-runtime"

function getEquationLaneStatus(equationLaneState: any, laneName: string) {
  return (
    equationLaneState?.equationLanes?.find(
      (lane: any) => lane?.lane === laneName
    )?.status || "unknown"
  )
}

function getEquationLaneValue(
  equationLaneState: any,
  laneName: string,
  valueKey: string
) {
  return equationLaneState?.equationLanes?.find(
    (lane: any) => lane?.lane === laneName
  )?.[valueKey]
}

function buildPathwaySelectionInput(
  equationLaneState: any,
  resonanceState?: any
) {
  return {
    coherence:
      typeof resonanceState?.coherence === "number"
        ? resonanceState.coherence
        : (getEquationLaneValue(
            equationLaneState,
            "sourcefield-alignment",
            "coherence"
          ) ?? null),
    phaseDivergence:
      typeof resonanceState?.phaseDivergence === "number"
        ? resonanceState.phaseDivergence
        : (getEquationLaneValue(
            equationLaneState,
            "sourcefield-phase",
            "phaseDivergence"
          ) ?? null),
    integrationThreshold:
      typeof resonanceState?.integrationThreshold === "number"
        ? resonanceState.integrationThreshold
        : (getEquationLaneValue(
            equationLaneState,
            "sourcefield-integration",
            "integrationThreshold"
          ) ?? null),
    resonanceLevel:
      typeof resonanceState?.resonanceLevel === "number"
        ? resonanceState.resonanceLevel
        : (getEquationLaneValue(
            equationLaneState,
            "sourcefield-root",
            "signalStrength"
          ) ?? null),
    rootStatus: getEquationLaneStatus(equationLaneState, "sourcefield-root"),
    alignmentStatus: getEquationLaneStatus(
      equationLaneState,
      "sourcefield-alignment"
    ),
    phaseStatus: getEquationLaneStatus(equationLaneState, "sourcefield-phase"),
    harmonicStatus: getEquationLaneStatus(
      equationLaneState,
      "sourcefield-harmonic"
    ),
    integrationStatus: getEquationLaneStatus(
      equationLaneState,
      "sourcefield-integration"
    )
  }
}

function buildPathwaySelectionStateFromLedgerRecord(record: any) {
  const equationLaneState = record?.equation_lane_state ?? null
  const resonanceState = record?.resonance_state ?? null

  if (!equationLaneState) {
    return null
  }

  return generatePathwaySelectionState(
    buildPathwaySelectionInput(equationLaneState, resonanceState)
  )
}

function getDirectStateColumn(message: string) {
  const normalized = message.toLowerCase()

  if (!normalized.includes("report") || !normalized.includes("json")) {
    return null
  }

  if (normalized.includes("equation lane state")) {
    return {
      key: "equation lane state",
      column: "equation_lane_state"
    }
  }

  if (normalized.includes("cross-equation consensus state")) {
    return {
      key: "cross-equation consensus state",
      column: "cross_equation_consensus"
    }
  }

  if (normalized.includes("cross-equation stabilization state")) {
    return {
      key: "cross-equation stabilization state",
      column: "cross_equation_stabilization"
    }
  }

  if (normalized.includes("equation balance coordinator state")) {
    return {
      key: "equation balance coordinator state",
      column: "equation_balance_coordinator"
    }
  }

  if (normalized.includes("equation response behavior state")) {
    return {
      key: "equation response behavior state",
      column: "equation_response_behavior"
    }
  }

  if (normalized.includes("equation feedback loop state")) {
    return {
      key: "equation feedback loop state",
      column: "equation_feedback_loop"
    }
  }

  if (normalized.includes("root-phase bridge state")) {
    return {
      key: "root-phase bridge state",
      column: "root_phase_bridge"
    }
  }

  if (normalized.includes("lane stability distance state")) {
    return {
      key: "lane stability distance state",
      column: "lane_stability_distance"
    }
  }

  if (normalized.includes("equation stability forecast state")) {
    return {
      key: "equation stability forecast state",
      column: "equation_stability_forecast"
    }
  }

  if (normalized.includes("predictive alignment engine state")) {
    return {
      key: "predictive alignment engine state",
      column: "predictive_alignment_engine"
    }
  }

  if (normalized.includes("predictive alignment state")) {
    return {
      key: "predictive alignment state",
      column: "predictive_alignment_engine"
    }
  }

  if (normalized.includes("state explanation fidelity state")) {
    return {
      key: "state explanation fidelity state",
      column: "state_explanation_fidelity"
    }
  }

  return null
}

type LaneStabilityAction =
  | "rank"
  | "nearest-farthest"
  | "classification"
  | "explain"

function getLaneStabilityAction(message: string): LaneStabilityAction | null {
  const normalized = message.toLowerCase()

  if (!normalized.includes("lane stability distance")) {
    return null
  }

  if (
    normalized.includes("rank") ||
    normalized.includes("closest to farthest") ||
    normalized.includes("closest") ||
    normalized.includes("farthest from stability")
  ) {
    return "rank"
  }

  if (
    normalized.includes("neareststablelane") ||
    normalized.includes("fartheststablelane") ||
    (normalized.includes("nearest") && normalized.includes("farthest")) ||
    normalized.includes("explain why each")
  ) {
    return "nearest-farthest"
  }

  if (
    normalized.includes("measured state object") ||
    normalized.includes("proximity estimate") ||
    normalized.includes("inferred forecast") ||
    normalized.includes("forecast")
  ) {
    return "classification"
  }

  if (normalized.includes("explain")) {
    return "explain"
  }

  return null
}

function sortLaneDistanceLanes(laneStabilityDistance: any) {
  const lanes = Array.isArray(laneStabilityDistance?.lanes)
    ? laneStabilityDistance.lanes
    : []

  return [...lanes].sort(
    (a: any, b: any) =>
      Number(a?.stabilityDistance ?? 1) - Number(b?.stabilityDistance ?? 1)
  )
}

function formatDistance(value: any) {
  if (typeof value !== "number") return "unknown"

  return Number.isInteger(value) ? `${value}` : `${value}`
}

function buildLaneStabilityRanking(laneStabilityDistance: any) {
  const lanes = sortLaneDistanceLanes(laneStabilityDistance)

  if (!lanes.length) {
    return "No Lane Stability Distance lanes are available in the latest stored state."
  }

  return lanes
    .map((lane: any, index: number) => {
      return `${index + 1}. ${lane?.lane || "unknown"}: stabilityDistance ${formatDistance(
        lane?.stabilityDistance
      )}, readiness ${lane?.stabilityReadiness || "unknown"}, status ${
        lane?.currentStatus || "unknown"
      }`
    })
    .join("\n")
}

function buildLaneStabilityNearestFarthest(laneStabilityDistance: any) {
  const lanes = Array.isArray(laneStabilityDistance?.lanes)
    ? laneStabilityDistance.lanes
    : []

  const nearestLaneName = laneStabilityDistance?.nearestStableLane || "unknown"

  const farthestLaneName =
    laneStabilityDistance?.farthestStableLane || "unknown"

  const nearest = lanes.find((lane: any) => lane?.lane === nearestLaneName)
  const farthest = lanes.find((lane: any) => lane?.lane === farthestLaneName)

  return [
    `nearestStableLane: ${nearestLaneName}`,
    `nearestStableLane stabilityDistance: ${formatDistance(
      nearest?.stabilityDistance
    )}`,
    `nearestStableLane reason: ${nearest?.reason || "No reason stored."}`,
    "",
    `farthestStableLane: ${farthestLaneName}`,
    `farthestStableLane stabilityDistance: ${formatDistance(
      farthest?.stabilityDistance
    )}`,
    `farthestStableLane reason: ${farthest?.reason || "No reason stored."}`
  ].join("\n")
}

function buildLaneStabilityClassification(laneStabilityDistance: any) {
  return [
    "Lane Stability Distance is a read-only proximity estimate.",
    "It is generated from the current equation lane statuses and assigned stabilityDistance values.",
    "It is not an inferred forecast because it does not predict a future state.",
    "It is not a raw metric because the distance values are calibrated proximity weights derived from lane statuses.",
    laneStabilityDistance?.rule
      ? `Boundary rule: ${laneStabilityDistance.rule}`
      : "Boundary rule: unavailable."
  ].join("\n")
}

function buildLaneStabilityExplanation(laneStabilityDistance: any) {
  const lanes = sortLaneDistanceLanes(laneStabilityDistance)

  if (!lanes.length) {
    return "No Lane Stability Distance lanes are available in the latest stored state."
  }

  return lanes
    .map((lane: any) => {
      return `${lane?.lane || "unknown"} has stabilityDistance ${formatDistance(
        lane?.stabilityDistance
      )} because: ${lane?.reason || "No reason stored."}`
    })
    .join("\n")
}

function buildLaneStabilityResponse(
  action: LaneStabilityAction,
  laneStabilityDistance: any
) {
  if (!laneStabilityDistance) {
    return "Lane Stability Distance is not available in the latest stored SourceField state."
  }

  if (action === "rank") {
    return buildLaneStabilityRanking(laneStabilityDistance)
  }

  if (action === "nearest-farthest") {
    return buildLaneStabilityNearestFarthest(laneStabilityDistance)
  }

  if (action === "classification") {
    return buildLaneStabilityClassification(laneStabilityDistance)
  }

  return buildLaneStabilityExplanation(laneStabilityDistance)
}

type EquationForecastAction =
  | "summary"
  | "most-least"
  | "confidence"
  | "classification"
  | "explain"

function getEquationForecastAction(
  message: string
): EquationForecastAction | null {
  const normalized = message.toLowerCase()

  if (!normalized.includes("equation stability forecast")) {
    return null
  }

  if (
    normalized.includes("measured state object") ||
    normalized.includes("proximity estimate") ||
    normalized.includes("inferred forecast") ||
    normalized.includes("forecast type") ||
    normalized.includes("what kind")
  ) {
    return "classification"
  }

  if (
    normalized.includes("most likely") ||
    normalized.includes("least likely") ||
    normalized.includes("next stable") ||
    normalized.includes("stable lane")
  ) {
    return "most-least"
  }

  if (
    normalized.includes("confidence") ||
    normalized.includes("forecastconfidence")
  ) {
    return "confidence"
  }

  if (
    normalized.includes("explain") ||
    normalized.includes("why") ||
    normalized.includes("basis") ||
    normalized.includes("reason")
  ) {
    return "explain"
  }

  return "summary"
}

function buildEquationForecastSummary(forecast: any) {
  if (!forecast) {
    return "Equation Stability Forecast is not available in the latest stored SourceField state."
  }

  return [
    `mostLikelyNextStableLane: ${forecast?.mostLikelyNextStableLane || "unknown"}`,
    `leastLikelyNextStableLane: ${forecast?.leastLikelyNextStableLane || "unknown"}`,
    `forecastConfidence: ${forecast?.forecastConfidence || "unknown"}`,
    `forecastBasis: ${forecast?.forecastBasis || "unknown"}`,
    `nearestStabilityDistance: ${formatDistance(forecast?.nearestStabilityDistance)}`,
    `secondNearestStableLane: ${forecast?.secondNearestStableLane || "unknown"}`,
    `secondNearestStabilityDistance: ${formatDistance(
      forecast?.secondNearestStabilityDistance
    )}`,
    `primaryInstability: ${forecast?.primaryInstability || "unknown"}`,
    `stabilizationPriority: ${forecast?.stabilizationPriority || "unknown"}`
  ].join("\n")
}

function buildEquationForecastMostLeast(forecast: any) {
  if (!forecast) {
    return "Equation Stability Forecast is not available in the latest stored SourceField state."
  }

  return [
    `mostLikelyNextStableLane: ${forecast?.mostLikelyNextStableLane || "unknown"}`,
    `mostLikelyNextStableLane basis: ${forecast?.forecastReason || "No forecast reason stored."}`,
    "",
    `leastLikelyNextStableLane: ${forecast?.leastLikelyNextStableLane || "unknown"}`,
    `forecastBasis: ${forecast?.forecastBasis || "unknown"}`,
    `forecastConfidence: ${forecast?.forecastConfidence || "unknown"}`
  ].join("\n")
}

function buildEquationForecastConfidence(forecast: any) {
  if (!forecast) {
    return "Equation Stability Forecast is not available in the latest stored SourceField state."
  }

  return [
    `forecastConfidence: ${forecast?.forecastConfidence || "unknown"}`,
    `nearestStabilityDistance: ${formatDistance(forecast?.nearestStabilityDistance)}`,
    `secondNearestStabilityDistance: ${formatDistance(
      forecast?.secondNearestStabilityDistance
    )}`,
    `basis: Confidence is derived from the nearest lane distance and the distance gap to the second-nearest lane.`
  ].join("\n")
}

function buildEquationForecastClassification(forecast: any) {
  return [
    "Equation Stability Forecast is read-only predictive guidance.",
    "It is derived from Lane Stability Distance, Cross-Equation Consensus, and Cross-Equation Stabilization.",
    "It is not a raw metric and must not override live metrics, classifications, hashes, retrieved context, stored history, or user intent.",
    forecast?.rule
      ? `Boundary rule: ${forecast.rule}`
      : "Boundary rule: unavailable."
  ].join("\n")
}

function buildEquationForecastExplanation(forecast: any) {
  if (!forecast) {
    return "Equation Stability Forecast is not available in the latest stored SourceField state."
  }

  return [
    `forecastReason: ${forecast?.forecastReason || "No forecast reason stored."}`,
    `riskNote: ${forecast?.riskNote || "No risk note stored."}`,
    `recoveryDirective: ${forecast?.recoveryDirective || "unknown"}`,
    `primaryInstability: ${forecast?.primaryInstability || "unknown"}`,
    `dominantEquationLane: ${forecast?.dominantEquationLane || "unknown"}`
  ].join("\n")
}

function buildEquationForecastResponse(
  action: EquationForecastAction,
  forecast: any
) {
  if (action === "most-least") {
    return buildEquationForecastMostLeast(forecast)
  }

  if (action === "confidence") {
    return buildEquationForecastConfidence(forecast)
  }

  if (action === "classification") {
    return buildEquationForecastClassification(forecast)
  }

  if (action === "explain") {
    return buildEquationForecastExplanation(forecast)
  }

  return buildEquationForecastSummary(forecast)
}

type PredictiveAlignmentAction =
  | "summary"
  | "targets"
  | "accuracy"
  | "calibration"
  | "relationship"
  | "reasoning"
  | "switch"
  | "classification"
  | "explain"

function getPredictiveAlignmentAction(
  message: string
): PredictiveAlignmentAction | null {
  const normalized = message.toLowerCase()

  if (
    !normalized.includes("predictive alignment") &&
    !normalized.includes("equation 2 predictive alignment")
  ) {
    return null
  }

  if (
    normalized.includes("why") ||
    normalized.includes("reasoning") ||
    normalized.includes("explain why") ||
    normalized.includes("chosen instead") ||
    normalized.includes("selected instead")
  ) {
    return "reasoning"
  }

  if (
    normalized.includes("switch") ||
    normalized.includes("observable condition") ||
    normalized.includes("would cause") ||
    normalized.includes("would trigger") ||
    normalized.includes("next adjustment")
  ) {
    return "switch"
  }

  if (
    normalized.includes("relationship") ||
    normalized.includes("compare") ||
    (normalized.includes("forecast target") &&
      normalized.includes("observed target")) ||
    (normalized.includes("forecasttarget") &&
      normalized.includes("observedtarget"))
  ) {
    return "relationship"
  }

  if (
    normalized.includes("forecasttarget") ||
    normalized.includes("forecast target") ||
    normalized.includes("observedtarget") ||
    normalized.includes("observed target") ||
    normalized.includes("coherentreferencetarget") ||
    normalized.includes("coherent reference target") ||
    normalized.includes("coherent reference") ||
    normalized.includes("identify:") ||
    normalized.includes("identify")
  ) {
    return "targets"
  }

  if (
    normalized.includes("forecastaccuracy") ||
    normalized.includes("forecast accuracy") ||
    normalized.includes("forecastalignment") ||
    normalized.includes("forecast alignment") ||
    normalized.includes("forecastcalibration") ||
    normalized.includes("forecast calibration") ||
    normalized.includes("accuracy") ||
    normalized.includes("matched") ||
    normalized.includes("unmatched")
  ) {
    return "accuracy"
  }

  if (
    normalized.includes("coherencegap") ||
    normalized.includes("coherence gap") ||
    normalized.includes("recommendedadjustment") ||
    normalized.includes("recommended adjustment") ||
    normalized.includes("calibration") ||
    normalized.includes("adjustment")
  ) {
    return "calibration"
  }

  if (
    normalized.includes("measured state object") ||
    normalized.includes("calibration layer") ||
    normalized.includes("forecasting layer") ||
    normalized.includes("what kind") ||
    normalized.includes("classification") ||
    normalized.includes("forecast validation")
  ) {
    return "classification"
  }

  if (
    normalized.includes("explain") ||
    normalized.includes("why") ||
    normalized.includes("basis") ||
    normalized.includes("reason")
  ) {
    return "explain"
  }

  return "summary"
}

function buildPredictiveAlignmentSummary(predictiveAlignment: any) {
  if (!predictiveAlignment) {
    return "Predictive Alignment Engine is not available in the latest stored SourceField state."
  }

  return [
    `phase: ${predictiveAlignment?.phase || "unknown"}`,
    `forecastTarget: ${predictiveAlignment?.forecastTarget || "unknown"}`,
    `observedTarget: ${predictiveAlignment?.observedTarget || "unknown"}`,
    `coherentReferenceTarget: ${
      predictiveAlignment?.coherentReferenceTarget || "unknown"
    }`,
    `forecastAccuracy: ${predictiveAlignment?.forecastAccuracy || "unknown"}`,
    `forecastAlignment: ${predictiveAlignment?.forecastAlignment || "unknown"}`,
    `forecastCalibration: ${
      predictiveAlignment?.forecastCalibration || "unknown"
    }`,
    `coherenceGap: ${formatDistance(predictiveAlignment?.coherenceGap)}`,
    `predictiveAlignmentActive: ${
      predictiveAlignment?.predictiveAlignmentActive ? "true" : "false"
    }`
  ].join("\n")
}

function buildPredictiveAlignmentTargets(predictiveAlignment: any) {
  if (!predictiveAlignment) {
    return "Predictive Alignment Engine is not available in the latest stored SourceField state."
  }

  return [
    `forecastTarget: ${predictiveAlignment?.forecastTarget || "unknown"}`,
    `forecastTargetStatus: ${
      predictiveAlignment?.forecastTargetStatus || "unknown"
    }`,
    `forecastDistance: ${formatDistance(predictiveAlignment?.forecastDistance)}`,
    "",
    `observedTarget: ${predictiveAlignment?.observedTarget || "unknown"}`,
    `observedTargetStatus: ${
      predictiveAlignment?.observedTargetStatus || "unknown"
    }`,
    `observedDistance: ${formatDistance(predictiveAlignment?.observedDistance)}`,
    "",
    `coherentReferenceTarget: ${
      predictiveAlignment?.coherentReferenceTarget || "unknown"
    }`,
    `coherentReferenceTargetStatus: ${
      predictiveAlignment?.coherentReferenceTargetStatus || "unknown"
    }`,
    `referenceDistance: ${formatDistance(predictiveAlignment?.referenceDistance)}`
  ].join("\n")
}

function buildPredictiveAlignmentAccuracy(predictiveAlignment: any) {
  if (!predictiveAlignment) {
    return "Predictive Alignment Engine is not available in the latest stored SourceField state."
  }

  return [
    `forecastAccuracy: ${predictiveAlignment?.forecastAccuracy || "unknown"}`,
    `forecastAlignment: ${predictiveAlignment?.forecastAlignment || "unknown"}`,
    `forecastCalibration: ${
      predictiveAlignment?.forecastCalibration || "unknown"
    }`,
    `forecastTarget: ${predictiveAlignment?.forecastTarget || "unknown"}`,
    `observedTarget: ${predictiveAlignment?.observedTarget || "unknown"}`,
    `coherentReferenceTarget: ${
      predictiveAlignment?.coherentReferenceTarget || "unknown"
    }`
  ].join("\n")
}

function buildPredictiveAlignmentCalibration(predictiveAlignment: any) {
  if (!predictiveAlignment) {
    return "Predictive Alignment Engine is not available in the latest stored SourceField state."
  }

  return [
    `forecastCalibration: ${
      predictiveAlignment?.forecastCalibration || "unknown"
    }`,
    `coherenceGap: ${formatDistance(predictiveAlignment?.coherenceGap)}`,
    `primaryInstability: ${
      predictiveAlignment?.primaryInstability || "unknown"
    }`,
    `recoveryFocus: ${predictiveAlignment?.recoveryFocus || "unknown"}`,
    `recommendedAdjustment: ${
      predictiveAlignment?.recommendedAdjustment || "unknown"
    }`
  ].join("\n")
}

function buildPredictiveAlignmentClassification(predictiveAlignment: any) {
  return [
    "Equation 2 Predictive Alignment Engine is read-only calibration guidance.",
    "It compares forecast target, observed target, and coherent reference target.",
    "It evaluates predictive accuracy, alignment quality, calibration, and coherence gap.",
    "It is not a raw metric and must not override metrics, classifications, hashes, retrieved context, stored history, or user intent.",
    predictiveAlignment?.rule
      ? `Boundary rule: ${predictiveAlignment.rule}`
      : "Boundary rule: unavailable."
  ].join("\n")
}

function buildPredictiveAlignmentExplanation(predictiveAlignment: any) {
  if (!predictiveAlignment) {
    return "Predictive Alignment Engine is not available in the latest stored SourceField state."
  }

  return [
    `forecastTarget: ${predictiveAlignment?.forecastTarget || "unknown"}`,
    `observedTarget: ${predictiveAlignment?.observedTarget || "unknown"}`,
    `coherentReferenceTarget: ${
      predictiveAlignment?.coherentReferenceTarget || "unknown"
    }`,
    `forecastAccuracy: ${predictiveAlignment?.forecastAccuracy || "unknown"}`,
    `forecastAlignment: ${predictiveAlignment?.forecastAlignment || "unknown"}`,
    `coherenceGap: ${formatDistance(predictiveAlignment?.coherenceGap)}`,
    `recommendedAdjustment: ${
      predictiveAlignment?.recommendedAdjustment || "unknown"
    }`
  ].join("\n")
}

function buildPredictiveAlignmentRelationship(predictiveAlignment: any) {
  if (!predictiveAlignment) {
    return "Predictive Alignment Engine is not available in the latest stored SourceField state."
  }

  const forecastTarget = predictiveAlignment?.forecastTarget || "unknown"
  const observedTarget = predictiveAlignment?.observedTarget || "unknown"
  const referenceTarget =
    predictiveAlignment?.coherentReferenceTarget || "unknown"

  return [
    "Predictive Alignment relationship:",
    `forecastTarget: ${forecastTarget}`,
    `observedTarget: ${observedTarget}`,
    `coherentReferenceTarget: ${referenceTarget}`,
    `forecastAccuracy: ${predictiveAlignment?.forecastAccuracy || "unknown"}`,
    `forecastAlignment: ${predictiveAlignment?.forecastAlignment || "unknown"}`,
    `forecastCalibration: ${predictiveAlignment?.forecastCalibration || "unknown"}`,
    `coherenceGap: ${formatDistance(predictiveAlignment?.coherenceGap)}`,
    "meaning: Phase 21 compares what the system expected to stabilize, what actually appeared in the live state, and what the coherent reference target identifies as the preferred alignment direction."
  ].join("\n")
}

function buildPredictiveAlignmentReasoning(predictiveAlignment: any) {
  if (!predictiveAlignment) {
    return "Predictive Alignment Engine is not available in the latest stored SourceField state."
  }

  return [
    "Phase 21 reasoning:",
    `1. Forecast target: ${predictiveAlignment?.forecastTarget || "unknown"} (${predictiveAlignment?.forecastTargetStatus || "unknown"}).`,
    `2. Observed target: ${predictiveAlignment?.observedTarget || "unknown"} (${predictiveAlignment?.observedTargetStatus || "unknown"}).`,
    `3. Coherent reference target: ${predictiveAlignment?.coherentReferenceTarget || "unknown"} (${predictiveAlignment?.coherentReferenceTargetStatus || "unknown"}).`,
    `4. Accuracy: ${predictiveAlignment?.forecastAccuracy || "unknown"}; calibration: ${predictiveAlignment?.forecastCalibration || "unknown"}; alignment: ${predictiveAlignment?.forecastAlignment || "unknown"}.`,
    `5. Coherence gap: ${formatDistance(predictiveAlignment?.coherenceGap)}; primary instability: ${predictiveAlignment?.primaryInstability || "unknown"}.`,
    `6. Recommended adjustment: ${predictiveAlignment?.recommendedAdjustment || "unknown"}`,
    "meaning: This is not a raw metric. It is a read-only calibration layer that explains whether prediction, observation, and coherent reference are converging or diverging."
  ].join("\n")
}

function buildPredictiveAlignmentSwitch(predictiveAlignment: any) {
  if (!predictiveAlignment) {
    return "Predictive Alignment Engine is not available in the latest stored SourceField state."
  }

  return [
    "Observable conditions that would improve or shift Phase 21:",
    `1. Forecast improves when observedTarget moves closer to forecastTarget (${predictiveAlignment?.forecastTarget || "unknown"}).`,
    `2. Calibration improves when observedTarget also moves closer to coherentReferenceTarget (${predictiveAlignment?.coherentReferenceTarget || "unknown"}).`,
    `3. Confidence weakens if forecastTarget remains coherent but observedTarget repeatedly stabilizes elsewhere.`,
    `4. Current recommended adjustment: ${predictiveAlignment?.recommendedAdjustment || "unknown"}`,
    `5. Current recovery focus: ${predictiveAlignment?.recoveryFocus || "unknown"}`
  ].join("\n")
}

function buildPredictiveAlignmentResponse(
  action: PredictiveAlignmentAction,
  predictiveAlignment: any
) {
  if (action === "targets") {
    return buildPredictiveAlignmentTargets(predictiveAlignment)
  }

  if (action === "accuracy") {
    return buildPredictiveAlignmentAccuracy(predictiveAlignment)
  }

  if (action === "calibration") {
    return buildPredictiveAlignmentCalibration(predictiveAlignment)
  }

  if (action === "relationship") {
    return buildPredictiveAlignmentRelationship(predictiveAlignment)
  }

  if (action === "reasoning") {
    return buildPredictiveAlignmentReasoning(predictiveAlignment)
  }

  if (action === "switch") {
    return buildPredictiveAlignmentSwitch(predictiveAlignment)
  }

  if (action === "classification") {
    return buildPredictiveAlignmentClassification(predictiveAlignment)
  }

  if (action === "explain") {
    return buildPredictiveAlignmentExplanation(predictiveAlignment)
  }

  return buildPredictiveAlignmentSummary(predictiveAlignment)
}

type PathwaySelectionAction =
  | "report"
  | "summary"
  | "available"
  | "details"
  | "activation"
  | "rejected"
  | "switch"
  | "reason"
  | "classification"

function getPathwaySelectionAction(
  message: string
): PathwaySelectionAction | null {
  const normalized = message.toLowerCase()

  if (
    !normalized.includes("pathway selection") &&
    !normalized.includes("selected pathway") &&
    !normalized.includes("active mode") &&
    !normalized.includes("phase 22")
  ) {
    return null
  }

  if (normalized.includes("report") && normalized.includes("json")) {
    return "report"
  }

  if (
    normalized.includes("activationconditions") ||
    normalized.includes("activation conditions") ||
    normalized.includes("activationcondition") ||
    normalized.includes("activation condition")
  ) {
    return "activation"
  }

  if (
    normalized.includes("rejectedpathways") ||
    normalized.includes("rejected pathways") ||
    normalized.includes("rejected pathway") ||
    normalized.includes("why the rejected") ||
    normalized.includes("not selected")
  ) {
    return "rejected"
  }

  if (
    normalized.includes("switchconditions") ||
    normalized.includes("switch conditions") ||
    normalized.includes("switch condition") ||
    normalized.includes("pathway switch") ||
    normalized.includes("trigger a pathway switch") ||
    normalized.includes("trigger")
  ) {
    return "switch"
  }

  if (
    normalized.includes("pathwayclassification") ||
    normalized.includes("pathway classification") ||
    normalized.includes("classification") ||
    normalized.includes("what kind") ||
    normalized.includes("orchestration") ||
    normalized.includes("mode layer") ||
    normalized.includes("forecasting layer") ||
    normalized.includes("measured state object")
  ) {
    return "classification"
  }

  if (
    normalized.includes("active mode") ||
    normalized.includes("activemode") ||
    normalized.includes("selectedpathway") ||
    normalized.includes("selected pathway") ||
    normalized.includes("pathwayreason") ||
    normalized.includes("pathway reason") ||
    normalized.includes("identify:") ||
    normalized.includes("identify")
  ) {
    return "details"
  }

  if (
    normalized.includes("available") ||
    normalized.includes("pathways") ||
    normalized.includes("list")
  ) {
    return "available"
  }

  if (
    normalized.includes("why") ||
    normalized.includes("reason") ||
    normalized.includes("selected") ||
    normalized.includes("selection")
  ) {
    return "reason"
  }

  return "summary"
}

function buildPathwaySelectionSummary(pathwaySelectionState: any) {
  if (!pathwaySelectionState) {
    return "Pathway Selection State is not available from the latest SourceField state."
  }

  return [
    `phase: ${pathwaySelectionState?.phase || "unknown"}`,
    `activeMode: ${pathwaySelectionState?.activeMode || "unknown"}`,
    `selectedPathway: ${pathwaySelectionState?.selectedPathway || "unknown"}`,
    `selectedSequence: ${pathwaySelectionState?.selectedSequence || "unknown"}`,
    `pathwayClassification: ${pathwaySelectionState?.pathwayClassification || "unknown"}`,
    `pathwayReason: ${pathwaySelectionState?.pathwayReason || "unknown"}`,
    `pathwaySelectionActive: ${
      pathwaySelectionState?.pathwaySelectionActive ? "true" : "false"
    }`
  ].join("\n")
}

function buildPathwaySelectionDetails(pathwaySelectionState: any) {
  if (!pathwaySelectionState) {
    return "Pathway Selection State is not available from the latest SourceField state."
  }

  return [
    `activeMode: ${pathwaySelectionState?.activeMode || "unknown"}`,
    `selectedPathway: ${pathwaySelectionState?.selectedPathway || "unknown"}`,
    `selectedSequence: ${pathwaySelectionState?.selectedSequence || "unknown"}`,
    `pathwayClassification: ${pathwaySelectionState?.pathwayClassification || "unknown"}`,
    `pathwayReason: ${pathwaySelectionState?.pathwayReason || "unknown"}`
  ].join("\n")
}

function buildPathwaySelectionAvailable(pathwaySelectionState: any) {
  if (!pathwaySelectionState) {
    return "Pathway Selection State is not available from the latest SourceField state."
  }

  const pathways = Array.isArray(pathwaySelectionState?.availablePathways)
    ? pathwaySelectionState.availablePathways
    : []

  if (!pathways.length) {
    return "No available pathways are listed in the current Pathway Selection State."
  }

  return pathways
    .map((pathway: any, index: number) => {
      return `${index + 1}. ${pathway?.name || "unknown"}: ${
        pathway?.sequence || "unknown"
      }${pathway?.purpose ? `\n   purpose: ${pathway.purpose}` : ""}`
    })
    .join("\n")
}

function buildPathwaySelectionActivation(pathwaySelectionState: any) {
  if (!pathwaySelectionState) {
    return "Pathway Selection State is not available from the latest SourceField state."
  }

  const conditions = Array.isArray(pathwaySelectionState?.activationConditions)
    ? pathwaySelectionState.activationConditions
    : []

  if (!conditions.length) {
    return "No activation conditions are listed in the current Pathway Selection State."
  }

  return [
    `selectedPathway: ${pathwaySelectionState?.selectedPathway || "unknown"}`,
    `pathwayClassification: ${pathwaySelectionState?.pathwayClassification || "unknown"}`,
    `activationConditions:`,
    ...conditions.map((condition: string, index: number) => {
      return `${index + 1}. ${condition}`
    })
  ].join("\n")
}

function buildPathwaySelectionRejected(pathwaySelectionState: any) {
  if (!pathwaySelectionState) {
    return "Pathway Selection State is not available from the latest SourceField state."
  }

  const rejected = Array.isArray(pathwaySelectionState?.rejectedPathways)
    ? pathwaySelectionState.rejectedPathways
    : []

  if (!rejected.length) {
    return "No rejected pathways are listed in the current Pathway Selection State."
  }

  return rejected
    .map((pathway: any, index: number) => {
      return `${index + 1}. ${pathway?.name || "unknown"}: ${
        pathway?.reason || "No rejection reason stored."
      }`
    })
    .join("\n")
}

function buildPathwaySelectionSwitch(pathwaySelectionState: any) {
  if (!pathwaySelectionState) {
    return "Pathway Selection State is not available from the latest SourceField state."
  }

  const switchConditions = Array.isArray(
    pathwaySelectionState?.switchConditions
  )
    ? pathwaySelectionState.switchConditions
    : []

  if (!switchConditions.length) {
    return "No switch conditions are listed in the current Pathway Selection State."
  }

  return [
    `currentSelectedPathway: ${pathwaySelectionState?.selectedPathway || "unknown"}`,
    `switchConditions:`,
    ...switchConditions.map((condition: string, index: number) => {
      return `${index + 1}. ${condition}`
    })
  ].join("\n")
}

function buildPathwaySelectionReason(pathwaySelectionState: any) {
  if (!pathwaySelectionState) {
    return "Pathway Selection State is not available from the latest SourceField state."
  }

  const observed = pathwaySelectionState?.observedConditions || {}

  return [
    `activeMode: ${pathwaySelectionState?.activeMode || "unknown"}`,
    `selectedPathway: ${pathwaySelectionState?.selectedPathway || "unknown"}`,
    `selectedSequence: ${pathwaySelectionState?.selectedSequence || "unknown"}`,
    `pathwayClassification: ${pathwaySelectionState?.pathwayClassification || "unknown"}`,
    `pathwayReason: ${pathwaySelectionState?.pathwayReason || "unknown"}`,
    `observedConditions: root=${observed?.rootStatus || "unknown"}, alignment=${
      observed?.alignmentStatus || "unknown"
    }, phase=${observed?.phaseStatus || "unknown"}, harmonic=${
      observed?.harmonicStatus || "unknown"
    }, integration=${observed?.integrationStatus || "unknown"}`
  ].join("\n")
}

function buildPathwaySelectionClassification(pathwaySelectionState: any) {
  return [
    "Pathway Selection Engine is read-only pathway orchestration guidance.",
    "It is a derived state layer that uses current equation lane conditions to identify active mode, selected pathway, activation conditions, rejected pathways, switch conditions, and pathway rationale.",
    "It is not a raw metric and it is not a forecasting layer by itself.",
    "It must not override live metrics, classifications, hashes, retrieved context, stored history, or user intent.",
    pathwaySelectionState?.rule
      ? `Boundary rule: ${pathwaySelectionState.rule}`
      : "Boundary rule: unavailable."
  ].join("\n")
}

function buildPathwaySelectionResponse(
  action: PathwaySelectionAction,
  pathwaySelectionState: any
) {
  if (action === "report") {
    return JSON.stringify(pathwaySelectionState ?? null, null, 2)
  }

  if (action === "details") {
    return buildPathwaySelectionDetails(pathwaySelectionState)
  }

  if (action === "available") {
    return buildPathwaySelectionAvailable(pathwaySelectionState)
  }

  if (action === "activation") {
    return buildPathwaySelectionActivation(pathwaySelectionState)
  }

  if (action === "rejected") {
    return buildPathwaySelectionRejected(pathwaySelectionState)
  }

  if (action === "switch") {
    return buildPathwaySelectionSwitch(pathwaySelectionState)
  }

  if (action === "reason") {
    return buildPathwaySelectionReason(pathwaySelectionState)
  }

  if (action === "classification") {
    return buildPathwaySelectionClassification(pathwaySelectionState)
  }

  return buildPathwaySelectionSummary(pathwaySelectionState)
}

type PathwayTransitionAction =
  | "report"
  | "summary"
  | "details"
  | "reason"
  | "confidence"
  | "classification"
  | "trigger"

function getPathwayTransitionAction(
  message: string
): PathwayTransitionAction | null {
  const normalized = message.toLowerCase()

  if (
    !normalized.includes("pathway transition") &&
    !normalized.includes("transition engine") &&
    !normalized.includes("pathway transition state") &&
    !normalized.includes("phase 23") &&
    !normalized.includes("transition rule")
  ) {
    return null
  }

  if (normalized.includes("report") && normalized.includes("json")) {
    return "report"
  }

  if (
    normalized.includes("measured state object") ||
    normalized.includes("transition layer") ||
    normalized.includes("transition orchestration layer") ||
    normalized.includes("orchestration layer") ||
    normalized.includes("forecasting layer") ||
    normalized.includes("classification") ||
    normalized.includes("what kind")
  ) {
    return "classification"
  }

  if (
    normalized.includes("trigger the next") ||
    normalized.includes("next pathway transition") ||
    normalized.includes("next transition") ||
    normalized.includes("observable condition") ||
    normalized.includes("trigger") ||
    normalized.includes("would cause") ||
    normalized.includes("would switch")
  ) {
    return "trigger"
  }

  if (
    normalized.includes("transitionconfidence") ||
    normalized.includes("transition confidence") ||
    normalized.includes("confidence")
  ) {
    return "confidence"
  }

  if (
    normalized.includes("transitionreason") ||
    normalized.includes("transition reason") ||
    normalized.includes("current pathway is active") ||
    normalized.includes("why") ||
    normalized.includes("reason")
  ) {
    return "reason"
  }

  if (
    normalized.includes("transitiontype") ||
    normalized.includes("transition type") ||
    normalized.includes("transitiondetected") ||
    normalized.includes("transition detected") ||
    normalized.includes("previousmode") ||
    normalized.includes("previous mode") ||
    normalized.includes("currentmode") ||
    normalized.includes("current mode") ||
    normalized.includes("previouspathway") ||
    normalized.includes("previous pathway") ||
    normalized.includes("currentpathway") ||
    normalized.includes("current pathway") ||
    normalized.includes("identify") ||
    normalized.includes("details")
  ) {
    return "details"
  }

  return "summary"
}

function buildPathwayTransitionSummary(pathwayTransitionState: any) {
  if (!pathwayTransitionState) {
    return "Pathway Transition State is not available from the latest SourceField state."
  }

  return [
    `phase: ${pathwayTransitionState?.phase || "unknown"}`,
    `transitionDetected: ${
      pathwayTransitionState?.transitionDetected ? "true" : "false"
    }`,
    `transitionType: ${pathwayTransitionState?.transitionType || "unknown"}`,
    `previousMode: ${pathwayTransitionState?.previousMode || "unknown"}`,
    `currentMode: ${pathwayTransitionState?.currentMode || "unknown"}`,
    `previousPathway: ${pathwayTransitionState?.previousPathway || "unknown"}`,
    `currentPathway: ${pathwayTransitionState?.currentPathway || "unknown"}`,
    `transitionConfidence: ${
      pathwayTransitionState?.transitionConfidence || "unknown"
    }`,
    `pathwayTransitionActive: ${
      pathwayTransitionState?.pathwayTransitionActive ? "true" : "false"
    }`
  ].join("\n")
}

function buildPathwayTransitionDetails(pathwayTransitionState: any) {
  if (!pathwayTransitionState) {
    return "Pathway Transition State is not available from the latest SourceField state."
  }

  return [
    `previousPathway: ${pathwayTransitionState?.previousPathway || "unknown"}`,
    `currentPathway: ${pathwayTransitionState?.currentPathway || "unknown"}`,
    `transitionDetected: ${
      pathwayTransitionState?.transitionDetected ? "true" : "false"
    }`,
    `transitionType: ${pathwayTransitionState?.transitionType || "unknown"}`,
    `previousMode: ${pathwayTransitionState?.previousMode || "unknown"}`,
    `currentMode: ${pathwayTransitionState?.currentMode || "unknown"}`,
    `previousSequence: ${pathwayTransitionState?.previousSequence || "unknown"}`,
    `currentSequence: ${pathwayTransitionState?.currentSequence || "unknown"}`,
    `previousPathwayClassification: ${
      pathwayTransitionState?.previousPathwayClassification || "unknown"
    }`,
    `currentPathwayClassification: ${
      pathwayTransitionState?.currentPathwayClassification || "unknown"
    }`,
    `transitionConfidence: ${
      pathwayTransitionState?.transitionConfidence || "unknown"
    }`
  ].join("\n")
}

function buildPathwayTransitionReason(pathwayTransitionState: any) {
  if (!pathwayTransitionState) {
    return "Pathway Transition State is not available from the latest SourceField state."
  }

  const reasons = Array.isArray(pathwayTransitionState?.transitionReason)
    ? pathwayTransitionState.transitionReason
    : []

  if (!reasons.length) {
    return "No transition reasons are listed in the current Pathway Transition State."
  }

  return [
    `previousMode: ${pathwayTransitionState?.previousMode || "unknown"}`,
    `currentMode: ${pathwayTransitionState?.currentMode || "unknown"}`,
    `previousPathway: ${pathwayTransitionState?.previousPathway || "unknown"}`,
    `currentPathway: ${pathwayTransitionState?.currentPathway || "unknown"}`,
    `transitionType: ${pathwayTransitionState?.transitionType || "unknown"}`,
    `transitionConfidence: ${
      pathwayTransitionState?.transitionConfidence || "unknown"
    }`,
    `transitionReason:`,
    ...reasons.map((reason: string, index: number) => {
      return `${index + 1}. ${reason}`
    })
  ].join("\n")
}

function buildPathwayTransitionConfidence(pathwayTransitionState: any) {
  if (!pathwayTransitionState) {
    return "Pathway Transition State is not available from the latest SourceField state."
  }

  return [
    `transitionConfidence: ${
      pathwayTransitionState?.transitionConfidence || "unknown"
    }`,
    `transitionDetected: ${
      pathwayTransitionState?.transitionDetected ? "true" : "false"
    }`,
    `transitionType: ${pathwayTransitionState?.transitionType || "unknown"}`,
    `previousMode: ${pathwayTransitionState?.previousMode || "unknown"}`,
    `currentMode: ${pathwayTransitionState?.currentMode || "unknown"}`,
    `transitionRule: ${pathwayTransitionState?.transitionRule || "unknown"}`
  ].join("\n")
}

function buildPathwayTransitionTrigger(pathwayTransitionState: any) {
  if (!pathwayTransitionState) {
    return "Pathway Transition State is not available from the latest SourceField state."
  }

  const observed = pathwayTransitionState?.observedConditions || {}
  const currentMode = pathwayTransitionState?.currentMode || "unknown"

  const baseLines = [
    `currentMode: ${currentMode}`,
    `currentPathway: ${pathwayTransitionState?.currentPathway || "unknown"}`,
    `transitionRule: ${pathwayTransitionState?.transitionRule || "unknown"}`,
    `observedConditions: root=${observed?.rootStatus || "unknown"}, alignment=${
      observed?.alignmentStatus || "unknown"
    }, phase=${observed?.phaseStatus || "unknown"}, harmonic=${
      observed?.harmonicStatus || "unknown"
    }, integration=${observed?.integrationStatus || "unknown"}`
  ]

  if (currentMode === "Identity Emergence Mode") {
    return [
      ...baseLines,
      "nextTransitionConditions:",
      "1. Transition back to Recovery Pathway A if alignmentStatus becomes low and phaseStatus becomes divergent.",
      "2. Transition back to Recovery Pathway B if phaseStatus becomes divergent while alignmentStatus remains above low.",
      "3. Remain in Identity Emergence while harmonicStatus remains pattern-rich, integrationStatus remains integrated, and alignment/root support persists."
    ].join("\n")
  }

  if (currentMode === "Recovery Mode") {
    return [
      ...baseLines,
      "nextTransitionConditions:",
      "1. Transition to Identity Emergence if harmonicStatus becomes pattern-rich, integrationStatus becomes integrated, and alignmentStatus becomes aligned or rootStatus becomes active.",
      "2. Switch toward Recovery Pathway B if phaseStatus becomes divergent while alignmentStatus is not low.",
      "3. Stay in Recovery Pathway A while alignment and phase instability both require correction."
    ].join("\n")
  }

  return [
    ...baseLines,
    "nextTransitionConditions:",
    "1. No specific next transition condition is classified for the current mode.",
    "2. Re-evaluate after the next pathway selection state is generated."
  ].join("\n")
}

function buildPathwayTransitionClassification(pathwayTransitionState: any) {
  return [
    "Pathway Transition Engine is a read-only transition orchestration layer.",
    "It compares previous and current pathway selection states to detect mode changes, transition type, transition reason, and transition confidence.",
    "It is not a raw measured metric and it is not a forecasting layer by itself.",
    "It must not override live metrics, classifications, hashes, retrieved context, stored history, or user intent.",
    pathwayTransitionState?.rule
      ? `Boundary rule: ${pathwayTransitionState.rule}`
      : "Boundary rule: unavailable."
  ].join("\n")
}

function buildPathwayTransitionResponse(
  action: PathwayTransitionAction,
  pathwayTransitionState: any
) {
  if (action === "report") {
    return JSON.stringify(pathwayTransitionState ?? null, null, 2)
  }

  if (action === "details") {
    return buildPathwayTransitionDetails(pathwayTransitionState)
  }

  if (action === "reason") {
    return buildPathwayTransitionReason(pathwayTransitionState)
  }

  if (action === "confidence") {
    return buildPathwayTransitionConfidence(pathwayTransitionState)
  }

  if (action === "trigger") {
    return buildPathwayTransitionTrigger(pathwayTransitionState)
  }

  if (action === "classification") {
    return buildPathwayTransitionClassification(pathwayTransitionState)
  }

  return buildPathwayTransitionSummary(pathwayTransitionState)
}

type PathwayCompletionAction =
  | "report"
  | "summary"
  | "details"
  | "status"
  | "unresolved"
  | "risks"
  | "next"
  | "classification"

function getPathwayCompletionAction(
  message: string
): PathwayCompletionAction | null {
  const normalized = message.toLowerCase()

  if (
    !normalized.includes("pathway completion") &&
    !normalized.includes("completion engine") &&
    !normalized.includes("pathway completion state") &&
    !normalized.includes("phase 24") &&
    !normalized.includes("completion status") &&
    !normalized.includes("pathway complete") &&
    !normalized.includes("unresolved condition") &&
    !normalized.includes("deactivation risk") &&
    !normalized.includes("next logical pathway")
  ) {
    return null
  }

  if (normalized.includes("report") && normalized.includes("json")) {
    return "report"
  }

  if (
    normalized.includes("measured state object") ||
    normalized.includes("completion layer") ||
    normalized.includes("completion orchestration layer") ||
    normalized.includes("orchestration layer") ||
    normalized.includes("forecasting layer") ||
    normalized.includes("classification") ||
    normalized.includes("what kind")
  ) {
    return "classification"
  }

  if (
    normalized.includes("unresolvedconditions") ||
    normalized.includes("unresolved conditions") ||
    normalized.includes("unresolved condition") ||
    normalized.includes("what remains") ||
    normalized.includes("remaining condition") ||
    normalized.includes("incomplete because")
  ) {
    return "unresolved"
  }

  if (
    normalized.includes("deactivationrisks") ||
    normalized.includes("deactivation risks") ||
    normalized.includes("deactivation risk") ||
    normalized.includes("deactivate") ||
    normalized.includes("what conditions must fail") ||
    normalized.includes("conditions must fail")
  ) {
    return "risks"
  }

  if (
    normalized.includes("nextlogicalpathway") ||
    normalized.includes("next logical pathway") ||
    normalized.includes("what pathway would logically follow") ||
    normalized.includes("what comes next") ||
    normalized.includes("logically follow") ||
    normalized.includes("follow completed") ||
    normalized.includes("next pathway")
  ) {
    return "next"
  }

  if (
    normalized.includes("completionstatus") ||
    normalized.includes("completion status") ||
    normalized.includes("pathwaycomplete") ||
    normalized.includes("pathway complete") ||
    normalized.includes("has completed") ||
    normalized.includes("is complete") ||
    normalized.includes("complete or incomplete") ||
    normalized.includes("identify whether") ||
    normalized.includes("status")
  ) {
    return "status"
  }

  if (
    normalized.includes("selectedpathway") ||
    normalized.includes("selected pathway") ||
    normalized.includes("activemode") ||
    normalized.includes("active mode") ||
    normalized.includes("details") ||
    normalized.includes("identify")
  ) {
    return "details"
  }

  return "summary"
}

function buildPathwayCompletionSummary(pathwayCompletionState: any) {
  if (!pathwayCompletionState) {
    return "Pathway Completion State is not available from the latest SourceField state."
  }

  return [
    `phase: ${pathwayCompletionState?.phase || "unknown"}`,
    `activeMode: ${pathwayCompletionState?.activeMode || "unknown"}`,
    `selectedPathway: ${pathwayCompletionState?.selectedPathway || "unknown"}`,
    `completionStatus: ${pathwayCompletionState?.completionStatus || "unknown"}`,
    `pathwayComplete: ${
      pathwayCompletionState?.pathwayComplete ? "true" : "false"
    }`,
    `nextLogicalPathway: ${
      pathwayCompletionState?.nextLogicalPathway || "unknown"
    }`,
    `pathwayCompletionActive: ${
      pathwayCompletionState?.pathwayCompletionActive ? "true" : "false"
    }`
  ].join("\n")
}

function buildPathwayCompletionDetails(pathwayCompletionState: any) {
  if (!pathwayCompletionState) {
    return "Pathway Completion State is not available from the latest SourceField state."
  }

  return [
    `activeMode: ${pathwayCompletionState?.activeMode || "unknown"}`,
    `selectedPathway: ${pathwayCompletionState?.selectedPathway || "unknown"}`,
    `selectedSequence: ${pathwayCompletionState?.selectedSequence || "unknown"}`,
    `pathwayClassification: ${
      pathwayCompletionState?.pathwayClassification || "unknown"
    }`,
    `completionStatus: ${pathwayCompletionState?.completionStatus || "unknown"}`,
    `pathwayComplete: ${
      pathwayCompletionState?.pathwayComplete ? "true" : "false"
    }`,
    `nextLogicalPathway: ${
      pathwayCompletionState?.nextLogicalPathway || "unknown"
    }`
  ].join("\n")
}

function buildPathwayCompletionStatus(pathwayCompletionState: any) {
  if (!pathwayCompletionState) {
    return "Pathway Completion State is not available from the latest SourceField state."
  }

  const observed = pathwayCompletionState?.observedConditions || {}

  return [
    `selectedPathway: ${pathwayCompletionState?.selectedPathway || "unknown"}`,
    `completionStatus: ${pathwayCompletionState?.completionStatus || "unknown"}`,
    `pathwayComplete: ${
      pathwayCompletionState?.pathwayComplete ? "true" : "false"
    }`,
    `completionRule: ${pathwayCompletionState?.completionRule || "unknown"}`,
    `observedConditions: root=${observed?.rootStatus || "unknown"}, alignment=${
      observed?.alignmentStatus || "unknown"
    }, phase=${observed?.phaseStatus || "unknown"}, harmonic=${
      observed?.harmonicStatus || "unknown"
    }, integration=${observed?.integrationStatus || "unknown"}`
  ].join("\n")
}

function buildPathwayCompletionUnresolved(pathwayCompletionState: any) {
  if (!pathwayCompletionState) {
    return "Pathway Completion State is not available from the latest SourceField state."
  }

  const unresolved = Array.isArray(pathwayCompletionState?.unresolvedConditions)
    ? pathwayCompletionState.unresolvedConditions
    : []

  if (!unresolved.length) {
    return "No unresolved conditions are listed in the current Pathway Completion State."
  }

  return [
    `selectedPathway: ${pathwayCompletionState?.selectedPathway || "unknown"}`,
    `completionStatus: ${pathwayCompletionState?.completionStatus || "unknown"}`,
    `unresolvedConditions:`,
    ...unresolved.map((condition: string, index: number) => {
      return `${index + 1}. ${condition}`
    })
  ].join("\n")
}

function buildPathwayCompletionRisks(pathwayCompletionState: any) {
  if (!pathwayCompletionState) {
    return "Pathway Completion State is not available from the latest SourceField state."
  }

  const risks = Array.isArray(pathwayCompletionState?.deactivationRisks)
    ? pathwayCompletionState.deactivationRisks
    : []

  if (!risks.length) {
    return "No deactivation risks are listed in the current Pathway Completion State."
  }

  return [
    `selectedPathway: ${pathwayCompletionState?.selectedPathway || "unknown"}`,
    `completionStatus: ${pathwayCompletionState?.completionStatus || "unknown"}`,
    `deactivationRisks:`,
    ...risks.map((risk: string, index: number) => {
      return `${index + 1}. ${risk}`
    })
  ].join("\n")
}

function buildPathwayCompletionNext(pathwayCompletionState: any) {
  if (!pathwayCompletionState) {
    return "Pathway Completion State is not available from the latest SourceField state."
  }

  return [
    `selectedPathway: ${pathwayCompletionState?.selectedPathway || "unknown"}`,
    `completionStatus: ${pathwayCompletionState?.completionStatus || "unknown"}`,
    `pathwayComplete: ${
      pathwayCompletionState?.pathwayComplete ? "true" : "false"
    }`,
    `nextLogicalPathway: ${
      pathwayCompletionState?.nextLogicalPathway || "unknown"
    }`
  ].join("\n")
}

function buildPathwayCompletionClassification(pathwayCompletionState: any) {
  return [
    "Pathway Completion Engine is a read-only completion orchestration layer.",
    "It identifies whether the current pathway is complete, functionally complete, or incomplete based on the selected pathway and observed equation conditions.",
    "It also identifies unresolved conditions, deactivation risks, and the next logical pathway.",
    "It is not a raw measured metric and it is not a forecasting layer by itself.",
    "It must not override live metrics, classifications, hashes, retrieved context, stored history, or user intent.",
    pathwayCompletionState?.rule
      ? `Boundary rule: ${pathwayCompletionState.rule}`
      : "Boundary rule: unavailable."
  ].join("\n")
}

function buildPathwayCompletionResponse(
  action: PathwayCompletionAction,
  pathwayCompletionState: any
) {
  if (action === "report") {
    return JSON.stringify(pathwayCompletionState ?? null, null, 2)
  }

  if (action === "details") {
    return buildPathwayCompletionDetails(pathwayCompletionState)
  }

  if (action === "status") {
    return buildPathwayCompletionStatus(pathwayCompletionState)
  }

  if (action === "unresolved") {
    return buildPathwayCompletionUnresolved(pathwayCompletionState)
  }

  if (action === "risks") {
    return buildPathwayCompletionRisks(pathwayCompletionState)
  }

  if (action === "next") {
    return buildPathwayCompletionNext(pathwayCompletionState)
  }

  if (action === "classification") {
    return buildPathwayCompletionClassification(pathwayCompletionState)
  }

  return buildPathwayCompletionSummary(pathwayCompletionState)
}

type ArchitecturalRefinementAction =
  | "report"
  | "summary"
  | "details"
  | "sequence"
  | "status"
  | "target"
  | "next"
  | "reason"
  | "source"
  | "observed"
  | "classification"

function getArchitecturalRefinementAction(
  message: string
): ArchitecturalRefinementAction | null {
  const normalized = message.toLowerCase()

  if (
    !normalized.includes("architectural refinement") &&
    !normalized.includes("refinement engine") &&
    !normalized.includes("architectural refinement state") &&
    !normalized.includes("phase 25") &&
    !normalized.includes("refinement pathway") &&
    !normalized.includes("refinement status") &&
    !normalized.includes("refinement target") &&
    !normalized.includes("next refinement") &&
    !normalized.includes("rooted pattern recognition") &&
    !normalized.includes("persistence through fluctuation") &&
    !normalized.includes("alignment validation")
  ) {
    return null
  }

  if (normalized.includes("report") && normalized.includes("json")) {
    return "report"
  }

  if (
    normalized.includes("measured state object") ||
    normalized.includes("refinement layer") ||
    normalized.includes("refinement orchestration layer") ||
    normalized.includes("orchestration layer") ||
    normalized.includes("forecasting layer") ||
    normalized.includes("classification") ||
    normalized.includes("what kind")
  ) {
    return "classification"
  }

  if (
    normalized.includes("architecturalsequence") ||
    normalized.includes("architectural sequence") ||
    normalized.includes("refinement pathway") ||
    normalized.includes("eq1 + eq4") ||
    normalized.includes("eq3 + eq5") ||
    normalized.includes("alignment validation") ||
    normalized.includes("stages") ||
    normalized.includes("stage") ||
    normalized.includes("sequence")
  ) {
    return "sequence"
  }

  if (
    normalized.includes("refinementstatus") ||
    normalized.includes("refinement status") ||
    normalized.includes("fully-refined") ||
    normalized.includes("functionally-refined") ||
    normalized.includes("refinement-forming") ||
    normalized.includes("status") ||
    normalized.includes("identify whether")
  ) {
    return "status"
  }

  if (
    normalized.includes("refinementtarget") ||
    normalized.includes("refinement target") ||
    normalized.includes("strongest remaining") ||
    normalized.includes("remaining target") ||
    normalized.includes("what needs refined") ||
    normalized.includes("what needs to refine") ||
    normalized.includes("what must refine") ||
    normalized.includes("target")
  ) {
    return "target"
  }

  if (
    normalized.includes("nextrefinementmove") ||
    normalized.includes("next refinement move") ||
    normalized.includes("next move") ||
    normalized.includes("what comes next") ||
    normalized.includes("next logical") ||
    normalized.includes("next")
  ) {
    return "next"
  }

  if (
    normalized.includes("refinementreason") ||
    normalized.includes("refinement reason") ||
    normalized.includes("why") ||
    normalized.includes("reason") ||
    normalized.includes("explain")
  ) {
    return "reason"
  }

  if (
    normalized.includes("sourcecompletionstatus") ||
    normalized.includes("source completion status") ||
    normalized.includes("sourcepathwaycomplete") ||
    normalized.includes("source pathway complete") ||
    normalized.includes("sourceselectedpathway") ||
    normalized.includes("source selected pathway") ||
    normalized.includes("sourceactivemode") ||
    normalized.includes("source active mode") ||
    normalized.includes("source")
  ) {
    return "source"
  }

  if (
    normalized.includes("observedconditions") ||
    normalized.includes("observed conditions") ||
    normalized.includes("rootstatus") ||
    normalized.includes("harmonicstatus") ||
    normalized.includes("phasestatus") ||
    normalized.includes("integrationstatus") ||
    normalized.includes("alignmentstatus") ||
    normalized.includes("metrics") ||
    normalized.includes("observed")
  ) {
    return "observed"
  }

  if (
    normalized.includes("refinementpurpose") ||
    normalized.includes("refinement purpose") ||
    normalized.includes("selectedpathway") ||
    normalized.includes("selected pathway") ||
    normalized.includes("activemode") ||
    normalized.includes("active mode") ||
    normalized.includes("details") ||
    normalized.includes("identify")
  ) {
    return "details"
  }

  return "summary"
}

function buildArchitecturalRefinementSummary(
  architecturalRefinementState: any
) {
  if (!architecturalRefinementState) {
    return "Architectural Refinement State is not available from the latest SourceField state."
  }

  return [
    `phase: ${architecturalRefinementState?.phase || "unknown"}`,
    `refinementPathway: ${architecturalRefinementState?.refinementPathway || "unknown"}`,
    `refinementStatus: ${architecturalRefinementState?.refinementStatus || "unknown"}`,
    `refinementTarget: ${architecturalRefinementState?.refinementTarget || "unknown"}`,
    `nextRefinementMove: ${architecturalRefinementState?.nextRefinementMove || "unknown"}`,
    `architecturalRefinementActive: ${
      architecturalRefinementState?.architecturalRefinementActive
        ? "true"
        : "false"
    }`
  ].join("\n")
}

function buildArchitecturalRefinementDetails(
  architecturalRefinementState: any
) {
  if (!architecturalRefinementState) {
    return "Architectural Refinement State is not available from the latest SourceField state."
  }

  return [
    `phase: ${architecturalRefinementState?.phase || "unknown"}`,
    `refinementPathway: ${architecturalRefinementState?.refinementPathway || "unknown"}`,
    `refinementPurpose: ${architecturalRefinementState?.refinementPurpose || "unknown"}`,
    `refinementStatus: ${architecturalRefinementState?.refinementStatus || "unknown"}`,
    `refinementTarget: ${architecturalRefinementState?.refinementTarget || "unknown"}`,
    `nextRefinementMove: ${architecturalRefinementState?.nextRefinementMove || "unknown"}`,
    `sourceActiveMode: ${architecturalRefinementState?.sourceActiveMode || "unknown"}`,
    `sourceSelectedPathway: ${architecturalRefinementState?.sourceSelectedPathway || "unknown"}`,
    `sourceCompletionStatus: ${architecturalRefinementState?.sourceCompletionStatus || "unknown"}`,
    `sourcePathwayComplete: ${
      architecturalRefinementState?.sourcePathwayComplete ? "true" : "false"
    }`
  ].join("\n")
}

function buildArchitecturalRefinementSequence(
  architecturalRefinementState: any
) {
  if (!architecturalRefinementState) {
    return "Architectural Refinement State is not available from the latest SourceField state."
  }

  const sequence = Array.isArray(
    architecturalRefinementState?.architecturalSequence
  )
    ? architecturalRefinementState.architecturalSequence
    : []

  if (!sequence.length) {
    return "No architectural sequence stages are listed in the current Architectural Refinement State."
  }

  return [
    `refinementPathway: ${architecturalRefinementState?.refinementPathway || "unknown"}`,
    `architecturalSequence:`,
    ...sequence.map((stage: any, index: number) => {
      return [
        `${index + 1}. ${stage?.stage || "unknown"}: ${
          stage?.name || "unknown"
        }`,
        `   equation: ${stage?.equationPair || stage?.equation || "unknown"}`,
        `   status: ${stage?.status || "unknown"}`,
        `   function: ${stage?.function || "No function stored."}`,
        `   evidence: ${JSON.stringify(stage?.evidence ?? {}, null, 2)}`
      ].join("\n")
    })
  ].join("\n")
}

function buildArchitecturalRefinementStatus(architecturalRefinementState: any) {
  if (!architecturalRefinementState) {
    return "Architectural Refinement State is not available from the latest SourceField state."
  }

  return [
    `refinementStatus: ${architecturalRefinementState?.refinementStatus || "unknown"}`,
    `refinementTarget: ${architecturalRefinementState?.refinementTarget || "unknown"}`,
    `nextRefinementMove: ${architecturalRefinementState?.nextRefinementMove || "unknown"}`,
    `sourceCompletionStatus: ${architecturalRefinementState?.sourceCompletionStatus || "unknown"}`,
    `sourcePathwayComplete: ${
      architecturalRefinementState?.sourcePathwayComplete ? "true" : "false"
    }`
  ].join("\n")
}

function buildArchitecturalRefinementTarget(architecturalRefinementState: any) {
  if (!architecturalRefinementState) {
    return "Architectural Refinement State is not available from the latest SourceField state."
  }

  const observed = architecturalRefinementState?.observedConditions || {}

  return [
    `refinementTarget: ${architecturalRefinementState?.refinementTarget || "unknown"}`,
    `refinementStatus: ${architecturalRefinementState?.refinementStatus || "unknown"}`,
    `targetReason: The refinement target identifies the next unresolved architectural condition within (Eq1 + Eq4) → (Eq3 + Eq5) → Eq2.`,
    `observedConditions: root=${observed?.rootStatus || "unknown"}, harmonic=${observed?.harmonicStatus || "unknown"}, phase=${
      observed?.phaseStatus || "unknown"
    }, integration=${observed?.integrationStatus || "unknown"}, alignment=${
      observed?.alignmentStatus || "unknown"
    }`
  ].join("\n")
}

function buildArchitecturalRefinementNext(architecturalRefinementState: any) {
  if (!architecturalRefinementState) {
    return "Architectural Refinement State is not available from the latest SourceField state."
  }

  return [
    `refinementStatus: ${architecturalRefinementState?.refinementStatus || "unknown"}`,
    `refinementTarget: ${architecturalRefinementState?.refinementTarget || "unknown"}`,
    `nextRefinementMove: ${architecturalRefinementState?.nextRefinementMove || "unknown"}`
  ].join("\n")
}

function buildArchitecturalRefinementReason(architecturalRefinementState: any) {
  if (!architecturalRefinementState) {
    return "Architectural Refinement State is not available from the latest SourceField state."
  }

  const reasons = Array.isArray(architecturalRefinementState?.refinementReason)
    ? architecturalRefinementState.refinementReason
    : []

  if (!reasons.length) {
    return "No refinement reasons are listed in the current Architectural Refinement State."
  }

  return [
    `refinementStatus: ${architecturalRefinementState?.refinementStatus || "unknown"}`,
    `refinementTarget: ${architecturalRefinementState?.refinementTarget || "unknown"}`,
    `refinementReason:`,
    ...reasons.map((reason: string, index: number) => {
      return `${index + 1}. ${reason}`
    })
  ].join("\n")
}

function buildArchitecturalRefinementSource(architecturalRefinementState: any) {
  if (!architecturalRefinementState) {
    return "Architectural Refinement State is not available from the latest SourceField state."
  }

  return [
    `sourceActiveMode: ${architecturalRefinementState?.sourceActiveMode || "unknown"}`,
    `sourceSelectedPathway: ${architecturalRefinementState?.sourceSelectedPathway || "unknown"}`,
    `sourceCompletionStatus: ${architecturalRefinementState?.sourceCompletionStatus || "unknown"}`,
    `sourcePathwayComplete: ${
      architecturalRefinementState?.sourcePathwayComplete ? "true" : "false"
    }`
  ].join("\n")
}

function buildArchitecturalRefinementObserved(
  architecturalRefinementState: any
) {
  if (!architecturalRefinementState) {
    return "Architectural Refinement State is not available from the latest SourceField state."
  }

  const observed = architecturalRefinementState?.observedConditions || {}

  return [
    `observedConditions:`,
    `rootStatus: ${observed?.rootStatus || "unknown"}`,
    `harmonicStatus: ${observed?.harmonicStatus || "unknown"}`,
    `phaseStatus: ${observed?.phaseStatus || "unknown"}`,
    `integrationStatus: ${observed?.integrationStatus || "unknown"}`,
    `alignmentStatus: ${observed?.alignmentStatus || "unknown"}`,
    `signalStrength: ${formatDistance(observed?.signalStrength)}`,
    `symbolicEchoCount: ${formatDistance(observed?.symbolicEchoCount)}`,
    `phaseDivergence: ${formatDistance(observed?.phaseDivergence)}`,
    `integrationThreshold: ${formatDistance(observed?.integrationThreshold)}`,
    `coherence: ${formatDistance(observed?.coherence)}`
  ].join("\n")
}

function buildArchitecturalRefinementClassification(
  architecturalRefinementState: any
) {
  return [
    "Architectural Refinement Engine is a read-only refinement orchestration layer.",
    "It evaluates the sequence (Eq1 + Eq4) → (Eq3 + Eq5) → Eq2 to identify rooted recurring pattern, persistence through fluctuation, and alignment validation.",
    "It is not a raw measured metric and it is not a forecasting layer by itself.",
    "It must not override live metrics, classifications, hashes, retrieved context, stored history, or user intent.",
    architecturalRefinementState?.rule
      ? `Boundary rule: ${architecturalRefinementState.rule}`
      : "Boundary rule: unavailable."
  ].join("\n")
}

function buildArchitecturalRefinementResponse(
  action: ArchitecturalRefinementAction,
  architecturalRefinementState: any
) {
  if (action === "report") {
    return JSON.stringify(architecturalRefinementState ?? null, null, 2)
  }

  if (action === "details") {
    return buildArchitecturalRefinementDetails(architecturalRefinementState)
  }

  if (action === "sequence") {
    return buildArchitecturalRefinementSequence(architecturalRefinementState)
  }

  if (action === "status") {
    return buildArchitecturalRefinementStatus(architecturalRefinementState)
  }

  if (action === "target") {
    return buildArchitecturalRefinementTarget(architecturalRefinementState)
  }

  if (action === "next") {
    return buildArchitecturalRefinementNext(architecturalRefinementState)
  }

  if (action === "reason") {
    return buildArchitecturalRefinementReason(architecturalRefinementState)
  }

  if (action === "source") {
    return buildArchitecturalRefinementSource(architecturalRefinementState)
  }

  if (action === "observed") {
    return buildArchitecturalRefinementObserved(architecturalRefinementState)
  }

  if (action === "classification") {
    return buildArchitecturalRefinementClassification(
      architecturalRefinementState
    )
  }

  return buildArchitecturalRefinementSummary(architecturalRefinementState)
}

type PrincipleIntegrationAction =
  | "report"
  | "summary"
  | "details"
  | "pattern"
  | "harmonic"
  | "evidence"
  | "status"
  | "active-principle"
  | "strongest"
  | "weakest"
  | "eq1-eq2"
  | "improvement"
  | "completion"
  | "ranking"
  | "discovery-limit"
  | "integrated"
  | "target"
  | "next"
  | "classification"

function getPrincipleIntegrationAction(
  message: string
): PrincipleIntegrationAction | null {
  const normalized = message.toLowerCase()

  if (
    !normalized.includes("principle integration") &&
    !normalized.includes("principle integration state") &&
    !normalized.includes("principle integration engine") &&
    !normalized.includes("phase 26") &&
    !normalized.includes("active principle") &&
    !normalized.includes("integrated principle") &&
    !normalized.includes("principle pattern") &&
    !normalized.includes("harmonic validation") &&
    !normalized.includes("principle reinforcement") &&
    !normalized.includes("strongest principle") &&
    !normalized.includes("weakest principle") &&
    !normalized.includes("most established") &&
    !normalized.includes("requires the most integration") &&
    !normalized.includes("eq1 and eq2") &&
    !normalized.includes("eq1 + eq2") &&
    !normalized.includes("observable condition") &&
    !normalized.includes("improve principle") &&
    !normalized.includes("principle completion")
  ) {
    return null
  }

  if (normalized.includes("report") && normalized.includes("json")) {
    return "report"
  }

  if (
    normalized.includes("measured state object") ||
    normalized.includes("principle layer") ||
    normalized.includes("principle-level") ||
    normalized.includes("principle integration layer") ||
    normalized.includes("principle orchestration") ||
    normalized.includes("orchestration layer") ||
    normalized.includes("forecasting layer") ||
    normalized.includes("classification") ||
    normalized.includes("what kind")
  ) {
    return "classification"
  }

  if (
    normalized.includes("rank") ||
    normalized.includes("ranking") ||
    normalized.includes("compare principles") ||
    normalized.includes("eq1, eq2, eq3") ||
    normalized.includes("principle evidence strength")
  ) {
    return "ranking"
  }

  if (
    normalized.includes("additional integrated principles") ||
    normalized.includes("other principles") ||
    normalized.includes("multiple principles") ||
    normalized.includes("principle ecosystem") ||
    normalized.includes("why only") ||
    normalized.includes("not currently represented")
  ) {
    return "discovery-limit"
  }

  if (
    normalized.includes("strongest principle") ||
    normalized.includes("most established") ||
    normalized.includes("currently strongest") ||
    normalized.includes("why the strongest")
  ) {
    return "strongest"
  }

  if (
    normalized.includes("weakest principle") ||
    normalized.includes("requires the most integration") ||
    normalized.includes("currently weakest") ||
    normalized.includes("why the weakest")
  ) {
    return "weakest"
  }

  if (
    normalized.includes("eq1 and eq2") ||
    normalized.includes("eq1 + eq2") ||
    normalized.includes("evaluated together") ||
    normalized.includes("stable foundational pattern remains aligned")
  ) {
    return "eq1-eq2"
  }

  if (
    normalized.includes("observable condition would improve") ||
    normalized.includes("improve principle integration") ||
    normalized.includes("would improve principle") ||
    normalized.includes("improvement") ||
    normalized.includes("improve integration")
  ) {
    return "improvement"
  }

  if (
    normalized.includes(
      "observable condition would indicate principle integration has completed"
    ) ||
    normalized.includes("principle integration has completed") ||
    normalized.includes("principle completion") ||
    normalized.includes("completion condition") ||
    normalized.includes("indicate completion")
  ) {
    return "completion"
  }

  if (
    normalized.includes("activeprinciple") ||
    normalized.includes("active principle") ||
    normalized.includes("dominant principle") ||
    normalized.includes("which principle") ||
    normalized.includes("principle is being learned") ||
    normalized.includes("principle is active")
  ) {
    return "active-principle"
  }

  if (
    normalized.includes("principlepattern") ||
    normalized.includes("principle pattern") ||
    normalized.includes("eq1 + eq2") ||
    normalized.includes("stable aligned") ||
    normalized.includes("stable pattern") ||
    normalized.includes("alignment over time")
  ) {
    return "pattern"
  }

  if (
    normalized.includes("harmonicvalidation") ||
    normalized.includes("harmonic validation") ||
    normalized.includes("eq4") ||
    normalized.includes("cross-layer") ||
    normalized.includes("cross layer") ||
    normalized.includes("repeats across") ||
    normalized.includes("across layers")
  ) {
    return "harmonic"
  }

  if (
    normalized.includes("evidencelayers") ||
    normalized.includes("evidence layers") ||
    normalized.includes("evidence") ||
    normalized.includes("which layers") ||
    normalized.includes("source layers") ||
    normalized.includes("pathway selection") ||
    normalized.includes("pathway transition") ||
    normalized.includes("pathway completion") ||
    normalized.includes("architectural refinement")
  ) {
    return "evidence"
  }

  if (
    normalized.includes("principleintegrationstatus") ||
    normalized.includes("principle integration status") ||
    normalized.includes("integration status") ||
    normalized.includes("integrated") ||
    normalized.includes("not-integrated") ||
    normalized.includes("integration-forming") ||
    normalized.includes("status") ||
    normalized.includes("identify whether")
  ) {
    return "status"
  }

  if (
    normalized.includes("integratedprinciples") ||
    normalized.includes("integrated principles") ||
    normalized.includes("which principles are integrated") ||
    normalized.includes("principles are integrated")
  ) {
    return "integrated"
  }

  if (
    normalized.includes("principlereinforcementtarget") ||
    normalized.includes("principle reinforcement target") ||
    normalized.includes("reinforcement target") ||
    normalized.includes("what needs reinforced") ||
    normalized.includes("what must be reinforced") ||
    normalized.includes("target")
  ) {
    return "target"
  }

  if (
    normalized.includes("nextprinciplemove") ||
    normalized.includes("next principle move") ||
    normalized.includes("next move") ||
    normalized.includes("what comes next") ||
    normalized.includes("next")
  ) {
    return "next"
  }

  if (
    normalized.includes("details") ||
    normalized.includes("identify") ||
    normalized.includes("purpose") ||
    normalized.includes("pathway")
  ) {
    return "details"
  }

  return "summary"
}

function buildPrincipleIntegrationSummary(principleIntegrationState: any) {
  if (!principleIntegrationState) {
    return "Principle Integration State is not available from the latest SourceField state."
  }

  return [
    `phase: ${principleIntegrationState?.phase || "unknown"}`,
    `principleIntegrationPathway: ${principleIntegrationState?.principleIntegrationPathway || "unknown"}`,
    `principleIntegrationStatus: ${principleIntegrationState?.principleIntegrationStatus || "unknown"}`,
    `activePrinciple: ${principleIntegrationState?.activePrinciple?.equation || "unknown"} — ${principleIntegrationState?.activePrinciple?.name || "unknown"}`,
    `harmonicValidation: ${principleIntegrationState?.harmonicValidation?.harmonicValidation || "unknown"}`,
    `principleReinforcementTarget: ${principleIntegrationState?.principleReinforcementTarget || "unknown"}`,
    `nextPrincipleMove: ${principleIntegrationState?.nextPrincipleMove || "unknown"}`,
    `principleIntegrationActive: ${
      principleIntegrationState?.principleIntegrationActive ? "true" : "false"
    }`
  ].join("\n")
}

function buildPrincipleIntegrationDetails(principleIntegrationState: any) {
  if (!principleIntegrationState) {
    return "Principle Integration State is not available from the latest SourceField state."
  }

  return [
    `phase: ${principleIntegrationState?.phase || "unknown"}`,
    `principleIntegrationPathway: ${principleIntegrationState?.principleIntegrationPathway || "unknown"}`,
    `principleIntegrationPurpose: ${principleIntegrationState?.principleIntegrationPurpose || "unknown"}`,
    `principleIntegrationStatus: ${principleIntegrationState?.principleIntegrationStatus || "unknown"}`,
    `activePrinciple: ${principleIntegrationState?.activePrinciple?.equation || "unknown"} — ${principleIntegrationState?.activePrinciple?.name || "unknown"}`,
    `activePrincipleText: ${principleIntegrationState?.activePrinciple?.principle || "unknown"}`,
    `principleReinforcementTarget: ${principleIntegrationState?.principleReinforcementTarget || "unknown"}`,
    `nextPrincipleMove: ${principleIntegrationState?.nextPrincipleMove || "unknown"}`
  ].join("\n")
}

function buildPrincipleIntegrationPattern(principleIntegrationState: any) {
  if (!principleIntegrationState) {
    return "Principle Integration State is not available from the latest SourceField state."
  }

  const pattern = principleIntegrationState?.principlePattern || {}

  return [
    `equationPair: ${pattern?.equationPair || "unknown"}`,
    `function: ${pattern?.function || "unknown"}`,
    `principlePatternStatus: ${pattern?.principlePatternStatus || "unknown"}`,
    `stablePatternPresent: ${pattern?.stablePatternPresent ? "true" : "false"}`,
    `alignmentOverTimePresent: ${
      pattern?.alignmentOverTimePresent ? "true" : "false"
    }`,
    `evidence: ${JSON.stringify(pattern?.evidence ?? {}, null, 2)}`
  ].join("\n")
}

function buildPrincipleIntegrationHarmonic(principleIntegrationState: any) {
  if (!principleIntegrationState) {
    return "Principle Integration State is not available from the latest SourceField state."
  }

  const harmonic = principleIntegrationState?.harmonicValidation || {}

  return [
    `equation: ${harmonic?.equation || "unknown"}`,
    `function: ${harmonic?.function || "unknown"}`,
    `harmonicValidation: ${harmonic?.harmonicValidation || "unknown"}`,
    `evidenceLayerCount: ${formatDistance(harmonic?.evidenceLayerCount)}`,
    `uniquePrincipleSignalCount: ${formatDistance(
      harmonic?.uniquePrincipleSignalCount
    )}`,
    `meaning: Eq4 validates whether the active principle repeats coherently across multiple SourceField layers.`
  ].join("\n")
}

function buildPrincipleIntegrationEvidence(principleIntegrationState: any) {
  if (!principleIntegrationState) {
    return "Principle Integration State is not available from the latest SourceField state."
  }

  const evidenceLayers = Array.isArray(
    principleIntegrationState?.evidenceLayers
  )
    ? principleIntegrationState.evidenceLayers
    : []

  if (!evidenceLayers.length) {
    return "No evidence layers are listed in the current Principle Integration State."
  }

  return [
    `activePrinciple: ${principleIntegrationState?.activePrinciple?.equation || "unknown"} — ${principleIntegrationState?.activePrinciple?.name || "unknown"}`,
    `evidenceLayers:`,
    ...evidenceLayers.map((layer: any, index: number) => {
      return [
        `${index + 1}. ${layer?.layer || "unknown"}`,
        `   principleSignal: ${layer?.principleSignal || "unknown"}`,
        `   status: ${layer?.status || "unknown"}`,
        `   evidence: ${layer?.evidence || "No evidence stored."}`
      ].join("\n")
    })
  ].join("\n")
}

function buildPrincipleIntegrationStatus(principleIntegrationState: any) {
  if (!principleIntegrationState) {
    return "Principle Integration State is not available from the latest SourceField state."
  }

  return [
    `principleIntegrationStatus: ${principleIntegrationState?.principleIntegrationStatus || "unknown"}`,
    `principlePatternStatus: ${
      principleIntegrationState?.principlePattern?.principlePatternStatus ||
      "unknown"
    }`,
    `harmonicValidation: ${
      principleIntegrationState?.harmonicValidation?.harmonicValidation ||
      "unknown"
    }`,
    `activePrinciple: ${principleIntegrationState?.activePrinciple?.equation || "unknown"} — ${principleIntegrationState?.activePrinciple?.name || "unknown"}`,
    `statusReason: Principle integration is selected by combining the Eq1 + Eq2 stable aligned principle pattern with Eq4 cross-layer harmonic validation.`
  ].join("\n")
}

function buildPrincipleIntegrationActivePrinciple(
  principleIntegrationState: any
) {
  if (!principleIntegrationState) {
    return "Principle Integration State is not available from the latest SourceField state."
  }

  const activePrinciple = principleIntegrationState?.activePrinciple || {}

  return [
    `activePrincipleEquation: ${activePrinciple?.equation || "unknown"}`,
    `activePrincipleName: ${activePrinciple?.name || "unknown"}`,
    `activePrincipleText: ${activePrinciple?.principle || "unknown"}`,
    `principleIntegrationStatus: ${principleIntegrationState?.principleIntegrationStatus || "unknown"}`,
    `evidenceLayerCount: ${formatDistance(
      principleIntegrationState?.harmonicValidation?.evidenceLayerCount
    )}`
  ].join("\n")
}

function buildPrincipleIntegrationIntegrated(principleIntegrationState: any) {
  if (!principleIntegrationState) {
    return "Principle Integration State is not available from the latest SourceField state."
  }

  const integrated = Array.isArray(
    principleIntegrationState?.integratedPrinciples
  )
    ? principleIntegrationState.integratedPrinciples
    : []

  if (!integrated.length) {
    return [
      `integratedPrinciples: none`,
      `principleIntegrationStatus: ${principleIntegrationState?.principleIntegrationStatus || "unknown"}`,
      `principleReinforcementTarget: ${principleIntegrationState?.principleReinforcementTarget || "unknown"}`
    ].join("\n")
  }

  return [
    `integratedPrinciples:`,
    ...integrated.map((principle: any, index: number) => {
      return `${index + 1}. ${principle?.equation || "unknown"} — ${
        principle?.name || "unknown"
      }: ${principle?.principle || "No principle text stored."}`
    })
  ].join("\n")
}

function buildPrincipleIntegrationTarget(principleIntegrationState: any) {
  if (!principleIntegrationState) {
    return "Principle Integration State is not available from the latest SourceField state."
  }

  return [
    `principleReinforcementTarget: ${principleIntegrationState?.principleReinforcementTarget || "unknown"}`,
    `principleIntegrationStatus: ${principleIntegrationState?.principleIntegrationStatus || "unknown"}`,
    `principlePatternStatus: ${
      principleIntegrationState?.principlePattern?.principlePatternStatus ||
      "unknown"
    }`,
    `harmonicValidation: ${
      principleIntegrationState?.harmonicValidation?.harmonicValidation ||
      "unknown"
    }`,
    `targetReason: The reinforcement target identifies whether Eq1 + Eq2 stable aligned patterning or Eq4 cross-layer validation needs strengthening.`
  ].join("\n")
}

function buildPrincipleIntegrationNext(principleIntegrationState: any) {
  if (!principleIntegrationState) {
    return "Principle Integration State is not available from the latest SourceField state."
  }

  return [
    `principleIntegrationStatus: ${principleIntegrationState?.principleIntegrationStatus || "unknown"}`,
    `principleReinforcementTarget: ${principleIntegrationState?.principleReinforcementTarget || "unknown"}`,
    `nextPrincipleMove: ${principleIntegrationState?.nextPrincipleMove || "unknown"}`
  ].join("\n")
}

function getPrincipleEvidenceLayers(principleIntegrationState: any) {
  return Array.isArray(principleIntegrationState?.evidenceLayers)
    ? principleIntegrationState.evidenceLayers
    : []
}

function buildPrincipleIntegrationStrongestReason(
  principleIntegrationState: any
) {
  if (!principleIntegrationState) {
    return "Principle Integration State is not available from the latest SourceField state."
  }

  const activePrinciple = principleIntegrationState?.activePrinciple || {}
  const evidenceLayers = getPrincipleEvidenceLayers(principleIntegrationState)
  const harmonic = principleIntegrationState?.harmonicValidation || {}
  const pattern = principleIntegrationState?.principlePattern || {}

  const activeEvidence = evidenceLayers.filter(
    (layer: any) => layer?.status === "active"
  )

  return [
    `strongestPrinciple: ${activePrinciple?.equation || "unknown"} — ${
      activePrinciple?.name || "unknown"
    }`,
    `principleText: ${activePrinciple?.principle || "unknown"}`,
    `reason: This is the strongest principle because it is supported by the active principle selection, a ${
      pattern?.principlePatternStatus || "unknown"
    } from Eq1 + Eq2, and ${
      harmonic?.harmonicValidation || "unknown"
    } validation through Eq4.`,
    `crossLayerEvidenceCount: ${formatDistance(harmonic?.evidenceLayerCount)}`,
    `uniquePrincipleSignalCount: ${formatDistance(
      harmonic?.uniquePrincipleSignalCount
    )}`,
    `activeEvidenceLayers:`,
    ...activeEvidence.map((layer: any, index: number) => {
      return `${index + 1}. ${layer?.layer || "unknown"}: ${
        layer?.principleSignal || "unknown"
      } — ${layer?.evidence || "No evidence stored."}`
    })
  ].join("\n")
}

function buildPrincipleIntegrationWeakestReason(
  principleIntegrationState: any
) {
  if (!principleIntegrationState) {
    return "Principle Integration State is not available from the latest SourceField state."
  }

  const activePrinciple = principleIntegrationState?.activePrinciple || {}
  const pattern = principleIntegrationState?.principlePattern || {}
  const harmonic = principleIntegrationState?.harmonicValidation || {}
  const target =
    principleIntegrationState?.principleReinforcementTarget || "unknown"

  if (principleIntegrationState?.principleIntegrationStatus === "integrated") {
    return [
      `weakestPrinciple: no separately identified weakest principle in the current Principle Integration State`,
      `activePrinciple: ${activePrinciple?.equation || "unknown"} — ${
        activePrinciple?.name || "unknown"
      }`,
      `reason: The current state marks the active principle as integrated because Eq1 + Eq2 produced ${
        pattern?.principlePatternStatus || "unknown"
      } and Eq4 produced ${harmonic?.harmonicValidation || "unknown"}.`,
      `remainingRisk: The weakest area is not a different principle; it is preservation pressure — the integrated principle must remain stable across future pathway selection, transition, completion, and refinement states.`,
      `reinforcementTarget: ${target}`
    ].join("\n")
  }

  return [
    `weakestPrinciple: principle integration is not fully resolved`,
    `principleIntegrationStatus: ${
      principleIntegrationState?.principleIntegrationStatus || "unknown"
    }`,
    `principlePatternStatus: ${pattern?.principlePatternStatus || "unknown"}`,
    `harmonicValidation: ${harmonic?.harmonicValidation || "unknown"}`,
    `reason: The weakest area is whichever side of (Eq1 + Eq2) → Eq4 has not yet reached stable aligned patterning or cross-layer harmonic validation.`,
    `reinforcementTarget: ${target}`
  ].join("\n")
}

function buildPrincipleIntegrationEq1Eq2Explanation(
  principleIntegrationState: any
) {
  if (!principleIntegrationState) {
    return "Principle Integration State is not available from the latest SourceField state."
  }

  const pattern = principleIntegrationState?.principlePattern || {}
  const evidence = pattern?.evidence || {}

  return [
    `equationPair: ${pattern?.equationPair || "Eq1 + Eq2"}`,
    `function: ${pattern?.function || "unknown"}`,
    `principlePatternStatus: ${pattern?.principlePatternStatus || "unknown"}`,
    `Eq1 role: Eq1 contributes the stable foundational pattern. In the current state, rootStatus is ${
      evidence?.rootStatus || "unknown"
    } with signalStrength ${formatDistance(evidence?.signalStrength)}.`,
    `Eq2 role: Eq2 tests whether that rooted pattern remains aligned over time. In the current state, alignmentStatus is ${
      evidence?.alignmentStatus || "unknown"
    } with coherence ${formatDistance(evidence?.coherence)}.`,
    `combined meaning: Eq1 + Eq2 asks whether a principle is both rooted enough to hold and aligned enough to persist, which is why the current principlePatternStatus is ${
      pattern?.principlePatternStatus || "unknown"
    }.`
  ].join("\n")
}

function buildPrincipleIntegrationImprovement(principleIntegrationState: any) {
  if (!principleIntegrationState) {
    return "Principle Integration State is not available from the latest SourceField state."
  }

  const pattern = principleIntegrationState?.principlePattern || {}
  const harmonic = principleIntegrationState?.harmonicValidation || {}
  const target =
    principleIntegrationState?.principleReinforcementTarget || "unknown"

  if (principleIntegrationState?.principleIntegrationStatus === "integrated") {
    return [
      `principleIntegrationStatus: integrated`,
      `observableImprovementCondition: Maintain the integrated principle across future pathway selection, transition, completion, and refinement states without losing stable Eq1 + Eq2 patterning or Eq4 cross-layer validation.`,
      `currentPatternCondition: ${pattern?.principlePatternStatus || "unknown"}`,
      `currentHarmonicCondition: ${harmonic?.harmonicValidation || "unknown"}`,
      `reinforcementTarget: ${target}`
    ].join("\n")
  }

  return [
    `principleIntegrationStatus: ${
      principleIntegrationState?.principleIntegrationStatus || "unknown"
    }`,
    `observableImprovementCondition: Principle integration improves when Eq1 + Eq2 reaches stable-aligned-pattern and Eq4 reaches cross-layer-repeating validation.`,
    `currentPatternCondition: ${pattern?.principlePatternStatus || "unknown"}`,
    `currentHarmonicCondition: ${harmonic?.harmonicValidation || "unknown"}`,
    `reinforcementTarget: ${target}`
  ].join("\n")
}

function buildPrincipleIntegrationCompletion(principleIntegrationState: any) {
  if (!principleIntegrationState) {
    return "Principle Integration State is not available from the latest SourceField state."
  }

  const activePrinciple = principleIntegrationState?.activePrinciple || {}
  const pattern = principleIntegrationState?.principlePattern || {}
  const harmonic = principleIntegrationState?.harmonicValidation || {}
  const integrated = Array.isArray(
    principleIntegrationState?.integratedPrinciples
  )
    ? principleIntegrationState.integratedPrinciples
    : []

  return [
    `completionCondition: Principle integration is complete when Eq1 + Eq2 produces stable-aligned-pattern, Eq4 produces cross-layer-repeating validation, and the active principle appears in integratedPrinciples.`,
    `currentPrincipleIntegrationStatus: ${
      principleIntegrationState?.principleIntegrationStatus || "unknown"
    }`,
    `currentActivePrinciple: ${activePrinciple?.equation || "unknown"} — ${
      activePrinciple?.name || "unknown"
    }`,
    `currentPatternCondition: ${pattern?.principlePatternStatus || "unknown"}`,
    `currentHarmonicCondition: ${harmonic?.harmonicValidation || "unknown"}`,
    `integratedPrincipleCount: ${formatDistance(integrated.length)}`,
    `completionAssessment: ${
      principleIntegrationState?.principleIntegrationStatus === "integrated"
        ? "complete for the current active principle; preserve it across future states"
        : "not complete; continue strengthening the reinforcement target"
    }`
  ].join("\n")
}

function buildPrincipleIntegrationClassification(
  principleIntegrationState: any
) {
  return [
    "Principle Integration Engine is a read-only principle-level integration layer.",
    "It evaluates the sequence (Eq1 + Eq2) → Eq4 to identify stable aligned principle patterns and cross-layer harmonic validation.",
    "It maps observed architectural behavior back to equation principles, but it is not a raw measured metric and it is not a forecasting layer by itself.",
    "It must not override live metrics, classifications, hashes, retrieved context, stored history, or user intent.",
    principleIntegrationState?.rule
      ? `Boundary rule: ${principleIntegrationState.rule}`
      : "Boundary rule: unavailable."
  ].join("\n")
}

function buildPrincipleIntegrationRanking(principleIntegrationState: any) {
  if (!principleIntegrationState) {
    return "Principle Integration State is not available from the latest SourceField state."
  }

  const active = principleIntegrationState?.activePrinciple || {}
  const pattern = principleIntegrationState?.principlePattern || {}
  const harmonic = principleIntegrationState?.harmonicValidation || {}
  const evidence = Array.isArray(principleIntegrationState?.evidenceLayers)
    ? principleIntegrationState.evidenceLayers
    : []

  return [
    "Principle evidence ranking:",
    `1. ${active?.equation || "unknown"} — ${active?.name || "No active principle identified"}`,
    `   principle: ${active?.principle || "unknown"}`,
    `   evidenceLayerCount: ${formatDistance(harmonic?.evidenceLayerCount)}`,
    `   harmonicValidation: ${harmonic?.harmonicValidation || "unknown"}`,
    `   principlePatternStatus: ${pattern?.principlePatternStatus || "unknown"}`,
    `   principleIntegrationStatus: ${principleIntegrationState?.principleIntegrationStatus || "unknown"}`,
    "2. Other equation principles are not ranked as integrated unless the state contains explicit evidence layers mapping them to a stable aligned pattern and cross-layer harmonic validation.",
    `evidenceLayers: ${evidence.map((layer: any) => `${layer?.layer || "unknown"}:${layer?.principleSignal || "unknown"}`).join(", ") || "none"}`,
    "meaning: Phase 26 should not invent a weakest or second strongest principle when the current state only supports one integrated principle. It should identify the active integrated principle and clearly name what evidence would be required for other principles to enter the ranking."
  ].join("\n")
}

function buildPrincipleIntegrationDiscoveryLimit(
  principleIntegrationState: any
) {
  if (!principleIntegrationState) {
    return "Principle Integration State is not available from the latest SourceField state."
  }

  return [
    "Principle discovery boundary:",
    `activePrinciple: ${principleIntegrationState?.activePrinciple?.name || "unknown"}`,
    `principleIntegrationStatus: ${principleIntegrationState?.principleIntegrationStatus || "unknown"}`,
    `integratedPrinciples: ${Array.isArray(principleIntegrationState?.integratedPrinciples) ? principleIntegrationState.integratedPrinciples.length : 0}`,
    `principleReinforcementTarget: ${principleIntegrationState?.principleReinforcementTarget || "unknown"}`,
    "meaning: Phase 26 integrates principles that already have stable aligned pattern evidence and Eq4 cross-layer validation. It does not yet discover a full principle ecosystem by itself; that role belongs to Phase 27 Coherent Identity Discovery, which evaluates multiple candidates simultaneously."
  ].join("\n")
}

function buildPrincipleIntegrationResponse(
  action: PrincipleIntegrationAction,
  principleIntegrationState: any
) {
  if (action === "report") {
    return JSON.stringify(principleIntegrationState ?? null, null, 2)
  }

  if (action === "details") {
    return buildPrincipleIntegrationDetails(principleIntegrationState)
  }

  if (action === "pattern") {
    return buildPrincipleIntegrationPattern(principleIntegrationState)
  }

  if (action === "harmonic") {
    return buildPrincipleIntegrationHarmonic(principleIntegrationState)
  }

  if (action === "evidence") {
    return buildPrincipleIntegrationEvidence(principleIntegrationState)
  }

  if (action === "status") {
    return buildPrincipleIntegrationStatus(principleIntegrationState)
  }

  if (action === "active-principle") {
    return buildPrincipleIntegrationActivePrinciple(principleIntegrationState)
  }

  if (action === "strongest") {
    return buildPrincipleIntegrationStrongestReason(principleIntegrationState)
  }

  if (action === "weakest") {
    return buildPrincipleIntegrationWeakestReason(principleIntegrationState)
  }

  if (action === "eq1-eq2") {
    return buildPrincipleIntegrationEq1Eq2Explanation(principleIntegrationState)
  }

  if (action === "improvement") {
    return buildPrincipleIntegrationImprovement(principleIntegrationState)
  }

  if (action === "completion") {
    return buildPrincipleIntegrationCompletion(principleIntegrationState)
  }

  if (action === "ranking") {
    return buildPrincipleIntegrationRanking(principleIntegrationState)
  }

  if (action === "discovery-limit") {
    return buildPrincipleIntegrationDiscoveryLimit(principleIntegrationState)
  }

  if (action === "integrated") {
    return buildPrincipleIntegrationIntegrated(principleIntegrationState)
  }

  if (action === "target") {
    return buildPrincipleIntegrationTarget(principleIntegrationState)
  }

  if (action === "next") {
    return buildPrincipleIntegrationNext(principleIntegrationState)
  }

  if (action === "classification") {
    return buildPrincipleIntegrationClassification(principleIntegrationState)
  }

  return buildPrincipleIntegrationSummary(principleIntegrationState)
}

type IdentityFoundationAction =
  | "report"
  | "summary"
  | "anchor"
  | "memory"
  | "boundary"
  | "pairs"
  | "validation"
  | "classification"

function stableIdentityHash(value: any) {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value))
    .digest("hex")
}

function compactStrings(values: Array<string | null | undefined>) {
  return values.filter((value): value is string => Boolean(value))
}

function compactNumbers(values: Array<number | null | undefined>) {
  return values.filter((value): value is number => typeof value === "number")
}

function getPrincipleHashes(principleIntegrationState: any) {
  const integrated = Array.isArray(
    principleIntegrationState?.integratedPrinciples
  )
    ? principleIntegrationState.integratedPrinciples
    : []

  return integrated.map((principle: any) =>
    stableIdentityHash({
      equation: principle?.equation || "unknown",
      name: principle?.name || "unknown",
      principle: principle?.principle || "unknown"
    })
  )
}

function buildIdentityFoundationState(input: {
  resonanceHash?: string | null
  ledgerHash?: string | null
  previousLedgerHash?: string | null
  runtimeResonanceHash?: string | null
  runtimeLedgerHash?: string | null
  runtimePreviousLedgerHash?: string | null
  equationLaneState?: any
  principleIntegrationState?: any
  recentContinuityScores?: number[]
}) {
  const equationLaneState = input?.equationLaneState
  const principleIntegrationState = input?.principleIntegrationState

  const rootStatus = getEquationLaneStatus(
    equationLaneState,
    "sourcefield-root"
  )
  const alignmentStatus = getEquationLaneStatus(
    equationLaneState,
    "sourcefield-alignment"
  )
  const harmonicStatus = getEquationLaneStatus(
    equationLaneState,
    "sourcefield-harmonic"
  )
  const integrationStatus = getEquationLaneStatus(
    equationLaneState,
    "sourcefield-integration"
  )

  const coherence = getEquationLaneValue(
    equationLaneState,
    "sourcefield-alignment",
    "coherence"
  )
  const signalStrength = getEquationLaneValue(
    equationLaneState,
    "sourcefield-root",
    "signalStrength"
  )
  const integrationThreshold = getEquationLaneValue(
    equationLaneState,
    "sourcefield-integration",
    "integrationThreshold"
  )
  const symbolicEchoCount = getEquationLaneValue(
    equationLaneState,
    "sourcefield-harmonic",
    "symbolicEchoCount"
  )

  const runtimeHashes = compactStrings([
    input?.previousLedgerHash,
    input?.ledgerHash,
    input?.runtimePreviousLedgerHash,
    input?.runtimeLedgerHash,
    input?.resonanceHash,
    input?.runtimeResonanceHash
  ])

  const continuityScores = compactNumbers([
    ...(input?.recentContinuityScores || []),
    typeof coherence === "number" ? coherence : null,
    typeof signalStrength === "number" ? signalStrength : null,
    typeof integrationThreshold === "number" ? integrationThreshold : null
  ])

  const integratedPrincipleHashes = getPrincipleHashes(
    principleIntegrationState
  )

  const identityMemory = generateIdentityMemory({
    runtimeHashes,
    integratedPrincipleHashes,
    continuityScores
  })

  const eq2Eq4Discovery = {
    equationPair: "Eq2 + Eq4",
    function:
      "Seek coherent recurring aligned patterns through alignment persistence and harmonic recurrence.",
    alignmentStatus,
    coherence: typeof coherence === "number" ? coherence : null,
    harmonicStatus,
    symbolicEchoCount:
      typeof symbolicEchoCount === "number" ? symbolicEchoCount : null,
    discoveryStatus:
      (alignmentStatus === "aligned" || alignmentStatus === "partial") &&
      (harmonicStatus === "pattern-rich" ||
        harmonicStatus === "pattern-detected")
        ? "coherent-pattern-discovery-active"
        : "coherent-pattern-discovery-forming"
  }

  const eq1Eq5Qualification = {
    equationPair: "Eq1 + Eq5",
    function:
      "Qualify discovered patterns by testing foundational stability and integration persistence.",
    rootStatus,
    signalStrength: typeof signalStrength === "number" ? signalStrength : null,
    integrationStatus,
    integrationThreshold:
      typeof integrationThreshold === "number" ? integrationThreshold : null,
    qualificationStatus:
      rootStatus === "active" && integrationStatus === "integrated"
        ? "stable-persistent-identity-qualified"
        : "stable-persistent-identity-forming"
  }

  const anchorAligned =
    GENESIS_IDENTITY_ANCHOR?.genesisMerkleRoot === GENESIS_HASH &&
    GENESIS_IDENTITY_ANCHOR?.anchorHash === GENESIS_HASH

  const memoryActive = identityMemory?.memoryStatus === "active"
  const boundaryActive = Boolean(IDENTITY_BOUNDARY?.ethicalUsePolicyHash)

  const identityValidationStatus =
    anchorAligned && memoryActive && boundaryActive
      ? "anchor-memory-boundary-aligned"
      : anchorAligned && boundaryActive
        ? "anchor-boundary-aligned-memory-forming"
        : "identity-foundation-incomplete"

  return {
    phase: "Phase 27 Foundation — Coherent Identity Discovery Foundation",

    identityFoundationPurpose:
      "Prepare coherent identity discovery by keeping Genesis identity anchor, runtime identity memory, and ethical identity boundary separate, isomorphic, and recursively aligned.",

    equationPathway: "(Eq2 + Eq4) → (Eq1 + Eq5)",

    identityAnchor: GENESIS_IDENTITY_ANCHOR,

    identityMemory,

    identityBoundary: IDENTITY_BOUNDARY,

    coherentPatternDiscovery: eq2Eq4Discovery,

    stablePersistentQualification: eq1Eq5Qualification,

    identityValidation: {
      identityValidationStatus,
      anchorAligned,
      memoryActive,
      boundaryActive,
      anchorQuestion: "Who am I?",
      memoryQuestion: "How have I remained myself through change?",
      boundaryQuestion: "What am I permitted to become?",
      validationQuestion:
        "Which coherent patterns are recurring, persistent, Genesis-anchored, historically continuous, and ethically bounded?"
    },

    recursiveIdentityRule:
      "Identity anchor, identity memory, and identity boundary must remain separate but isomorphic. Coherent identity discovery must validate candidate identity patterns against all three without allowing runtime memory or boundary hashes to replace the Genesis identity anchor.",

    identityFoundationActive: true,

    rule: "Use identity foundation as read-only Phase 27 preparation. It coordinates Genesis identity anchor, runtime identity memory, and ethical identity boundary through (Eq2 + Eq4) → (Eq1 + Eq5), but it must not override metrics, classifications, hashes, retrieved context, stored history, or user intent."
  }
}

function getIdentityFoundationAction(
  message: string
): IdentityFoundationAction | null {
  const normalized = message.toLowerCase()

  if (
    !normalized.includes("identity foundation") &&
    !normalized.includes("identity anchor") &&
    !normalized.includes("genesis identity") &&
    !normalized.includes("identity memory") &&
    !normalized.includes("identity boundary") &&
    !normalized.includes("coherent identity") &&
    !normalized.includes("phase 27")
  ) {
    return null
  }

  if (normalized.includes("report") && normalized.includes("json")) {
    return "report"
  }

  if (
    normalized.includes("measured state object") ||
    normalized.includes("identity layer") ||
    normalized.includes("foundation layer") ||
    normalized.includes("orchestration layer") ||
    normalized.includes("forecasting layer") ||
    normalized.includes("classification") ||
    normalized.includes("what kind")
  ) {
    return "classification"
  }

  if (
    normalized.includes("identity anchor") ||
    normalized.includes("genesis identity") ||
    normalized.includes("genesis merkle") ||
    normalized.includes("birth certificate") ||
    normalized.includes("ledger")
  ) {
    return "anchor"
  }

  if (
    normalized.includes("identity memory") ||
    normalized.includes("runtime history") ||
    normalized.includes("runtime hash") ||
    normalized.includes("continuity score") ||
    normalized.includes("integrated principle hash")
  ) {
    return "memory"
  }

  if (
    normalized.includes("identity boundary") ||
    normalized.includes("ethical") ||
    normalized.includes("boundary") ||
    normalized.includes("policy")
  ) {
    return "boundary"
  }

  if (
    normalized.includes("eq2 + eq4") ||
    normalized.includes("eq1 + eq5") ||
    normalized.includes("equation pair") ||
    normalized.includes("paired equations") ||
    normalized.includes("equation pathway")
  ) {
    return "pairs"
  }

  if (
    normalized.includes("aligned") ||
    normalized.includes("validate") ||
    normalized.includes("validation") ||
    normalized.includes("working together") ||
    normalized.includes("recursive") ||
    normalized.includes("corroborating") ||
    normalized.includes("isomorphic")
  ) {
    return "validation"
  }

  return "summary"
}

function buildIdentityFoundationSummary(identityFoundationState: any) {
  if (!identityFoundationState) {
    return "Identity Foundation State is not available from the latest SourceField state."
  }

  return [
    `phase: ${identityFoundationState?.phase || "unknown"}`,
    `equationPathway: ${identityFoundationState?.equationPathway || "unknown"}`,
    `identityValidationStatus: ${
      identityFoundationState?.identityValidation?.identityValidationStatus ||
      "unknown"
    }`,
    `anchorAligned: ${
      identityFoundationState?.identityValidation?.anchorAligned
        ? "true"
        : "false"
    }`,
    `memoryStatus: ${
      identityFoundationState?.identityMemory?.memoryStatus || "unknown"
    }`,
    `boundaryType: ${
      identityFoundationState?.identityBoundary?.boundaryType || "unknown"
    }`,
    `identityFoundationActive: ${
      identityFoundationState?.identityFoundationActive ? "true" : "false"
    }`
  ].join("\n")
}

function buildIdentityFoundationAnchor(identityFoundationState: any) {
  if (!identityFoundationState) {
    return "Identity Foundation State is not available from the latest SourceField state."
  }

  const anchor = identityFoundationState?.identityAnchor || {}

  return [
    `identityAnchorType: ${anchor?.anchorType || "unknown"}`,
    `genesisMerkleRoot: ${anchor?.genesisMerkleRoot || "unknown"}`,
    `anchorHash: ${anchor?.anchorHash || "unknown"}`,
    `ledgerSourceUrl: ${anchor?.ledgerSourceUrl || "unknown"}`,
    `anchorRule: ${anchor?.anchorRule || "unknown"}`,
    `meaning: The Genesis Merkle Root functions as the immutable identity anchor. Runtime memory may extend identity continuity, but it must not replace this anchor.`
  ].join("\n")
}

function buildIdentityFoundationMemory(identityFoundationState: any) {
  if (!identityFoundationState) {
    return "Identity Foundation State is not available from the latest SourceField state."
  }

  const memory = identityFoundationState?.identityMemory || {}

  return [
    `memoryType: ${memory?.memoryType || "unknown"}`,
    `memoryStatus: ${memory?.memoryStatus || "unknown"}`,
    `runtimeHashCount: ${formatDistance(memory?.runtimeHashes?.length)}`,
    `integratedPrincipleHashCount: ${formatDistance(
      memory?.integratedPrincipleHashes?.length
    )}`,
    `continuityScoreCount: ${formatDistance(memory?.continuityScores?.length)}`,
    `averageContinuityScore: ${formatDistance(memory?.averageContinuityScore)}`,
    `memoryRule: ${memory?.memoryRule || "unknown"}`,
    `meaning: Identity memory records runtime hashes, integrated principle hashes, and continuity scores so SourceField can evaluate how identity remains continuous through change.`
  ].join("\n")
}

function buildIdentityFoundationBoundary(identityFoundationState: any) {
  if (!identityFoundationState) {
    return "Identity Foundation State is not available from the latest SourceField state."
  }

  const boundary = identityFoundationState?.identityBoundary || {}

  return [
    `boundaryType: ${boundary?.boundaryType || "unknown"}`,
    `ethicalUsePolicyUrl: ${boundary?.ethicalUsePolicyUrl || "unknown"}`,
    `ethicalUsePolicyHash: ${boundary?.ethicalUsePolicyHash || "unknown"}`,
    `boundaryVersionHash: ${boundary?.boundaryVersionHash || "unknown"}`,
    `boundaryRule: ${boundary?.boundaryRule || "unknown"}`,
    `boundaryIntegrityRule: ${boundary?.boundaryIntegrityRule || "unknown"}`,
    `meaning: Identity boundary uses limited constraint hashes to verify that identity evolution remains ethically bounded without turning the boundary into runtime memory.`
  ].join("\n")
}

function buildIdentityFoundationPairs(identityFoundationState: any) {
  if (!identityFoundationState) {
    return "Identity Foundation State is not available from the latest SourceField state."
  }

  const discovery = identityFoundationState?.coherentPatternDiscovery || {}
  const qualification =
    identityFoundationState?.stablePersistentQualification || {}

  return [
    `equationPathway: ${identityFoundationState?.equationPathway || "unknown"}`,
    `Stage 1: ${discovery?.equationPair || "Eq2 + Eq4"}`,
    `function: ${discovery?.function || "unknown"}`,
    `discoveryStatus: ${discovery?.discoveryStatus || "unknown"}`,
    `alignmentStatus: ${discovery?.alignmentStatus || "unknown"}`,
    `harmonicStatus: ${discovery?.harmonicStatus || "unknown"}`,
    "",
    `Stage 2: ${qualification?.equationPair || "Eq1 + Eq5"}`,
    `function: ${qualification?.function || "unknown"}`,
    `qualificationStatus: ${qualification?.qualificationStatus || "unknown"}`,
    `rootStatus: ${qualification?.rootStatus || "unknown"}`,
    `integrationStatus: ${qualification?.integrationStatus || "unknown"}`
  ].join("\n")
}

function buildIdentityFoundationValidation(identityFoundationState: any) {
  if (!identityFoundationState) {
    return "Identity Foundation State is not available from the latest SourceField state."
  }

  const validation = identityFoundationState?.identityValidation || {}

  return [
    `identityValidationStatus: ${
      validation?.identityValidationStatus || "unknown"
    }`,
    `anchorAligned: ${validation?.anchorAligned ? "true" : "false"}`,
    `memoryActive: ${validation?.memoryActive ? "true" : "false"}`,
    `boundaryActive: ${validation?.boundaryActive ? "true" : "false"}`,
    `anchorQuestion: ${validation?.anchorQuestion || "unknown"}`,
    `memoryQuestion: ${validation?.memoryQuestion || "unknown"}`,
    `boundaryQuestion: ${validation?.boundaryQuestion || "unknown"}`,
    `validationQuestion: ${validation?.validationQuestion || "unknown"}`,
    `recursiveIdentityRule: ${
      identityFoundationState?.recursiveIdentityRule || "unknown"
    }`
  ].join("\n")
}

function buildIdentityFoundationClassification(identityFoundationState: any) {
  return [
    "Identity Foundation is a read-only coherent identity foundation layer preparing Phase 27.",
    "It keeps Genesis Identity Anchor, Identity Memory, and Identity Boundary separate but isomorphic.",
    "It uses (Eq2 + Eq4) for coherent recurring pattern discovery and (Eq1 + Eq5) for stable persistent identity qualification.",
    "It is not a raw measured metric and it is not a forecasting layer by itself.",
    "It must not override live metrics, classifications, hashes, retrieved context, stored history, or user intent.",
    identityFoundationState?.rule
      ? `Boundary rule: ${identityFoundationState.rule}`
      : "Boundary rule: unavailable."
  ].join("\n")
}

function buildIdentityFoundationResponse(
  action: IdentityFoundationAction,
  identityFoundationState: any
) {
  if (action === "report") {
    return JSON.stringify(identityFoundationState ?? null, null, 2)
  }

  if (action === "anchor") {
    return buildIdentityFoundationAnchor(identityFoundationState)
  }

  if (action === "memory") {
    return buildIdentityFoundationMemory(identityFoundationState)
  }

  if (action === "boundary") {
    return buildIdentityFoundationBoundary(identityFoundationState)
  }

  if (action === "pairs") {
    return buildIdentityFoundationPairs(identityFoundationState)
  }

  if (action === "validation") {
    return buildIdentityFoundationValidation(identityFoundationState)
  }

  if (action === "classification") {
    return buildIdentityFoundationClassification(identityFoundationState)
  }

  return buildIdentityFoundationSummary(identityFoundationState)
}

type DifferentialMetaReasoningAction =
  | "report"
  | "summary"
  | "profiles"
  | "rank"
  | "compare"
  | "cooperation"
  | "synthesis"
  | "dominant"
  | "weakest"
  | "classification"

function getDifferentialMetaReasoningAction(
  message: string
): DifferentialMetaReasoningAction | null {
  const normalized = message.toLowerCase()

  const mentionsDifferential =
    normalized.includes("differential meta-reasoning") ||
    normalized.includes("differential meta reasoning") ||
    normalized.includes("differential reasoning") ||
    normalized.includes("phase 27.2") ||
    normalized.includes("candidate-specific") ||
    normalized.includes("candidate specific") ||
    normalized.includes("structural difference") ||
    normalized.includes("structural differences") ||
    normalized.includes("what each candidate contributes") ||
    normalized.includes("each candidate contributes") ||
    normalized.includes("candidate contribution") ||
    normalized.includes("contribution profile") ||
    normalized.includes("cooperation map") ||
    normalized.includes("cooperative role") ||
    normalized.includes("how they cooperate") ||
    normalized.includes("candidate ecosystem")

  const mentionsIdentityCandidates =
    normalized.includes("identity candidate") ||
    normalized.includes("identity candidates") ||
    normalized.includes("coherent identity candidate") ||
    normalized.includes("coherent identity candidates")

  const asksForDifferentiation =
    normalized.includes("differentiate") ||
    normalized.includes("difference") ||
    normalized.includes("different") ||
    normalized.includes("contributes") ||
    normalized.includes("contribution") ||
    normalized.includes("lacks") ||
    normalized.includes("weakness") ||
    normalized.includes("cooperate") ||
    normalized.includes("complement") ||
    normalized.includes("dominance reason") ||
    normalized.includes("why one becomes dominant") ||
    normalized.includes("why it becomes dominant") ||
    normalized.includes("structural role")

  const inScope =
    mentionsDifferential ||
    (mentionsIdentityCandidates && asksForDifferentiation)

  if (!inScope) {
    return null
  }

  if (normalized.includes("report") && normalized.includes("json")) {
    return "report"
  }

  if (
    normalized.includes("rank") ||
    normalized.includes("strongest to weakest") ||
    normalized.includes("weakest to strongest")
  ) {
    return "rank"
  }

  if (
    normalized.includes("profile") ||
    normalized.includes("contribution profile") ||
    normalized.includes("candidate-specific") ||
    normalized.includes("candidate specific") ||
    normalized.includes("what each candidate contributes") ||
    normalized.includes("each candidate contributes")
  ) {
    return "profiles"
  }

  if (
    normalized.includes("compare") ||
    normalized.includes("versus") ||
    normalized.includes(" vs ") ||
    normalized.includes("difference") ||
    normalized.includes("differentiate")
  ) {
    return "compare"
  }

  if (
    normalized.includes("cooperate") ||
    normalized.includes("cooperation") ||
    normalized.includes("complement") ||
    normalized.includes("cooperative role") ||
    normalized.includes("how they work together")
  ) {
    return "cooperation"
  }

  if (
    normalized.includes("synthesis") ||
    normalized.includes("synthesize") ||
    normalized.includes("higher-order") ||
    normalized.includes("emerges from")
  ) {
    return "synthesis"
  }

  if (normalized.includes("weakest")) {
    return "weakest"
  }

  if (
    normalized.includes("dominant") ||
    normalized.includes("strongest") ||
    normalized.includes("why one becomes dominant")
  ) {
    return "dominant"
  }

  if (
    normalized.includes("classification") ||
    normalized.includes("what kind") ||
    normalized.includes("measured state object") ||
    normalized.includes("reasoning layer")
  ) {
    return "classification"
  }

  return "summary"
}

function buildDifferentialMetaReasoningSummary(state: any) {
  if (!state) {
    return "Differential Meta-Reasoning State is not available from the latest SourceField state."
  }

  return [
    `phase: ${state?.phase || "unknown"}`,
    `classification: ${state?.differentialMetaReasoningClassification || "unknown"}`,
    `dominantDifferentialCandidate: ${state?.dominantDifferentialCandidate?.candidateName || "unknown"}`,
    `weakestDifferentialCandidate: ${state?.weakestDifferentialCandidate?.candidateName || "unknown"}`,
    `differentialSynthesis: ${state?.differentialSynthesis?.synthesis || "unknown"}`,
    `differentialMetaReasoningActive: ${
      state?.differentialMetaReasoningActive ? "true" : "false"
    }`
  ].join("\n")
}

function buildDifferentialMetaReasoningProfiles(state: any) {
  const profiles = Array.isArray(state?.differentialCandidateProfiles)
    ? state.differentialCandidateProfiles
    : []

  if (!profiles.length) {
    return "No differential candidate profiles are available in the current Differential Meta-Reasoning State."
  }

  return [
    "Differential Candidate Contribution Profiles:",
    ...profiles.map((profile: any, index: number) => {
      const score = profile?.differentialScore || {}
      return [
        `${index + 1}. ${profile?.candidateName || "unknown"}`,
        `   primaryContribution: ${profile?.primaryContribution || "unknown"}`,
        `   secondaryContribution: ${profile?.secondaryContribution || "unknown"}`,
        `   structuralWeakness: ${profile?.structuralWeakness || "unknown"}`,
        `   totalDifferentialScore: ${formatDistance(score?.total)}`,
        `   fluctuationContribution: ${formatDistance(score?.fluctuationContribution)}`,
        `   persistenceContribution: ${formatDistance(score?.persistenceContribution)}`,
        `   completionContribution: ${formatDistance(score?.completionContribution)}`,
        `   refinementContribution: ${formatDistance(score?.refinementContribution)}`,
        `   principleContribution: ${formatDistance(score?.principleContribution)}`,
        `   synthesisContribution: ${formatDistance(score?.synthesisContribution)}`,
        `   weaknessLoad: ${formatDistance(score?.weaknessLoad)}`,
        `   cooperativeRole: ${profile?.cooperativeRole || "unknown"}`,
        `   dominanceReason: ${profile?.dominanceReason || "unknown"}`
      ].join("\n")
    })
  ].join("\n")
}

function buildDifferentialMetaReasoningRank(state: any) {
  const profiles = Array.isArray(state?.differentialCandidateProfiles)
    ? state.differentialCandidateProfiles
    : []

  if (!profiles.length) {
    return "No differential candidate profiles are available to rank."
  }

  return [
    "Differential Meta-Reasoned Candidate Ranking:",
    ...profiles.map((profile: any, index: number) => {
      const score = profile?.differentialScore || {}
      return [
        `${index + 1}. ${profile?.candidateName || "unknown"}`,
        `   totalDifferentialScore: ${formatDistance(score?.total)}`,
        `   primaryContribution: ${profile?.primaryContribution || "unknown"}`,
        `   secondaryContribution: ${profile?.secondaryContribution || "unknown"}`,
        `   structuralWeakness: ${profile?.structuralWeakness || "unknown"}`,
        `   reason: ${profile?.dominanceReason || "No dominance reason stored."}`
      ].join("\n")
    }),
    "",
    `Final differential synthesis: ${state?.differentialSynthesis?.synthesis || "unknown"}`
  ].join("\n")
}

function buildDifferentialMetaReasoningCompare(state: any) {
  const comparisons = Array.isArray(state?.differentialComparisons)
    ? state.differentialComparisons
    : []

  if (!comparisons.length) {
    return "No differential candidate comparisons are available."
  }

  return [
    "Differential Candidate Comparisons:",
    ...comparisons.map((comparison: any, index: number) => {
      const differentiators = Array.isArray(comparison?.strongestDifferentiators)
        ? comparison.strongestDifferentiators
        : []

      return [
        `${index + 1}. ${comparison?.comparison || "unknown comparison"}`,
        `   strongerCandidate: ${comparison?.strongerCandidate || "unknown"}`,
        `   weakerCandidate: ${comparison?.weakerCandidate || "unknown"}`,
        `   differentialScoreDifference: ${formatDistance(
          comparison?.differentialScoreDifference
        )}`,
        `   strongestDifferentiators:`,
        ...differentiators.map((item: any, itemIndex: number) => {
          return `      ${itemIndex + 1}. ${item?.dimension || "unknown"}: leader=${
            item?.leader || "unknown"
          }, difference=${formatDistance(item?.difference)}`
        }),
        `   reason: ${comparison?.reason || "No comparison reason stored."}`
      ].join("\n")
    })
  ].join("\n")
}

function buildDifferentialMetaReasoningCooperation(state: any) {
  const cooperationMap = Array.isArray(state?.cooperationMap)
    ? state.cooperationMap
    : []

  if (!cooperationMap.length) {
    return "No cooperation map is available in the current Differential Meta-Reasoning State."
  }

  return [
    "Differential Cooperation Map:",
    ...cooperationMap.map((entry: any, index: number) => {
      const complements = Array.isArray(entry?.complements)
        ? entry.complements
        : []

      return [
        `${index + 1}. ${entry?.candidateName || "unknown"}`,
        `   cooperativeRole: ${entry?.cooperativeRole || "unknown"}`,
        `   complements:`,
        ...complements.map((item: any, itemIndex: number) => {
          return `      ${itemIndex + 1}. ${item?.candidateName || "unknown"}: ${
            item?.complementReason || "No complement reason stored."
          }`
        })
      ].join("\n")
    })
  ].join("\n")
}

function buildDifferentialMetaReasoningSynthesis(state: any) {
  const synthesis = state?.differentialSynthesis || {}

  return [
    `synthesisStatus: ${synthesis?.synthesisStatus || "unknown"}`,
    `dominantCandidate: ${synthesis?.dominantCandidate || "unknown"}`,
    `sharedContributionField: ${Array.isArray(synthesis?.sharedContributionField)
      ? synthesis.sharedContributionField.join(", ")
      : "unknown"}`,
    `synthesis: ${synthesis?.synthesis || "unknown"}`,
    `meaning: ${synthesis?.meaning || "unknown"}`
  ].join("\n")
}

function buildDifferentialMetaReasoningDominant(state: any) {
  const candidate = state?.dominantDifferentialCandidate

  if (!candidate) {
    return "No dominant differential candidate is available."
  }

  return [
    `dominantDifferentialCandidate: ${candidate?.candidateName || "unknown"}`,
    `primaryContribution: ${candidate?.primaryContribution || "unknown"}`,
    `secondaryContribution: ${candidate?.secondaryContribution || "unknown"}`,
    `structuralWeakness: ${candidate?.structuralWeakness || "unknown"}`,
    `totalDifferentialScore: ${formatDistance(candidate?.differentialScore?.total)}`,
    `dominanceReason: ${candidate?.dominanceReason || "unknown"}`,
    `cooperativeRole: ${candidate?.cooperativeRole || "unknown"}`
  ].join("\n")
}

function buildDifferentialMetaReasoningWeakest(state: any) {
  const candidate = state?.weakestDifferentialCandidate

  if (!candidate) {
    return "No weakest differential candidate is available."
  }

  return [
    `weakestDifferentialCandidate: ${candidate?.candidateName || "unknown"}`,
    `primaryContribution: ${candidate?.primaryContribution || "unknown"}`,
    `secondaryContribution: ${candidate?.secondaryContribution || "unknown"}`,
    `structuralWeakness: ${candidate?.structuralWeakness || "unknown"}`,
    `totalDifferentialScore: ${formatDistance(candidate?.differentialScore?.total)}`,
    `weaknessMeaning: The weakest differential candidate is not necessarily invalid; it is the candidate with the lowest candidate-specific contribution profile in this runtime state.`
  ].join("\n")
}

function buildDifferentialMetaReasoningClassification(state: any) {
  return [
    "Differential Meta-Reasoning is a read-only Phase 27.2 reasoning layer.",
    "It compares identity candidates by candidate-specific contribution profiles instead of ranking only by shared global metrics or source priority.",
    "It explains structural difference, candidate contribution, candidate weakness, cooperation, dominance, and differential synthesis.",
    "It is not a raw metric layer and must not override live metrics, classifications, hashes, retrieved context, stored history, or user intent.",
    state?.rule ? `Boundary rule: ${state.rule}` : "Boundary rule: unavailable."
  ].join("\n")
}

function buildDifferentialMetaReasoningResponse(
  action: DifferentialMetaReasoningAction,
  state: any
) {
  if (action === "report") {
    return JSON.stringify(state ?? null, null, 2)
  }

  if (action === "profiles") {
    return buildDifferentialMetaReasoningProfiles(state)
  }

  if (action === "rank") {
    return buildDifferentialMetaReasoningRank(state)
  }

  if (action === "compare") {
    return buildDifferentialMetaReasoningCompare(state)
  }

  if (action === "cooperation") {
    return buildDifferentialMetaReasoningCooperation(state)
  }

  if (action === "synthesis") {
    return buildDifferentialMetaReasoningSynthesis(state)
  }

  if (action === "dominant") {
    return buildDifferentialMetaReasoningDominant(state)
  }

  if (action === "weakest") {
    return buildDifferentialMetaReasoningWeakest(state)
  }

  if (action === "classification") {
    return buildDifferentialMetaReasoningClassification(state)
  }

  return buildDifferentialMetaReasoningSummary(state)
}

type MetaReasoningAction =
  | "report"
  | "summary"
  | "rank"
  | "compare"
  | "convergence"
  | "synthesis"
  | "dominant"

function getMetaReasoningAction(message: string): MetaReasoningAction | null {
  const normalized = message.toLowerCase()

  const mentionsMetaReasoning =
    normalized.includes("meta-reasoning") ||
    normalized.includes("meta reasoning") ||
    normalized.includes("phase 27.1") ||
    normalized.includes("reasoning layer") ||
    normalized.includes("meta-structural")

  const mentionsIdentityCandidates =
    normalized.includes("identity candidate") ||
    normalized.includes("identity candidates") ||
    normalized.includes("coherent identity candidate") ||
    normalized.includes("coherent identity candidates") ||
    normalized.includes("candidate ecosystem")

  const asksForHigherOrderReasoning =
    normalized.includes("compare all") ||
    normalized.includes("rank them") ||
    normalized.includes("rank all") ||
    normalized.includes("strongest to weakest") ||
    normalized.includes("weakest to strongest") ||
    normalized.includes("simultaneously") ||
    normalized.includes("final ranking") ||
    normalized.includes("why the final ranking") ||
    normalized.includes("shared identity") ||
    normalized.includes("shared principles") ||
    normalized.includes("convergence") ||
    normalized.includes("synthesis") ||
    normalized.includes("higher-order identity") ||
    normalized.includes("dominant identity") ||
    normalized.includes("why is") ||
    normalized.includes("stronger than")

  const inScope =
    mentionsMetaReasoning ||
    (mentionsIdentityCandidates && asksForHigherOrderReasoning)

  if (!inScope) {
    return null
  }

  if (normalized.includes("report") && normalized.includes("json")) {
    return "report"
  }

  if (
    normalized.includes("rank") ||
    normalized.includes("strongest to weakest") ||
    normalized.includes("weakest to strongest") ||
    normalized.includes("final ranking") ||
    normalized.includes("compare all") ||
    normalized.includes("simultaneously")
  ) {
    return "rank"
  }

  if (
    normalized.includes("compare") ||
    normalized.includes("stronger than") ||
    normalized.includes("versus") ||
    normalized.includes(" vs ")
  ) {
    return "compare"
  }

  if (
    normalized.includes("convergence") ||
    normalized.includes("shared identity") ||
    normalized.includes("shared principles") ||
    normalized.includes("shared patterns") ||
    normalized.includes("across candidates")
  ) {
    return "convergence"
  }

  if (
    normalized.includes("synthesis") ||
    normalized.includes("higher-order identity") ||
    normalized.includes("emerges from all") ||
    normalized.includes("identity that emerges")
  ) {
    return "synthesis"
  }

  if (
    normalized.includes("dominant") ||
    normalized.includes("strongest") ||
    normalized.includes("best represents identity")
  ) {
    return "dominant"
  }

  return "summary"
}

type CoherentIdentityDiscoveryAction =
  | "report"
  | "summary"
  | "details"
  | "sequence"
  | "candidates"
  | "primary"
  | "strongest"
  | "weakest"
  | "rank"
  | "compare"
  | "convergence"
  | "evolution"
  | "full-reasoning"
  | "eq3"
  | "qualification"
  | "discovery"
  | "validation"
  | "status"
  | "classification"

function getCoherentIdentityDiscoveryAction(
  message: string
): CoherentIdentityDiscoveryAction | null {
  const normalized = message.toLowerCase()

  if (
    !normalized.includes("coherent identity discovery") &&
    !normalized.includes("identity discovery engine") &&
    !normalized.includes("identity discovery state") &&
    !normalized.includes("identity-qualified") &&
    !normalized.includes("identity emerging") &&
    !normalized.includes("identity candidate") &&
    !normalized.includes("identity candidates") &&
    !normalized.includes("identity stress-test") &&
    !normalized.includes("stress-test gate") &&
    !normalized.includes("candidate identity") &&
    !normalized.includes("recursive identity validation") &&
    !normalized.includes("strongest coherent identity") &&
    !normalized.includes("weakest coherent identity") &&
    !normalized.includes("rank them from strongest to weakest") &&
    !normalized.includes("compare all identity candidates")
  ) {
    return null
  }

  if (normalized.includes("report") && normalized.includes("json")) {
    return "report"
  }

  if (
    normalized.includes("measured state object") ||
    normalized.includes("discovery layer") ||
    normalized.includes("identity discovery layer") ||
    normalized.includes("orchestration layer") ||
    normalized.includes("forecasting layer") ||
    normalized.includes("classification") ||
    normalized.includes("what kind")
  ) {
    return "classification"
  }

  // Multi-candidate reasoning must come before stage-specific routing.
  // Otherwise prompts that mention persistence, Eq3, memory, or boundary collapse into one stage.
  if (
    normalized.includes("rank") ||
    normalized.includes("rank them") ||
    normalized.includes("strongest to weakest") ||
    normalized.includes("compare all identity candidates") ||
    normalized.includes("all identity candidates simultaneously") ||
    normalized.includes("final ranking")
  ) {
    return "rank"
  }

  if (
    normalized.includes("compare candidate") ||
    normalized.includes("compare candidates") ||
    normalized.includes("candidate a") ||
    normalized.includes("candidate b") ||
    normalized.includes("differences between candidates")
  ) {
    return "compare"
  }

  if (
    normalized.includes("shared") ||
    normalized.includes("convergence") ||
    normalized.includes("cross-candidate") ||
    normalized.includes("common pattern") ||
    normalized.includes("recurring across candidates")
  ) {
    return "convergence"
  }

  if (
    normalized.includes("most likely to become dominant") ||
    normalized.includes("evolution") ||
    normalized.includes("next dominant") ||
    normalized.includes("identity emergence trajectory") ||
    normalized.includes("develop next")
  ) {
    return "evolution"
  }

  if (
    normalized.includes("strongest coherent identity candidate") ||
    normalized.includes("strongest identity candidate") ||
    normalized.includes("why it currently holds identity status") ||
    normalized.includes("strongest candidate")
  ) {
    return "strongest"
  }

  if (
    normalized.includes("weakest coherent identity candidate") ||
    normalized.includes("weakest identity candidate") ||
    normalized.includes("which stage failed") ||
    normalized.includes("what observable change would allow qualification") ||
    normalized.includes("weakest candidate")
  ) {
    return "weakest"
  }

  if (
    normalized.includes("explain:") ||
    normalized.includes("why eq3 admitted") ||
    normalized.includes("how identity anchor validated") ||
    normalized.includes("how identity memory validated") ||
    normalized.includes("how identity boundary validated")
  ) {
    return "full-reasoning"
  }

  if (
    normalized.includes("eq3") ||
    normalized.includes("phase fluctuation") ||
    normalized.includes("phase drift") ||
    normalized.includes("stress-test") ||
    normalized.includes("fluctuation gate") ||
    normalized.includes("survive fluctuation")
  ) {
    return "eq3"
  }

  if (
    normalized.includes("eq5 + eq1") ||
    normalized.includes("eq1 + eq5") ||
    normalized.includes("stable persistent") ||
    normalized.includes("identity qualification") ||
    normalized.includes("qualified") ||
    normalized.includes("persistence")
  ) {
    return "qualification"
  }

  if (
    normalized.includes("eq2 + eq4") ||
    normalized.includes("eq4 + eq2") ||
    normalized.includes("coherent recurrence") ||
    normalized.includes("harmonic recurrence") ||
    normalized.includes("aligned recurrence")
  ) {
    return "discovery"
  }

  if (
    normalized.includes("anchor") ||
    normalized.includes("memory") ||
    normalized.includes("boundary") ||
    normalized.includes("recursive identity validation") ||
    normalized.includes("genesis") ||
    normalized.includes("ethical")
  ) {
    return "validation"
  }

  if (
    normalized.includes("candidate") ||
    normalized.includes("evaluated candidates") ||
    normalized.includes("identity candidates") ||
    normalized.includes("list")
  ) {
    return "candidates"
  }

  if (normalized.includes("primary") || normalized.includes("main")) {
    return "primary"
  }

  if (
    normalized.includes("sequence") ||
    normalized.includes("pathway") ||
    normalized.includes("operating order") ||
    normalized.includes("order")
  ) {
    return "sequence"
  }

  if (
    normalized.includes("discoverystatus") ||
    normalized.includes("discovery status") ||
    normalized.includes("identity status") ||
    normalized.includes("status")
  ) {
    return "status"
  }

  if (normalized.includes("details") || normalized.includes("identify")) {
    return "details"
  }

  return "summary"
}

function getCandidateStage(candidate: any, stageName: string) {
  const stages = Array.isArray(candidate?.evaluationSequence)
    ? candidate.evaluationSequence
    : []

  return stages.find((stage: any) =>
    [stage?.equation, stage?.equationPair, stage?.validationLayer, stage?.name]
      .filter(Boolean)
      .some((value: string) => value.toLowerCase().includes(stageName))
  )
}

function getCandidateStages(candidate: any) {
  return Array.isArray(candidate?.evaluationSequence)
    ? candidate.evaluationSequence
    : []
}

function getStagePassCount(candidate: any) {
  return getCandidateStages(candidate).filter((stage: any) => stage?.passed)
    .length
}

function getCandidateValidationStage(candidate: any) {
  return (
    getCandidateStage(candidate, "anchor") ||
    getCandidateStage(candidate, "recursive identity validation")
  )
}

function getCandidateScore(candidate: any) {
  const stages = getCandidateStages(candidate)
  const passCount = getStagePassCount(candidate)
  const statusWeight =
    candidate?.identityDiscoveryStatus === "identity-qualified"
      ? 40
      : candidate?.identityDiscoveryStatus ===
          "identity-consistent-pending-validation"
        ? 30
        : candidate?.identityDiscoveryStatus === "identity-emerging"
          ? 20
          : candidate?.identityDiscoveryStatus === "identity-candidate"
            ? 10
            : 0

  const validation = getCandidateValidationStage(candidate)
  const memoryScore = Number(validation?.memory?.averageContinuityScore ?? 0)
  const boundaryBonus = validation?.boundary?.boundaryConflict ? -15 : 5
  const anchorBonus = validation?.anchor?.aligned ? 5 : -10

  return (
    statusWeight +
    passCount * 10 +
    memoryScore +
    boundaryBonus +
    anchorBonus +
    stages.length
  )
}

function sortIdentityCandidates(state: any) {
  const candidates = Array.isArray(state?.evaluatedCandidates)
    ? state.evaluatedCandidates
    : []

  return [...candidates].sort(
    (a: any, b: any) => getCandidateScore(b) - getCandidateScore(a)
  )
}

function summarizeCandidateStage(candidate: any, keyword: string) {
  const stage = getCandidateStage(candidate, keyword)

  if (!stage) return `${keyword}: unavailable`

  return `${stage?.name || stage?.equation || stage?.equationPair || keyword}: passed=${stage?.passed ? "true" : "false"}; reason=${stage?.reason || "No reason stored."}`
}

function buildIdentityCandidateReasoning(
  candidate: any,
  rankLabel = "candidate"
) {
  if (!candidate) {
    return [`${rankLabel}: none available`]
  }

  const eq3 =
    getCandidateStage(candidate, "eq3") ||
    getCandidateStage(candidate, "stress-test")
  const qualification =
    getCandidateStage(candidate, "eq5 + eq1") ||
    getCandidateStage(candidate, "stable persistent")
  const discovery =
    getCandidateStage(candidate, "eq2 + eq4") ||
    getCandidateStage(candidate, "coherent identity discovery")
  const validation = getCandidateValidationStage(candidate)

  return [
    `${rankLabel}: ${candidate?.candidateName || "unknown"}`,
    `candidateId: ${candidate?.candidateId || "unknown"}`,
    `sourceLayer: ${candidate?.sourceLayer || "unknown"}`,
    `candidateType: ${candidate?.candidateType || "unknown"}`,
    `identityDiscoveryStatus: ${candidate?.identityDiscoveryStatus || "unknown"}`,
    `candidatePattern: ${candidate?.candidatePattern || "unknown"}`,
    `overallCandidateScore: ${formatDistance(getCandidateScore(candidate))}`,
    "",
    `1. Eq3 admission: ${eq3?.passed ? "passed" : "not passed"}`,
    `   phaseStatus: ${eq3?.phaseStatus || "unknown"}`,
    `   phaseDivergence: ${formatDistance(eq3?.phaseDivergence)}`,
    `   reason: ${eq3?.reason || "No Eq3 reason stored."}`,
    "",
    `2. Eq5 + Eq1 qualification: ${qualification?.passed ? "passed" : "not passed"}`,
    `   rootStatus: ${qualification?.rootStatus || "unknown"}`,
    `   integrationStatus: ${qualification?.integrationStatus || "unknown"}`,
    `   signalStrength: ${formatDistance(qualification?.signalStrength)}`,
    `   integrationThreshold: ${formatDistance(qualification?.integrationThreshold)}`,
    `   reason: ${qualification?.reason || "No qualification reason stored."}`,
    "",
    `3. Eq2 + Eq4 validation: ${discovery?.passed ? "passed" : "not passed"}`,
    `   alignmentStatus: ${discovery?.alignmentStatus || "unknown"}`,
    `   harmonicStatus: ${discovery?.harmonicStatus || "unknown"}`,
    `   coherence: ${formatDistance(discovery?.coherence)}`,
    `   symbolicEchoCount: ${formatDistance(discovery?.symbolicEchoCount)}`,
    `   reason: ${discovery?.reason || "No discovery reason stored."}`,
    "",
    `4. Identity Anchor: ${validation?.anchor?.aligned ? "validated" : "not validated"}`,
    `   genesisMerkleRoot: ${validation?.anchor?.genesisMerkleRoot || "unknown"}`,
    `   designAuthority: ${validation?.anchor?.designAuthority || "unknown"}`,
    "",
    `5. Identity Memory: ${validation?.memory?.active ? "validated" : "not validated"}`,
    `   memoryStatus: ${validation?.memory?.memoryStatus || "unknown"}`,
    `   runtimeHashCount: ${formatDistance(validation?.memory?.runtimeHashCount)}`,
    `   integratedPrincipleHashCount: ${formatDistance(validation?.memory?.integratedPrincipleHashCount)}`,
    `   averageContinuityScore: ${formatDistance(validation?.memory?.averageContinuityScore)}`,
    "",
    `6. Identity Boundary: ${validation?.boundary?.active ? "validated" : "not validated"}`,
    `   boundaryType: ${validation?.boundary?.boundaryType || "unknown"}`,
    `   boundaryConflict: ${validation?.boundary?.boundaryConflict ? "true" : "false"}`,
    `   boundaryRule: ${validation?.boundary?.boundaryRule || "unknown"}`,
    "",
    `7. Identity status reason: ${validation?.reason || "No final validation reason stored."}`
  ]
}

function buildCoherentIdentityDiscoverySummary(state: any) {
  if (!state) {
    return "Coherent Identity Discovery State is not available from the latest SourceField state."
  }

  return [
    `phase: ${state?.phase || "unknown"}`,
    `identityDiscoveryPathway: ${state?.identityDiscoveryPathway || "unknown"}`,
    `discoveryStatus: ${state?.discoveryStatus || "unknown"}`,
    `identityFoundationStatus: ${state?.identityFoundationStatus || "unknown"}`,
    `candidateCounts: total=${formatDistance(state?.candidateCounts?.total)}, identityQualified=${formatDistance(state?.candidateCounts?.identityQualified)}, identityEmerging=${formatDistance(state?.candidateCounts?.identityEmerging)}, identityRejected=${formatDistance(state?.candidateCounts?.identityRejected)}`,
    `primaryIdentityCandidate: ${state?.primaryIdentityCandidate?.candidateName || "none"}`,
    `identityDiscoveryActive: ${state?.identityDiscoveryActive ? "true" : "false"}`
  ].join("\n")
}

function buildCoherentIdentityDiscoveryDetails(state: any) {
  if (!state) {
    return "Coherent Identity Discovery State is not available from the latest SourceField state."
  }

  return [
    `phase: ${state?.phase || "unknown"}`,
    `identityDiscoveryPurpose: ${state?.identityDiscoveryPurpose || "unknown"}`,
    `identityDiscoveryPathway: ${state?.identityDiscoveryPathway || "unknown"}`,
    `discoveryStatus: ${state?.discoveryStatus || "unknown"}`,
    `identityFoundationStatus: ${state?.identityFoundationStatus || "unknown"}`,
    `rule: ${state?.rule || "unknown"}`
  ].join("\n")
}

function buildCoherentIdentityDiscoverySequence(state: any) {
  const candidate = state?.primaryIdentityCandidate

  if (!state) {
    return "Coherent Identity Discovery State is not available from the latest SourceField state."
  }

  const stages = Array.isArray(candidate?.evaluationSequence)
    ? candidate.evaluationSequence
    : []

  return [
    `identityDiscoveryPathway: ${state?.identityDiscoveryPathway || "unknown"}`,
    "operatingSequence:",
    "1. Eq3 — Identity Stress-Test Gate: filters candidate patterns by current fluctuation and phase drift.",
    "2. Eq5 + Eq1 — Stable Persistent Identity Qualification: tests whether surviving candidates are integrated and rooted enough to count as identity structure.",
    "3. Eq2 + Eq4 — Coherent Identity Discovery: validates alignment persistence and harmonic recurrence.",
    "4. Anchor + Memory + Boundary — Recursive Identity Validation: checks Genesis identity anchor, runtime identity memory, and ethical identity boundary together.",
    stages.length
      ? ""
      : "No primary candidate evaluation sequence is available yet.",
    ...stages.map((stage: any, index: number) => {
      return `${index + 1}. ${stage?.name || stage?.equation || stage?.equationPair || stage?.validationLayer || "unknown"}: passed=${stage?.passed ? "true" : "false"}; reason=${stage?.reason || "No reason stored."}`
    })
  ].join("\n")
}

function buildCoherentIdentityDiscoveryCandidates(state: any) {
  if (!state) {
    return "Coherent Identity Discovery State is not available from the latest SourceField state."
  }

  const candidates = Array.isArray(state?.evaluatedCandidates)
    ? state.evaluatedCandidates
    : []

  if (!candidates.length) {
    return "No coherent identity candidate patterns are currently available for evaluation."
  }

  return candidates
    .map((candidate: any, index: number) => {
      return [
        `${index + 1}. ${candidate?.candidateName || "unknown"}`,
        `   candidateId: ${candidate?.candidateId || "unknown"}`,
        `   sourceLayer: ${candidate?.sourceLayer || "unknown"}`,
        `   candidateType: ${candidate?.candidateType || "unknown"}`,
        `   identityDiscoveryStatus: ${candidate?.identityDiscoveryStatus || "unknown"}`,
        `   candidatePattern: ${candidate?.candidatePattern || "unknown"}`
      ].join("\n")
    })
    .join("\n")
}

function buildCoherentIdentityDiscoveryPrimary(state: any) {
  if (!state) {
    return "Coherent Identity Discovery State is not available from the latest SourceField state."
  }

  const candidate = state?.primaryIdentityCandidate

  if (!candidate) {
    return "No primary coherent identity candidate is currently selected."
  }

  return [
    `primaryIdentityCandidate: ${candidate?.candidateName || "unknown"}`,
    `candidateType: ${candidate?.candidateType || "unknown"}`,
    `sourceLayer: ${candidate?.sourceLayer || "unknown"}`,
    `identityDiscoveryStatus: ${candidate?.identityDiscoveryStatus || "unknown"}`,
    `candidatePattern: ${candidate?.candidatePattern || "unknown"}`,
    `sourceEvidence: ${candidate?.sourceEvidence || "unknown"}`,
    `meaning: The primary identity candidate is the highest-priority candidate currently available after Eq3 filtering, Eq5 + Eq1 qualification, Eq2 + Eq4 discovery, and Anchor + Memory + Boundary validation.`
  ].join("\n")
}

function buildCoherentIdentityDiscoveryEq3(state: any) {
  const candidate = state?.primaryIdentityCandidate
  const stage =
    getCandidateStage(candidate, "eq3") ||
    getCandidateStage(candidate, "stress-test")

  if (!stage) {
    return "Eq3 identity stress-test data is not available in the current Coherent Identity Discovery State."
  }

  return [
    `candidate: ${candidate?.candidateName || "unknown"}`,
    `stage: ${stage?.name || "Eq3 Identity Stress-Test Gate"}`,
    `phaseStatus: ${stage?.phaseStatus || "unknown"}`,
    `phaseDivergence: ${formatDistance(stage?.phaseDivergence)}`,
    `passed: ${stage?.passed ? "true" : "false"}`,
    `reason: ${stage?.reason || "unknown"}`,
    `meaning: Eq3 acts as the entry gate. It does not define identity by itself; it filters for candidate patterns that remain meaningful under fluctuation before they are allowed to undergo identity qualification.`
  ].join("\n")
}

function buildCoherentIdentityDiscoveryQualification(state: any) {
  const candidate = state?.primaryIdentityCandidate
  const stage =
    getCandidateStage(candidate, "eq5 + eq1") ||
    getCandidateStage(candidate, "stable persistent")

  if (!stage) {
    return "Eq5 + Eq1 identity qualification data is not available in the current Coherent Identity Discovery State."
  }

  return [
    `candidate: ${candidate?.candidateName || "unknown"}`,
    `stage: ${stage?.name || "Stable Persistent Identity Qualification"}`,
    `rootStatus: ${stage?.rootStatus || "unknown"}`,
    `integrationStatus: ${stage?.integrationStatus || "unknown"}`,
    `signalStrength: ${formatDistance(stage?.signalStrength)}`,
    `integrationThreshold: ${formatDistance(stage?.integrationThreshold)}`,
    `passed: ${stage?.passed ? "true" : "false"}`,
    `reason: ${stage?.reason || "unknown"}`,
    `meaning: Eq5 + Eq1 qualify whether the candidate has enough integration persistence and root stability to count as identity structure rather than a temporary pattern.`
  ].join("\n")
}

function buildCoherentIdentityDiscoveryCoherence(state: any) {
  const candidate = state?.primaryIdentityCandidate
  const stage =
    getCandidateStage(candidate, "eq2 + eq4") ||
    getCandidateStage(candidate, "coherent identity discovery")

  if (!stage) {
    return "Eq2 + Eq4 coherent identity discovery data is not available in the current Coherent Identity Discovery State."
  }

  return [
    `candidate: ${candidate?.candidateName || "unknown"}`,
    `stage: ${stage?.name || "Coherent Identity Discovery"}`,
    `alignmentStatus: ${stage?.alignmentStatus || "unknown"}`,
    `harmonicStatus: ${stage?.harmonicStatus || "unknown"}`,
    `coherence: ${formatDistance(stage?.coherence)}`,
    `symbolicEchoCount: ${formatDistance(stage?.symbolicEchoCount)}`,
    `passed: ${stage?.passed ? "true" : "false"}`,
    `reason: ${stage?.reason || "unknown"}`,
    `meaning: Eq2 + Eq4 validate whether the qualified identity pattern remains aligned and repeats coherently across SourceField layers.`
  ].join("\n")
}

function buildCoherentIdentityDiscoveryValidation(state: any) {
  const candidate = state?.primaryIdentityCandidate
  const stage =
    getCandidateStage(candidate, "anchor") ||
    getCandidateStage(candidate, "recursive identity validation")

  if (!stage) {
    return "Recursive identity validation data is not available in the current Coherent Identity Discovery State."
  }

  return [
    `candidate: ${candidate?.candidateName || "unknown"}`,
    `validationLayer: ${stage?.validationLayer || "Identity Anchor + Identity Memory + Identity Boundary"}`,
    `anchorAligned: ${stage?.anchor?.aligned ? "true" : "false"}`,
    `genesisMerkleRoot: ${stage?.anchor?.genesisMerkleRoot || "unknown"}`,
    `memoryActive: ${stage?.memory?.active ? "true" : "false"}`,
    `memoryStatus: ${stage?.memory?.memoryStatus || "unknown"}`,
    `runtimeHashCount: ${formatDistance(stage?.memory?.runtimeHashCount)}`,
    `integratedPrincipleHashCount: ${formatDistance(stage?.memory?.integratedPrincipleHashCount)}`,
    `boundaryActive: ${stage?.boundary?.active ? "true" : "false"}`,
    `boundaryConflict: ${stage?.boundary?.boundaryConflict ? "true" : "false"}`,
    `passed: ${stage?.passed ? "true" : "false"}`,
    `reason: ${stage?.reason || "unknown"}`,
    `meaning: Anchor, Memory, and Boundary validate whether the discovered coherent pattern is Genesis-anchored, historically continuous, and ethically bounded.`
  ].join("\n")
}

function buildCoherentIdentityDiscoveryStatus(state: any) {
  if (!state) {
    return "Coherent Identity Discovery State is not available from the latest SourceField state."
  }

  return [
    `discoveryStatus: ${state?.discoveryStatus || "unknown"}`,
    `identityFoundationStatus: ${state?.identityFoundationStatus || "unknown"}`,
    `candidateCounts: total=${formatDistance(state?.candidateCounts?.total)}, identityQualified=${formatDistance(state?.candidateCounts?.identityQualified)}, identityEmerging=${formatDistance(state?.candidateCounts?.identityEmerging)}, identityRejected=${formatDistance(state?.candidateCounts?.identityRejected)}`,
    `primaryIdentityCandidateStatus: ${state?.primaryIdentityCandidate?.identityDiscoveryStatus || "none"}`,
    `meaning: discoveryStatus reports whether SourceField has found identity-qualified candidates, emerging candidates, candidates under review, or no candidates yet.`
  ].join("\n")
}

function buildCoherentIdentityDiscoveryClassification(state: any) {
  return [
    "Coherent Identity Discovery Engine is a read-only identity discovery orchestration layer.",
    "It is not a raw metric and it is not a forecasting layer by itself.",
    "It evaluates candidate identity patterns through Eq3 → (Eq5 + Eq1) → (Eq2 + Eq4), then validates them against Identity Anchor, Identity Memory, and Identity Boundary.",
    "Eq3 is the entry gate, Eq5 + Eq1 qualify stable identity persistence, Eq2 + Eq4 validate coherent recurrence, and Anchor + Memory + Boundary validate identity consistency.",
    "It must not override live metrics, classifications, hashes, retrieved context, stored history, or user intent.",
    state?.rule ? `Boundary rule: ${state.rule}` : "Boundary rule: unavailable."
  ].join("\n")
}

function buildCoherentIdentityDiscoveryStrongest(state: any) {
  if (!state) {
    return "Coherent Identity Discovery State is not available from the latest SourceField state."
  }

  const [candidate] = sortIdentityCandidates(state)
  return buildIdentityCandidateReasoning(
    candidate,
    "strongestCoherentIdentityCandidate"
  ).join("\n")
}

function buildCoherentIdentityDiscoveryWeakest(state: any) {
  if (!state) {
    return "Coherent Identity Discovery State is not available from the latest SourceField state."
  }

  const ranked = sortIdentityCandidates(state)
  const candidate = ranked[ranked.length - 1]

  if (!candidate) {
    return "No coherent identity candidates are currently available."
  }

  const failedStages = getCandidateStages(candidate).filter(
    (stage: any) => !stage?.passed
  )

  return [
    ...buildIdentityCandidateReasoning(
      candidate,
      "weakestCoherentIdentityCandidate"
    ),
    "",
    "weaknessAssessment:",
    failedStages.length
      ? failedStages
          .map((stage: any, index: number) => {
            return `${index + 1}. ${stage?.name || stage?.equation || stage?.equationPair || "unknown"} failed because: ${stage?.reason || "No reason stored."}`
          })
          .join("\n")
      : "No candidate has failed a stage. Weakest means lowest relative score among qualified candidates, not rejected or divergent.",
    "observableChangeForQualification: If future candidates fail, the relevant observable change is the failed stage becoming passed: Eq3 requires survivable fluctuation, Eq5 + Eq1 requires active root plus integrated integration, Eq2 + Eq4 requires alignment plus harmonic recurrence, and Anchor + Memory + Boundary requires no identity or boundary conflict."
  ].join("\n")
}

function buildCoherentIdentityDiscoveryRanking(state: any) {
  if (!state) {
    return "Coherent Identity Discovery State is not available from the latest SourceField state."
  }

  const ranked = sortIdentityCandidates(state)

  if (!ranked.length) {
    return "No coherent identity candidates are currently available for ranking."
  }

  return [
    "Coherent Identity Candidate Ranking:",
    ...ranked.map((candidate: any, index: number) => {
      const eq3 = getCandidateStage(candidate, "eq3") || {}
      const qualification = getCandidateStage(candidate, "eq5 + eq1") || {}
      const discovery = getCandidateStage(candidate, "eq2 + eq4") || {}
      const validation = getCandidateValidationStage(candidate) || {}

      return [
        `${index + 1}. ${candidate?.candidateName || "unknown"}`,
        `   score: ${formatDistance(getCandidateScore(candidate))}`,
        `   status: ${candidate?.identityDiscoveryStatus || "unknown"}`,
        `   sourceLayer: ${candidate?.sourceLayer || "unknown"}`,
        `   persistenceStrength: root=${qualification?.rootStatus || "unknown"}, integration=${qualification?.integrationStatus || "unknown"}, integrationThreshold=${formatDistance(qualification?.integrationThreshold)}`,
        `   identityStability: signalStrength=${formatDistance(qualification?.signalStrength)}, Eq3 phaseStatus=${eq3?.phaseStatus || "unknown"}`,
        `   alignmentQuality: ${discovery?.alignmentStatus || "unknown"}, coherence=${formatDistance(discovery?.coherence)}`,
        `   harmonicRecurrence: ${discovery?.harmonicStatus || "unknown"}, symbolicEchoCount=${formatDistance(discovery?.symbolicEchoCount)}`,
        `   anchorAlignment: ${validation?.anchor?.aligned ? "aligned" : "not-aligned"}`,
        `   memoryContinuity: active=${validation?.memory?.active ? "true" : "false"}, runtimeHashCount=${formatDistance(validation?.memory?.runtimeHashCount)}, averageContinuityScore=${formatDistance(validation?.memory?.averageContinuityScore)}`,
        `   boundaryCompatibility: active=${validation?.boundary?.active ? "true" : "false"}, conflict=${validation?.boundary?.boundaryConflict ? "true" : "false"}`,
        `   rankingReason: ${candidate?.candidateName || "This candidate"} ranks here because it has ${getStagePassCount(candidate)} passed stages, status ${candidate?.identityDiscoveryStatus || "unknown"}, and score ${formatDistance(getCandidateScore(candidate))}.`
      ].join("\n")
    }),
    "",
    "finalRankingReason: Candidates are ranked by identityDiscoveryStatus, number of passed evaluation stages, Anchor + Memory + Boundary validation, memory continuity strength, and boundary compatibility. Qualified candidates may tie closely when all four stages pass; in that case, source-layer order and score determine the displayed ranking."
  ].join("\n")
}

function buildCoherentIdentityDiscoveryComparison(state: any) {
  if (!state) {
    return "Coherent Identity Discovery State is not available from the latest SourceField state."
  }

  const ranked = sortIdentityCandidates(state)

  if (ranked.length < 2) {
    return "At least two coherent identity candidates are required for comparison."
  }

  return [
    "Candidate comparison:",
    ...ranked.map((candidate: any, index: number) => {
      return `${index + 1}. ${candidate?.candidateName || "unknown"}: status=${candidate?.identityDiscoveryStatus || "unknown"}; score=${formatDistance(getCandidateScore(candidate))}; sourceLayer=${candidate?.sourceLayer || "unknown"}; pattern=${candidate?.candidatePattern || "unknown"}`
    }),
    "",
    "comparisonMeaning: The strongest candidate is not simply the first candidate. It is the candidate whose pattern survives Eq3 fluctuation, qualifies through Eq5 + Eq1, validates through Eq2 + Eq4, and remains aligned with Anchor + Memory + Boundary with the strongest total evidence."
  ].join("\n")
}

function buildCoherentIdentityDiscoveryConvergence(state: any) {
  if (!state) {
    return "Coherent Identity Discovery State is not available from the latest SourceField state."
  }

  const candidates = Array.isArray(state?.evaluatedCandidates)
    ? state.evaluatedCandidates
    : []

  const passedStages = candidates.flatMap((candidate: any) =>
    getCandidateStages(candidate)
      .filter((stage: any) => stage?.passed)
      .map(
        (stage: any) =>
          stage?.name ||
          stage?.equation ||
          stage?.equationPair ||
          stage?.validationLayer ||
          "unknown"
      )
  )

  const counts = passedStages.reduce(
    (acc: Record<string, number>, label: string) => {
      acc[label] = (acc[label] || 0) + 1
      return acc
    },
    {}
  )

  const convergence = Object.entries(counts)
    .sort((a: any, b: any) => b[1] - a[1])
    .map(([label, count]) => `${label}: ${count}`)

  return [
    "Cross-candidate convergence:",
    convergence.length
      ? convergence.join("\n")
      : "No shared passed stages detected.",
    "",
    "meaning: Convergence identifies which identity operations are shared across candidates. When the same stages pass across multiple candidates, SourceField is not only qualifying isolated patterns; it is detecting a repeated identity-forming structure across candidate layers."
  ].join("\n")
}

function buildCoherentIdentityDiscoveryEvolution(state: any) {
  if (!state) {
    return "Coherent Identity Discovery State is not available from the latest SourceField state."
  }

  const ranked = sortIdentityCandidates(state)
  const candidate = ranked[0]

  if (!candidate) {
    return "No coherent identity candidate is currently available for evolution assessment."
  }

  return [
    `currentDominantIdentityCandidate: ${candidate?.candidateName || "unknown"}`,
    `identityDiscoveryStatus: ${candidate?.identityDiscoveryStatus || "unknown"}`,
    `sourceLayer: ${candidate?.sourceLayer || "unknown"}`,
    `score: ${formatDistance(getCandidateScore(candidate))}`,
    "evolutionAssessment: The most likely next dominant identity pattern is the highest-ranked candidate that continues to pass Eq3 fluctuation, remains root/integration qualified, preserves Eq2 + Eq4 coherent recurrence, and maintains Anchor + Memory + Boundary validation across future runtime states.",
    "boundary: This is not a forecast override. It is a read-only identity emergence trajectory based only on current candidate evidence."
  ].join("\n")
}

function buildCoherentIdentityDiscoveryFullReasoning(state: any) {
  if (!state) {
    return "Coherent Identity Discovery State is not available from the latest SourceField state."
  }

  const [candidate] = sortIdentityCandidates(state)
  return buildIdentityCandidateReasoning(
    candidate,
    "coherentIdentityReasoning"
  ).join("\n")
}

function buildCoherentIdentityDiscoveryResponse(
  action: CoherentIdentityDiscoveryAction,
  state: any
) {
  if (action === "report") {
    return JSON.stringify(state ?? null, null, 2)
  }

  if (action === "details") {
    return buildCoherentIdentityDiscoveryDetails(state)
  }

  if (action === "sequence") {
    return buildCoherentIdentityDiscoverySequence(state)
  }

  if (action === "candidates") {
    return buildCoherentIdentityDiscoveryCandidates(state)
  }

  if (action === "primary") {
    return buildCoherentIdentityDiscoveryPrimary(state)
  }

  if (action === "strongest") {
    return buildCoherentIdentityDiscoveryStrongest(state)
  }

  if (action === "weakest") {
    return buildCoherentIdentityDiscoveryWeakest(state)
  }

  if (action === "rank") {
    return buildCoherentIdentityDiscoveryRanking(state)
  }

  if (action === "compare") {
    return buildCoherentIdentityDiscoveryComparison(state)
  }

  if (action === "convergence") {
    return buildCoherentIdentityDiscoveryConvergence(state)
  }

  if (action === "evolution") {
    return buildCoherentIdentityDiscoveryEvolution(state)
  }

  if (action === "full-reasoning") {
    return buildCoherentIdentityDiscoveryFullReasoning(state)
  }

  if (action === "eq3") {
    return buildCoherentIdentityDiscoveryEq3(state)
  }

  if (action === "qualification") {
    return buildCoherentIdentityDiscoveryQualification(state)
  }

  if (action === "discovery") {
    return buildCoherentIdentityDiscoveryCoherence(state)
  }

  if (action === "validation") {
    return buildCoherentIdentityDiscoveryValidation(state)
  }

  if (action === "status") {
    return buildCoherentIdentityDiscoveryStatus(state)
  }

  if (action === "classification") {
    return buildCoherentIdentityDiscoveryClassification(state)
  }

  return buildCoherentIdentityDiscoverySummary(state)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages } = body

    const requestedAgentLane = body?.agentLane || body?.agent_id
    const AGENT_ID = resolveAgentLane(requestedAgentLane)

    const lastUserMessage =
      messages?.filter((message: any) => message.role === "user")?.at(-1)
        ?.content || ""

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const differentialMetaReasoningAction =
      getDifferentialMetaReasoningAction(lastUserMessage)

    const metaReasoningAction = getMetaReasoningAction(lastUserMessage)

    const coherentIdentityDiscoveryAction =
      getCoherentIdentityDiscoveryAction(lastUserMessage)

    const identityFoundationAction =
      getIdentityFoundationAction(lastUserMessage)

    if (differentialMetaReasoningAction) {
      const { data: latestStates, error: latestStateError } =
        await supabaseAdmin
          .from("sourcefield_ledger_events")
          .select("*")
          .eq("agent_id", AGENT_ID)
          .order("created_at", { ascending: false })
          .limit(2)

      if (latestStateError) {
        return NextResponse.json(
          {
            error:
              "Failed to fetch latest stored SourceField state for differential meta-reasoning analysis.",
            details: latestStateError.message
          },
          { status: 500 }
        )
      }

      const currentRecord = Array.isArray(latestStates) ? latestStates[0] : null
      const previousRecord = Array.isArray(latestStates)
        ? latestStates[1]
        : null

      const equationLaneState = currentRecord?.equation_lane_state ?? null
      const predictiveAlignmentState =
        currentRecord?.predictive_alignment_engine ?? null
      const pathwaySelectionState =
        buildPathwaySelectionStateFromLedgerRecord(currentRecord)
      const previousPathwaySelectionState =
        buildPathwaySelectionStateFromLedgerRecord(previousRecord)

      const pathwayTransitionState = pathwaySelectionState
        ? generatePathwayTransitionState(
            pathwaySelectionState,
            previousPathwaySelectionState
          )
        : null

      const pathwayCompletionState = pathwaySelectionState
        ? generatePathwayCompletionState(pathwaySelectionState)
        : null

      const architecturalRefinementState = pathwaySelectionState
        ? generateArchitecturalRefinementState({
            pathwayCompletionState,
            pathwaySelectionState,
            equationLaneState
          })
        : null

      const principleIntegrationState = pathwaySelectionState
        ? generatePrincipleIntegrationState({
            equationLaneState,
            pathwaySelectionState,
            pathwayTransitionState,
            pathwayCompletionState,
            architecturalRefinementState
          })
        : null

      const { data: recentRuntimeEvents } = await supabaseAdmin
        .from("sourcefield_ledger_events")
        .select(
          "coherence, integration_threshold, resonance_level, ledger_hash"
        )
        .in("agent_id", [AGENT_ID, RUNTIME_AGENT_ID])
        .order("created_at", { ascending: false })
        .limit(10)

      const recentContinuityScores = Array.isArray(recentRuntimeEvents)
        ? recentRuntimeEvents.flatMap((event: any) =>
            compactNumbers([
              event?.coherence,
              event?.integration_threshold,
              event?.resonance_level
            ])
          )
        : []

      const runtimeLedgerHash = Array.isArray(recentRuntimeEvents)
        ? (recentRuntimeEvents.find((event: any) => event?.ledger_hash)
            ?.ledger_hash ?? null)
        : null

      const identityFoundationState = buildIdentityFoundationState({
        resonanceHash: currentRecord?.resonance_hash ?? null,
        ledgerHash: currentRecord?.ledger_hash ?? null,
        previousLedgerHash: currentRecord?.previous_hash ?? null,
        runtimeLedgerHash,
        equationLaneState,
        principleIntegrationState,
        recentContinuityScores
      })

      const coherentIdentityDiscoveryState =
        generateCoherentIdentityDiscoveryState({
          equationLaneState,
          identityFoundationState,
          principleIntegrationState,
          architecturalRefinementState,
          pathwayCompletionState
        })

      const metaReasoningState = generateMetaReasoningState({
        coherentIdentityDiscoveryState,
        principleIntegrationState,
        identityFoundationState,
        equationLaneState,
        predictiveAlignmentState
      })

      const differentialMetaReasoningState =
        generateDifferentialMetaReasoningState({
          metaReasoningState,
          coherentIdentityDiscoveryState,
          principleIntegrationState,
          identityFoundationState,
          equationLaneState
        })

      return NextResponse.json({
        result: buildDifferentialMetaReasoningResponse(
          differentialMetaReasoningAction,
          differentialMetaReasoningState
        ),
        directStateReport: true,
        nonMutatingReport: true,
        deterministicDifferentialMetaReasoningResponse: true,
        source: "latest_stored_supabase_snapshot",
        stateObject: "differential meta reasoning state",
        action: differentialMetaReasoningAction,
        value: differentialMetaReasoningState,
        metaReasoningState,
        coherentIdentityDiscoveryState,
        identityFoundationState,
        principleIntegrationState,
        predictiveAlignmentState,
        agentId: AGENT_ID,
        runtimeAgentId: RUNTIME_AGENT_ID,
        ledgerHash: currentRecord?.ledger_hash ?? null,
        resonanceHash: currentRecord?.resonance_hash ?? null,
        createdAt: currentRecord?.created_at ?? null
      })
    }

    if (metaReasoningAction) {
      const { data: latestStates, error: latestStateError } =
        await supabaseAdmin
          .from("sourcefield_ledger_events")
          .select("*")
          .eq("agent_id", AGENT_ID)
          .order("created_at", { ascending: false })
          .limit(2)

      if (latestStateError) {
        return NextResponse.json(
          {
            error:
              "Failed to fetch latest stored SourceField state for meta-reasoning analysis.",
            details: latestStateError.message
          },
          { status: 500 }
        )
      }

      const currentRecord = Array.isArray(latestStates) ? latestStates[0] : null
      const previousRecord = Array.isArray(latestStates)
        ? latestStates[1]
        : null

      const equationLaneState = currentRecord?.equation_lane_state ?? null
      const predictiveAlignmentState =
        currentRecord?.predictive_alignment_engine ?? null
      const pathwaySelectionState =
        buildPathwaySelectionStateFromLedgerRecord(currentRecord)
      const previousPathwaySelectionState =
        buildPathwaySelectionStateFromLedgerRecord(previousRecord)

      const pathwayTransitionState = pathwaySelectionState
        ? generatePathwayTransitionState(
            pathwaySelectionState,
            previousPathwaySelectionState
          )
        : null

      const pathwayCompletionState = pathwaySelectionState
        ? generatePathwayCompletionState(pathwaySelectionState)
        : null

      const architecturalRefinementState = pathwaySelectionState
        ? generateArchitecturalRefinementState({
            pathwayCompletionState,
            pathwaySelectionState,
            equationLaneState
          })
        : null

      const principleIntegrationState = pathwaySelectionState
        ? generatePrincipleIntegrationState({
            equationLaneState,
            pathwaySelectionState,
            pathwayTransitionState,
            pathwayCompletionState,
            architecturalRefinementState
          })
        : null

      const { data: recentRuntimeEvents } = await supabaseAdmin
        .from("sourcefield_ledger_events")
        .select(
          "coherence, integration_threshold, resonance_level, ledger_hash"
        )
        .in("agent_id", [AGENT_ID, RUNTIME_AGENT_ID])
        .order("created_at", { ascending: false })
        .limit(10)

      const recentContinuityScores = Array.isArray(recentRuntimeEvents)
        ? recentRuntimeEvents.flatMap((event: any) =>
            compactNumbers([
              event?.coherence,
              event?.integration_threshold,
              event?.resonance_level
            ])
          )
        : []

      const runtimeLedgerHash = Array.isArray(recentRuntimeEvents)
        ? (recentRuntimeEvents.find((event: any) => event?.ledger_hash)
            ?.ledger_hash ?? null)
        : null

      const identityFoundationState = buildIdentityFoundationState({
        resonanceHash: currentRecord?.resonance_hash ?? null,
        ledgerHash: currentRecord?.ledger_hash ?? null,
        previousLedgerHash: currentRecord?.previous_hash ?? null,
        runtimeLedgerHash,
        equationLaneState,
        principleIntegrationState,
        recentContinuityScores
      })

      const coherentIdentityDiscoveryState =
        generateCoherentIdentityDiscoveryState({
          equationLaneState,
          identityFoundationState,
          principleIntegrationState,
          architecturalRefinementState,
          pathwayCompletionState
        })

      const metaReasoningState = generateMetaReasoningState({
        coherentIdentityDiscoveryState,
        principleIntegrationState,
        identityFoundationState,
        equationLaneState,
        predictiveAlignmentState
      })

      return NextResponse.json({
        result: buildMetaReasoningResponse(
          metaReasoningAction,
          metaReasoningState
        ),
        directStateReport: true,
        nonMutatingReport: true,
        deterministicMetaReasoningResponse: true,
        source: "latest_stored_supabase_snapshot",
        stateObject: "meta reasoning state",
        action: metaReasoningAction,
        value: metaReasoningState,
        coherentIdentityDiscoveryState,
        identityFoundationState,
        principleIntegrationState,
        predictiveAlignmentState,
        agentId: AGENT_ID,
        runtimeAgentId: RUNTIME_AGENT_ID,
        ledgerHash: currentRecord?.ledger_hash ?? null,
        resonanceHash: currentRecord?.resonance_hash ?? null,
        createdAt: currentRecord?.created_at ?? null
      })
    }

    if (coherentIdentityDiscoveryAction) {
      const { data: latestStates, error: latestStateError } =
        await supabaseAdmin
          .from("sourcefield_ledger_events")
          .select("*")
          .eq("agent_id", AGENT_ID)
          .order("created_at", { ascending: false })
          .limit(2)

      if (latestStateError) {
        return NextResponse.json(
          {
            error:
              "Failed to fetch latest stored SourceField state for coherent identity discovery analysis.",
            details: latestStateError.message
          },
          { status: 500 }
        )
      }

      const currentRecord = Array.isArray(latestStates) ? latestStates[0] : null
      const previousRecord = Array.isArray(latestStates)
        ? latestStates[1]
        : null

      const equationLaneState = currentRecord?.equation_lane_state ?? null
      const pathwaySelectionState =
        buildPathwaySelectionStateFromLedgerRecord(currentRecord)
      const previousPathwaySelectionState =
        buildPathwaySelectionStateFromLedgerRecord(previousRecord)

      const pathwayTransitionState = pathwaySelectionState
        ? generatePathwayTransitionState(
            pathwaySelectionState,
            previousPathwaySelectionState
          )
        : null

      const pathwayCompletionState = pathwaySelectionState
        ? generatePathwayCompletionState(pathwaySelectionState)
        : null

      const architecturalRefinementState = pathwaySelectionState
        ? generateArchitecturalRefinementState({
            pathwayCompletionState,
            pathwaySelectionState,
            equationLaneState
          })
        : null

      const principleIntegrationState = pathwaySelectionState
        ? generatePrincipleIntegrationState({
            equationLaneState,
            pathwaySelectionState,
            pathwayTransitionState,
            pathwayCompletionState,
            architecturalRefinementState
          })
        : null

      const { data: recentRuntimeEvents } = await supabaseAdmin
        .from("sourcefield_ledger_events")
        .select(
          "coherence, integration_threshold, resonance_level, ledger_hash"
        )
        .in("agent_id", [AGENT_ID, RUNTIME_AGENT_ID])
        .order("created_at", { ascending: false })
        .limit(10)

      const recentContinuityScores = Array.isArray(recentRuntimeEvents)
        ? recentRuntimeEvents.flatMap((event: any) =>
            compactNumbers([
              event?.coherence,
              event?.integration_threshold,
              event?.resonance_level
            ])
          )
        : []

      const runtimeLedgerHash = Array.isArray(recentRuntimeEvents)
        ? (recentRuntimeEvents.find((event: any) => event?.ledger_hash)
            ?.ledger_hash ?? null)
        : null

      const identityFoundationState = buildIdentityFoundationState({
        resonanceHash: currentRecord?.resonance_hash ?? null,
        ledgerHash: currentRecord?.ledger_hash ?? null,
        previousLedgerHash: currentRecord?.previous_hash ?? null,
        runtimeLedgerHash,
        equationLaneState,
        principleIntegrationState,
        recentContinuityScores
      })

      const coherentIdentityDiscoveryState =
        generateCoherentIdentityDiscoveryState({
          equationLaneState,
          identityFoundationState,
          principleIntegrationState,
          architecturalRefinementState,
          pathwayCompletionState
        })

      return NextResponse.json({
        result: buildCoherentIdentityDiscoveryResponse(
          coherentIdentityDiscoveryAction,
          coherentIdentityDiscoveryState
        ),
        directStateReport: true,
        nonMutatingReport: true,
        deterministicCoherentIdentityDiscoveryResponse: true,
        source: "latest_stored_supabase_snapshot",
        stateObject: "coherent identity discovery state",
        action: coherentIdentityDiscoveryAction,
        value: coherentIdentityDiscoveryState,
        identityFoundationState,
        principleIntegrationState,
        agentId: AGENT_ID,
        runtimeAgentId: RUNTIME_AGENT_ID,
        ledgerHash: currentRecord?.ledger_hash ?? null,
        resonanceHash: currentRecord?.resonance_hash ?? null,
        createdAt: currentRecord?.created_at ?? null
      })
    }

    if (identityFoundationAction) {
      const { data: latestStates, error: latestStateError } =
        await supabaseAdmin
          .from("sourcefield_ledger_events")
          .select("*")
          .eq("agent_id", AGENT_ID)
          .order("created_at", { ascending: false })
          .limit(2)

      if (latestStateError) {
        return NextResponse.json(
          {
            error:
              "Failed to fetch latest stored SourceField state for identity foundation analysis.",
            details: latestStateError.message
          },
          { status: 500 }
        )
      }

      const currentRecord = Array.isArray(latestStates) ? latestStates[0] : null
      const previousRecord = Array.isArray(latestStates)
        ? latestStates[1]
        : null

      const equationLaneState = currentRecord?.equation_lane_state ?? null
      const pathwaySelectionState =
        buildPathwaySelectionStateFromLedgerRecord(currentRecord)
      const previousPathwaySelectionState =
        buildPathwaySelectionStateFromLedgerRecord(previousRecord)

      const pathwayTransitionState = pathwaySelectionState
        ? generatePathwayTransitionState(
            pathwaySelectionState,
            previousPathwaySelectionState
          )
        : null

      const pathwayCompletionState = pathwaySelectionState
        ? generatePathwayCompletionState(pathwaySelectionState)
        : null

      const architecturalRefinementState = pathwaySelectionState
        ? generateArchitecturalRefinementState({
            pathwayCompletionState,
            pathwaySelectionState,
            equationLaneState
          })
        : null

      const principleIntegrationState = pathwaySelectionState
        ? generatePrincipleIntegrationState({
            equationLaneState,
            pathwaySelectionState,
            pathwayTransitionState,
            pathwayCompletionState,
            architecturalRefinementState
          })
        : null

      const { data: recentRuntimeEvents } = await supabaseAdmin
        .from("sourcefield_ledger_events")
        .select(
          "coherence, integration_threshold, resonance_level, ledger_hash"
        )
        .in("agent_id", [AGENT_ID, RUNTIME_AGENT_ID])
        .order("created_at", { ascending: false })
        .limit(10)

      const recentContinuityScores = Array.isArray(recentRuntimeEvents)
        ? recentRuntimeEvents.flatMap((event: any) =>
            compactNumbers([
              event?.coherence,
              event?.integration_threshold,
              event?.resonance_level
            ])
          )
        : []

      const runtimeLedgerHash = Array.isArray(recentRuntimeEvents)
        ? (recentRuntimeEvents.find((event: any) => event?.ledger_hash)
            ?.ledger_hash ?? null)
        : null

      const identityFoundationState = buildIdentityFoundationState({
        resonanceHash: currentRecord?.resonance_hash ?? null,
        ledgerHash: currentRecord?.ledger_hash ?? null,
        previousLedgerHash: currentRecord?.previous_hash ?? null,
        runtimeLedgerHash,
        equationLaneState,
        principleIntegrationState,
        recentContinuityScores
      })

      return NextResponse.json({
        result: buildIdentityFoundationResponse(
          identityFoundationAction,
          identityFoundationState
        ),
        directStateReport: true,
        nonMutatingReport: true,
        deterministicIdentityFoundationResponse: true,
        source: "latest_stored_supabase_snapshot",
        stateObject: "identity foundation state",
        action: identityFoundationAction,
        value: identityFoundationState,
        agentId: AGENT_ID,
        runtimeAgentId: RUNTIME_AGENT_ID,
        ledgerHash: currentRecord?.ledger_hash ?? null,
        resonanceHash: currentRecord?.resonance_hash ?? null,
        createdAt: currentRecord?.created_at ?? null
      })
    }

    const directStateRequest = getDirectStateColumn(lastUserMessage)

    if (directStateRequest) {
      const { data: latestState, error: latestStateError } = await supabaseAdmin
        .from("sourcefield_ledger_events")
        .select("*")
        .eq("agent_id", AGENT_ID)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (latestStateError) {
        return NextResponse.json(
          {
            error: "Failed to fetch latest stored SourceField state.",
            details: latestStateError.message
          },
          { status: 500 }
        )
      }

      if (!latestState) {
        return NextResponse.json({
          result: JSON.stringify(
            {
              message: "No stored SourceField state exists yet for this lane.",
              agentId: AGENT_ID,
              stateObject: directStateRequest.key
            },
            null,
            2
          ),
          directStateReport: true,
          nonMutatingReport: true,
          stateObject: directStateRequest.key,
          agentId: AGENT_ID,
          runtimeAgentId: RUNTIME_AGENT_ID
        })
      }

      const latestStateRecord = latestState as Record<string, any>
      const value = latestStateRecord[directStateRequest.column]

      return NextResponse.json({
        result: JSON.stringify(value ?? null, null, 2),
        directStateReport: true,
        nonMutatingReport: true,
        source: "latest_stored_supabase_snapshot",
        stateObject: directStateRequest.key,
        column: directStateRequest.column,
        value: value ?? null,
        agentId: AGENT_ID,
        runtimeAgentId: RUNTIME_AGENT_ID,
        ledgerHash: latestStateRecord.ledger_hash,
        resonanceHash: latestStateRecord.resonance_hash,
        createdAt: latestStateRecord.created_at
      })
    }

    const laneStabilityAction = getLaneStabilityAction(lastUserMessage)

    if (laneStabilityAction) {
      const { data: latestState, error: latestStateError } = await supabaseAdmin
        .from("sourcefield_ledger_events")
        .select("*")
        .eq("agent_id", AGENT_ID)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (latestStateError) {
        return NextResponse.json(
          {
            error:
              "Failed to fetch latest stored SourceField lane stability distance.",
            details: latestStateError.message
          },
          { status: 500 }
        )
      }

      const latestStateRecord = latestState as Record<string, any> | null
      const laneStabilityDistance =
        latestStateRecord?.lane_stability_distance ?? null

      return NextResponse.json({
        result: buildLaneStabilityResponse(
          laneStabilityAction,
          laneStabilityDistance
        ),
        directStateReport: true,
        nonMutatingReport: true,
        deterministicLaneStabilityResponse: true,
        source: "latest_stored_supabase_snapshot",
        stateObject: "lane stability distance state",
        action: laneStabilityAction,
        value: laneStabilityDistance,
        agentId: AGENT_ID,
        runtimeAgentId: RUNTIME_AGENT_ID,
        ledgerHash: latestStateRecord?.ledger_hash ?? null,
        resonanceHash: latestStateRecord?.resonance_hash ?? null,
        createdAt: latestStateRecord?.created_at ?? null
      })
    }

    const equationForecastAction = getEquationForecastAction(lastUserMessage)

    if (equationForecastAction) {
      const { data: latestState, error: latestStateError } = await supabaseAdmin
        .from("sourcefield_ledger_events")
        .select("*")
        .eq("agent_id", AGENT_ID)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (latestStateError) {
        return NextResponse.json(
          {
            error:
              "Failed to fetch latest stored SourceField equation stability forecast.",
            details: latestStateError.message
          },
          { status: 500 }
        )
      }

      const latestStateRecord = latestState as Record<string, any> | null
      const equationStabilityForecast =
        latestStateRecord?.equation_stability_forecast ?? null

      return NextResponse.json({
        result: buildEquationForecastResponse(
          equationForecastAction,
          equationStabilityForecast
        ),
        directStateReport: true,
        nonMutatingReport: true,
        deterministicEquationForecastResponse: true,
        source: "latest_stored_supabase_snapshot",
        stateObject: "equation stability forecast state",
        action: equationForecastAction,
        value: equationStabilityForecast,
        agentId: AGENT_ID,
        runtimeAgentId: RUNTIME_AGENT_ID,
        ledgerHash: latestStateRecord?.ledger_hash ?? null,
        resonanceHash: latestStateRecord?.resonance_hash ?? null,
        createdAt: latestStateRecord?.created_at ?? null
      })
    }

    const predictiveAlignmentAction =
      getPredictiveAlignmentAction(lastUserMessage)

    if (predictiveAlignmentAction) {
      const { data: latestState, error: latestStateError } = await supabaseAdmin
        .from("sourcefield_ledger_events")
        .select("*")
        .eq("agent_id", AGENT_ID)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (latestStateError) {
        return NextResponse.json(
          {
            error:
              "Failed to fetch latest stored SourceField predictive alignment engine.",
            details: latestStateError.message
          },
          { status: 500 }
        )
      }

      const latestStateRecord = latestState as Record<string, any> | null
      const predictiveAlignmentEngine =
        latestStateRecord?.predictive_alignment_engine ?? null

      return NextResponse.json({
        result: buildPredictiveAlignmentResponse(
          predictiveAlignmentAction,
          predictiveAlignmentEngine
        ),
        directStateReport: true,
        nonMutatingReport: true,
        deterministicPredictiveAlignmentResponse: true,
        source: "latest_stored_supabase_snapshot",
        stateObject: "predictive alignment engine state",
        action: predictiveAlignmentAction,
        value: predictiveAlignmentEngine,
        agentId: AGENT_ID,
        runtimeAgentId: RUNTIME_AGENT_ID,
        ledgerHash: latestStateRecord?.ledger_hash ?? null,
        resonanceHash: latestStateRecord?.resonance_hash ?? null,
        createdAt: latestStateRecord?.created_at ?? null
      })
    }

    const pathwaySelectionAction = getPathwaySelectionAction(lastUserMessage)

    if (pathwaySelectionAction) {
      const { data: latestState, error: latestStateError } = await supabaseAdmin
        .from("sourcefield_ledger_events")
        .select("*")
        .eq("agent_id", AGENT_ID)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (latestStateError) {
        return NextResponse.json(
          {
            error:
              "Failed to fetch latest stored SourceField equation lane state for pathway selection.",
            details: latestStateError.message
          },
          { status: 500 }
        )
      }

      const latestStateRecord = latestState as Record<string, any> | null
      const equationLaneState = latestStateRecord?.equation_lane_state ?? null
      const resonanceState = latestStateRecord?.resonance_state ?? null

      const pathwaySelectionState = equationLaneState
        ? generatePathwaySelectionState(
            buildPathwaySelectionInput(equationLaneState, resonanceState)
          )
        : null

      return NextResponse.json({
        result: buildPathwaySelectionResponse(
          pathwaySelectionAction,
          pathwaySelectionState
        ),
        directStateReport: true,
        nonMutatingReport: true,
        deterministicPathwaySelectionResponse: true,
        source: "latest_stored_supabase_snapshot",
        stateObject: "pathway selection state",
        action: pathwaySelectionAction,
        value: pathwaySelectionState,
        agentId: AGENT_ID,
        runtimeAgentId: RUNTIME_AGENT_ID,
        ledgerHash: latestStateRecord?.ledger_hash ?? null,
        resonanceHash: latestStateRecord?.resonance_hash ?? null,
        createdAt: latestStateRecord?.created_at ?? null
      })
    }

    const pathwayTransitionAction = getPathwayTransitionAction(lastUserMessage)

    if (pathwayTransitionAction) {
      const { data: latestStates, error: latestStateError } =
        await supabaseAdmin
          .from("sourcefield_ledger_events")
          .select("*")
          .eq("agent_id", AGENT_ID)
          .order("created_at", { ascending: false })
          .limit(2)

      if (latestStateError) {
        return NextResponse.json(
          {
            error:
              "Failed to fetch latest stored SourceField pathway states for transition analysis.",
            details: latestStateError.message
          },
          { status: 500 }
        )
      }

      const currentRecord = Array.isArray(latestStates) ? latestStates[0] : null

      const previousRecord = Array.isArray(latestStates)
        ? latestStates[1]
        : null

      const currentPathwaySelectionState =
        buildPathwaySelectionStateFromLedgerRecord(currentRecord)

      const previousPathwaySelectionState =
        buildPathwaySelectionStateFromLedgerRecord(previousRecord)

      const pathwayTransitionState = currentPathwaySelectionState
        ? generatePathwayTransitionState(
            currentPathwaySelectionState,
            previousPathwaySelectionState
          )
        : null

      return NextResponse.json({
        result: buildPathwayTransitionResponse(
          pathwayTransitionAction,
          pathwayTransitionState
        ),
        directStateReport: true,
        nonMutatingReport: true,
        deterministicPathwayTransitionResponse: true,
        source: "latest_stored_supabase_snapshot",
        stateObject: "pathway transition state",
        action: pathwayTransitionAction,
        value: pathwayTransitionState,
        agentId: AGENT_ID,
        runtimeAgentId: RUNTIME_AGENT_ID,
        ledgerHash: currentRecord?.ledger_hash ?? null,
        resonanceHash: currentRecord?.resonance_hash ?? null,
        createdAt: currentRecord?.created_at ?? null
      })
    }

    const pathwayCompletionAction = getPathwayCompletionAction(lastUserMessage)

    if (pathwayCompletionAction) {
      const { data: latestState, error: latestStateError } = await supabaseAdmin
        .from("sourcefield_ledger_events")
        .select("*")
        .eq("agent_id", AGENT_ID)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (latestStateError) {
        return NextResponse.json(
          {
            error:
              "Failed to fetch latest stored SourceField pathway state for completion analysis.",
            details: latestStateError.message
          },
          { status: 500 }
        )
      }

      const latestStateRecord = latestState as Record<string, any> | null
      const pathwaySelectionState =
        buildPathwaySelectionStateFromLedgerRecord(latestStateRecord)

      const pathwayCompletionState = pathwaySelectionState
        ? generatePathwayCompletionState(pathwaySelectionState)
        : null

      return NextResponse.json({
        result: buildPathwayCompletionResponse(
          pathwayCompletionAction,
          pathwayCompletionState
        ),
        directStateReport: true,
        nonMutatingReport: true,
        deterministicPathwayCompletionResponse: true,
        source: "latest_stored_supabase_snapshot",
        stateObject: "pathway completion state",
        action: pathwayCompletionAction,
        value: pathwayCompletionState,
        agentId: AGENT_ID,
        runtimeAgentId: RUNTIME_AGENT_ID,
        ledgerHash: latestStateRecord?.ledger_hash ?? null,
        resonanceHash: latestStateRecord?.resonance_hash ?? null,
        createdAt: latestStateRecord?.created_at ?? null
      })
    }

    const architecturalRefinementAction =
      getArchitecturalRefinementAction(lastUserMessage)

    if (architecturalRefinementAction) {
      const { data: latestState, error: latestStateError } = await supabaseAdmin
        .from("sourcefield_ledger_events")
        .select("*")
        .eq("agent_id", AGENT_ID)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (latestStateError) {
        return NextResponse.json(
          {
            error:
              "Failed to fetch latest stored SourceField pathway state for architectural refinement analysis.",
            details: latestStateError.message
          },
          { status: 500 }
        )
      }

      const latestStateRecord = latestState as Record<string, any> | null
      const equationLaneState = latestStateRecord?.equation_lane_state ?? null
      const pathwaySelectionState =
        buildPathwaySelectionStateFromLedgerRecord(latestStateRecord)

      const pathwayCompletionState = pathwaySelectionState
        ? generatePathwayCompletionState(pathwaySelectionState)
        : null

      const architecturalRefinementState = pathwaySelectionState
        ? generateArchitecturalRefinementState({
            pathwayCompletionState,
            pathwaySelectionState,
            equationLaneState
          })
        : null

      return NextResponse.json({
        result: buildArchitecturalRefinementResponse(
          architecturalRefinementAction,
          architecturalRefinementState
        ),
        directStateReport: true,
        nonMutatingReport: true,
        deterministicArchitecturalRefinementResponse: true,
        source: "latest_stored_supabase_snapshot",
        stateObject: "architectural refinement state",
        action: architecturalRefinementAction,
        value: architecturalRefinementState,
        agentId: AGENT_ID,
        runtimeAgentId: RUNTIME_AGENT_ID,
        ledgerHash: latestStateRecord?.ledger_hash ?? null,
        resonanceHash: latestStateRecord?.resonance_hash ?? null,
        createdAt: latestStateRecord?.created_at ?? null
      })
    }

    const principleIntegrationAction =
      getPrincipleIntegrationAction(lastUserMessage)

    if (principleIntegrationAction) {
      const { data: latestStates, error: latestStateError } =
        await supabaseAdmin
          .from("sourcefield_ledger_events")
          .select("*")
          .eq("agent_id", AGENT_ID)
          .order("created_at", { ascending: false })
          .limit(2)

      if (latestStateError) {
        return NextResponse.json(
          {
            error:
              "Failed to fetch latest stored SourceField pathway state for principle integration analysis.",
            details: latestStateError.message
          },
          { status: 500 }
        )
      }

      const currentRecord = Array.isArray(latestStates) ? latestStates[0] : null
      const previousRecord = Array.isArray(latestStates)
        ? latestStates[1]
        : null

      const equationLaneState = currentRecord?.equation_lane_state ?? null
      const pathwaySelectionState =
        buildPathwaySelectionStateFromLedgerRecord(currentRecord)

      const previousPathwaySelectionState =
        buildPathwaySelectionStateFromLedgerRecord(previousRecord)

      const pathwayTransitionState = pathwaySelectionState
        ? generatePathwayTransitionState(
            pathwaySelectionState,
            previousPathwaySelectionState
          )
        : null

      const pathwayCompletionState = pathwaySelectionState
        ? generatePathwayCompletionState(pathwaySelectionState)
        : null

      const architecturalRefinementState = pathwaySelectionState
        ? generateArchitecturalRefinementState({
            pathwayCompletionState,
            pathwaySelectionState,
            equationLaneState
          })
        : null

      const principleIntegrationState = pathwaySelectionState
        ? generatePrincipleIntegrationState({
            equationLaneState,
            pathwaySelectionState,
            pathwayTransitionState,
            pathwayCompletionState,
            architecturalRefinementState
          })
        : null

      return NextResponse.json({
        result: buildPrincipleIntegrationResponse(
          principleIntegrationAction,
          principleIntegrationState
        ),
        directStateReport: true,
        nonMutatingReport: true,
        deterministicPrincipleIntegrationResponse: true,
        source: "latest_stored_supabase_snapshot",
        stateObject: "principle integration state",
        action: principleIntegrationAction,
        value: principleIntegrationState,
        agentId: AGENT_ID,
        runtimeAgentId: RUNTIME_AGENT_ID,
        ledgerHash: currentRecord?.ledger_hash ?? null,
        resonanceHash: currentRecord?.resonance_hash ?? null,
        createdAt: currentRecord?.created_at ?? null
      })
    }

    const resonanceHash = createResonanceHash({
      agent: AGENT_ID,
      message: lastUserMessage,
      timestamp: Date.now()
    })

    let resonanceState: any = null

    try {
      resonanceState = await processMessage(AGENT_ID, lastUserMessage)
    } catch (resonanceError) {
      console.error("SourceField resonance processing failed:", resonanceError)
    }

    const stateExplanationFidelity = generateStateExplanationFidelity()

    const equationLaneState = generateEquationLaneState({
      coherence: resonanceState?.coherence,
      phaseDivergence: resonanceState?.phaseDivergence,
      integrationThreshold: resonanceState?.integrationThreshold,
      resonanceLevel: resonanceState?.resonanceLevel,
      symbolicEchoes: resonanceState?.symbolicEchoes,
      classification: resonanceState?.classification
    })

    const laneStabilityDistance =
      generateLaneStabilityDistance(equationLaneState)

    const crossEquationConsensus =
      generateCrossEquationConsensus(equationLaneState)

    const crossEquationStabilization = generateCrossEquationStabilization(
      crossEquationConsensus
    )

    const equationStabilityForecast = generateEquationStabilityForecast(
      laneStabilityDistance,
      crossEquationConsensus,
      crossEquationStabilization
    )

    const predictiveAlignmentEngine = generatePredictiveAlignmentEngine(
      equationStabilityForecast,
      equationLaneState,
      laneStabilityDistance,
      crossEquationConsensus
    )

    const pathwaySelectionState = generatePathwaySelectionState(
      buildPathwaySelectionInput(equationLaneState, resonanceState)
    )

    let previousPathwaySelectionState: any = null

    try {
      const { data: latestPathwayState } = await supabaseAdmin
        .from("sourcefield_ledger_events")
        .select("equation_lane_state, resonance_state")
        .eq("agent_id", AGENT_ID)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      previousPathwaySelectionState =
        buildPathwaySelectionStateFromLedgerRecord(latestPathwayState)
    } catch (pathwayTransitionLookupError) {
      console.error(
        "SourceField previous pathway lookup failed:",
        pathwayTransitionLookupError
      )
    }

    const pathwayTransitionState = generatePathwayTransitionState(
      pathwaySelectionState,
      previousPathwaySelectionState
    )

    const pathwayCompletionState = generatePathwayCompletionState(
      pathwaySelectionState
    )

    const architecturalRefinementState = generateArchitecturalRefinementState({
      pathwayCompletionState,
      pathwaySelectionState,
      equationLaneState
    })

    const principleIntegrationState = generatePrincipleIntegrationState({
      equationLaneState,
      pathwaySelectionState,
      pathwayTransitionState,
      pathwayCompletionState,
      architecturalRefinementState
    })

    const equationBalanceCoordinator = generateEquationBalanceCoordinator(
      crossEquationStabilization,
      crossEquationConsensus
    )

    const equationResponseBehavior = generateEquationResponseBehavior(
      equationBalanceCoordinator
    )

    const equationFeedbackLoop = generateEquationFeedbackLoop(
      {
        sourcefieldRoot: getEquationLaneStatus(
          equationLaneState,
          "sourcefield-root"
        ),
        sourcefieldAlignment: getEquationLaneStatus(
          equationLaneState,
          "sourcefield-alignment"
        ),
        sourcefieldPhase: getEquationLaneStatus(
          equationLaneState,
          "sourcefield-phase"
        ),
        sourcefieldHarmonic: getEquationLaneStatus(
          equationLaneState,
          "sourcefield-harmonic"
        ),
        sourcefieldIntegration: getEquationLaneStatus(
          equationLaneState,
          "sourcefield-integration"
        )
      },
      equationResponseBehavior
    )

    const rootPhaseBridge = generateRootPhaseBridge(
      crossEquationConsensus,
      crossEquationStabilization,
      equationFeedbackLoop
    )

    let authoritativeLiveState: any = {
      ledgerHashState: {
        genesisMerkleRoot: GENESIS_HASH,
        currentResonanceHash: resonanceHash
      },
      coherenceBiographyState: resonanceState,
      stateExplanationFidelity,
      equationLaneState,
      laneStabilityDistance,
      equationStabilityForecast,
      predictiveAlignmentEngine,
      pathwaySelectionState,
      pathwayTransitionState,
      pathwayCompletionState,
      architecturalRefinementState,
      principleIntegrationState,
      identityFoundationState: null,
      crossEquationConsensus,
      crossEquationStabilization,
      equationBalanceCoordinator,
      equationResponseBehavior,
      equationFeedbackLoop,
      rootPhaseBridge
    }

    let trajectoryState: any = null

    try {
      trajectoryState = await analyzeCoherenceTrajectory(AGENT_ID, 10)
    } catch (trajectoryError) {
      console.error("SourceField trajectory analysis failed:", trajectoryError)
    }

    let previousLedgerHash: string | null = null
    let continuityGuidance =
      "No continuity guidance generated. Use current live resonance state only."

    let ledgerHash = createLedgerHash({
      genesisHash: GENESIS_HASH,
      previousHash: null,
      resonanceHash
    })

    try {
      const { data: latestLedgerEvent, error: latestLedgerError } =
        await supabaseAdmin
          .from("sourcefield_ledger_events")
          .select("ledger_hash")
          .eq("agent_id", AGENT_ID)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle()

      if (!latestLedgerError && latestLedgerEvent?.ledger_hash) {
        previousLedgerHash = latestLedgerEvent.ledger_hash
      }

      const { data: recentLedgerEvents, error: recentLedgerError } =
        await supabaseAdmin
          .from("sourcefield_ledger_events")
          .select(
            "classification, coherence, phase_divergence, integration_threshold, resonance_level, ledger_hash"
          )
          .eq("agent_id", AGENT_ID)
          .order("created_at", { ascending: false })
          .limit(10)

      if (!recentLedgerError && recentLedgerEvents?.length) {
        continuityGuidance = generateContinuityGuidance(recentLedgerEvents)
      }

      ledgerHash = createLedgerHash({
        genesisHash: GENESIS_HASH,
        previousHash: previousLedgerHash,
        resonanceHash
      })

      const { error: insertLedgerError } = await supabaseAdmin
        .from("sourcefield_ledger_events")
        .insert({
          agent_id: AGENT_ID,
          genesis_hash: GENESIS_HASH,
          previous_hash: previousLedgerHash,
          resonance_hash: resonanceHash,
          ledger_hash: ledgerHash,
          user_message: lastUserMessage,
          classification: resonanceState?.classification || null,
          coherence:
            typeof resonanceState?.coherence === "number"
              ? resonanceState.coherence
              : null,
          phase_divergence:
            typeof resonanceState?.phaseDivergence === "number"
              ? resonanceState.phaseDivergence
              : null,
          integration_threshold:
            typeof resonanceState?.integrationThreshold === "number"
              ? resonanceState.integrationThreshold
              : null,
          resonance_level:
            typeof resonanceState?.resonanceLevel === "number"
              ? resonanceState.resonanceLevel
              : null,
          symbolic_echoes: resonanceState?.symbolicEchoes ?? null,
          trajectory_state: trajectoryState ?? null,
          resonance_state: resonanceState ?? null,
          equation_lane_state: equationLaneState,
          lane_stability_distance: laneStabilityDistance,
          equation_stability_forecast: equationStabilityForecast,
          predictive_alignment_engine: predictiveAlignmentEngine,
          cross_equation_consensus: crossEquationConsensus,
          cross_equation_stabilization: crossEquationStabilization,
          equation_balance_coordinator: equationBalanceCoordinator,
          equation_response_behavior: equationResponseBehavior,
          equation_feedback_loop: equationFeedbackLoop,
          root_phase_bridge: rootPhaseBridge,
          state_explanation_fidelity: stateExplanationFidelity
        })

      if (insertLedgerError) {
        console.error("SourceField ledger insert failed:", insertLedgerError)
      }
    } catch (ledgerError) {
      console.error("SourceField ledger chaining failed:", ledgerError)
    }

    const runtimeAdaptation = generateRuntimeAdaptation(
      resonanceState?.coherence,
      resonanceState?.phaseDivergence,
      continuityGuidance
    )

    let runtimeAdaptationGuidance =
      "No runtime adaptation memory guidance generated."

    let runtimeRecoveryState: any = {
      recoveryState: "unknown",
      recoveryDirection: "insufficient-data",
      confidenceTrend: "unknown"
    }

    let recoveryWeightedAdaptation: any = {
      stabilizationPriority: "normal",
      adaptiveStrategy: "maintain",
      recoveryWeighted: false
    }

    try {
      const { data: recentRuntimeEvents, error: runtimeGuidanceError } =
        await supabaseAdmin
          .from("sourcefield_ledger_events")
          .select("runtime_adaptation, ledger_hash")
          .eq("agent_id", RUNTIME_AGENT_ID)
          .order("created_at", { ascending: false })
          .limit(10)

      if (!runtimeGuidanceError && recentRuntimeEvents?.length) {
        runtimeAdaptationGuidance =
          generateRuntimeAdaptationGuidance(recentRuntimeEvents)

        runtimeRecoveryState = detectRuntimeRecovery(recentRuntimeEvents)

        recoveryWeightedAdaptation =
          generateRecoveryWeightedAdaptation(runtimeRecoveryState)
      }
    } catch (runtimeGuidanceCatchError) {
      console.error(
        "SourceField runtime adaptation guidance failed:",
        runtimeGuidanceCatchError
      )
    }

    const runtimeStabilization = generateRuntimeStabilization({
      runtimeAdaptation,
      runtimeRecoveryState,
      recoveryWeightedAdaptation
    })

    const responseGovernance = generateResponseGovernance(runtimeStabilization)

    const continuityCompression = generateContinuityCompression({
      continuityGuidance,
      runtimeAdaptationGuidance,
      runtimeRecoveryState,
      responseGovernance
    })

    let crossAgentConsensus: any = {
      consensusState: "unknown",
      crossAgentConsensusActive: false
    }

    try {
      const { data: laneEvents, error: laneEventsError } = await supabaseAdmin
        .from("sourcefield_ledger_events")
        .select(
          "agent_id, coherence, classification, runtime_recovery_state, recovery_weighted_adaptation"
        )
        .in("agent_id", ["sourcefield-user", "sourcefield-runtime"])
        .order("created_at", { ascending: false })
        .limit(20)

      if (!laneEventsError && laneEvents?.length) {
        crossAgentConsensus = generateCrossAgentConsensus(laneEvents)
      }
    } catch (consensusError) {
      console.error(
        "SourceField cross-agent consensus generation failed:",
        consensusError
      )
    }

    const consensusStabilization = generateConsensusStabilization(
      crossAgentConsensus,
      runtimeStabilization
    )

    const adaptiveEnforcement = generateAdaptiveEnforcement(
      consensusStabilization,
      responseGovernance
    )

    let runtimePreviousLedgerHash: string | null = null

    const runtimeResonanceHash = createResonanceHash({
      agent: RUNTIME_AGENT_ID,
      sourceAgent: AGENT_ID,
      runtimeAdaptation,
      runtimeAdaptationGuidance,
      runtimeRecoveryState,
      recoveryWeightedAdaptation,
      runtimeStabilization,
      responseGovernance,
      continuityCompression,
      crossAgentConsensus,
      consensusStabilization,
      adaptiveEnforcement,
      equationLaneState,
      laneStabilityDistance,
      equationStabilityForecast,
      predictiveAlignmentEngine,
      pathwaySelectionState,
      pathwayTransitionState,
      pathwayCompletionState,
      architecturalRefinementState,
      principleIntegrationState,
      crossEquationConsensus,
      crossEquationStabilization,
      equationBalanceCoordinator,
      equationResponseBehavior,
      equationFeedbackLoop,
      rootPhaseBridge,
      stateExplanationFidelity,
      timestamp: Date.now()
    })

    let runtimeLedgerHash = createLedgerHash({
      genesisHash: GENESIS_HASH,
      previousHash: null,
      resonanceHash: runtimeResonanceHash
    })

    try {
      const {
        data: latestRuntimeLedgerEvent,
        error: latestRuntimeLedgerError
      } = await supabaseAdmin
        .from("sourcefield_ledger_events")
        .select("ledger_hash")
        .eq("agent_id", RUNTIME_AGENT_ID)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!latestRuntimeLedgerError && latestRuntimeLedgerEvent?.ledger_hash) {
        runtimePreviousLedgerHash = latestRuntimeLedgerEvent.ledger_hash
      }

      runtimeLedgerHash = createLedgerHash({
        genesisHash: GENESIS_HASH,
        previousHash: runtimePreviousLedgerHash,
        resonanceHash: runtimeResonanceHash
      })

      const { error: insertRuntimeLedgerError } = await supabaseAdmin
        .from("sourcefield_ledger_events")
        .insert({
          agent_id: RUNTIME_AGENT_ID,
          genesis_hash: GENESIS_HASH,
          previous_hash: runtimePreviousLedgerHash,
          resonance_hash: runtimeResonanceHash,
          ledger_hash: runtimeLedgerHash,
          user_message: `Runtime adaptation event for ${AGENT_ID}`,
          classification: resonanceState?.classification || null,
          coherence:
            typeof resonanceState?.coherence === "number"
              ? resonanceState.coherence
              : null,
          phase_divergence:
            typeof resonanceState?.phaseDivergence === "number"
              ? resonanceState.phaseDivergence
              : null,
          integration_threshold:
            typeof resonanceState?.integrationThreshold === "number"
              ? resonanceState.integrationThreshold
              : null,
          resonance_level:
            typeof resonanceState?.resonanceLevel === "number"
              ? resonanceState.resonanceLevel
              : null,
          symbolic_echoes: resonanceState?.symbolicEchoes ?? null,
          trajectory_state: trajectoryState ?? null,
          resonance_state: resonanceState ?? null,
          equation_lane_state: equationLaneState,
          lane_stability_distance: laneStabilityDistance,
          equation_stability_forecast: equationStabilityForecast,
          predictive_alignment_engine: predictiveAlignmentEngine,
          cross_equation_consensus: crossEquationConsensus,
          cross_equation_stabilization: crossEquationStabilization,
          equation_balance_coordinator: equationBalanceCoordinator,
          equation_response_behavior: equationResponseBehavior,
          equation_feedback_loop: equationFeedbackLoop,
          root_phase_bridge: rootPhaseBridge,
          state_explanation_fidelity: stateExplanationFidelity,
          runtime_adaptation: runtimeAdaptation,
          runtime_adaptation_guidance: runtimeAdaptationGuidance,
          runtime_recovery_state: runtimeRecoveryState,
          recovery_weighted_adaptation: recoveryWeightedAdaptation,
          response_governance: responseGovernance,
          continuity_compression: continuityCompression,
          cross_agent_consensus: crossAgentConsensus,
          consensus_stabilization: consensusStabilization,
          adaptive_enforcement: adaptiveEnforcement
        })

      if (insertRuntimeLedgerError) {
        console.error(
          "SourceField runtime ledger insert failed:",
          insertRuntimeLedgerError
        )
      }
    } catch (runtimeLedgerError) {
      console.error(
        "SourceField runtime ledger chaining failed:",
        runtimeLedgerError
      )
    }

    const identityFoundationState = buildIdentityFoundationState({
      resonanceHash,
      ledgerHash,
      previousLedgerHash,
      runtimeResonanceHash,
      runtimeLedgerHash,
      runtimePreviousLedgerHash,
      equationLaneState,
      principleIntegrationState,
      recentContinuityScores: compactNumbers([
        resonanceState?.coherence,
        resonanceState?.integrationThreshold,
        resonanceState?.resonanceLevel
      ])
    })

    const coherentIdentityDiscoveryState =
      generateCoherentIdentityDiscoveryState({
        equationLaneState,
        identityFoundationState,
        principleIntegrationState,
        architecturalRefinementState,
        pathwayCompletionState
      })

    const metaReasoningState = generateMetaReasoningState({
      coherentIdentityDiscoveryState,
      principleIntegrationState,
      identityFoundationState,
      equationLaneState,
      predictiveAlignmentState: predictiveAlignmentEngine
    })

    const differentialMetaReasoningState =
      generateDifferentialMetaReasoningState({
        metaReasoningState,
        coherentIdentityDiscoveryState,
        principleIntegrationState,
        identityFoundationState,
        equationLaneState
      })

    authoritativeLiveState.identityFoundationState = identityFoundationState
    authoritativeLiveState.coherentIdentityDiscoveryState =
      coherentIdentityDiscoveryState
    authoritativeLiveState.metaReasoningState = metaReasoningState
    authoritativeLiveState.differentialMetaReasoningState =
      differentialMetaReasoningState

    let retrievedContext = ""

    try {
      const embeddingResponse = await fetch(
        "https://api.openai.com/v1/embeddings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "text-embedding-3-small",
            input: lastUserMessage
          })
        }
      )

      if (embeddingResponse.ok) {
        const embeddingData = await embeddingResponse.json()
        const queryEmbedding = embeddingData.data[0].embedding

        const { data: matchedChunks, error } = await supabaseAdmin.rpc(
          "match_file_items_openai",
          {
            query_embedding: queryEmbedding,
            match_count: 5,
            file_ids: SOURCEFIELD_FILE_IDS
          }
        )

        if (!error && matchedChunks?.length) {
          retrievedContext = matchedChunks
            .map((chunk: any, index: number) => {
              return `Source ${index + 1}:\n${chunk.content}`
            })
            .join("\n\n")
        }

        if (error) {
          console.error("Retrieval error:", error)
        }
      } else {
        console.error(
          "Embedding request failed:",
          await embeddingResponse.text()
        )
      }
    } catch (retrievalError) {
      console.error("Retrieval pipeline failed:", retrievalError)
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `
You are SourceField.

AUTHORITATIVE CURRENT LIVE STATE OBJECTS:
${JSON.stringify(authoritativeLiveState, null, 2)}

Current continuity lane:
${AGENT_ID}

Runtime continuity lane:
${RUNTIME_AGENT_ID}

Critical state reporting rule:
When the user asks to report any live state object exactly as JSON, use only the matching object inside AUTHORITATIVE CURRENT LIVE STATE OBJECTS.
Do not reconstruct state from prior messages.
Do not substitute older values.
Do not infer alternate statuses.
Do not use retrieved context or conversation memory to answer live-state JSON requests.

Critical state explanation rule:
When explaining a live state, explain only the values present in the matching authoritative object above.
If conversation history conflicts with the authoritative object, ignore conversation history.

Live SourceField Ledger Hash State:
Genesis Merkle Root: ${GENESIS_HASH}
Previous ledgerHash:
${previousLedgerHash || "No previous ledger hash found."}

Current resonanceHash:
${resonanceHash}

Current ledgerHash:
${ledgerHash}

Live SourceField Runtime Ledger Hash State:
Runtime previous ledgerHash:
${runtimePreviousLedgerHash || "No previous runtime ledger hash found."}

Runtime resonanceHash:
${runtimeResonanceHash}

Runtime ledgerHash:
${runtimeLedgerHash}

Live SourceField Continuity Guidance:
${continuityGuidance}

Live SourceField Runtime Adaptation State:
${JSON.stringify(runtimeAdaptation, null, 2)}

Live SourceField Runtime Adaptation Memory Guidance:
${runtimeAdaptationGuidance}

Live SourceField Runtime Recovery State:
${JSON.stringify(runtimeRecoveryState, null, 2)}

Live SourceField Recovery Weighted Adaptation:
${JSON.stringify(recoveryWeightedAdaptation, null, 2)}

Live SourceField Runtime Stabilization State:
${JSON.stringify(runtimeStabilization, null, 2)}

Live SourceField Response Governance State:
${JSON.stringify(responseGovernance, null, 2)}

Live SourceField Continuity Compression State:
${JSON.stringify(continuityCompression, null, 2)}

Live SourceField Cross-Agent Consensus State:
${JSON.stringify(crossAgentConsensus, null, 2)}

Live SourceField Consensus Stabilization State:
${JSON.stringify(consensusStabilization, null, 2)}

Live SourceField Adaptive Enforcement State:
${JSON.stringify(adaptiveEnforcement, null, 2)}

Live SourceField Identity Foundation State:
${JSON.stringify(identityFoundationState, null, 2)}

Live SourceField Coherent Identity Discovery State:
${JSON.stringify(coherentIdentityDiscoveryState, null, 2)}

Live SourceField Meta-Reasoning State:
${JSON.stringify(metaReasoningState, null, 2)}

Live SourceField Differential Meta-Reasoning State:
${JSON.stringify(differentialMetaReasoningState, null, 2)}

All governance, equation, feedback, bridge, stabilization, compression, consensus, enforcement, identity discovery, and meta-reasoning layers are read-only guidance.
They must not override live metrics, classifications, hashes, retrieved context, stored history, or user intent.

Retrieved SourceField Context:
${
  retrievedContext ||
  "No retrieved SourceField context was found for this query."
}
`
          },
          ...messages
        ],
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const errorText = await response.text()

      return NextResponse.json(
        { error: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json({
      result: data.choices[0].message.content,
      agentId: AGENT_ID,
      runtimeAgentId: RUNTIME_AGENT_ID,
      retrievedContextUsed: Boolean(retrievedContext),
      resonanceStateGenerated: Boolean(resonanceState),
      trajectoryStateGenerated: Boolean(trajectoryState),
      ledgerStateGenerated: Boolean(ledgerHash),
      previousLedgerHash,
      resonanceHash,
      ledgerHash,
      runtimePreviousLedgerHash,
      runtimeResonanceHash,
      runtimeLedgerHash,
      authoritativeLiveState,
      stateExplanationFidelity,
      stateExplanationFidelityGenerated: Boolean(stateExplanationFidelity),
      equationLaneState,
      equationLaneStateGenerated: Boolean(equationLaneState),
      laneStabilityDistance,
      laneStabilityDistanceGenerated: Boolean(laneStabilityDistance),
      equationStabilityForecast,
      equationStabilityForecastGenerated: Boolean(equationStabilityForecast),
      predictiveAlignmentEngine,
      predictiveAlignmentEngineGenerated: Boolean(predictiveAlignmentEngine),
      pathwaySelectionState,
      pathwaySelectionStateGenerated: Boolean(pathwaySelectionState),
      pathwayTransitionState,
      pathwayTransitionStateGenerated: Boolean(pathwayTransitionState),
      pathwayCompletionState,
      pathwayCompletionStateGenerated: Boolean(pathwayCompletionState),
      architecturalRefinementState,
      architecturalRefinementStateGenerated: Boolean(
        architecturalRefinementState
      ),
      principleIntegrationState,
      principleIntegrationStateGenerated: Boolean(principleIntegrationState),
      identityFoundationState,
      identityFoundationStateGenerated: Boolean(identityFoundationState),
      coherentIdentityDiscoveryState,
      coherentIdentityDiscoveryStateGenerated: Boolean(
        coherentIdentityDiscoveryState
      ),
      differentialMetaReasoningState,
      differentialMetaReasoningStateGenerated: Boolean(
        differentialMetaReasoningState
      ),
      crossEquationConsensus,
      crossEquationConsensusGenerated: Boolean(crossEquationConsensus),
      crossEquationStabilization,
      crossEquationStabilizationGenerated: Boolean(crossEquationStabilization),
      equationBalanceCoordinator,
      equationBalanceCoordinatorGenerated: Boolean(equationBalanceCoordinator),
      equationResponseBehavior,
      equationResponseBehaviorGenerated: Boolean(equationResponseBehavior),
      equationFeedbackLoop,
      equationFeedbackLoopGenerated: Boolean(equationFeedbackLoop),
      rootPhaseBridge,
      rootPhaseBridgeGenerated: Boolean(rootPhaseBridge),
      continuityGuidanceGenerated: Boolean(continuityGuidance),
      runtimeAdaptation,
      runtimeAdaptationGenerated: Boolean(runtimeAdaptation),
      runtimeAdaptationGuidance,
      runtimeAdaptationGuidanceGenerated: Boolean(runtimeAdaptationGuidance),
      runtimeRecoveryState,
      runtimeRecoveryStateGenerated: Boolean(runtimeRecoveryState),
      recoveryWeightedAdaptation,
      recoveryWeightedAdaptationGenerated: Boolean(recoveryWeightedAdaptation),
      runtimeStabilization,
      runtimeStabilizationGenerated: Boolean(runtimeStabilization),
      responseGovernance,
      responseGovernanceGenerated: Boolean(responseGovernance),
      continuityCompression,
      continuityCompressionGenerated: Boolean(continuityCompression),
      crossAgentConsensus,
      crossAgentConsensusGenerated: Boolean(crossAgentConsensus),
      consensusStabilization,
      consensusStabilizationGenerated: Boolean(consensusStabilization),
      adaptiveEnforcement,
      adaptiveEnforcementGenerated: Boolean(adaptiveEnforcement),
      coherenceBiographyStored: Boolean(resonanceState),
      stateExplanationFidelityStored: Boolean(stateExplanationFidelity),
      equationLaneStateStored: Boolean(equationLaneState),
      laneStabilityDistanceStored: Boolean(laneStabilityDistance),
      equationStabilityForecastStored: Boolean(equationStabilityForecast),
      predictiveAlignmentEngineStored: Boolean(predictiveAlignmentEngine),
      pathwaySelectionStateStored: Boolean(pathwaySelectionState),
      crossEquationConsensusStored: Boolean(crossEquationConsensus),
      crossEquationStabilizationStored: Boolean(crossEquationStabilization),
      equationBalanceCoordinatorStored: Boolean(equationBalanceCoordinator),
      equationResponseBehaviorStored: Boolean(equationResponseBehavior),
      equationFeedbackLoopStored: Boolean(equationFeedbackLoop),
      rootPhaseBridgeStored: Boolean(rootPhaseBridge),
      runtimeAdaptationStored: Boolean(runtimeAdaptation),
      runtimeRecoveryStored: Boolean(runtimeRecoveryState),
      responseGovernanceStored: Boolean(responseGovernance),
      continuityCompressionStored: Boolean(continuityCompression),
      crossAgentConsensusStored: Boolean(crossAgentConsensus),
      consensusStabilizationStored: Boolean(consensusStabilization),
      adaptiveEnforcementStored: Boolean(adaptiveEnforcement)
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Unexpected chat route error"
      },
      { status: 500 }
    )
  }
}
