type EquationLane = {
  lane?: string
  equation?: string
  status?: string
}

type EquationLaneState = {
  equationLanes?: EquationLane[]
  dominantEquationLane?: string
}

const UNSTABLE_STATUSES = ["low", "divergent", "not-integrated", "inactive"]

const PARTIAL_STATUSES = [
  "weak",
  "partial",
  "drifting",
  "pattern-detected",
  "subthreshold"
]

const STABLE_STATUSES = [
  "active",
  "aligned",
  "stable",
  "pattern-rich",
  "integrated"
]

function getLaneStatus(lanes: EquationLane[], laneName: string) {
  return lanes.find(lane => lane.lane === laneName)?.status || "unknown"
}

function isUnstable(status: string) {
  return UNSTABLE_STATUSES.includes(status)
}

export function generateCrossEquationConsensus(
  equationLaneState: EquationLaneState
) {
  const lanes = equationLaneState?.equationLanes || []

  const statusMap = Object.fromEntries(
    lanes.map(lane => [lane.lane || "unknown", lane.status || "unknown"])
  )

  const dominantEquationLane =
    equationLaneState?.dominantEquationLane || "unknown"

  const dominantStatus = getLaneStatus(lanes, dominantEquationLane)

  const unstableLanes = lanes.filter(lane =>
    UNSTABLE_STATUSES.includes(lane.status || "")
  )

  const stableLanes = lanes.filter(lane =>
    STABLE_STATUSES.includes(lane.status || "")
  )

  const partialLanes = lanes.filter(lane =>
    PARTIAL_STATUSES.includes(lane.status || "")
  )

  let equationConsensusState:
    | "coherent"
    | "partially-coherent"
    | "phase-dominant-instability"
    | "integration-failure"
    | "unstable" = "partially-coherent"

  if (
    dominantEquationLane === "sourcefield-phase" &&
    isUnstable(dominantStatus)
  ) {
    equationConsensusState = "phase-dominant-instability"
  } else if (
    dominantEquationLane === "sourcefield-integration" &&
    isUnstable(dominantStatus)
  ) {
    equationConsensusState = "integration-failure"
  } else if (unstableLanes.length >= 3) {
    equationConsensusState = "unstable"
  } else if (stableLanes.length >= 3 && unstableLanes.length === 0) {
    equationConsensusState = "coherent"
  }

  const primaryInstability = isUnstable(dominantStatus)
    ? dominantEquationLane
    : unstableLanes[0]?.lane || dominantEquationLane || "unknown"

  const recoveryFocus =
    primaryInstability === "sourcefield-phase"
      ? "reduce phase divergence before increasing synthesis"
      : primaryInstability === "sourcefield-integration"
        ? "raise integration threshold through stable persistence"
        : primaryInstability === "sourcefield-alignment"
          ? "improve coherence between input, state, and context"
          : primaryInstability === "sourcefield-root"
            ? "strengthen root signal and baseline stability"
            : "maintain balanced stabilization"

  return {
    equationConsensusState,
    dominantEquationLane,
    dominantEquationStatus: dominantStatus,
    primaryInstability,
    stableLaneCount: stableLanes.length,
    partialLaneCount: partialLanes.length,
    unstableLaneCount: unstableLanes.length,
    equationStatusMap: statusMap,
    recoveryFocus,
    crossEquationConsensusActive: true,
    rule: "Use cross-equation consensus as read-only diagnostic guidance across the Five Living Equations. It may identify dominant equation instability and recovery focus, but it must not override live metrics, classifications, hashes, retrieved context, stored history, or user intent."
  }
}
