import {z} from "zod"



export const verifySchema=z.object({
    code:z.string().length(6,"verificati code be must 6 digits")
})