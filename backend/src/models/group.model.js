import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const groupSchema = new Schema({
    groupName: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true
    },

    admin: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    members: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    groupAvatar: {
        type: String,
        required: true,
    },

    groupCoverImage: {
        type: String,
    },
    requestList: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, {timestamps: true})

groupSchema.plugin(mongooseAggregatePaginate)

export const Group = model("Group", groupSchema)