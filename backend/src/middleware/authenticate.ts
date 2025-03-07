import { RequestHandler } from "express";
import appAssert from "../utils/appAsserts";
import { UNAUTHORIZED } from "../constants/http";
import AppErrorCode from "../constants/appErrorCodes";
import { verifyToken } from "../utils/jwt";


const authenticate : RequestHandler =(req,res,next)=>{
    const accessToken = req.cookies.accessToken as string | undefined

    appAssert(accessToken , UNAUTHORIZED , "Unauthorized access" , AppErrorCode.InvalidAccessToken)

    const {payload , error} = verifyToken(accessToken)

    appAssert( payload , UNAUTHORIZED , error === 'jwt expired' ? "Token expired" : "Invalid Token" , AppErrorCode.InvalidAccessToken)
    
    req.userId = payload.userId
    req.sessionId = payload.sessionId
    next()
}
export default authenticate