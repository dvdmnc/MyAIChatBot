import mongoose from "mongoose"
import { randomUUID } from "crypto"

const chatSchema = new mongoose.Schema({
    id:{
        type:String,
        default: randomUUID(),
    },
    role : {
        type: String,
        required:[true,"Please provide a role"]
    },
    content : {
        type: String,
        required:[true,"Please provide a role"]
    },
})

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,"Please provide a name"]
    },
    email:{
        type:String,
        required:[true,"Please provide an email"],
    },
    password:{
        type:String,
        required:[true,"Please provide a password"]
    },
    chats : [chatSchema]
})

export default mongoose.model('User',userSchema)