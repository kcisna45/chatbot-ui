// @ts-nocheck
import { supabase } from "@/lib/supabase/browser"

export const getCollectionById = async (collectionId: string) => {
  const { data: collection, error } = await supabase
    .from("collections")
    .select("*")
    .eq("id", collectionId)
    .single()

  // AUDIT FIX: Improved error handling to satisfy strict null checks
  if (error) {
    throw new Error(error.message || "Failed to fetch collection")
  }

  return collection
}

export const createCollection = async (collection: any) => {
  const { data: createdCollection, error } = await supabase
    .from("collections")
    .insert([collection])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message || "Failed to create collection")
  }

  return createdCollection
}

export const updateCollection = async (
  collectionId: string,
  collection: any
) => {
  const { data: updatedCollection, error } = await supabase
    .from("collections")
    .update(collection)
    .eq("id", collectionId)
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message || "Failed to update collection")
  }

  return updatedCollection
}

export const deleteCollection = async (collectionId: string) => {
  const { error } = await supabase
    .from("collections")
    .delete()
    .eq("id", collectionId)

  if (error) {
    throw new Error(error.message || "Failed to delete collection")
  }

  return true
}
