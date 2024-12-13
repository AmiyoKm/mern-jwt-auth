import { SignOptions, VerifyOptions } from "jsonwebtoken"
import { SessionDocument } from "../model/session.model"
import { UserDocument } from "../model/user.model"
import jwt from "jsonwebtoken"
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env"
export type RefreshToken ={
    sessionId : SessionDocument["_id"]
}

export type AccessToken ={
    userId :  UserDocument["_id"]
    sessionId :  SessionDocument["_id"]
}

type SignOptionsAndSecret = SignOptions & {
    secret : string
}

const defaults : SignOptions ={
    audience : ["user"],
}

const accessTokenSignOptions : SignOptionsAndSecret ={
    expiresIn : "15m",
    secret : JWT_SECRET,
}

export const refreshTokenSignOptions : SignOptionsAndSecret ={
    expiresIn : "30d",
    secret : JWT_REFRESH_SECRET,
}

export const signToken = (payload : AccessToken |RefreshToken , options? : SignOptionsAndSecret )=>{
    const {secret, ...signOptions} = options || accessTokenSignOptions
    return jwt.sign(payload ,secret , {...defaults , ...signOptions})
}

export const verifyToken = <TPayload extends object = AccessToken>(token : string , options? : VerifyOptions & {secret: string})=>{

    const {secret =JWT_SECRET , ...verifyOptions} = options || {}

    try {
        const payload = jwt.verify(token , secret , {
            ...defaults, ...verifyOptions
        }) as TPayload
        return {payload}
    } catch (error : any) {
        return { error : error.message} 
    }
    
}