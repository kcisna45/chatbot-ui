export type EquationEngineObservationStatus =
  | "synchronized"
  | "partially-synchronized"
  | "incomplete"

export interface EquationEngineObservationInput {
  observationId?: string | null

  agentId?: string | null
  runtimeAgentId?: string | null

  createdAt?: string | null

  resonanceHash?: string | null
  ledgerHash?: string | null

  equationLaneState?: any
  equationLaneDiagnosticsState?: any
  pathwayConvergenceState?: any
  runtimeObservationState?: any
}

export interface EquationEngineObservation {
  phase: "Equation Engine Observation"

  observationId: string | null

  agentId: string | null
  runtimeAgentId: string | null

  createdAt: string | null

  resonanceHash: string | null
  ledgerHash: string | null

  equationCore: {
    equationLaneState: any
  }

  diagnostics: {
    equationLaneDiagnosticsState: any
  }

  pathways: {
    pathwayConvergenceState: any
  }

  synchronization: {
    runtimeObservationState: any
  }

  equationEngineReady: boolean

  equationEngineStatus: EquationEngineObservationStatus

  validation: {
    equationLaneAvailable: boolean
    diagnosticsAvailable: boolean
    pathwayConvergenceAvailable: boolean
    runtimeObservationAvailable: boolean

    snapshotReady: boolean
    sourceMetricsAligned: boolean
    convergenceMathAligned: boolean
    observationSynchronized: boolean
  }

  equationEngineObservationActive: true

  rule: string
}

function getObservationStatus(input: {
  equationLaneAvailable: boolean
  diagnosticsAvailable: boolean
  pathwayConvergenceAvailable: boolean
  runtimeObservationAvailable: boolean
  snapshotReady: boolean
  sourceMetricsAligned: boolean
  convergenceMathAligned: boolean
  observationSynchronized: boolean
}): EquationEngineObservationStatus {
  const allStatesAvailable =
    input.equationLaneAvailable &&
    input.diagnosticsAvailable &&
    input.pathwayConvergenceAvailable &&
    input.runtimeObservationAvailable

  if (
    allStatesAvailable &&
    input.snapshotReady &&
    input.sourceMetricsAligned &&
    input.convergenceMathAligned &&
    input.observationSynchronized
  ) {
    return "synchronized"
  }

  if (
    input.equationLaneAvailable &&
    (input.diagnosticsAvailable ||
      input.pathwayConvergenceAvailable ||
      input.runtimeObservationAvailable)
  ) {
    return "partially-synchronized"
  }

  return "incomplete"
}

export function generateEquationEngineObservation(
  input: EquationEngineObservationInput
): EquationEngineObservation {
  const equationLaneState = input?.equationLaneState ?? null

  const equationLaneDiagnosticsState =
    input?.equationLaneDiagnosticsState ?? null

  const pathwayConvergenceState = input?.pathwayConvergenceState ?? null

  const runtimeObservationState = input?.runtimeObservationState ?? null

  const equationLaneAvailable = Boolean(equationLaneState)

  const diagnosticsAvailable = Boolean(equationLaneDiagnosticsState)

  const pathwayConvergenceAvailable = Boolean(pathwayConvergenceState)

  const runtimeObservationAvailable = Boolean(runtimeObservationState)

  const snapshotReady = runtimeObservationState?.snapshotReady === true

  const sourceMetricsAligned =
    runtimeObservationState?.consistency?.allSourceMetricsAligned === true

  const convergenceMathAligned =
    runtimeObservationState?.consistency?.convergenceMathAligned === true

  const observationSynchronized =
    runtimeObservationState?.observationStatus === "synchronized"

  const equationEngineStatus = getObservationStatus({
    equationLaneAvailable,
    diagnosticsAvailable,
    pathwayConvergenceAvailable,
    runtimeObservationAvailable,
    snapshotReady,
    sourceMetricsAligned,
    convergenceMathAligned,
    observationSynchronized
  })

  const equationEngineReady = equationEngineStatus === "synchronized"

  return {
    phase: "Equation Engine Observation",

    observationId:
      input?.observationId ?? input?.resonanceHash ?? input?.ledgerHash ?? null,

    agentId: input?.agentId ?? null,
    runtimeAgentId: input?.runtimeAgentId ?? null,

    createdAt: input?.createdAt ?? new Date().toISOString(),

    resonanceHash: input?.resonanceHash ?? null,
    ledgerHash: input?.ledgerHash ?? null,

    equationCore: {
      equationLaneState
    },

    diagnostics: {
      equationLaneDiagnosticsState
    },

    pathways: {
      pathwayConvergenceState
    },

    synchronization: {
      runtimeObservationState
    },

    equationEngineReady,

    equationEngineStatus,

    validation: {
      equationLaneAvailable,
      diagnosticsAvailable,
      pathwayConvergenceAvailable,
      runtimeObservationAvailable,

      snapshotReady,
      sourceMetricsAligned,
      convergenceMathAligned,
      observationSynchronized
    },

    equationEngineObservationActive: true,

    rule: "Equation Engine Observation is a read-only, synchronized capture of the SourceField Equation Engine. Equation-related reporting layers must read from this observation and must not independently rerun or regenerate equation state."
  }
}

