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


const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGING_FACE_ACCESS_TOKEN);

interface ImagePrompt {
  prompt : String,
  imgUrl : String
}

export default function ImageComponent() {
  const [imageUrls, setImageUrls] = useState<ImagePrompt[]>([]);
  const [isLoading, setIsLoading] = useState(false)

const fetchImage = async (prompt : string)=> {

  try{
    const response = await hf.textToImage({
      inputs: prompt,
      model: 'stabilityai/stable-diffusion-xl-base-1.0',
      parameters: {
        negative_prompt: 'Worst quality, Low quality, Normal quality, Low res, Blurry, Text, Watermark, Logo, Banner, Extra digits, Cropped, JPEG artifacts, Signature, Username, Error, Sketch, Ugly, Monochrome, Horror, Geometry, Mutation, Disgusting '
      }
    })
    console.log("Received");
      const blob = new Blob([response], { type: "image/jpeg" });
      console.log(blob);
      if(blob.size < 1000){
        return "https://img.freepik.com/free-vector/page-found-concept-illustration_114360-1869.jpg"
      }
      const url = URL.createObjectURL(blob);
      console.log(url);
      return url;
  }catch(err){
    console.log("Lafda hua hehehe")
    return "https://img.freepik.com/free-vector/page-found-concept-illustration_114360-1869.jpg"
  }
  
}

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Submitted");
    try {
      setIsLoading(true);
      const url = await fetchImage(values.prompt)
      await setImageUrls((prev)=> [...prev , { prompt : values.prompt , imgUrl : url}])
    } catch (err) {
      console.error('Error fetching the image', err);
    } finally {
      setIsLoading(false);
      form.reset()
    }
  };

  return (
    <div className='flex w-full flex-col gap-y-2 justify-center items-center'>
      <div className='scrollable-view flex-1 overflow-auto max-h-[80vh] lg:w-[80%] w-full flex flex-col gap-y-10 py-6'>
        {
          imageUrls.map((url)=>(
            <div className='w-full' key={url.imgUrl as string}>
            <div className=' text-xl text-[#fff] mb-2 '>{url.prompt}</div>
            <div className='w-[300px] h-[300px] relative'>
              <Image src={url.imgUrl as string} alt="Genrated Image" fill={true}/>
            </div>
            </div>
          ))
        }
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
                      placeholder='A flock of birds flying over a river at night with realistic textures.'
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