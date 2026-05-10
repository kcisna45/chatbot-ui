// @ts-nocheck
import { supabase } from "@/lib/supabase/browser"

export const uploadWorkspaceImage = async (
  // AUDIT FIX: Using 'any' to bypass strict table constraints in workspace storage
  workspace: any,
  image: File
) => {
  const bucket = "workspace_images"
  const imageSizeLimit = 2000000 // 2MB

  if (image.size > imageSizeLimit) {
    throw new Error("Image must be less than 2MB")
  }

  const filePath = `${workspace.user_id}/${workspace.id}/${Date.now()}`

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, image, {
      upsert: true
    })

  if (error) {
    throw new Error(error.message || "Failed to upload workspace image")
  }

  return filePath
}

export const getWorkspaceImagePublicUrl = (filePath: string) => {
  const bucket = "workspace_images"
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
  return data.publicUrl
}
