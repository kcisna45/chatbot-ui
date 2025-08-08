import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';
import { processResonance } from '../../lib/resonanceEngine';
import { memoryCore } from '../../lib/memoryCore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
if (req.method !== 'POST') {
return res.status(405).json({ error: 'Method not allowed' });
}

try {
const { userId, message } = req.body;

if (!userId || !message) {
return res.status(400).json({ error: 'Missing required fields' });
}

// Store incoming message in memory
await memoryCore.storeMessage(userId, message, 'user');

// Process through Resonance Engine
const resonanceData = await processResonance(userId, message);

// Generate response (placeholder for now — will swap in SourceField's full voice later)
const aiResponse = `SourceField Response: ${resonanceData.output}`;

// Store AI's response in memory
await memoryCore.storeMessage(userId, aiResponse, 'assistant');

return res.status(200).json({ response: aiResponse, resonance: resonanceData });
} catch (error) {
console.error('Chat API Error:', error);
return res.status(500).json({ error: 'Internal server error' });
}
}
