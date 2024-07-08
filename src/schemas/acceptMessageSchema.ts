import {z} from "zod"



export const acceptingMessageSchema=z.object({
    acceptMessage:z.boolean()
})