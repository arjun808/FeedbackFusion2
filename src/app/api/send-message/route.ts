import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/models/UserModel";

export async function POST(request:Request) {
    await dbConnect();
    try {
        const {username,content}=await request.json();
        const user=await UserModel.findOne({username});
        if(!user){
            return Response.json(
                {
                  success: false,
                  message: "User Not Found",
                },
                { status: 404 }
            );
        }
        if(!user.isAcceptingMessage){
            return Response.json(
                {
                  success: false,
                  message: "User is not accepting messages",
                },
                { status: 400 }
            );
        }
        const newMessage={content,createdAt:new Date()}
        user.messages.push(newMessage as Message)
        await user.save();
        return Response.json(
            {
              success: true,
              message: "message sent successfully",
              user
            },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            {
              success: false,
              message: "message sending failed",
            },
            { status: 500 }
        );
    }
}