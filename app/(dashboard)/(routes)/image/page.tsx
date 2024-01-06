"use client"
import React, { useState } from 'react'
import Image from 'next/image';
import axios from 'axios';
import { useForm } from 'react-hook-form'
import * as z from "zod"
import { formSchema } from './constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Wand2Icon } from 'lucide-react'

interface ImagePrompt {
  prompt : String,
  imgUrl : String
}

export default function ImageComponent() {
  const [imageUrls, setImageUrls] = useState<ImagePrompt[]>([]);
  const [isLoading, setIsLoading] = useState(false)

  const genrateImage = async (prompt: string) => {
    try {
      console.log("sent");
      const response = await axios.get("/api/image",
        {
          responseType: "blob",
          params: {
            prompt: prompt
          }
        });
      console.log("Received");
      const blob = new Blob([response.data], { type: "image/jpeg" });
      console.log(blob);
      const url = URL.createObjectURL(blob);
      console.log(url);
      return url;
    } catch (error) {
      console.error('Error fetching the image', error);
      return "";
    }
  };

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
      const url = await genrateImage(values.prompt)
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