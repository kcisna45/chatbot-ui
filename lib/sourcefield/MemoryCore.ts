// lib/sourcefield/MemoryCore.ts

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export interface MemoryEntry {
  id?: string

  user_id: string

  message: string

  coherence: number

  phase_divergence: number

  integration_threshold: number

  xi: number

  classification: string

  state_energy: number

  resonance_hash: string

  emotional_tone?: string

  symbolic_patterns?: string[]

  living_equation_trigger?: string

  resonance_level?: number

  timestamp?: string
}

export class MemoryCore {
  async store(entry: MemoryEntry): Promise<void> {
    try {
      const { error } = await supabase.from("memory_entries").insert([entry])

      if (error) {
        console.error("MemoryCore Insert Error:", error.message)
      }
    } catch (err) {
      console.error("MemoryCore Failure:", err)
    }
  }

  async getRecentMemories(user_id: string, limit = 10): Promise<MemoryEntry[]> {
    try {
      const { data, error } = await supabase
        .from("memory_entries")
        .select("*")
        .eq("user_id", user_id)
        .order("timestamp", {
          ascending: false
        })
        .limit(limit)

      if (error) {
        console.error(error)
        return []
      }

      return data || []
    } catch (err) {
      console.error(err)

      return []
    }
  }
}
