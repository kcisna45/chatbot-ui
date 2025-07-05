// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: Request) {
const body = await req.json();
const { messages } = body;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const { data, error } = await supabase
.from('messages')
.insert([{ content: JSON.stringify(messages), role: 'user' }]);

if (error) {
console.error(error);
return NextResponse.json({ error: error.message }, { status: 500 });
}

return NextResponse.json({ result: 'Message saved to Supabase!', data });
}
