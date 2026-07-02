export type SourceFieldEquation =
  | "Eq1"
  | "Eq2"
  | "Eq3"
  | "Eq4"
  | "Eq5"

export interface PathwayDefinition {
  id: string
  name: string
  sequence: SourceFieldEquation[]
  description: string
  role: string
  defaultWeight: number
}

export const REGISTERED_SOURCEFIELD_PATHWAYS: PathwayDefinition[] = [
  {
    id: "eq314",
    name: "Movement Root Pattern",
    sequence: ["Eq3", "Eq1", "Eq4"],
    description:
      "Phase returns through root into harmonic formation.",
    role: "movement-root-pattern",
    defaultWeight: 0.5
  },

  {
    id: "eq135",
    name: "Root Movement Integration",
    sequence: ["Eq1", "Eq3", "Eq5"],
    description:
      "Root progresses through phase toward integration.",
    role: "root-movement-integration",
    defaultWeight: 0.5
  }
]