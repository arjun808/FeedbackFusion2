import {getServerSession} from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/UserModel';
import {User} from "next-auth";

export async function POST(request:Request) {
    await dbConnect();
    const session =await getServerSession(authOptions);
    const user:User=session?.user as User
    if(!session || !user){
        return Response.json(
            {
              success: false,
              message: "User Not Authenticated",
            },
            { status: 401 }
        );
    }

    const userId=user._id;
    const {acceptMessages}=await request.json();
    try {
       const updatedUser= await UserModel.findByIdAndUpdate(
                userId,
                {isAcceptingMessage:acceptMessages},
                {new:true}
        )
        if(!updatedUser){
            return Response.json(
                {
                  success: false,
                  message: "Failed to update user accepatnce status",
                },
                { status: 401 }
            );
        }
        return Response.json(
            {
              success: true,
              message: "Message acceptance status updated successfully",
            },
            { status: 200}
        );
    } catch (error) {
        return Response.json(
            {
              success: false,
              message: "User Not Authenticated",
            },
            { status: 401 }
        );
    }
}


export async function GET(request:Request) {
    await dbConnect();
    const session=await getServerSession(authOptions);
    const user:User=session?.user as User;
    if(!session || !user){
        return Response.json(
            {
              success: false,
              message: "User Not Authenticated",
            },
            { status: 401 }
        );
    }
    const userId=user._id;
    
    try {
        const foundUser=await UserModel.findById(userId);
        if(!foundUser){
            return Response.json(
                {
                success: false,
                message: "User not found",
                },
                { status: 404 }
            );
        }
        return Response.json(
            {
              success: true,
              isAcceptingMessages:foundUser.isAcceptingMessage
            },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            {
              success: false,
              message: "Error while getting status is messageAcceptence",
            },
            { status: 401 }
        );
    }
}

