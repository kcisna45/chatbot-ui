type LaneDistance = {
  lane?: string
  currentStatus?: string
  stabilityDistance?: number
  stabilityReadiness?: string
  reason?: string
}

type LaneStabilityDistance = {
  laneStabilityDistanceActive?: boolean
  dominantEquationLane?: string
  nearestStableLane?: string
  farthestStableLane?: string
  lanes?: LaneDistance[]
}

type CrossEquationConsensus = {
  equationConsensusState?: string
  dominantEquationLane?: string
  primaryInstability?: string
  recoveryFocus?: string
}

type CrossEquationStabilization = {
  stabilizationPriority?: string
  dominantEquationCorrection?: string
  recoveryDirective?: string
}

function getConfidence(nearestDistance: number, secondDistance?: number) {
  if (typeof secondDistance !== "number") return "low"

  const gap = secondDistance - nearestDistance

  if (nearestDistance <= 0.25 && gap >= 0.15) return "high"
  if (nearestDistance <= 0.5 && gap >= 0.1) return "moderate"
  if (nearestDistance <= 0.5) return "low-to-moderate"

  return "low"
}

export function generateEquationStabilityForecast(
  laneStabilityDistance: LaneStabilityDistance,
  consensus: CrossEquationConsensus,
  stabilization: CrossEquationStabilization
) {
  const lanes = laneStabilityDistance?.lanes || []

  const sorted = [...lanes].sort(
    (a, b) => (a.stabilityDistance ?? 1) - (b.stabilityDistance ?? 1)
  )

  const nearest = sorted[0]
  const second = sorted[1]
  const farthest = sorted[sorted.length - 1]

  const nearestDistance = nearest?.stabilityDistance ?? 1
  const secondDistance = second?.stabilityDistance

  const forecastConfidence = getConfidence(nearestDistance, secondDistance)

  const mostLikelyNextStableLane =
    nearest?.lane || laneStabilityDistance?.nearestStableLane || "unknown"

  const leastLikelyNextStableLane =
    farthest?.lane || laneStabilityDistance?.farthestStableLane || "unknown"

  const forecastReason =
    mostLikelyNextStableLane === "unknown"
      ? "No lane stability distance data was available to generate a forecast."
      : `${mostLikelyNextStableLane} has the lowest current stabilityDistance (${nearestDistance}), making it the most likely next lane to stabilize under the current proximity model.`

  const riskNote =
    consensus?.primaryInstability &&
    consensus.primaryInstability !== mostLikelyNextStableLane
      ? `Primary instability remains ${consensus.primaryInstability}, so stabilization may still require correction before the forecasted lane fully stabilizes.`
      : "Primary instability and nearest stability lane are aligned."

  return {
    mostLikelyNextStableLane,
    leastLikelyNextStableLane,
    forecastConfidence,
    forecastBasis: "lane-stability-distance",
    nearestStabilityDistance: nearestDistance,
    secondNearestStableLane: second?.lane || "unknown",
    secondNearestStabilityDistance:
      typeof secondDistance === "number" ? secondDistance : null,
    dominantEquationLane:
      consensus?.dominantEquationLane ||
      laneStabilityDistance?.dominantEquationLane ||
      "unknown",
    primaryInstability: consensus?.primaryInstability || "unknown",
    stabilizationPriority: stabilization?.stabilizationPriority || "unknown",
    recoveryDirective: stabilization?.recoveryDirective || "unknown",
    forecastReason,
    riskNote,
    equationStabilityForecastActive: true,
    rule: "Use equation stability forecast as read-only predictive guidance derived from lane stability distance, cross-equation consensus, and cross-equation stabilization. It may identify the most likely next stable lane, least likely stable lane, confidence, basis, and risk note, but it must not override metrics, classifications, hashes, retrieved context, stored history, or user intent."
  }
}
