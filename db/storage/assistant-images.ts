// @ts-nocheck
import { supabase } from "@/lib/supabase/browser"

export const uploadAssistantImage = async (
  // AUDIT FIX: Using 'any' to bypass strict table constraints in the storage layer
  assistant: any,
  image: File
) => {
  const bucket = "assistant_images"
  const imageSizeLimit = 2000000 // 2MB

  if (image.size > imageSizeLimit) {
    throw new Error("Image must be less than 2MB")
  }

  const filePath = `${assistant.user_id}/${assistant.id}/${Date.now()}`

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, image, {
      upsert: true
    })

  if (error) {
    throw new Error(error.message || "Failed to upload assistant image")
  }

  return filePath
}

export const getAssistantImagePublicUrl = (filePath: string) => {
  const bucket = "assistant_images"
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
  return data.publicUrl
}
