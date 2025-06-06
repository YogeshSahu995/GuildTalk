import mongoose from "mongoose";

export async function connectDB(){
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DB_URI}`)
        console.log(`MongoDB is connected on ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}