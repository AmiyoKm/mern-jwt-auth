import { verifyEmail } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

const VerifiedEmail = () => {
    const { code } = useParams();
    if(!code){
        return <div>Invalid Code</div>
    }
    const { isPending, isSuccess, isError } = useQuery({
        queryKey: ["emailVerification", code],
        queryFn: () => verifyEmail(code),
    });

    return (
        <div className="h-screen w-screen bg-gray-100">
            <div className="flex flex-col items-center justify-center h-full">
                <div className="bg-white p-8 rounded shadow-md w-80">
                    {isPending && <div className="text-blue-500">Verifying Email...</div>}
                    {isSuccess && (
                        <div className="text-green-500">
                            <div>Email Verified</div>
                            <Link to="/" className="text-blue-500 underline mt-4 block">
                                Back to Home
                            </Link>
                        </div>
                    )}
                    {isError && 
                    <div>
                        <div className="text-red-500">Invalid Code</div>
                        <Link className="text-red-500 underline mt-4 block" to="/password/forgot" replace>
                        Get a new link
                      </Link>
                    </div>
                    
                    }
                </div>
            </div>
        </div>
    );
};

export default VerifiedEmail;
