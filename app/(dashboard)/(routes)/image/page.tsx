"use client"
import React, { useState } from 'react'
import Image from 'next/image';
import { useForm } from 'react-hook-form'
import * as z from "zod"
import { formSchema } from './constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Wand2Icon } from 'lucide-react'
import { HfInference } from '@huggingface/inference'
import { Skeleton } from '@/components/ui/skeleton';

const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGING_FACE_ACCESS_TOKEN);

interface ImagePrompt {
  prompt : string,
  imgUrl : string
}

export default function ImageComponent() {
  const [imageUrls, setImageUrls] = useState<ImagePrompt[]>([]);
  const [isLoading, setIsLoading] = useState(false)

  const fetchImage = async (prompt : string) => {
    try {
      const response = await hf.textToImage({
        inputs: prompt,
        model: 'stabilityai/stable-diffusion-xl-base-1.0',
        parameters: {
          negative_prompt: 'painting, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, deformed, ugly, blurry, bad anatomy, bad proportions, extra limbs, cloned face, skinny, glitchy, double torso, extra arms, extra hands, mangled fingers, missing lips, ugly face, distorted face, extra legs, anime, naked , nsfw'
        }
      })
      console.log("Image received from Hugging Face API",response);

      const blob = new Blob([response], { type: "image/jpeg" });
      if(blob.size < 1000){
        console.log("Received blob is too small, returning error image");
        return "/Error.png"
      }
      const url = URL.createObjectURL(blob);
      console.log(`Image URL created: ${url}`);
      return url;
    } catch(err) {
      console.error("Error occurred while fetching image", err);
      return "/Error.png"
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(`Form submitted with prompt: ${values.prompt}`);
    setIsLoading(true);
    try {
      const url = await fetchImage(values.prompt)
      setImageUrls(prev => [...prev , { prompt : values.prompt , imgUrl : url}])
      console.log("Image URL set successfully");
    } catch (err) {
      console.error('Error occurred while setting the image URL', err);
    } finally {
      setIsLoading(false);
      form.reset()
    }
  };

  const handleDownload = ( url : string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = "Image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className='flex w-full flex-col gap-y-2 justify-center items-center'>
      <div className='scrollable-view flex-1 overflow-auto max-h-[80vh] lg:w-[80%] w-full flex flex-col gap-y-10 py-6'>
        {
          imageUrls.map((url)=>(
            <div className='w-full flex flex-col justify-center gap-y-3 items-center p-4 border  border-hoverCard/20 bg-card_background rounded-md' key={url.imgUrl as string}>
            <div className=' text-xl text-[#fff] '>{url.prompt}</div>
            <div className='w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] relative rounded-md overflow-hidden'>
              <Image src={url.imgUrl as string} alt="Genrated Image" fill={true}/>
            </div>
            <Button className='w-[300px] lg:w-[500px] bg-yellow hover:bg-yellow/90' onClick={()=>handleDownload(url.imgUrl)} variant="secondary">Download</Button>
            </div>
          ))
        }
        {isLoading && <div className='flex flex-col w-full justify-center items-center gap-y-2 opacity-30'>
          <Skeleton className='w-1/3 h-4'/>
          <Skeleton className='w-[300px] h-[300px] lg:w-[500px] lg:h-[500px]'/>
          <Skeleton className='w-[300px] h-[50px] lg:w-[500px] '/>
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