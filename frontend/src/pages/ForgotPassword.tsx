import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { sendPasswordForgotEmail } from "@/lib/api"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { Link } from "react-router-dom"


const ForgotPassword = () => {
    const [email , setEmail]=useState('')

  const {mutate , isError , isSuccess} =  useMutation({
        mutationFn : sendPasswordForgotEmail
       
    })
    const handleReset =(email : string)=>{
        mutate(email)
    }
    
  return (
    <div className="flex justify-center items-center w-screen grow h-screen">
      
            {
                isSuccess ?
                <Card className="w-96 bg-green-700 rounder-lg">
                        <CardHeader>
                            <CardTitle>Success</CardTitle>
                        </CardHeader>
                        
                      <CardContent className=" rounded-lg">
                            <CardTitle className="text-white">Email Sent</CardTitle>
                            <CardDescription className="text-white">Check your email for the password reset link</CardDescription>
                      </CardContent>
                      <CardFooter>
                       <div className="text-center  text-sm">Go back to <Link to='/login' className="text-blue-300">Sign in</Link> or <Link className="text-blue-300" to='/register'>Sign up</Link></div> 
                </CardFooter>
                </Card>
              
                : 
                <Card className="w-96 bg-slate-900">
                <CardHeader>
                <CardTitle>Reset Your Password</CardTitle>
                {   isError &&
                    <CardDescription className="text-red-500">User not found</CardDescription>
                }
                </CardHeader>
                <CardContent className="space-y-5">
                    <Label>Email address</Label>
                    <Input  className='border-2' placeholder="enter your email..." value={email} type="email" onChange={(e)=> setEmail(e.target.value)} />
                    <Button onClick={()=> handleReset(email)} className="w-full">Reset Password</Button>
                </CardContent>
                <CardFooter>
                       <div className="text-center text-muted-foreground text-sm">Go back to <Link to='/login' className="text-primary">Sign in</Link> or <Link className="text-primary" to='/register'>Sign up</Link></div> 
                </CardFooter>
                </Card>
            }
           
           
    

    </div>
  )
}

export default ForgotPassword