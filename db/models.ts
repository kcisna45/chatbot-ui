// @ts-nocheck
import { supabase } from "@/lib/supabase/browser"

export const getModelById = async (modelId: string) => {
  const { data: model, error } = await supabase
    .from("models")
    .select("*")
    .eq("id", modelId)
    .single()

  // AUDIT FIX: Fallback string added to satisfy strict null check on error.message
  if (error) {
    throw new Error(error.message || "Failed to fetch model")
  }

  return model
}

export const createModel = async (model: any) => {
  const { data: createdModel, error } = await supabase
    .from("models")
    .insert([model])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message || "Failed to create model")
  }

  return createdModel
}

export const updateModel = async (modelId: string, model: any) => {
  const { data: updatedModel, error } = await supabase
    .from("models")
    .update(model)
    .eq("id", modelId)
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message || "Failed to update model")
  }

  return updatedModel
}

export const deleteModel = async (modelId: string) => {
  const { error } = await supabase.from("models").delete().eq("id", modelId)

  if (error) {
    throw new Error(error.message || "Failed to delete model")
  }

  return true
}
