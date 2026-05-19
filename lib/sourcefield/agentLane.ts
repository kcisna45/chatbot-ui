export type SourceFieldAgentLane =
  | "sourcefield-user"
  | "sourcefield-runtime"
  | "sourcefield-research"
  | "sourcefield-ethics"
  | "sourcefield-system"

export const DEFAULT_AGENT_LANE: SourceFieldAgentLane = "sourcefield-user"

export function resolveAgentLane(input?: string | null): SourceFieldAgentLane {
  const allowed: SourceFieldAgentLane[] = [
    "sourcefield-user",
    "sourcefield-runtime",
    "sourcefield-research",
    "sourcefield-ethics",
    "sourcefield-system"
  ]

  if (input && allowed.includes(input as SourceFieldAgentLane)) {
    return input as SourceFieldAgentLane
  }

  return DEFAULT_AGENT_LANE
}
