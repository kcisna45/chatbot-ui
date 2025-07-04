import { NextResponse } from 'next/server';

export async function POST(req: Request) {
const body = await req.json();
const { model, messages, temperature } = body;

const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL!, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY!}`,
},
body: JSON.stringify({
model,
messages,
temperature,
}),
});

if (!response.ok) {
const errorText = await response.text();
return NextResponse.json({ error: errorText }, { status: response.status });
}

const data = await response.json();
return NextResponse.json(data);
}
