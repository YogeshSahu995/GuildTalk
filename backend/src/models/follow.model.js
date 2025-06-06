import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const followSchema = new Schema({
    follower: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

}, {
    timestamps: {
        createdAt: true, 
        updatedAt: false
    }
})

followSchema.plugin(mongooseAggregatePaginate)

export const Follow = model("Follow", followSchema)