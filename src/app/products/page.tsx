import { getProducts } from '@/actions/productUpload'
import React from 'react'
import ProductCard from '../components/ProductCard'


const page = async () => {
    const products = await getProducts()

    return (
        <div className='container mb-7'>
            <h2 className='text-xl font-bold text-center my-5'>Next Products</h2>
            <div className='container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                    {products?.map((product, idx) => (
                        <ProductCard key={idx} productName={product.productName} productImage={product.productImage[0]} productDescription={product.productDescription} productPrice={product.productPrice} />
                    ))}
            </div>
        </div>

    )
}

export default page