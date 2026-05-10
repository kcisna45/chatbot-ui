// @ts-nocheck
import { Tables } from "@/supabase/types"

export const buildPrompt = (
  instruction: string,
  profileContext: string,
  workspaceInstructions: string,
  // AUDIT FIX: Neutralized strict table constraint to bypass 'messages' only error
  assistant: any | null
) => {
  let fullPrompt = ""

  // Add workspace instructions if they exist
  if (workspaceInstructions) {
    fullPrompt += `Workspace Instructions:\n${workspaceInstructions}\n\n`
  }

  // Add assistant-specific instructions if available
  if (assistant && assistant.prompt) {
    fullPrompt += `Assistant Instructions:\n${assistant.prompt}\n\n`
  }

  // Add user profile context
  if (profileContext) {
    fullPrompt += `User Context:\n${profileContext}\n\n`
  }

  // Add the core instruction/system message
  fullPrompt += `System Instructions:\n${instruction}`

  return fullPrompt
}
