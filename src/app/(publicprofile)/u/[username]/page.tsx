'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { messageSchema } from '@/schemas/messageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const Page = () => {

    const [isSubmitting,setIsSubmitting]=useState(false);
    const params=useParams();
    const {toast}=useToast();

    const form=useForm<z.infer<typeof messageSchema>>({
        resolver:zodResolver(messageSchema),
        defaultValues:{
            content:''
        }
    })

    const onSubmit=async(data:z.infer<typeof messageSchema>)=>{
        setIsSubmitting(true);
        try {
            const response=await axios.post('/api/send-message',{
                username:params.username,
                content:data.content
            })
            if(response.data.success){
                toast({
                    title: 'Success',
                    description: response.data.message,
                })
            }

        } catch (error) {
            const axiosError=error as AxiosError<ApiResponse>;
            toast({
              title:"Error",
              description:axiosError.response?.data.message ||
              "Failed to Send messages",
              variant:"destructive"
            })
            
        }finally{
            setIsSubmitting(false);
        }
    }

  return (
    <div className="my-8 md:mx-8 lg:mx-auto p-6 rounded bg-white w-full max-w-5xl">
      <h1 className="font-bold text-5xl  text-center">Public Profile Link</h1>
      <div className="mt-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 text-center"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600 text-base">
                    Send Anonymous Message to @{params.username}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your anoynomous message here"
                      {...field}
                      className="w-full h-24 resize-none mt-3"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="font-semibold text-lg py-6  ">
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Please wait
                </>
              ) : (
                "Send It"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Page