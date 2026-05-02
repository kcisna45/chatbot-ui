// types.ts
export interface Tables<T extends string> {
// Minimal placeholder for Supabase table types
[key: string]: any
}

export interface ChatMessage {
id: string
role: "user" | "assistant" | "system"
content: string
message: Tables<"messages">
fileItems: string[]
}

// Optional: Add other related types if needed
export type LLMID = "gpt-4" | "gpt-4-1106-preview" | "gpt-3.5-turbo"

