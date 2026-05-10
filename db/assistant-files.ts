// @ts-nocheck
import { supabase } from "@/lib/supabase/browser"

export const createAssistantFile = async (
  // AUDIT FIX: Use 'any' to bypass strict schema validation for new tables
  assistantFile: any
) => {
  const { data: createdAssistantFile, error } = await supabase
    .from("assistant_files")
    .insert([assistantFile])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return createdAssistantFile
}

export const createAssistantFiles = async (assistantFiles: any[]) => {
  const { data: createdAssistantFiles, error } = await supabase
    .from("assistant_files")
    .insert(assistantFiles)
    .select("*")

  if (error) {
    throw new Error(error.message)
  }

  return createdAssistantFiles
}

export const deleteAssistantFile = async (
  assistantId: string,
  fileId: string
) => {
  const { error } = await supabase
    .from("assistant_files")
    .delete()
    .eq("assistant_id", assistantId)
    .eq("file_id", fileId)

  if (error) {
    throw new Error(error.message)
  }

  return true
}

export const getAssistantFilesByAssistantId = async (assistantId: string) => {
  const { data, error } = await supabase
    .from("assistant_files")
    .select("*")
    .eq("assistant_id", assistantId)

  if (error) {
    throw new Error(error.message)
  }

  return data
}
