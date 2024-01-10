"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from "zod"
import { formSchema } from './constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Wand2Icon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';

interface musicProps {
  prompt : string,
  url : string,
  isErrored : boolean,
}

export default function ImageComponent() {
  const [audioList, setAudioList] = useState<musicProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchMusic = async (prompt: string) => {
    try {
      console.log("Fetching music for prompt: ", prompt);
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/facebook/musicgen-small",
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          responseType: "blob",
        }
      );
  
      console.log("Response received successfully", response);
  
      if (response.data.size < 1000) {
        console.log("Received blob is too small, returning error image");
        const errorAudioData: musicProps = {
          prompt: prompt,
          url: "/Error.png",
          isErrored: true,
        };
        return errorAudioData;
      }
  
      const blob = new Blob([response.data], { type: response.data.type });
      console.log("Blob created successfully", blob);
  
      const audioUrl = window.URL.createObjectURL(blob);
      console.log("URL created successfully", audioUrl);
  
      const successAudioData: musicProps = {
        prompt: prompt,
        url: audioUrl,
        isErrored: false,
      };
  
      return successAudioData;
  
    } catch (err) {
      console.error("Error occurred while fetching audio", err);
      const errorAudioData: musicProps = {
        prompt: prompt,
        url: "/Error.png",
        isErrored: true,
      };
      return errorAudioData;
    }
  };
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(`Form submitted with prompt: ${values.prompt}`);
    setIsLoading(true);
  
    try {
      const audioData = await fetchMusic(values.prompt);
      setAudioList((prevAudioList) => [...prevAudioList, audioData]);
      console.log("Audio set successfully");
  
    } catch (err) {
      console.error('Error occurred while setting the audio', err);
  
    } finally {
      setIsLoading(false);
      form.reset();
    }
  };

  const downloadAudio = (url: string, prompt: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = prompt;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  

  return (
    <div className='flex w-full flex-col gap-y-2 justify-center items-center'>
      <div className='scrollable-view flex-1 overflow-auto max-h-[80vh] lg:w-[80%] w-full flex flex-col gap-y-10 py-6'>
        {
          audioList.map((audio) => (
            <div className='w-full bg-card_background border border-hoverCard/20 p-4 px-6 rounded-md' key={audio.url}>
              <div className=' text-md text-[#fff] mb-2 '>{audio.prompt}</div>
              <div className='w-full  relative rounded-md overflow-hidden'>
                  {
                    audio.isErrored ? <div className=' text-red'>Error while fetching the Audio ! Try again later..</div> : 
                    <div className='flex justify-between items-center gap-x-4 flex-col md:flex-row gap-y-2'>
                    <audio controls className='w-full h-[55px] object-cover'>
                    <source src={audio.url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                  <Button className='h-[55px] w-full md:w-[20%] lg:w-[15%] px-10 rounded-full bg-yellow ' variant="secondary" onClick={()=>downloadAudio(audio.url,audio.prompt)}>Download</Button>
                  </div>
                  }
              </div>
            </div>
          ))
        }
        {isLoading && <div className='flex flex-col gap-y-2 bg-card_background p-4 px-6 border border-hoverCard/20 rounded-md'>
          <Skeleton className='w-1/3 h-5  mb-2 opacity-30' />
          <div className='flex justify-between items-center gap-x-4 flex-col md:flex-row gap-y-2'>
          <Skeleton className=' h-[55px] w-full opacity-30 rounded-full' />
          <Skeleton className='h-[55px] w-full md:w-[20%] lg:w-[15%] opacity-30 rounded-full' />
          </div>
        </div>}
      </div>
      <div className='w-full fixed-height-content bg-card_background p-2 border-[#E8E9E911] border rounded-lg'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex w-full  justify-between items-center'
          >
            <FormField
              disabled={isLoading}
              name='prompt'
              render={({ field }) => (
                <FormItem className='flex-1 '>
                  <FormControl className='p-0 pl-3 m-0'>
                    <Input
                      autoFocus
                      autoComplete='off'
                      placeholder='Joyful portrait of someone laughing in the rain, using high shutter speed to freeze raindrops.'
                      {...field}
                      className=' rounded-sm outline-0 bg-[#ffffff00] border-0 focus-visible:ring-0 focus-visible:border-0 focus-visible:ring-offset-0'
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              variant="ghost"
              size="icon"
              disabled={isLoading}
            >
              <Wand2Icon />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}