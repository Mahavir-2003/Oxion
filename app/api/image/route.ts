// pages/api/image.ts
import { HfInference } from '@huggingface/inference'
import { NextRequest, NextResponse } from 'next/server';
const token = process.env.HUGGING_FACE_ACCESS_TOKEN;

const hf = new HfInference(token);

export async function GET(
  req: NextRequest
) {
  try {
    console.log("IMAGE : Request Recived")
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
    console.log("IMAGE : Request full-filled")

    return new NextResponse(response, {
      status: 200,
      statusText: "OK",
      headers: {
        "Content-Type": "image/jpeg",
      },
    });

  } catch (err) {
    console.log("IMAGE : lafda hua hai")
    return new NextResponse("Currently Unavailaible to Respond", {
      status: 500,
      statusText: "ERROR",
      headers: {
        "Content-Type": "text/json",
      },
    });
  }
}