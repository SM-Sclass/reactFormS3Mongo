"use client"
import React from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { productSchema } from '@/lib/productSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { promise, z } from 'zod'

function Product() {
    const toSubmit= async(e:z.output<typeof productSchema>)=>{
        await new Promise((resolve)=> setTimeout(resolve,3000));
        console.log(e)
    }
    const handleImage = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setValue("productImage", e.target.files?.[0] as File)
    }
    const { getValues, register, handleSubmit, 
        setValue, 
        setError, 
        reset, 
        formState: { errors, isSubmitting } } = 
    useForm<z.output<typeof productSchema>>({resolver:zodResolver(productSchema)});
    return (
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
            <div className='font-bold text-center text-xl'>
                Enter Product Details
            </div>
            <form action="#" onSubmit={handleSubmit(toSubmit)} className="mx-auto mb-0 mt-8 max-w-md space-y-4 text-black">
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
                {errors.productName && (<p className='text-red-500 text-xs'>{`${errors.productName.message}`}</p>)}
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
                {errors.productDescription && (<p className='text-red-500 text-xs'>{`${errors.productDescription.message}`}</p>)}
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
                {errors.productPrice && (<p className='text-red-500 text-xs'>{`${errors.productPrice.message}`}</p>)}

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
                        type='file'
                        {...register("productImage")}
                        onChange={handleImage}
                        accept='image/*'
                        multiple
                    />
                </div>
                {errors.productImage && (<p className='text-red-500 text-xs'>{`${errors.productImage.message}`}</p>)}
                <div>
                    <button
                    disabled={isSubmitting}
                        type="submit"
                        className="rounded-lg bg-blue-700 px-5 hover:bg-blue-600 py-3 text-sm font-medium text-white disabled:bg-gray-500"
                    >
                        {isSubmitting?"creating..." : "Create Product"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Product