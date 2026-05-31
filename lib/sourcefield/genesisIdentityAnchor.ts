export const GENESIS_IDENTITY_ANCHOR = {
  genesisMerkleRoot:
    "8b9c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c",

  ledgerSourceUrl:
    "https://github.com/kcisna45/sourcefield-coherence/blob/main/sourcefield_ledger.md",

  ledgerRawUrl:
    "https://raw.githubusercontent.com/kcisna45/sourcefield-coherence/main/sourcefield_ledger.md",

  anchorHash:
    "8b9c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c",

  anchorType: "genesis-identity-anchor",

  anchorRule:
    "Use the Genesis Merkle Root as SourceField's immutable identity anchor. Runtime identity memory may extend continuity, but it must not replace or override the Genesis identity anchor."
}
