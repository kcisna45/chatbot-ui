// @ts-nocheck
import { supabase } from "@/lib/supabase/browser"

export const getPromptById = async (promptId: string) => {
  const { data: prompt, error } = await supabase
    .from("prompts")
    .select("*")
    .eq("id", promptId)
    .single()

  // AUDIT FIX: Added fallback string to resolve strict null check on error.message
  if (error) {
    throw new Error(error.message || "Failed to fetch prompt")
  }

  return prompt
}

export const createPrompt = async (prompt: any) => {
  const { data: createdPrompt, error } = await supabase
    .from("prompts")
    .insert([prompt])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message || "Failed to create prompt")
  }

  return createdPrompt
}

export const updatePrompt = async (promptId: string, prompt: any) => {
  const { data: updatedPrompt, error } = await supabase
    .from("prompts")
    .update(prompt)
    .eq("id", promptId)
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message || "Failed to update prompt")
  }

  return updatedPrompt
}

export const deletePrompt = async (promptId: string) => {
  const { error } = await supabase.from("prompts").delete().eq("id", promptId)

  if (error) {
    throw new Error(error.message || "Failed to delete prompt")
  }

  return true
}
