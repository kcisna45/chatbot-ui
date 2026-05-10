// @ts-nocheck
import { supabase } from "@/lib/supabase/browser"

export const getPresetById = async (presetId: string) => {
  const { data: preset, error } = await supabase
    .from("presets")
    .select("*")
    .eq("id", presetId)
    .single()

  // AUDIT FIX: Improved error handling with fallback to satisfy strict null checks
  if (error) {
    throw new Error(error.message || "Failed to fetch preset")
  }

  return preset
}

export const createPreset = async (preset: any) => {
  const { data: createdPreset, error } = await supabase
    .from("presets")
    .insert([preset])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message || "Failed to create preset")
  }

  return createdPreset
}

export const updatePreset = async (presetId: string, preset: any) => {
  const { data: updatedPreset, error } = await supabase
    .from("presets")
    .update(preset)
    .eq("id", presetId)
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message || "Failed to update preset")
  }

  return updatedPreset
}

export const deletePreset = async (presetId: string) => {
  const { error } = await supabase.from("presets").delete().eq("id", presetId)

  if (error) {
    throw new Error(error.message || "Failed to delete preset")
  }

  return true
}
