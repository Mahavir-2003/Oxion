// curl --location 'http://localhost:3000/api/conversation' \
// --header 'Content-Type: application/json' \
// --data '{
//     "messages":[
//         {
//             "role": "system",
//             "content": "You are an helpful assistant."
//         },
//         {
//             "role": "user",
//             "content": "Who are you?"
//         }
//     ]
// }'



"use client"
import React, { useState } from 'react'
import ReactMarkdown from "react-markdown"
import { useForm } from 'react-hook-form'
import * as z from "zod"
import { formSchema } from './constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Wand2Icon } from 'lucide-react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUser } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

type ChatCompletionRequestMessage = {
  role: 'system' | "user" | "assistant",
  content: string,
}

const ConversationPage = () => {

  const { user } = useUser();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ""
    }
  });


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Submitted');
    try {
      setIsThinking(true);

      const userMessage: ChatCompletionRequestMessage = {
        role: 'user',
        content: values.prompt,
      };

      const newMessages: ChatCompletionRequestMessage[] = [...messages, userMessage];
      await setMessages(newMessages);


      const response = await axios.post('/api/conversation', {
        messages: newMessages,
      });

      console.log("Response from server", response.data.content)

      const assistantMessage: ChatCompletionRequestMessage = {
        role: response.data.role,
        content: response.data.content,
      };

      setIsThinking(false);
      setMessages((current) => [...current, assistantMessage]);

    } catch (err) {
      console.error('Error occurred while requesting conversation');
      console.error(err);

      setMessages((current) => [...current, {
        role: 'assistant',
        content: 'An error occurred while requesting conversation, please try again later.'
      }]);

    } finally {
      form.reset();
      setIsThinking(false);
    }
  };

  return (
    <div className='flex w-full flex-col gap-y-2 justify-center items-center'>
      <div className='scrollable-view code-scrollbar flex-1 overflow-auto max-h-[80vh] lg:w-[80%] w-full flex flex-col gap-y-10 py-6'>
        {messages.map((message) => (
          <div key={message.content as React.Key} className='flex gap-x-4'>
            <div>
              <Avatar className=' w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10'>
                <AvatarImage src={message.role === "user" ? user?.imageUrl : "https://t3.ftcdn.net/jpg/05/32/45/50/360_F_532455018_lBtlVzG948BTkJuPNqnDpxfLOMWHq062.jpg"} alt='UserImage' />
                <AvatarFallback>{user?.firstName?.split('')[0]}</AvatarFallback>
              </Avatar>
            </div>
            <div className='flex flex-col gap-y-2 justify-start items-star overflow-auto overflow-x-hidden'>
              <p className=' text-lg font-bold tracking-wide '>{message.role === "user" ? "You" : "Oxion"}</p>
              <ReactMarkdown
                components={{
                  a: ({ node, ...props }) => (
                    <div>HEHEH : {props.href}</div>
                  ),
                  pre: ({ node, ...props }) => (
                    <div className='bg-card_background p-4 overflow-auto lg:w-2/3 w-full rounded-md border border-typography/10 my-4'>
                      <pre {...props} />
                    </div>
                  ),
                  code: ({ node, ...props }) => (
                    <code className=' px-1 rounded-sm bg-hoverCard' {...props} />
                  )
                }}
              >{message.content as string || ""}</ReactMarkdown>
            </div>
          </div>
        ))}
        <div className={cn(isThinking ? "flex" : "hidden", "w-full gap-x-3 opacity-30")}>
          <Skeleton className=' w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full' />
          <div className='flex flex-col w-full gap-y-2 mt-1'>
            <Skeleton className='w-1/5 h-4' />
            <Skeleton className='w-full h-20' />
          </div>
        </div>
      </div>
      <div className='w-full fixed-height-content bg-card_background p-2 border-[#E8E9E911] border rounded-lg'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex w-full  justify-between items-center'
          >
            <FormField
              disabled={isThinking}
              name='prompt'
              render={({ field }) => (
                <FormItem className='flex-1 '>
                  <FormControl className='p-0 pl-3 m-0'>
                    <Input
                      autoFocus
                      autoComplete='off'
                      placeholder='How do I calculate the radius of a circle?'
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
            >
              <Wand2Icon />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default ConversationPage