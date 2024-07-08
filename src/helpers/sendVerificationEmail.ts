import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/verificationEmail";
import { resend } from "@/lib/resend";

export async function sendVerficationEmail(
    username:string,
    email:string,
    verifyCode:string
):Promise<ApiResponse> {
        try {
            await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: email,
                subject: 'Mystry Message | Verification Code',
                react: VerificationEmail({username,otp:verifyCode}),
            });

            return {success:true ,message:"Email Verfication Successful"}
        } catch (emailError) {
            console.log("Error while sending the verify code");
            return {success:false,message:"email verification failed"}
        }
}
