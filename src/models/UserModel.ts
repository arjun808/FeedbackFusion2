import mongoose,{Schema,Document} from "mongoose";
import { Scheherazade_New } from "next/font/google";

export interface Message extends Document{
    content:string;
    createdAt:Date
}

//Messageschema is type of Message it uses ts that interface we create above

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

export interface User extends Document{
    username:string;
    email:string,
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessage:boolean;
    messages:Message[];
}


const UserSchema :Schema<User>=new Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        match:[/.+\@.+\..+/,"pleause use valid email"]    //we can match the email using regex
    },
    password:{
        type:String,
        required:[true,"password is required"],
    },
    verifyCode:{
        type:String,
        required:true
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"expiry is req"]
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    messages:[MessageSchema]

})

const UserModel=mongoose.models.User as mongoose.Model<User>
        || mongoose.model<User>("User",UserSchema)
export default UserModel