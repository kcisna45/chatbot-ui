// @ts-nocheck
import Chat from "@/components/Chat"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic" // This tells Next.js to skip static generation and avoid build-time errors

export default async function ChatPage() {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        }
      }
    }
  )

  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) {
    return redirect("/login")
  }

  return (
    <main className="flex h-screen flex-col">
      <header className="bg-white p-4 shadow">
        <h1 className="text-xl font-semibold">SourceField Chat</h1>
      </header>
      <div className="flex-1 overflow-hidden">
        <Chat />
      </div>
    </main>
  )
}
