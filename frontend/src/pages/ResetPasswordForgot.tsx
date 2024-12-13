import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMutation } from '@tanstack/react-query'
import  { useState } from 'react'
import {  resetPassword } from '@/lib/api'
import { Link} from 'react-router-dom'

const ResetPasswordForm = ({code} : {code : string}) => {
   const[password , setPassword] = useState('')
    
    
    

    

 const {mutate , isSuccess , isError}=  useMutation({
         mutationFn : resetPassword
   })
   const handleResetPassword =(password: string)=>{
        
         mutate({password , verificationCode : code})
   }
  return (
    
          <div className='w-1/3'>
            <h1 className='text-2xl font-semibold mb-3'>Change your password</h1>
                {
                  isSuccess?
                  <Card className="w-96 bg-green-700 rounder-lg">
                  <CardHeader>
                      <CardTitle>Success</CardTitle>
                  </CardHeader>
                  
                <CardContent className=" rounded-lg">
                      <CardTitle className="text-white">Password changed</CardTitle>
                     
                </CardContent>
                <CardFooter>
                 <div className="text-center  text-sm">Go back to <Link to='/' className="text-blue-300"> Home</Link></div> 
                </CardFooter>
          </Card>
                  :
                  <Card className='rounded-lg '>
                  <CardHeader>
                      <CardTitle>Reset Password</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                      <Label>New Password</Label>
                      <Input value={password} onChange={(e)=> setPassword(e.target.value)} placeholder='enter new password...' />
                      <Button onClick={()=> handleResetPassword(password)} className='w-full'>Reset Password</Button>
                  </CardContent>
              </Card>
                }
                {
                  isError && <Card className="w-96 bg-red-700 rounder-lg">
                  <CardHeader>
                      <CardTitle>Error</CardTitle>
                  </CardHeader>
                  </Card>
                }
              
            </div>
  
  )
}

export default ResetPasswordForm