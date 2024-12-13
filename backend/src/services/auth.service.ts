import AppErrorCode from "../constants/appErrorCodes"
import { APP_ORIGIN, JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env"
import { CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND, TOO_MANY_REQUESTS, UNAUTHORIZED } from "../constants/http"
import VerificationCodeType from "../constants/verificationCodeTypes"
import SessionModel from "../model/session.model"
import UserModel from "../model/user.model"
import verificationCodeModel from "../model/verification.model"
import appAssert from "../utils/appAsserts"
import { fiveMinutesAgo, ONE_DAY_MS, oneHourFromNow, oneYearFromNow, thirtyDaysFromNow } from "../utils/date"
import jwt from "jsonwebtoken"
import { RefreshToken, refreshTokenSignOptions, signToken, verifyToken } from "../utils/jwt"
import { sendMail } from "../utils/sendMail"
import { getPasswordResetTemplate, getVerifyEmailTemplate } from "../utils/emailTemplates"
import { hashValue } from "../utils/bcrypt"

export type CreateAccountParams = {
    email: string,
    password: string,
    userAgent?: string,
}

export const createAccount = async (data: CreateAccountParams) => {
    const existingUser = await UserModel.exists({ email: data.email })
    // if(existingUser){
    //     throw new Error("User already exists")
    // }
    appAssert(!existingUser, CONFLICT, "User already exists", AppErrorCode.InvalidAccessToken)

    const user = await UserModel.create({
        email: data.email,
        password: data.password
    })

    const userId = user._id



    const verificationCode = await verificationCodeModel.create({
        userId,
        type: VerificationCodeType.EmailVerification,
        expiresAt: oneYearFromNow()
    })

    const url = `${APP_ORIGIN}/email/verify/${verificationCode._id}`

   const {error} = await sendMail({
        to: user.email,
        ...getVerifyEmailTemplate(url)
    })
    if(error){
        console.log(error);
        
    }

    const session = await SessionModel.create({
        userId,
        userAgent: data.userAgent
    })

    const refreshToken = signToken({ sessionId: session._id }, refreshTokenSignOptions)

    // jwt.sign({sessionId : session._id}, JWT_REFRESH_SECRET , {audience :['user'] ,expiresIn : "30d"})

    const accessToken = signToken({ userId, sessionId: session._id })


    // jwt.sign({userId : user._id} , JWT_SECRET , {audience : ["user"] , expiresIn : "15m"})

    return { user: user.omitPassword(), accessToken, refreshToken }
} 


export type LoginParams = {
    email: string,
    password: string,
    userAgent?: string,
}


export const loginUser = async ({ email, password, userAgent }: LoginParams) => {
    const user = await UserModel.findOne({ email })
    appAssert(user, UNAUTHORIZED, "Invalid email or password")

    const isPasswordValid = await user.comparePassword(password)
    appAssert(isPasswordValid, UNAUTHORIZED, "Invalid email or password")

    const userId = user._id

    const session = await SessionModel.create({
        userId,
        userAgent
    })
    const sessionInfo = {
        sessionId: session._id,
        userAgent
    }
    const accessToken = signToken({
        ...sessionInfo,
        userId
    })

    // jwt.sign({userId , ...sessionInfo} , JWT_SECRET , {audience : ["user"] , expiresIn : "15m"})

    const refreshToken = signToken({ sessionId: session._id }, refreshTokenSignOptions)

    // jwt.sign({sessionInfo} , JWT_REFRESH_SECRET , {audience : ["user"], expiresIn : "30d"})

    return { user: user.omitPassword(), accessToken, refreshToken }
}

export const refreshUserAccessToken = async (refreshToken: string) => {
    const { payload } = verifyToken<RefreshToken>(refreshToken, { secret: refreshTokenSignOptions.secret })
    appAssert(payload, UNAUTHORIZED, "Invalid refresh token")
    const session = await SessionModel.findById(payload.sessionId)
    const now = Date.now()
    appAssert(session && session.expiresAt.getTime() > now, UNAUTHORIZED, "Invalid session")

    const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS

    if (sessionNeedsRefresh) {
        session.expiresAt = thirtyDaysFromNow()
        await session.save()
    }
    const newRefreshToken = sessionNeedsRefresh ? signToken({ sessionId: session._id }, refreshTokenSignOptions) : undefined

    const accessToken = signToken({ userId : session.userId , sessionId : session._id})

    return { accessToken,  newRefreshToken }

}

export const verifyEmail = async (code: string) => {
    const validCode = await verificationCodeModel.findOne({_id : code , type : VerificationCodeType.EmailVerification})

    appAssert(validCode , NOT_FOUND , "Invalid or expired verification code")  
   
    const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId , {verified : true} , {new : true , runValidators : true})

    appAssert(updatedUser , INTERNAL_SERVER_ERROR , "Failed to verify email")

    await validCode.deleteOne()

    return updatedUser.omitPassword()
}

export const sendForgotPasswordEmail = async(email : string)=>{
    try {
        const user = await UserModel.findOne({email})
    appAssert(user , NOT_FOUND , "User not found")
    const fiveMinAgo = fiveMinutesAgo()

    const count = await verificationCodeModel.countDocuments({userId : user._id , type : VerificationCodeType.PasswordReset , createdAt : {$gt : fiveMinAgo}})

    appAssert(count <=1 , TOO_MANY_REQUESTS , "Too many requests ,Please try again later")

    const expiresAt = oneHourFromNow()

    const verificationCode = await verificationCodeModel.create({
        userId : user._id,
        type : VerificationCodeType.PasswordReset,
        expiresAt
    })

    const url = `${APP_ORIGIN}/password/reset?code=${
        verificationCode._id
      }&exp=${expiresAt.getTime()}`;

    const {data ,error} = await sendMail({
        to : user.email,
        ...getPasswordResetTemplate(url)
    })
    appAssert(data?.id , INTERNAL_SERVER_ERROR , `${error?.name} = ${error?.message}`)

    return {url , emailId : data?.id}
    } catch (error) {
        console.log('ForgotPasswordError:', error);
        return {};
    }
    
}
type ResetPasswordParams = {
    password : string,
    verificationCode : string
}
export const resetPassword =async({password , verificationCode} : ResetPasswordParams)=>{
    const validCode = await verificationCodeModel.findOne({_id : verificationCode , type : VerificationCodeType.PasswordReset , expiresAt : {$gt : new Date()}})

    appAssert(validCode , NOT_FOUND , "Invalid or expired verification code")

    const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId , {password : await hashValue(password)} , {new : true , runValidators : true})

    appAssert(updatedUser , INTERNAL_SERVER_ERROR , "Failed to reset password")

    await validCode.deleteOne()

    await SessionModel.deleteMany({userId : updatedUser._id})

    return {user : updatedUser.omitPassword()}
}
