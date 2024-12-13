import { z } from "zod"
import catchErrors from "../utils/catchErrors"
import { createAccount, loginUser, refreshUserAccessToken, resetPassword, sendForgotPasswordEmail, verifyEmail } from "../services/auth.service"
import { CREATED, OK, UNAUTHORIZED } from "../constants/http"
import { clearAuthCookies, getAccessTokenCookieOptions, getRefreshTokenCookieOptions, setAuthCookies } from "../utils/cookies"
import { emailSchema, loginSchema, registerSchema, resetPasswordSchema } from "./auth.schemas"
import { verifyToken } from "../utils/jwt"
import SessionModel from "../model/session.model"
import { verificationCodeSchema } from "./auth.schemas"



export const registerHandler = catchErrors(
    async (req, res) => {
        const request = registerSchema.parse({
            ...req.body,
            userAgent: req.headers['user-agent']
        })

        const {
            user,
            accessToken,
            refreshToken
        } = await createAccount(request)
        return setAuthCookies({res , accessToken , refreshToken}).status(CREATED).json({user})
         
    }
)

export const loginHandler = catchErrors(
    async (req,res)=>{
        const request = loginSchema.parse({
            ...req.body , userAgent : req.headers["user-agent"]
        })
        const { accessToken , refreshToken} = await loginUser(request)

        return setAuthCookies({res ,accessToken , refreshToken}).json({message : "Logged in"})

    }
)

export const logoutHandler = catchErrors(
    async (req,res)=>{
        const accessToken = req.cookies.accessToken as string | undefined
        const {payload} = verifyToken(accessToken || "")
        if(payload){

            await SessionModel.findByIdAndDelete(payload.sessionId)
    }
    return clearAuthCookies(res).status(OK).json({message : "Logged out"})
  
}
)

export const refreshHandler = catchErrors(
    async (req,res)=>{
        const refreshToken = req.cookies.refreshToken as string | undefined
        console.log(req.cookies.refreshToken);
        
       const {accessToken , newRefreshToken} = await refreshUserAccessToken(refreshToken || "")

        if(newRefreshToken){
            res.cookie("refreshToken" , newRefreshToken , getRefreshTokenCookieOptions())
        }


       return res.status(OK).cookie("accessToken" ,accessToken ,getAccessTokenCookieOptions()).json({message : "Access Token Refreshed"})
    }
)

export const verifyEmailHandler = catchErrors(
    async(req,res)=>{
        const verificationCode =verificationCodeSchema.parse(req.params.code)
         
        await verifyEmail(verificationCode)
        return res.status(OK).json({message : "Email Successfully Verified"})
    }
)

export const forgotPasswordHandler = catchErrors(
    async(req,res)=>{
       const email = emailSchema.parse(req.body.email)
         await sendForgotPasswordEmail(email)

         return res.status(OK).json({message : "Password reset email sent"})
    }
)

export const resetPasswordHandler = catchErrors(
    async(req,res)=>{
      const request =  resetPasswordSchema.parse(req.body)
      await  resetPassword(request)

        return clearAuthCookies(res).status(OK).json({message : "Password reset successful"})


    }

 
)