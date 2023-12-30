"use client"
import React, { ReactNode, useState } from 'react'
import ReactMarkdown from "react-markdown"
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
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


type ChatCompletionRequestMessage = {
  role: 'system' | "user" | "assistant",
  content: String,
}


const ConversationPage = () => {

  const { user } = useUser();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  const [isThinking , setIsThinking] = useState(false);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ""
    }
  });

  const isLoading = form.formState.isSubmitting;


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Submitted");
    try {
      await setIsThinking(true);
      // creating ChatCompletionRequestMessage object of user prompt
      const userMessage: ChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
      };
      // creating ChatCompletionRequestMessage object array of user prompts
      const newMessages: ChatCompletionRequestMessage[] = [...messages, userMessage];
      await setMessages(newMessages); // wait for the state to update
      form.reset();

      const response = await axios.post("/api/conversation", {
        messages: newMessages, // send the updated messages array
      });
      console.log(response.data);
      await setIsThinking(false);
      // adding response to the chat array
      await setMessages((current) => [...current, response.data]);
      // resetting the form
      form.reset();
    } catch (err) {
      //TODO : Open Pro Model
      console.log("Something Error Occurred while requesting Conversation");
      console.log(err);
      await setMessages((current) => [...current, {
        role : 'assistant',
        content : "Some Error Occured re-prompt please"
      }]);
      
    } finally {
      router.refresh();
      await setIsThinking(false)
    }
  };



  return (
    <div className='flex w-full flex-col gap-y-2 justify-center items-center'>
      <div className='scrollable-view flex-1 overflow-auto max-h-[80vh] w-[80%] flex flex-col gap-y-10 py-6'>
      {messages.map((message) => (
          <div key={message.content as React.Key} className='flex gap-x-4'>
            <div>
              <Avatar>
                <AvatarImage src={message.role === "user" ? user?.imageUrl : "https://t3.ftcdn.net/jpg/05/32/45/50/360_F_532455018_lBtlVzG948BTkJuPNqnDpxfLOMWHq062.jpg"} alt='UserImage' />
                <AvatarFallback>{user?.firstName?.split('')[0]}</AvatarFallback>
              </Avatar>
            </div>
            <div className='flex flex-col gap-y-2 justify-start items-start'>
              <p className=' text-lg font-bold tracking-wide '>{message.role === "user" ? "You" : "Oxion"}</p>
              <ReactMarkdown
  components={{
    pre: ({ node, children }) => (
      <SyntaxHighlighter
        style={atomDark}
        customStyle={{
          margin: 0,
          borderRadius: '0.375rem',
        }}
      >
        {children?.props.children}
      </SyntaxHighlighter>
    ),
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={atomDark}
          language={match[1]}
          PreTag="div"
          customStyle={{
            margin: 0,
            borderRadius: '0.375rem',
          }}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  }}
>
  {message.content as string || ''}
</ReactMarkdown>
            </div>
          </div>
        ))}
        <div className={cn(isThinking ? "block" : "hidden")}>Thinking....</div>
      </div>
      <div className='w-full fixed-height-content bg-card_background p-2 border-[#E8E9E911] border rounded-lg'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex w-full  justify-between items-center'
          >
            <FormField
              name='prompt'
              render={({ field }) => (
                <FormItem className='flex-1 '>
                  <FormControl className='p-0 pl-3 m-0'>
                    <Input
                      disabled={isLoading}
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
              disabled={isLoading}
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