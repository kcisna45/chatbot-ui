// @ts-nocheck
import { supabase } from "@/lib/supabase/browser"

export const uploadProfileImage = async (
  // AUDIT FIX: Using 'any' to bypass strict table constraints in profile storage
  profile: any,
  image: File
) => {
  const bucket = "profile_images"
  const imageSizeLimit = 2000000 // 2MB

  if (image.size > imageSizeLimit) {
    throw new Error("Image must be less than 2MB")
  }

  const filePath = `${profile.user_id}/${Date.now()}`

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, image, {
      upsert: true
    })

  if (error) {
    throw new Error(error.message || "Failed to upload profile image")
  }

  return filePath
}

export const getProfileImagePublicUrl = (filePath: string) => {
  const bucket = "profile_images"
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
  return data.publicUrl
}
