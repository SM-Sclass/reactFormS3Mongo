import { z } from "zod"

const fileSchema = 
  z.instanceof(File)
  .refine(file => file.size <= 4 * 1024 * 1024, {
    message: "Each file must be <= 4MB",
  })
  .refine(file => ["image/jpg", "image/jpeg", "image/png", "image/gif"].includes(file.type), {
    message: "All images must be of type png, jpg, jpeg, or gif",
  });

export const productSchema = z.object({
    productName: z.string().min(3, {
        message: "Product name should be atleast 3 characters long",
    }).trim(),
    productDescription: z.string().min(10, {
        message: "Product description should be atleast 10 characters long",
    }).trim(),
    productPrice: z.string().refine((value) => !isNaN(Number(value)), {
        message: "The Input must be a valid string number",
    }).transform((value) => Number(value)).refine((value) => value > 0, {
        message: "The price must be a positive number",
    }),
    // productPrice: z.number().positive({
    //     message: "The price must be a positive number",
    // }),
    productImage: z
    .array(fileSchema)
    .nonempty({ message: "At least one image file is required" }),  
})
