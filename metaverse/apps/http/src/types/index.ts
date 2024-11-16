import z from "zod"
export const SignupSchema = z.object({
    username: z.string(),
    password: z.string().min(8),
    type: z.enum(["user", "admin"]),
})

export const SigninSchema = z.object({
    username: z.string(),
    password: z.string().min(8),
})

export const updateMetadataSchema = z.object({
    avatarId: z.string()
})

export const CreateSpaceSchema = z.object({
    name: z.string(),
    dimentions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/), //regex stands for regular exprssion
    mapId: z.string()
})