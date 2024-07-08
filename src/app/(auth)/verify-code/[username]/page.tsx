'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { useToast } from '@/components/ui/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const VerifyCode = () => {
    const router=useRouter()
    const {toast} = useToast()
    const params=useParams();
    const form=useForm<z.infer<typeof verifySchema>>({
        resolver:zodResolver(verifySchema),
        defaultValues:{
            code:''
        }

    })

    const onSubmit=async(data: z.infer<typeof verifySchema>)=>{
        try {
            const response=await axios.post(`/api/verify-code`,{
                username:params.username,
                code:data.code
            })
            toast({
                title:"Success",
                description:response.data.message
            })
            router.push("/signin");
        } catch (error) {
            console.log("error in verify code", error);
            toast({
              title: "Failed",
              description: "Code verification Failed",
            });
        }
    }
  return (
    <div className="flex justify-center items-center min-h-screen mx-auto bg-gray-100">
      <div className="w-full p-10 max-w-md space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold mb-6 lg:text-5xl">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 ">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                      <InputOTPSlot index={0} className="border-gray-400" />
                        <InputOTPSlot index={1} className="border-gray-400" />
                        <InputOTPSlot index={2} className="border-gray-400" />
                        <InputOTPSlot index={3} className="border-gray-400" />
                        <InputOTPSlot index={4} className="border-gray-400" />
                        <InputOTPSlot index={5} className="border-gray-400" />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">Verify</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default VerifyCode