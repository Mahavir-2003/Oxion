import { auth } from "@clerk/nextjs";
import axios from "axios";
import { NextResponse } from "next/server";

const configuration = {
    apiKey: process.env.CHAT_COMPLETION_PAWAN_API_KEY,
    apiUrl: 'https://api.pawan.krd/v1/chat/completions',
}

type ChatCompletionRequestMessage = {
    role: 'system' | "user" | "assistant",
    content: string,
}

export async function POST(req: Request) {
    try {

        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { apiKey, apiUrl } = configuration;

        if (!apiKey || !apiUrl) {
            console.error('API key or URL is not defined');
            return new NextResponse("Internal server error", { status: 500 });
        }

        const { messages } = await req.json() as { messages: ChatCompletionRequestMessage[] };

        if (!messages) {
            return new NextResponse("Missing messages", { status: 400 });
        }

        const headers = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        };

        const response = await axios.post(apiUrl, {
            model: 'pai-001-light',
            max_tokens: 3000,
            messages: [
                {
                    role: 'system',
                    content: `You are talking to a chatbot named Oxion. Oxion is a chatbot that can help you with your questions in simple and understandable manner. Oxion is developed by Mahavir Patel. Mahavir Patel is a software engineer and a student. He is currently studying at ganpat university. His Website is https://mhvr.vercel.app .`,
                },
                ...messages],
        }, { headers });

        if (response.data.choices[0]?.message) {
            return new NextResponse(JSON.stringify(response.data.choices[0].message), { status: 200 });
        }

        console.error('Unexpected response format', response);
        return new NextResponse("Internal server error", { status: 500 });

    } catch (e) {
        console.error("CONVERSATION ERROR : ", e);
        return new NextResponse("Internal server error", { status: 500 });
    }
}