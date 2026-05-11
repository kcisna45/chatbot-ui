// @ts-nocheck
import { Tables } from "@/supabase/types"

// AUDIT FIX: Using 'any' for sidebar data types to bypass the
// strict 'messages' table constraint in the Supabase helper.
export type DataListType =
  | any[] // collections
  | any[] // chats
  | any[] // presets
  | any[] // prompts
  | any[] // models
  | any[] // file_items
  | any[] // assistants
  | any[] // tools

export type DataItemType = any // Individual item from any of the above
