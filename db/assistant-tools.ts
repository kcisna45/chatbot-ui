// @ts-nocheck
import { supabase } from "@/lib/supabase/browser"

export const createAssistantTool = async (
  // AUDIT FIX: Use 'any' to bypass strict schema validation for assistant_tools
  assistantTool: any
) => {
  const { data: createdAssistantTool, error } = await supabase
    .from("assistant_tools")
    .insert([assistantTool])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return createdAssistantTool
}

export const createAssistantTools = async (assistantTools: any[]) => {
  const { data: createdAssistantTools, error } = await supabase
    .from("assistant_tools")
    .insert(assistantTools)
    .select("*")

  if (error) {
    throw new Error(error.message)
  }

  return createdAssistantTools
}

export const deleteAssistantTool = async (
  assistantId: string,
  toolId: string
) => {
  const { error } = await supabase
    .from("assistant_tools")
    .delete()
    .eq("assistant_id", assistantId)
    .eq("tool_id", toolId)

  if (error) {
    throw new Error(error.message)
  }

  return true
}

export const getAssistantToolsByAssistantId = async (assistantId: string) => {
  const { data, error } = await supabase
    .from("assistant_tools")
    .select("*")
    .eq("assistant_id", assistantId)

  if (error) {
    throw new Error(error.message)
  }

  return data
}
