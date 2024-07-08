import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/UserModel";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Username not found",
        },
        { status: 500 }
      );
    }
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "Account is Verified",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verify code is expires",
        },
        { status: 500 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Code Is incorrect Please enter valid code",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error while validation the Verification code",
      },
      { status: 500 }
    );
  }
}