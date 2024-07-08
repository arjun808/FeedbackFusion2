'use client'
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse";
import { useState,useEffect } from "react"
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import Link from "next/link";
import { useDebounceCallback, useDebounceValue } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import * as z from "zod";
import { signUpSchema } from "@/schemas/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Page = () => {
    const [username,setUsername]=useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isUsernameCheck,setIsUsernameCheck] =useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false)
    const debounced=useDebounceCallback(setUsername,500);
    const router = useRouter();
    const { toast } = useToast();



    const form=useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues:{
            username:'',
            email:'',
            password:''
        }
    })

    const checkUsernameUnique=async()=>{
        if(username){
            setIsUsernameCheck(true);
            setUsernameMessage('')// Reset this
            try {
                const response = await axios.get<ApiResponse>(
                    `/api/check-username-unique?username=${username}`
                );
                setUsernameMessage(response.data.message);
            } catch (error) {
                console.log("error while checking usernmae ", error);
            }finally{
                setIsUsernameCheck(false);
                
            }
        }
    }
    useEffect(()=>{
        checkUsernameUnique();
    },[username])

    const onSubmit=async(data:z.infer<typeof signUpSchema>)=>{
        console.log(data);
        setIsSubmitting(true);
        try {
            const res=await axios.post<ApiResponse>('/api/signup',data);
            console.log("signup ",res);
            if(res.data.success){
                toast({
                    title: 'Success',
                    description: res.data.message,
                })
            }
            router.push(`/verify-code/${username}`);
        } catch (error) {
            console.log("Error while signup ",error);
            toast({
                title: 'Sign Up Failed',
                description: "Error in signup",
            })
        }finally{
            setIsSubmitting(false);
        }
    }

  return (
    <div className="flex justify-center items-center min-h-screen mx-auto bg-gray-950">
      <div className="w-full p-8 max-w-md space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold mb-6 lg:text-5xl">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isUsernameCheck && <Loader2 className="animate-spin" />}
            {!isUsernameCheck && usernameMessage && (
              <p
                className={`text-sm mt-0 ${
                  usernameMessage === "Username is available"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {usernameMessage}
              </p>
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email" {...field} />
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
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center text-lg">
          Already a member?
          <Link href={"/sign-in"} className="text-blue-700 ">
            <span> Sign in</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Page