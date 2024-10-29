"use server";

import { productSchema } from "@/lib/productSchema";

export type DataState = {
    message: string;
    errors: {
        productName: string;
        productDescription: string;
        productPrice: string;
        productImage: File[];
    };
};

// `s3UploadDatabase` now accepts only `formData` as input
export async function s3UploadDatabase(state: DataState, formData: FormData) {
    console.log(formData);

    // Convert FormData into a plain object
    const plainObject: Record<string, any> = {};
    formData.forEach((value, key) => {
        // Convert File object if it's productImage
        if (key === "productImage") {
            if (!plainObject[key]) plainObject[key] = [];
            plainObject[key].push(value);
        } else {
            plainObject[key] = value;
        }
    });

    console.log('These is plainObject', plainObject)
    try {
        // Validate with Zod schema
        productSchema.parse(plainObject);
        return {
            ...state,
            message: "Upload successful",
        };
    } catch (error: any) {
        console.log(error);
        return {
            ...state,
            message: "Upload failed",
            errors: {
                ...state.errors,
                ...error.errors,
            },
        };
    }
}

