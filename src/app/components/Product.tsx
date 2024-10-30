"use client"
import React, { useActionState, useEffect, useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { productSchema } from '@/lib/productSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useFormState } from 'react-dom'
import { DataState, s3UploadDatabase } from '@/actions/s3UploadDB'

function Product() {
    const formState: DataState = {
        message: "",
        errors: {
            productName: "",
            productDescription: "",
            productPrice: "",
            productImage: "",
        }
    }
    const [state, formAction, isPending] = useActionState<DataState, FormData>(s3UploadDatabase, formState)
    const [filesData, setFilesData] = useState<{ file: File; previewUrl: string }[]>([]);

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {

        const files = Array.from(e.target.files || []).filter(
            file => file.size > 0 && ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(file.type)
        );
        console.log("These is image files array", files)

        const updatedFilesData = files.map(file => ({
            file,
            previewUrl: URL.createObjectURL(file),
        }));
        console.log("These is upadted file data", updatedFilesData)
        setFilesData(updatedFilesData)
    };
    useEffect(() => {
        if (state.message === "Upload successful") {
            setFilesData([]); // Clear the filesData state
        }
    }, [state.message]);
    const { register,
        setValue,
        handleSubmit,
        formState: { errors, isSubmitting } } =
        useForm<z.output<typeof productSchema>>({ resolver: zodResolver(productSchema) });
    
    

    return (
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
            <div className='font-bold text-center text-xl'>
                Enter Product Details
            </div>
            <p className='text-center my-3 text-sm text-neutral-500'>Upload your product images to AWS S3</p>
            <form action={formAction}  className="mx-auto mb-0 mt-8 max-w-md space-y-4 text-black">
                <div>
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                            placeholder="Product Name"
                            {...register("productName")}
                        />
                    </div>
                </div>
                {state.errors.productName && (<p className='text-red-500 text-xs'>{`${state.errors.productName}`}</p>)}
                <div>
                    <div className="relative">
                        <textarea
                            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                            placeholder="Description....."
                            id='productDescription'
                            rows={5}
                            {...register("productDescription")}
                        ></textarea>
                    </div>
                </div>
                {state.errors.productDescription && (<p className='text-red-500 text-xs'>{`${state.errors.productDescription}`}</p>)}
                <div>
                    <div className="relative">
                        <input
                            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                            placeholder="Product Price"
                            id='productPrice'
                            {...register("productPrice")}
                            type='text'
                        />
                    </div>
                </div>
                {state.errors.productPrice && (<p className='text-red-500 text-xs'>{`${state.errors.productPrice}`}</p>)}

                <div className='flex items-center justify-center w-full bg-yellow-200 rounded-lg py-10'>
                    <label htmlFor="productImage">
                        <div className='flex flex-col items-center gap-y-1 w-full'>
                            <Image className='' src="./upload.svg" alt='upload' width={30} height={30} />
                            <p className='text-gray-500 text-sm'> <span className='font-bold'>click to upload</span> or drag and drop images</p>
                            <p className='text-gray-500 text-xs '>SVG, PNG, JPG or GIF</p>
                        </div>
                    </label>
                    <input
                        className='hidden'
                        id='productImage'
                        type="file"
                        {...register("productImage")}
                        onChange={handleImage}
                        accept='image/*'
                        multiple
                    />
                </div>
                {state.errors.productImage && (<p className='text-red-500 text-xs'>{`${state.errors.productImage}`}</p>)}

                {filesData.length > 0 && (
                    <div className="mt-4">
                        {filesData.map((data, idx) => (
                            <div key={idx} className="bg-white dark:bg-neutral-700 p-4 mt-4 w-full mx-auto rounded-md shadow-sm">
                                <div className="flex justify-between items-center gap-4">
                                    <img src={data.previewUrl} alt={`Preview ${idx + 1}`} className="h-24 w-24 object-cover rounded-md" />
                                    <div className="flex flex-col justify-center">
                                        <p className="text-neutral-700 dark:text-neutral-300 truncate max-w-xs">Image {idx + 1}</p>
                                        <p className="text-neutral-600 dark:text-neutral-300 text-sm">{(data.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        <p className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 text-xs text-neutral-700">{data.file.type}</p>
                                        <p className="text-xs text-neutral-400">Modified: {new Date(data.file.lastModified).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div>
                    <button
                        disabled={isPending}
                        type="submit"
                        className="rounded-lg bg-blue-700 px-5 hover:bg-blue-600 py-3 text-sm font-medium text-white disabled:bg-gray-500"
                    >
                        {isPending ? "creating..." : "Create Product"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Product