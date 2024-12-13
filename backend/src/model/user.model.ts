import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { compareValue, hashValue } from "../utils/bcrypt";
export interface UserDocument extends mongoose.Document{
    _id: mongoose.Types.ObjectId;
    email: string;
    password: string;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword : (password : string)=> Promise<boolean>
    omitPassword :()=> Pick<UserDocument , 'email' | '_id' | 'verified' | 'createdAt' | 'updatedAt'>
}

const userSchema = new mongoose.Schema<UserDocument>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false , required : true },
}, { timestamps: true });

userSchema.pre("save" , async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await hashValue(this.password, 8)
    next()
})

userSchema.methods.comparePassword = async function(password : string){
    return compareValue(password, this.password)
}

userSchema.methods.omitPassword = function(){
    const obj = this.toObject()
    delete obj.password
    return obj
}
const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;