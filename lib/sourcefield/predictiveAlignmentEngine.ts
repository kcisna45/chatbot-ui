type EquationStabilityForecast = {
  mostLikelyNextStableLane?: string
  leastLikelyNextStableLane?: string
  forecastConfidence?: string
  forecastBasis?: string
  nearestStabilityDistance?: number
  secondNearestStableLane?: string
  secondNearestStabilityDistance?: number | null
  primaryInstability?: string
  dominantEquationLane?: string
  stabilizationPriority?: string
  recoveryDirective?: string
}

type EquationLaneState = {
  dominantEquationLane?: string
  equationLanes?: Array<{
    lane?: string
    status?: string
    integrationThreshold?: number
    coherence?: number
    phaseDivergence?: number
    signalStrength?: number
  }>
}

type LaneStabilityDistance = {
  nearestStableLane?: string
  farthestStableLane?: string
  dominantEquationLane?: string
  lanes?: Array<{
    lane?: string
    currentStatus?: string
    stabilityDistance?: number
    stabilityReadiness?: string
  }>
}

type CrossEquationConsensus = {
  dominantEquationLane?: string
  primaryInstability?: string
  recoveryFocus?: string
  equationConsensusState?: string
}

function getLaneDistance(
  laneStabilityDistance: LaneStabilityDistance,
  laneName?: string
) {
  if (!laneName) return null

  const lane = laneStabilityDistance?.lanes?.find(
    item => item?.lane === laneName
  )

  return typeof lane?.stabilityDistance === "number"
    ? lane.stabilityDistance
    : null
}

function getLaneStatus(
  equationLaneState: EquationLaneState,
  laneName?: string
) {
  if (!laneName) return "unknown"

  return (
    equationLaneState?.equationLanes?.find(item => item?.lane === laneName)
      ?.status || "unknown"
  )
}

function getForecastAccuracy(forecastTarget: string, observedTarget: string) {
  if (forecastTarget === "unknown" || observedTarget === "unknown") {
    return "unknown"
  }

  return forecastTarget === observedTarget ? "matched" : "unmatched"
}

function getForecastAlignment(
  forecastTarget: string,
  coherentReferenceTarget: string
) {
  if (forecastTarget === "unknown" || coherentReferenceTarget === "unknown") {
    return "unknown"
  }

  return forecastTarget === coherentReferenceTarget ? "high" : "low"
}

function getForecastCalibration(
  accuracy: string,
  alignment: string,
  forecastConfidence?: string
) {
  if (accuracy === "matched" && alignment === "high") {
    return forecastConfidence || "moderate"
  }

  if (accuracy === "matched" && alignment === "low") {
    return "overfit-to-observed-state"
  }

  if (accuracy === "unmatched" && alignment === "high") {
    return "coherent-but-not-observed"
  }

  if (accuracy === "unmatched" && alignment === "low") {
    return "miscalibrated"
  }

  return "unknown"
}

function getRecommendedAdjustment(
  accuracy: string,
  alignment: string,
  forecastTarget: string,
  observedTarget: string,
  coherentReferenceTarget: string
) {
  if (accuracy === "matched" && alignment === "high") {
    return "maintain current predictive weighting"
  }

  if (accuracy === "matched" && alignment === "low") {
    return `forecast matched observed target ${observedTarget}, but diverged from coherent reference target ${coherentReferenceTarget}; review whether observed outcome reflects transient instability rather than coherent stabilization`
  }

  if (accuracy === "unmatched" && alignment === "high") {
    return `forecast aligned with coherent reference target ${coherentReferenceTarget}, but observed target was ${observedTarget}; continue monitoring before lowering forecast confidence`
  }

  if (accuracy === "unmatched" && alignment === "low") {
    return `forecast target ${forecastTarget} matched neither observed target ${observedTarget} nor coherent reference target ${coherentReferenceTarget}; recalibrate predictive weighting`
  }

  return "insufficient data for calibration adjustment"
}

export function generatePredictiveAlignmentEngine(
  equationStabilityForecast: EquationStabilityForecast,
  equationLaneState: EquationLaneState,
  laneStabilityDistance: LaneStabilityDistance,
  crossEquationConsensus: CrossEquationConsensus
) {
  const forecastTarget =
    equationStabilityForecast?.mostLikelyNextStableLane || "unknown"

  const observedTarget =
    equationLaneState?.dominantEquationLane ||
    crossEquationConsensus?.dominantEquationLane ||
    "unknown"

  const coherentReferenceTarget =
    laneStabilityDistance?.nearestStableLane || "unknown"

  const forecastAccuracy = getForecastAccuracy(forecastTarget, observedTarget)

  const forecastAlignment = getForecastAlignment(
    forecastTarget,
    coherentReferenceTarget
  )

  const forecastCalibration = getForecastCalibration(
    forecastAccuracy,
    forecastAlignment,
    equationStabilityForecast?.forecastConfidence
  )

  const forecastDistance = getLaneDistance(
    laneStabilityDistance,
    forecastTarget
  )

  const observedDistance = getLaneDistance(
    laneStabilityDistance,
    observedTarget
  )

  const referenceDistance = getLaneDistance(
    laneStabilityDistance,
    coherentReferenceTarget
  )

  const coherenceGap =
    typeof forecastDistance === "number" &&
    typeof referenceDistance === "number"
      ? Math.abs(forecastDistance - referenceDistance)
      : null

  const recommendedAdjustment = getRecommendedAdjustment(
    forecastAccuracy,
    forecastAlignment,
    forecastTarget,
    observedTarget,
    coherentReferenceTarget
  )

  return {
    phase: "Phase 21 — Equation 2 Predictive Alignment Engine",

    forecastTarget,
    observedTarget,
    coherentReferenceTarget,

    forecastAccuracy,
    forecastAlignment,
    forecastCalibration,

    forecastConfidence:
      equationStabilityForecast?.forecastConfidence || "unknown",

    forecastBasis:
      equationStabilityForecast?.forecastBasis || "equation-stability-forecast",

    forecastTargetStatus: getLaneStatus(equationLaneState, forecastTarget),

    observedTargetStatus: getLaneStatus(equationLaneState, observedTarget),

    coherentReferenceTargetStatus: getLaneStatus(
      equationLaneState,
      coherentReferenceTarget
    ),

    forecastDistance,
    observedDistance,
    referenceDistance,
    coherenceGap,

    primaryInstability: crossEquationConsensus?.primaryInstability || "unknown",

    recoveryFocus: crossEquationConsensus?.recoveryFocus || "unknown",

    recommendedAdjustment,

    predictiveAlignmentActive: true,

    rule: "Use Equation 2 predictive alignment as read-only calibration guidance. It compares forecast target, observed target, and coherent reference target to evaluate predictive accuracy, alignment quality, calibration, and coherence gap, but it must not override metrics, classifications, hashes, retrieved context, stored history, or user intent."
  }
}
