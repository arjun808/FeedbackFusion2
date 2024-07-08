'use client'
import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { Message } from '@/models/UserModel';
import { acceptingMessageSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';


const Page = () => {
  const [isloading,setIsloading]=useState(false);
  const [messages,setMessages]=useState<Message []>([]);
  const [isSwitchLoading,setIsSwitchLoading] =useState(false);

  const handleDeletMessage=(messageId:string)=>{
     setMessages(messages.filter((message)=>message._id!==messageId));
  }

  const {data:session}=useSession();
  const form=useForm({
    resolver:zodResolver(acceptingMessageSchema),
  })
  const {register, watch, setValue}=form
  const acceptMessages=watch('acceptMessages')

  const fetchAcceptingMessage=useCallback(async()=>{
    setIsSwitchLoading(true);
    try {
      const res = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", res.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(true);
    }
  },[setValue])

  const fetchMessages=useCallback(async(refresh:boolean)=>{
    setIsloading(true);
    setIsSwitchLoading(false);
    try {
      const res=await axios.get('/api/get-messages');
      console.log()
      setMessages(res.data.messages);
      if(refresh){
        toast({
          title: "Refreshed Messages",
          description: "Showing Latest Messages",
        });
      }
    } catch (error) {
      console.log(error);
      const axiosError=error as AxiosError<ApiResponse>;
        toast({
          title:"Error",
          description:axiosError.response?.data.message ||
          "Failed to fetch messages",
          variant:"destructive"
        })
    }finally{
      setIsloading(false)
      setIsSwitchLoading(false)
    }
  },[setIsloading,setMessages])

  useEffect(()=>{
      if(!session || !session.user)return;
      fetchMessages(false);
      fetchAcceptingMessage();
  },[session,setValue,fetchAcceptingMessage,fetchMessages])

  //handle switch change
  const handleSwitchChange=async()=>{
    try {
      const res=await axios.post('/api/accept-messages',{
        acceptMessages:!acceptMessages
      })
      setValue('acceptMessages',!acceptMessages);
      toast({
        title: res.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError=error as AxiosError<ApiResponse>;
        toast({
          title:"Error",
          description:axiosError.response?.data.message ||
          "Failed to fetch messages",
          variant:"destructive"
        })
    }
  }
  if(!session || !session.user){
    return <div>Please Login</div>
  }

  const {username}:User=session?.user as User;
  const baseUrl=`${window.location.protocol}//${window.location.host}`
  const profileUrl=`${baseUrl}/u/${username}`;


  const copyToClipboard=()=>{
      navigator.clipboard.writeText(profileUrl);
      toast({
        title:"URL Copied",
        description:"URL is Copied to Your clipboard",
      })
  }

  return (
    <div className="my-8 md:mx-8 lg:mx-auto p-6 rounded bg-white w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="w-full p-2 mr-2 bg-gray-100 rounded-md"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
        <div className="mt-5 mb-3 flex">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isloading}
          />
          <div className="ml-4 text-lg font-medium">
            Accepting Messages : {acceptMessages ? "On" : "Off"}
          </div>
        </div>
        <Separator />
        <Button
          className="mt-4"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageCard
                key={message.id}
                message={message}
                onMessageDelete={handleDeletMessage}
              />
            ))
          ) : (
            <p>No Messages to display</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page