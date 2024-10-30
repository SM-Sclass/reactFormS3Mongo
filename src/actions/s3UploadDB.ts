"use server";

import { productSchema } from "@/lib/productSchema";
import { ZodError } from "zod";

export type DataState = {
    message: string;
    errors: {
        productName: string;
        productDescription: string;
        productPrice: string;
        productImage:string;
    };
};

// `s3UploadDatabase` now accepts only `formData` as input
export async function s3UploadDatabase(state: DataState, formData: FormData) {
    console.log(formData);
    console.log("These is the image", formData.get("productImage"))
    // Convert FormData into a plain object
    const plainObject: Record<string, any> = {};
    formData.forEach((value, key) => {
        if (key === "productImage") {
            // Ensure `productImage` is an array of files
            if (!plainObject[key]) plainObject[key] = [];
            plainObject[key].push(value);
        } else {
            plainObject[key] = value;
        }
    });

    console.log('Converted plainObject:', plainObject); // Check if data is correctly structured

    try {
        // Validate with Zod schema
        productSchema.parse(plainObject);  // Use `plainObject` instead of `formData`
        return {
            message: "Upload successful",
            errors: {
                productName: "",
                productDescription: "",
                productPrice: "",
                productImage: "",
            },
        };
    } catch (error: any) {

        if (error instanceof ZodError) {
            // Flatten the Zod errors and map each field error
            const formValidationErrors = error.flatten().fieldErrors;
            return {
                message: "Validation failed",
                errors: {
                    productName: formValidationErrors.productName?.join(", ") || "",
                    productDescription: formValidationErrors.productDescription?.join(", ") || "",
                    productPrice: formValidationErrors.productPrice?.join(", ") || "",
                    productImage: formValidationErrors.productImage?.join(", ") || "",
                },
            };
        }
        throw error; // Throw if it's a different error type
    }

}

