import { sendVerficationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/UserModel";
import bcrypt from 'bcryptjs'


export async function POST(request:Request){
    console.log("Inside signup");
    await dbConnect();
    try {
        const {username,email,password}=await request.json()
        const existingUserByVerifiedUsername=await UserModel.findOne({username,isVerified:true})
       //if user is verified by its username so it is already registered
        if(existingUserByVerifiedUsername){
            return Response.json(
              {
                success: false,
                message: "Username is already registered",
              },
              { status: 400 }
            );
        }

        //find user by email
        const existingUser=await UserModel.findOne({email});
        const verifyCode=Math.floor(100000 + Math.random()*900000).toString();
        console.log(verifyCode)
        if(existingUser){
            if(existingUser.isVerified){
                return Response.json(
                    {
                        success:false,
                        message:"User is already registered with this email"
                    },{status:500}
                )
            }
            else{
                const hashPass=await bcrypt.hash(password,10);
                existingUser.password=hashPass;
                existingUser.verifyCode=verifyCode;
                existingUser.verifyCodeExpiry=new Date(Date.now()+3600000);
                await existingUser.save();
            }
        }else{
            const hashPass=await bcrypt.hash(password,10);
            const expiryDate=new Date();
            expiryDate.setHours(expiryDate.getHours()+1);

            const newUser=new UserModel({
                username,
                email,
                password:hashPass,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                messages:[]
            })
            await newUser.save();
        }
        // send verificetion email
        const emailResponse=await sendVerficationEmail(username,email,verifyCode);
        console.log(emailResponse);
        if(!emailResponse.success){
            return Response.json(
                {
                    success:false,
                    message:emailResponse.message
                },{status:500}
            )
        }

        return Response.json(
          {
            success: true,
            message: "User registered successfully please verify",
          },
          { status: 201 }
        ); 
         
    } catch (err) {
        console.error("Error registering user",err);
        return Response.json(
            {
                success:false,
                message:"Error registering user"
            },
            {
                status:500
            }
        )
    }
}