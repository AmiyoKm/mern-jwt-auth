import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import useAuth from '@/hooks/useAuth'

import { AlertCircle } from 'lucide-react'



const Profile = () => {
    const {user} : any = useAuth()
    console.log(user);
    
    const {email , verified  , createdAt} = user.user
  return (
    <div className='w-full h-full flex flex-col items-center '>
        <h1 className='mb-4 text-xl'>My Account</h1>      
            {
                !verified && <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Email verification</AlertTitle>
                <AlertDescription>
                  Verify your account by checking the mail.
                </AlertDescription>
              </Alert>
            }
            <p>Email: {email}</p>
            <p>Created on: {new Date(createdAt).toLocaleDateString('en-US')}</p>


    </div>
  )
}

export default Profile