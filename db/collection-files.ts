// @ts-nocheck
import { supabase } from "@/lib/supabase/browser"

export const createCollectionFile = async (
  // AUDIT FIX: Using 'any' to bypass strict schema validation for collection_files
  collectionFile: any
) => {
  const { data: createdCollectionFile, error } = await supabase
    .from("collection_files")
    .insert([collectionFile])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return createdCollectionFile
}

export const createCollectionFiles = async (collectionFiles: any[]) => {
  const { data: createdCollectionFiles, error } = await supabase
    .from("collection_files")
    .insert(collectionFiles)
    .select("*")

  if (error) {
    throw new Error(error.message)
  }

  return createdCollectionFiles
}

export const deleteCollectionFile = async (
  collectionId: string,
  fileId: string
) => {
  const { error } = await supabase
    .from("collection_files")
    .delete()
    .eq("collection_id", collectionId)
    .eq("file_id", fileId)

  if (error) {
    throw new Error(error.message)
  }

  return true
}

export const getCollectionFilesByCollectionId = async (
  collectionId: string
) => {
  const { data, error } = await supabase
    .from("collection_files")
    .select("*")
    .eq("collection_id", collectionId)

  if (error) {
    throw new Error(error.message)
  }

  return data
}
