import { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";

export async function getSocketId(id){
    try {
        if(!isValidObjectId(id)){
            console.log("This is not a valid id of user")
        }
        const user = await User.findById(id)
        return user?.socketId
    } catch (error) {
        console.log(error.message)
    }
}