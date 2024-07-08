import {z} from "zod"

export const usernameValidation=z
    .string().min(2,"Username must be atleast 2 char")
    .max(20,"Username must be atmost 20 char")
    .regex(/^[a-zA-Z0-9_]+$/)

export const signUpSchema=z.object({
    username:usernameValidation,
    email:z.string().email({message:"Invalid email"}),
    password:z.string().min(6,{message:"6 character"}).max(20)
})