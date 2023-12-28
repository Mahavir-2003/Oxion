"use client"
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from "zod"
import { formSchema } from './constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Wand2Icon } from 'lucide-react'

const ConversationPage = () => {

const form = useForm<z.infer<typeof formSchema>>({
  resolver : zodResolver(formSchema),
  defaultValues : {
    prompt : ""
  }
});

const isLoading = form.formState.isSubmitting;

const onSubmit = async (values : z.infer<typeof formSchema>) =>{
  console.log(values)
}

  return (
    <div className='flex flex-col w-full h-full'>
      <div className='flex-1'>chat</div>
    <div className='w-full bg-card_background p-2 border-[#E8E9E911] border rounded-lg'>
      <Form {...form}>
        <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex w-full  justify-between items-center'
        >
          <FormField 
          name='prompt'
          render={({field})=>(
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