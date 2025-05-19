// app/Services/openai/api.ts
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true // Note: In production, API calls should be made from a backend
});

export default openai;