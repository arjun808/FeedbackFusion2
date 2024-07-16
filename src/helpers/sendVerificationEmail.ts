import { ApiResponse } from "@/types/ApiResponse";

import nodemailer from 'nodemailer';

// Configure your SMTP transporter here
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: 'arjunjagotra2001@gmail.com', // Your Gmail address
        pass: 'qigu galp ejcl rtzi', // Replace with your app-specific password
    },
});
export async function sendVerificationEmail(
    username: string,
    email: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        // Generate the plain text content for the email
        const emailText = `
        Dear ${username},

        Thank you for registering with FeedFusion. To complete your registration, please use the following OTP (One-Time Password) to verify your account:

        OTP: ${verifyCode}

        This OTP is valid for 5 minutes. If you did not request this verification, please disregard this email.

        Once your account is verified, you will have access to our platform and its features.

        If you have any questions or need assistance, please feel free to reach out to us at feedFusion@gmail.com. We are here to help!
        `;

        await transporter.sendMail({
            from: '"FeedbackFusion" <your-email@example.com>', // Replace with your "from" address
            to: email,
            subject: 'FeedbackFusion Message | Verification Code',
            text: emailText, // Use the plain text content
        });

        return { success: true, message: "Email Verification Successful" };
    } catch (emailError) {
        console.log("Error while sending the verify code:", emailError);
        return { success: false, message: "Email verification failed" };
    }
}
