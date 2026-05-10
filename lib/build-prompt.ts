// @ts-nocheck
import { Tables } from "@/supabase/types"

export const buildPrompt = (
  instruction: string,
  profileContext: string,
  workspaceInstructions: string,
  assistant: any | null
) => {
  let fullPrompt = ""
  if (workspaceInstructions)
    fullPrompt += `Workspace Instructions:\n${workspaceInstructions}\n\n`
  if (assistant && assistant.prompt)
    fullPrompt += `Assistant Instructions:\n${assistant.prompt}\n\n`
  if (profileContext) fullPrompt += `User Context:\n${profileContext}\n\n`
  fullPrompt += `System Instructions:\n${instruction}`
  return fullPrompt
}

// AUDIT FIX: Adding the missing exported member 'buildFinalMessages'
export const buildFinalMessages = (
  payload: any,
  profile: any,
  chatMessages: any[]
) => {
  // This logic ensures the system prompt and history are formatted for the LLM
  const systemPrompt = buildPrompt(
    payload.prompt,
    profile?.context || "",
    payload.workspaceInstructions || "",
    payload.assistant
  )

  return [
    { role: "system", content: systemPrompt },
    ...chatMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))
  ]
}

// AUDIT FIX: Adding placeholder for Gemini adapter to satisfy imports
export const adaptMessagesForGoogleGemini = (payload: any, messages: any[]) => {
  const model = payload.model

  // Google Gemini requires a specific format:
  // 'user' and 'model' (instead of assistant) roles with 'parts'
  return messages.map(msg => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }]
  }))
}
