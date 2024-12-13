import API from "@/config/apiClient"
import { formSchema } from "@/pages/Login"
import { registerSchema } from "@/pages/Register"
import { z } from "zod"


export const login = async (data: z.infer<typeof formSchema>) =>
    API.post('/api/v1/auth/login', data)

export const register = async (data: z.infer<typeof registerSchema>) =>
    API.post('/api/v1/auth/register', data)

export const logout = async () => 
    API.post('/api/v1/auth/logout')

export const verifyEmail = async (code: string) =>
    API.get(`/api/v1/auth/email/verify/${code}`)

export const sendPasswordForgotEmail = async(email : string)=> 
    API.post('/api/v1/auth/password/forgot', {email})

export const resetPassword = async({password, verificationCode} : {password : string , verificationCode : string})=> 
    API.post('/api/v1/auth/password/reset', {password , verificationCode})

export const getUser = async () => 
    API.get('/api/v1/user')  

export const getSessions =()=> 
    API.get('/api/v1/session')

export const deleteSession =(_id : string)=> 
    API.delete(`/api/v1/session/${_id}`)