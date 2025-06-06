import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const likeSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    },

    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, {timestamps: {createdAt: true, updatedAt: false}})

likeSchema.plugin(mongooseAggregatePaginate)
export const Like = model("Like", likeSchema)