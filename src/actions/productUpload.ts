"use server"
import connectDB from "@/DBconfig/dbconfig";
import Product from "@/DBconfig/productModel";

interface productSchema {
    productName: string;
    productDescription: string;
    productPrice: number;
    productImage: string[];
}

export async function createProducts(params: productSchema) {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI not found in .env file");
      return {
        success: false,
        message: "MONGODB_URI not found in .env file",
      };
    }
  
    try {
      await connectDB();
      const createdProduct = await Product.create(params);
      return {
        success: true,
        message: "Product created successfully",
        data: createdProduct,
      };
    } catch (error) {
      console.error("Error creating product:", error);
      return {
        success: false,
        message: "Error creating product",
        error: error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  }

  export async function getProducts() {
    try {
      await connectDB();
      const products = await Product.find({});
      return products;
    } catch (error) {
      console.log("Error while fetching products",error)
    }
  }