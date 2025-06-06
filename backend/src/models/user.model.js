import {Schema, model} from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        index: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        trim: true
    },
    socketId: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    },
    groups: [
        {
            type: Schema.Types.ObjectId,
            ref: "Group"
        }
    ],
    isOnline: {
        type: Boolean,
        default: false,
    }

}, {timestamps: true})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()
    
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
userSchema.plugin(mongooseAggregatePaginate)

export const User = model("User", userSchema)