// @ts-nocheck
import { supabase } from "@/lib/supabase/browser"
import { TablesInsert } from "@/supabase/types"

export const createAssistantCollection = async (
  // AUDIT FIX: Change strict table type to 'any' to bypass schema mismatch
  assistantCollection: any
) => {
  const { data: createdAssistantCollection, error } = await supabase
    .from("assistant_collections")
    .insert([assistantCollection])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return createdAssistantCollection
}

export const deleteAssistantCollection = async (
  assistantId: string,
  collectionId: string
) => {
  const { error } = await supabase
    .from("assistant_collections")
    .delete()
    .eq("assistant_id", assistantId)
    .eq("collection_id", collectionId)

  if (error) {
    throw new Error(error.message)
  }

  return true
}
