import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        const data = await req.formData();

        console.log(data);
        return NextResponse.json({ message: 'Data received successfully' });
    } catch (error:any) {
        return NextResponse.json("These is the error", error)
    }

}