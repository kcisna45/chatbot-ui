import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { file_id } = await req.json()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        {
          ok: false,
          hasSupabaseUrl: !!supabaseUrl,
          hasServiceRoleKey: !!serviceRoleKey,
          message: "Missing Supabase env variables"
        },
        { status: 500 }
      )
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

    const { data, error } = await supabaseAdmin
      .from("files")
      .select("id, name, file_path, user_id, tokens, created_at")
      .eq("id", file_id)

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          supabaseProject: supabaseUrl,
          file_id,
          error: error.message
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      supabaseProject: supabaseUrl,
      file_id,
      matchingRows: data?.length || 0,
      rows: data || []
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        message: error?.message || "Unexpected debug error"
      },
      { status: 500 }
    )
  }
}
