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

function getPathwayTransitionAction(
  message: string
): PathwayTransitionAction | null {
  const normalized = message.toLowerCase()

  if (
    !normalized.includes("pathway transition") &&
    !normalized.includes("transition engine") &&
    !normalized.includes("phase 23") &&
    !normalized.includes("transition rule")
  ) {
    return null
  }

  if (normalized.includes("report") && normalized.includes("json")) {
    return "report"
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
    normalized.includes("why") ||
    normalized.includes("reason")
  ) {
    return "reason"
  }

  if (
    normalized.includes("transitiontype") ||
    normalized.includes("transition type") ||
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

  if (
    normalized.includes("measured state object") ||
    normalized.includes("transition layer") ||
    normalized.includes("orchestration layer") ||
    normalized.includes("classification") ||
    normalized.includes("what kind")
  ) {
    return "classification"
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
    `transitionDetected: ${
      pathwayTransitionState?.transitionDetected ? "true" : "false"
    }`,
    `transitionType: ${pathwayTransitionState?.transitionType || "unknown"}`,
    `previousMode: ${pathwayTransitionState?.previousMode || "unknown"}`,
    `currentMode: ${pathwayTransitionState?.currentMode || "unknown"}`,
    `previousPathway: ${pathwayTransitionState?.previousPathway || "unknown"}`,
    `currentPathway: ${pathwayTransitionState?.currentPathway || "unknown"}`,
    `previousSequence: ${pathwayTransitionState?.previousSequence || "unknown"}`,
    `currentSequence: ${pathwayTransitionState?.currentSequence || "unknown"}`,
    `previousPathwayClassification: ${
      pathwayTransitionState?.previousPathwayClassification || "unknown"
    }`,
    `currentPathwayClassification: ${
      pathwayTransitionState?.currentPathwayClassification || "unknown"
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
    `transitionRule: ${pathwayTransitionState?.transitionRule || "unknown"}`
  ].join("\n")
}

function buildPathwayTransitionClassification(pathwayTransitionState: any) {
  return [
    "Pathway Transition Engine is read-only transition guidance.",
    "It compares previous and current pathway selection states to detect mode changes, transition type, transition reason, and transition confidence.",
    "It is not a raw metric and it must not override live metrics, classifications, hashes, retrieved context, stored history, or user intent.",
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

  if (action === "classification") {
    return buildPathwayTransitionClassification(pathwayTransitionState)
  }

  return buildPathwayTransitionSummary(pathwayTransitionState)
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

    const authoritativeLiveState = {
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

All governance, equation, feedback, bridge, stabilization, compression, consensus, and enforcement layers are read-only guidance.
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
