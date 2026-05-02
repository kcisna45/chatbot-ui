export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  fileItems?: string[]
}
