import React from 'react'
import Image from 'next/image'
type ProductCardProps = {
    productName: string;
    productImage: string;
    productPrice: number;
    productDescription: string;
};

export default function ProductCard({ productName, productImage, productDescription, productPrice }: ProductCardProps) {
    return (
        <div className='flex flex-col w-64 border rounded-md bg-white justify-center'>
            <div className='w-full h-56 flex items-center px-3'><Image src={productImage} alt={productName} width="300" height="150" priority /></div>
            <div className='bg-neutral-300 p-2'>
                <h3 className="mt-2 text-lg font-bold text-gray-900 sm:text-xl">{productName}</h3>
                <p className="mt-2 max-w-sm text-gray-700">{productDescription}</p>
                <p className='text-green-600'>&#x20B9;{productPrice}</p>
            </div>

        </div>
    )
}
