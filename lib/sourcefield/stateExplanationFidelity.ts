export function generateStateExplanationFidelity() {
  return {
    fidelityMode: "strict-current-json",
    explanationSource: "latest-live-state-object",
    prohibitStateMixing: true,
    requireExactFieldReference: true,
    fallbackRule:
      "If a JSON state and explanatory memory conflict, treat the JSON state as authoritative.",
    stateExplanationFidelityActive: true,
    rule: "When explaining a live state object, explain only the exact values currently present in that object. Do not substitute older values, inferred values, or nearby contextual values."
  }
}
