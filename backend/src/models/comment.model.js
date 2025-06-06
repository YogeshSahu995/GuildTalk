import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    comment: {
        type: String,
        required: true,
        trim: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
    }
}, {timestamps: {createdAt: true, updatedAt: false}})

export const Comment = model("Comment", commentSchema)