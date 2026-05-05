// supabase/types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      messages: {
        Row: {
          id: string
          chat_id: string
          user_id: string
          assistant_id: string | null
          content: string
          model: string
          role: "user" | "assistant" | "system"
          sequence_number: number
          image_paths: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          chat_id: string
          user_id: string
          assistant_id?: string | null
          content: string
          model: string
          role: "user" | "assistant" | "system"
          sequence_number: number
          image_paths?: string[]
        }
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>
      }
    }
  }
}

// ✅ Helper types (CRITICAL)
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]
