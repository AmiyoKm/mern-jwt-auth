import useAuth from '@/hooks/useAuth'
import {PacmanLoader } from 'react-spinners'

import { Navigate, Outlet } from 'react-router-dom'
import UserMenu from './UserMenu'

const AppContainer = () => {

const { user , isLoading } = useAuth()

console.log(user);
    
  return (
    <div className='w-full h-screen flex justify-center '>
      {
       
          
          isLoading ? <PacmanLoader  size={100} color='#1534d1' speedMultiplier={1} /> : user ? 
          <div className='w-[100vh] p-4'>
            <div className='fixed w-12 h-12 bottom-10 left-10 bg-slate-800 flex items-center justify-center rounded-full'>
              <UserMenu  /> 
            </div>
             
            <Outlet />
          </div>
          : 
          <Navigate to='/login' replace state={{
            redirectUrl: window.location.pathname
          }} />
        
        
      }
    </div>
  )
}

export default AppContainer