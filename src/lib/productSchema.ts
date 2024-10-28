import { z } from "zod"

export const productSchema = z.object({
    productName: z.string().min(3, {
        message: "Product name should be atleast 3 characters long",
    }).trim(),
    productDescription: z.string().min(10, {
        message: "Product description should be atleast 10 characters long",
    }).trim(),
    productPrice: z.string().min(1, {message:"Minimum price should be atleast 1 Rupee"}).refine((value) => !isNaN(Number(value)), {
        message: "The Input must be a valid string number",
    }).transform((value) => Number(value)).refine((value) => value > 0, {
        message: "The price must be a positive number",
    }),
    productImage: z.any().refine((file) => file instanceof File, "Image file is required").refine((file) => file?.size <= 4 * 1024 * 1024, "Provide an image file less than or equal 4MB").refine((file) => ["image/jpg", "image/jpeg", "image/png", "image/gif"].includes(file?.type), "Image must of type png, jpg, jpeg, gif"),
})