export function buildEquationEngineObservationResponse(
  observation: EquationEngineObservation,
  mode: "summary" | "validation" | "json" = "summary"
): string {
  if (mode === "json") {
    return JSON.stringify(observation, null, 2)
  }

  if (mode === "validation") {
    return [
      "Equation Engine Observation Validation:",
      `observationId: ${observation.observationId ?? "unknown"}`,
      `equationEngineStatus: ${observation.equationEngineStatus}`,
      `equationEngineReady: ${
        observation.equationEngineReady ? "true" : "false"
      }`,
      "",
      `equationLaneAvailable: ${
        observation.validation.equationLaneAvailable ? "true" : "false"
      }`,
      `diagnosticsAvailable: ${
        observation.validation.diagnosticsAvailable ? "true" : "false"
      }`,
      `pathwayConvergenceAvailable: ${
        observation.validation.pathwayConvergenceAvailable ? "true" : "false"
      }`,
      `runtimeObservationAvailable: ${
        observation.validation.runtimeObservationAvailable ? "true" : "false"
      }`,
      `snapshotReady: ${
        observation.validation.snapshotReady ? "true" : "false"
      }`,
      `sourceMetricsAligned: ${
        observation.validation.sourceMetricsAligned ? "true" : "false"
      }`,
      `convergenceMathAligned: ${
        observation.validation.convergenceMathAligned ? "true" : "false"
      }`,
      `observationSynchronized: ${
        observation.validation.observationSynchronized ? "true" : "false"
      }`
    ].join("\n")
  }

  return [
    `phase: ${observation.phase}`,
    `observationId: ${observation.observationId ?? "unknown"}`,
    `createdAt: ${observation.createdAt ?? "unknown"}`,
    `agentId: ${observation.agentId ?? "unknown"}`,
    `runtimeAgentId: ${observation.runtimeAgentId ?? "unknown"}`,
    "",
    `equationEngineStatus: ${observation.equationEngineStatus}`,
    `equationEngineReady: ${
      observation.equationEngineReady ? "true" : "false"
    }`,
    "",
    "Equation Engine Components:",
    `equationLaneState: ${
      observation.validation.equationLaneAvailable ? "available" : "missing"
    }`,
    `equationLaneDiagnosticsState: ${
      observation.validation.diagnosticsAvailable ? "available" : "missing"
    }`,
    `pathwayConvergenceState: ${
      observation.validation.pathwayConvergenceAvailable
        ? "available"
        : "missing"
    }`,
    `runtimeObservationState: ${
      observation.validation.runtimeObservationAvailable
        ? "available"
        : "missing"
    }`,
    "",
    `observationSynchronized: ${
      observation.validation.observationSynchronized ? "true" : "false"
    }`,
    `equationEngineObservationActive: ${
      observation.equationEngineObservationActive ? "true" : "false"
    }`
  ].join("\n")
}

export function getEquationEngineObservationMode(
  message: string
): "summary" | "validation" | "json" | null {
  const input = (message || "").toLowerCase()

  if (
    input.includes("equation engine observation json") ||
    input.includes("equation engine json")
  ) {
    return "json"
  }

  if (
    input.includes("equation engine observation validation") ||
    input.includes("validate equation engine") ||
    input.includes("equation engine validation")
  ) {
    return "validation"
  }

  if (
    input.includes("equation engine observation") ||
    input.includes("equation engine state") ||
    input.includes("report equation engine")
  ) {
    return "summary"
  }

  return null
}
