import { supabase } from "@/lib/supabase/client"
// Updated this path to ensure it matches your folder structure
import { Tables, TablesInsert, TablesUpdate } from "@/types"

// Create a new chat
export async function createChat(newChat: TablesInsert<"chats">) {
  const { data, error } = await supabase
    .from("chats")
    .insert(newChat)
    .select("*")
    .single()

  if (error) {
    console.error("createChat error:", error)
    // We use a console warning instead of a hard throw to keep the UI from crashing
    return null
  }

  return data
}

// Get a single chat by its ID
export async function getChatById(chatId: string) {
  const { data, error } = await supabase
    .from("chats")
    .select("*")
    .eq("id", chatId)
    .single()

  if (error) {
    console.error("getChatById error:", error)
    return null
  }

  return data
}

// Update an existing chat
export async function updateChat(
  chatId: string,
  updates: TablesUpdate<"chats">
) {
  const { data, error } = await supabase
    .from("chats")
    .update(updates)
    .eq("id", chatId)
    .select("*")
    .single()

  if (error) {
    console.error("updateChat error:", error)
    return null
  }

  return data
}

// Delete a chat
export async function deleteChat(chatId: string) {
  const { error } = await supabase.from("chats").delete().eq("id", chatId)

  if (error) {
    console.error("deleteChat error:", error)
  }
}

// ✅ Get all chats for a given workspace ID
export async function getChatsByWorkspaceId(workspaceId: string) {
  const { data, error } = await supabase
    .from("chats")
    .select("*")
    .eq("workspace_id", workspaceId)

  if (error) {
    console.error("getChatsByWorkspaceId error:", error)
    return [] // Return an empty array so the UI doesn't break
  }

  return data
}
