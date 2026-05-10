// @ts-nocheck
import { supabase } from "@/lib/supabase/browser"

export const getToolById = async (toolId: string) => {
  const { data: tool, error } = await supabase
    .from("tools")
    .select("*")
    .eq("id", toolId)
    .single()

  // AUDIT FIX: Added fallback string to satisfy strict null check on error.message
  if (error) {
    throw new Error(error.message || "Failed to fetch tool")
  }

  return tool
}

export const createTool = async (tool: any) => {
  const { data: createdTool, error } = await supabase
    .from("tools")
    .insert([tool])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message || "Failed to create tool")
  }

  return createdTool
}

export const updateTool = async (toolId: string, tool: any) => {
  const { data: updatedTool, error } = await supabase
    .from("tools")
    .update(tool)
    .eq("id", toolId)
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message || "Failed to update tool")
  }

  return updatedTool
}

export const deleteTool = async (toolId: string) => {
  const { error } = await supabase.from("tools").delete().eq("id", toolId)

  if (error) {
    throw new Error(error.message || "Failed to delete tool")
  }

  return true
}

export const getToolsByWorkspaceId = async (workspaceId: string) => {
  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .eq("workspace_id", workspaceId)

  if (error) {
    throw new Error(error.message || "Failed to fetch tools")
  }

  return data
}
