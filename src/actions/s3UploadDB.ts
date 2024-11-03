"use server";
import { productSchema } from "@/lib/productSchema";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ZodError } from "zod";
import { createProducts } from "./productUpload";

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
    const imgURL = `https://nextform.s3.eu-north-1.amazonaws.com/`;
    const uploadPromises = [];
    const imgURLs = [] as string[];
    for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer()); 

        const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `productImages/${productName}/${file.name}`,
        Body: buffer,
        ContentType: file.type,
        };
        const imageUrl = `${imgURL}productImages/${productName}/${file.name}`;
        imgURLs.push(imageUrl);
        uploadPromises.push(AWSClient.send(new PutObjectCommand(uploadParams)));
    }

    try {
        const responses = await Promise.all(uploadPromises);
        return imgURLs;
    } catch (error) {
        console.error("Error uploading to S3:", error);
        return [];
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
        const imgURLArray= await uploadToS3(productImg, plainObject.productName);
        await createProducts({
            productName: plainObject.productName,
            productDescription: plainObject.productDescription,
            productPrice: plainObject.productPrice,
            productImage: imgURLArray!,
        });
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

