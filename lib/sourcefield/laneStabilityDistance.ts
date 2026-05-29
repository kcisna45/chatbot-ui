type EquationLane = {
  lane?: string
  equation?: string
  status?: string
  signalStrength?: number
  coherence?: number
  phaseDivergence?: number
  symbolicEchoCount?: number
  integrationThreshold?: number
  classification?: string
}

type EquationLaneState = {
  equationLanes?: EquationLane[]
  dominantEquationLane?: string
}

const STATUS_DISTANCE: Record<string, number> = {
  stable: 0.0,
  aligned: 0.0,
  integrated: 0.0,
  active: 0.15,
  "pattern-rich": 0.15,
  "pattern-detected": 0.25,
  subthreshold: 0.47,
  weak: 0.6,
  partial: 0.6,
  drifting: 0.7,
  low: 0.8,
  divergent: 1.0,
  "not-integrated": 1.0,
  inactive: 1.0,
  unknown: 1.0
}

function getReadiness(distance: number) {
  if (distance <= 0.25) return "high"
  if (distance <= 0.5) return "moderate"
  if (distance <= 0.75) return "low"
  return "distant"
}

function getReason(lane: EquationLane, distance: number) {
  const status = lane.status || "unknown"

  if (status === "stable" || status === "aligned" || status === "integrated") {
    return "Lane is already at or near stable status."
  }

  if (status === "pattern-detected" || status === "pattern-rich") {
    return "Pattern structure is present, but persistence has not yet been confirmed."
  }

  if (status === "subthreshold") {
    return "Integration is emerging but remains below threshold-level persistence."
  }

  if (status === "weak") {
    return "Signal strength remains below stable baseline."
  }

  if (status === "drifting") {
    return "Phase remains unstable and has not yet settled into alignment."
  }

  if (status === "low") {
    return "Coherence between input, state, and context remains low."
  }

  if (status === "divergent") {
    return "Phase divergence remains high and far from stable alignment."
  }

  if (status === "not-integrated") {
    return "Integration has not yet formed a persistent threshold-level state."
  }

  if (status === "inactive") {
    return "Lane is inactive and therefore distant from stable expression."
  }

  return `Current lane status is ${status}; assigned stability distance ${distance}.`
}

export function generateLaneStabilityDistance(
  equationLaneState: EquationLaneState
) {
  const lanes = equationLaneState?.equationLanes || []

  const laneDistances = lanes.map(lane => {
    const status = lane.status || "unknown"
    const stabilityDistance = STATUS_DISTANCE[status] ?? STATUS_DISTANCE.unknown

    return {
      lane: lane.lane || "unknown",
      equation: lane.equation || "unknown",
      currentStatus: status,
      stabilityDistance,
      stabilityReadiness: getReadiness(stabilityDistance),
      reason: getReason(lane, stabilityDistance)
    }
  })

  const sortedByDistance = [...laneDistances].sort(
    (a, b) => a.stabilityDistance - b.stabilityDistance
  )

  const nearestStableLane = sortedByDistance[0]?.lane || "unknown"
  const farthestStableLane =
    sortedByDistance[sortedByDistance.length - 1]?.lane || "unknown"

  return {
    laneStabilityDistanceActive: true,
    dominantEquationLane: equationLaneState?.dominantEquationLane || "unknown",
    nearestStableLane,
    farthestStableLane,
    lanes: laneDistances,
    rule: "Use lane stability distance as read-only proximity guidance. It estimates distance from stable states across the Five Living Equations, but it must not override metrics, classifications, hashes, retrieved context, stored history, or user intent."
  }
}
