


import { Link, useSearchParams } from 'react-router-dom'
import ResetPasswordForm from './ResetPasswordForgot'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'

const ResetPassword = () => {
   
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");
    const exp = Number(searchParams.get("exp"));
    const now = Date.now();
  
    if (!code || isNaN(exp) || exp < now) {
      return <div>Invalid or expired reset code</div>;
    }

    const linkIsValid = code && exp && now < exp;

   
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
          <div>
           
          
               {
                linkIsValid ? (
                   < ResetPasswordForm code={code} /> 
                ) : (
                    <Card>
                        <CardContent>
                            <CardTitle>Invalid or expired link</CardTitle>
                        </CardContent>
                        <CardFooter>
                            <div>Try again <Link to='/password/forgot' className='text-blue-500'>here</Link></div>
                        </CardFooter>
                    </Card>
                )
               }
            </div>
    </div>
  )
}

export default ResetPassword