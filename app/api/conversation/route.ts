import { auth } from "@clerk/nextjs"
import axios from "axios";
import { NextResponse } from "next/server";
const configuration = {
    apiKey : process.env.PAWAN_API_KEY,
    apiUrl : 'https://api.pawan.krd/v1/chat/completions',
}


export async function POST(
    req : Request
){
    try{
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;
        const {apiKey ,apiUrl } = configuration;
        console.log("CONVERSATION : sending request")


        if(!userId){
            return new NextResponse("Unauthorized",{status : 401})
        }        


        if(!configuration){
            return new NextResponse("No API Key",{status : 500})
        }

        if(!messages){
            return new NextResponse("Messages are Required",{status : 400})
        }


        const headers = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          };
       
          
          console.log("the message consists : ",messages)

        const response = await axios.post(apiUrl, {
          "model": "pai-001-light",
          "max_tokens": 3000,
          "messages": [
              ...messages
          ]
      }, { headers });

      console.log("request Completed")
      console.log("The first response : ",response.data)
        
          if(response.data.choices[0].message){
            return NextResponse.json(response.data.choices[0].message)
          }

           return NextResponse.json({
                role: 'assistant',
                content: "I'm Currently unavailable, Try after some time",
        },{status : 404})

    }catch(err){
        console.log(`Conversation : Some Error Occured ${JSON.stringify(err)}`)
    }
}