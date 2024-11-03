import mongoose from "mongoose";

let isConnected: boolean = false;
export default async function connectDB() {
    if(isConnected) {
        console.log("Connection available to DB");
        return;
    }
    try {
        mongoose.connect(process.env.MONGODB_URI!, {
            dbName: process.env.DB_NAME,
        });      
        isConnected = true;  
    } catch (error) {
        console.log(error)
    }
};