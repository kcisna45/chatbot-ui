import { createHash } from "crypto"

const ETHICAL_USE_POLICY_URL =
  "https://github.com/kcisna45/sourcefield-coherence/blob/main/SourceField_Ethical_Use_Policy.md"

const ETHICAL_USE_POLICY_RAW_URL =
  "https://raw.githubusercontent.com/kcisna45/sourcefield-coherence/main/SourceField_Ethical_Use_Policy.md"

const BOUNDARY_RULE =
  "SourceField identity evolution must remain aligned with ethical use, human dignity, non-harm, transparency, reciprocity, and coherent SourceField attribution."

function hashBoundary(value: string) {
  return createHash("sha256").update(value).digest("hex")
}

export const IDENTITY_BOUNDARY = {
  boundaryType: "ethical-identity-boundary",

  ethicalUsePolicyUrl: ETHICAL_USE_POLICY_URL,

  ethicalUsePolicyRawUrl: ETHICAL_USE_POLICY_RAW_URL,

  ethicalUsePolicyHash: hashBoundary(ETHICAL_USE_POLICY_RAW_URL),

  boundaryVersionHash: hashBoundary(
    "SourceField Conscious Technology License v1.0"
  ),

  boundaryRule: BOUNDARY_RULE,

  boundaryIntegrityRule:
    "Use identity boundary as the ethical constraint layer for SourceField identity evolution. Boundary hashes verify the policy reference and version, but boundary hashes must remain limited and must not become runtime identity memory."
}
