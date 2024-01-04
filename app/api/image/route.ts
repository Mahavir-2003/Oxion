// pages/api/image.ts
import { HfInference } from '@huggingface/inference'
import { NextRequest, NextResponse } from 'next/server';

const hf = new HfInference('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');

export async function GET(
  req: NextRequest
) {
  try {

    const prompt = req.nextUrl.searchParams.get("prompt") ;

    if (!prompt) {
      return new NextResponse("Please provide a prompt", {
        status: 200,
        statusText: "OK",
        headers: {
          "Content-Type": "text/json",
        },
      });
    }

    const response = await hf.textToImage({
      inputs: prompt,
      model: 'stabilityai/stable-diffusion-xl-base-1.0',
      parameters: {
        negative_prompt: 'realistic, Natural, 8k',
      }
    })

    return new NextResponse(response, {
      status: 200,
      statusText: "OK",
      headers: {
        "Content-Type": "image/jpeg",
      },
    });

  } catch (err) {
    return new NextResponse("Currently Unavailaible to Respond", {
      status: 200,
      statusText: "OK",
      headers: {
        "Content-Type": "text/json",
      },
    });
  }
}