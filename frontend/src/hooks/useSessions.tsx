import { getSessions } from "@/lib/api"
import { useQuery, UseQueryOptions } from "@tanstack/react-query"

export const SESSIONS = "sessions"
const useSessions = (opts ={})=>{
    const queryOptions: UseQueryOptions = {
        queryKey: [SESSIONS],
        queryFn: getSessions,
        ...opts,
      };
    const {data : sessions =[] , ...rest} =  useQuery(queryOptions)
    return { sessions , ...rest}
}
export default useSessions