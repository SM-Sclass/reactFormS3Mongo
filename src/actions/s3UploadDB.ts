"use server";
import { productSchema } from "@/lib/productSchema";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
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


const AWSClient = new S3Client({
    region:process.env.AWS_REGION!,
    credentials: {
        accessKeyId:process.env.AWS_ACCESS_KEY!,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY!,
        },
})

async function uploadToS3(files: File[], productName: string) {
    const uploadPromises = [];
    
    for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer()); 

        const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `productImages/${productName}/${file.name}`,
        Body: buffer,
        ContentType: file.type,
        };

        uploadPromises.push(AWSClient.send(new PutObjectCommand(uploadParams)));
    }

    try {
        const responses = await Promise.all(uploadPromises);
        console.log("All images uploaded successfully:", responses);
        const imgURL = `https://nextform.s3.eu-north-1.amazonaws.com/${productName}/`;
        return imgURL;
    } catch (error) {
        console.error("Error uploading to S3:", error);
        
    }
}

export async function s3UploadDatabase(state: DataState, formData: FormData) {

    const plainObject: Record<string, any> = {};
    formData.forEach((value, key) => {
        if (key === "productImage") {
            if (!plainObject[key]) plainObject[key] = [];
            plainObject[key].push(value);
        } 
        else {
            plainObject[key] = value;
        }
    });



    try {

        productSchema.parse(plainObject);  
        const productImg = formData.getAll("productImage") as File[];
        uploadToS3(productImg, plainObject.productName);
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

