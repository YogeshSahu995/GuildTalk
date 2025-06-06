import {Schema, model} from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const messageSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    groupId: {
        type: Schema.Types.ObjectId,
        ref: "Group",
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
},
{timestamps: {createdAt: true, updatedAt: false}}
)

messageSchema.plugin(mongooseAggregatePaginate)

export const Message = model("Message", messageSchema)