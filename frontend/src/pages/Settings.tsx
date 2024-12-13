import SessionCard from '@/components/SessionCard'
import useSessions from '@/hooks/useSessions'

import { PacmanLoader } from 'react-spinners'

const Settings = () => {
  const { sessions , isPending , isSuccess , isError} : any = useSessions()
  console.log(sessions);
  
  return (
    <div>
      <h1 className='text-5xl mb-8'>My Sessions</h1>
      {
        isPending && <PacmanLoader size={100} color='#1534d1' />
      }
      {
        isError && <p className='text2xl text-red-500'>Error fetching sessions</p>
      }
      {
        isSuccess && 
        <div className='flex flex-col gap-4 '>
          {

          sessions.map((session : any)=>(
            <SessionCard key={session.id} session={session} />
          ))
          }
        </div>

        
      }
    </div>
  )
}

export default Settings