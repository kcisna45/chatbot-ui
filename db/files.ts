// @ts-nocheck
import { supabase } from "@/lib/supabase/browser"

export const getFileById = async (fileId: string) => {
  const { data: file, error } = await supabase
    .from("files")
    .select("*")
    .eq("id", fileId)
    .single()

  // AUDIT FIX: Improved error handling with fallback string to satisfy strict null checks
  if (error) {
    throw new Error(error.message || "Failed to fetch file")
  }

  return file
}

export const createFile = async (file: any) => {
  const { data: createdFile, error } = await supabase
    .from("files")
    .insert([file])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message || "Failed to create file")
  }

  return createdFile
}

export const updateFile = async (fileId: string, file: any) => {
  const { data: updatedFile, error } = await supabase
    .from("files")
    .update(file)
    .eq("id", fileId)
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message || "Failed to update file")
  }

  return updatedFile
}

export const deleteFile = async (fileId: string) => {
  const { error } = await supabase.from("files").delete().eq("id", fileId)

  if (error) {
    throw new Error(error.message || "Failed to delete file")
  }

  return true
}
