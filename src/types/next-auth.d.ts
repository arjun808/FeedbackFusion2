import "next-auth"
import { DefaultSession } from "next-auth";


declare module 'next-auth'{
    interface Session {
        user: {
          _id?: string;
          isVerified?: boolean;
          isAcceptingMessage?: boolean;
          username?: string;
        } & DefaultSession['user'];
    }
    interface User{
        _id?:string;
        username?:string,
        isVerified?:boolean;
        isAcceptingMessage?:boolean;
    }
    
}
declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
    username?: string;
  }
}