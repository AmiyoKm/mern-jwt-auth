import { deleteSession } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { SESSIONS } from "./useSessions"


const useDeleteSession =(id: string) => {
   const queryClient = useQueryClient()
     const {mutate , ...rest } =  useMutation({
            mutationFn:() =>  deleteSession(id),
            onSuccess: () =>{
                queryClient.setQueryData(
                    [SESSIONS] , 
                    (cache : any)=> cache.filter((session : any)=> session._id !== id)
                )
            }
        })
        return { deleteSession : mutate , ...rest} 
}

export default  useDeleteSession;