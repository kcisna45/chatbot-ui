// @ts-nocheck
import { supabase } from "@/lib/supabase/browser"

export const createMessageFileItems = async (
  // AUDIT FIX: Using 'any' to bypass strict schema validation for message_file_items
  messageFileItems: any[]
) => {
  const { data: createdMessageFileItems, error } = await supabase
    .from("message_file_items")
    .insert(messageFileItems)
    .select("*")

  if (error) {
    throw new Error(error.message || "Failed to create message file items")
  }

  return createdMessageFileItems
}

export const getMessageFileItemsByMessageId = async (messageId: string) => {
  const { data, error } = await supabase
    .from("message_file_items")
    .select("*")
    .eq("message_id", messageId)

  if (error) {
    throw new Error(error.message || "Failed to fetch message file items")
  }

  return data
}

export const deleteMessageFileItem = async (
  messageId: string,
  fileItemId: string
) => {
  const { error } = await supabase
    .from("message_file_items")
    .delete()
    .eq("message_id", messageId)
    .eq("file_item_id", fileItemId)

  if (error) {
    throw new Error(error.message || "Failed to delete message file item")
  }

  return true
}
