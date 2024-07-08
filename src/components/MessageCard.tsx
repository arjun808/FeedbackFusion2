'use client'
import dayjs from 'dayjs'
import {
    Card,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/models/UserModel";
import { useToast } from "./ui/use-toast";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
  

type MessageProp={
    message:Message;
    onMessageDelete:(messageId:string)=>void
}
  
const MessageCard = ({message,onMessageDelete}:MessageProp) => {

    const {toast}=useToast()
    const handleOnDelete=async()=>{
        const resp=await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
        toast({
            title:resp.data.message
        })
        onMessageDelete(message._id);
    }
  return (
    <Card className="card-bordered">
      
      <CardHeader >
        <div className="flex flex-row justify-between items-center">
        <CardTitle>{message.content}</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive"><X className="w-5 h-5"></X></Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleOnDelete}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </div>
        <div className="text-sm">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
      </CardHeader>
      
    </Card>
  );
}

export default MessageCard