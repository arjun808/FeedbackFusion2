'use client'
import { signIn } from 'next-auth/react'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import * as z from "zod"
import { signInSchema } from '@/schemas/signInSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Fascinate_Inline } from 'next/font/google';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const SignIn = () => {
    
  const router=useRouter();
  const {toast}=useToast();

  const form=useForm<z.infer<typeof signInSchema>>({
    resolver:zodResolver(signInSchema),
    defaultValues:{
      identifier:'',
      password:''
    }
  })
  const onSubmit=async(data:z.infer<typeof signInSchema>)=>{
      const result=await signIn('credentials',{
        redirect:false,
        identifier:data.identifier,
        password:data.password
      })

      if(result?.error){
        if(result.error==='CredentialsSignin'){
          toast({
            title:'Login Failed',
            description:'Incorrect Username or Password',
            variant:'destructive'
          })
        }else{
          toast({
            title:"Error",
            description:result.error,
            variant:'destructive'
          })
        }
      }
      if(result?.url){
        toast({
          title:'Login SuccessFully',
          description:'Start Your anounomous adven',
          variant:'default'
        })
        router.push('/dashboard');
      }
  }

  return (
    <div className="flex justify-center items-center min-h-screen mx-auto bg-gray-950">
      <div className="w-full p-8 max-w-md space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold mb-6 lg:text-5xl">
          Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username/Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </Form>
        <div className="text-center text-lg">
          Not a member yet? 
          <Link href={'/sign-up'} className="text-blue-700 ">
               <span> Sign Up</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignIn