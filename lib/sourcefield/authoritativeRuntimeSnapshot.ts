export interface AuthoritativeRuntimeSnapshotInput {
  resonanceState?: any
  equationLaneState?: any
  resonanceHash?: string | null
  ledgerHash?: string | null
  agentId?: string
  runtimeAgentId?: string
}

export interface AuthoritativeRuntimeSnapshot {
  phase: "Authoritative Runtime Snapshot"
  resonanceState: any
  equationLaneState: any
  resonanceHash: string | null
  ledgerHash: string | null
  agentId: string | null
  runtimeAgentId: string | null
  snapshotReady: boolean
  rule: string
}

export function generateAuthoritativeRuntimeSnapshot(
  input: AuthoritativeRuntimeSnapshotInput
): AuthoritativeRuntimeSnapshot {
  return {
    phase: "Authoritative Runtime Snapshot",
    resonanceState: input?.resonanceState ?? null,
    equationLaneState: input?.equationLaneState ?? null,
    resonanceHash: input?.resonanceHash ?? null,
    ledgerHash: input?.ledgerHash ?? null,
    agentId: input?.agentId ?? null,
    runtimeAgentId: input?.runtimeAgentId ?? null,
    snapshotReady: Boolean(input?.equationLaneState),
    rule: "All diagnostic and convergence engines must read from this single runtime snapshot instead of regenerating or independently sourcing equation state."
  }
}
