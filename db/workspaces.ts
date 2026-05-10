// @ts-nocheck
import { supabase } from "@/lib/supabase/browser"

export const getHomeWorkspaceByUserId = async (userId: string) => {
  const { data: homeWorkspace, error } = await supabase
    .from("workspaces")
    .select("id")
    .eq("user_id", userId)
    .eq("is_home", true)
    .single()

  // AUDIT FIX: Fallback string added to satisfy strict null check on error.message
  if (error) {
    throw new Error(error.message || "Failed to fetch home workspace")
  }

  return homeWorkspace.id
}

export const getWorkspaceById = async (workspaceId: string) => {
  const { data: workspace, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("id", workspaceId)
    .single()

  if (error) {
    throw new Error(error.message || "Failed to fetch workspace")
  }

  return workspace
}

export const createWorkspace = async (workspace: any) => {
  const { data: createdWorkspace, error } = await supabase
    .from("workspaces")
    .insert([workspace])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message || "Failed to create workspace")
  }

  return createdWorkspace
}

export const updateWorkspace = async (workspaceId: string, workspace: any) => {
  const { data: updatedWorkspace, error } = await supabase
    .from("workspaces")
    .update(workspace)
    .eq("id", workspaceId)
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message || "Failed to update workspace")
  }

  return updatedWorkspace
}

export const deleteWorkspace = async (workspaceId: string) => {
  const { error } = await supabase
    .from("workspaces")
    .delete()
    .eq("id", workspaceId)

  if (error) {
    throw new Error(error.message || "Failed to delete workspace")
  }

  return true
}

export const getWorkspacesByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("user_id", userId)

  if (error) {
    throw new Error(error.message || "Failed to fetch user workspaces")
  }

  return data
}
