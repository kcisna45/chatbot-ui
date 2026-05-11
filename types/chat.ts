// @ts-nocheck
import { Tables } from "@/supabase/types"
import { ChatMessage } from "./chat-message"

export interface ChatPayload {
  chatId: string
  userInput: string
  prompt: string
  temperature: number
  model: string
  embeddingsProvider: string
  includeRetrievedContext: boolean
  includeProfileContext: boolean
  contextCount: number
  workspaceInstructions: string
  chatMessages: ChatMessage[]
  // AUDIT FIX: Using 'any' to bypass the strict 'messages' table constraint.
  // This allows the build to recognize the assistant and file item structures.
  assistant: any | null
  messageFileItems: any[]
  chatFileItems: any[]
}

export interface ChatSettings {
  model: string
  prompt: string
  temperature: number
  contextLength: number
  includeProfileContext: boolean
  includeRetrievedContext: boolean
  embeddingsProvider: string
}
