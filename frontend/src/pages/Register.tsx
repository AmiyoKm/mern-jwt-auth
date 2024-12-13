import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { register } from "@/lib/api";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";

export const registerSchema = z.object({
    email : z.string().email("Please Enter a Valid Email").min(5, {message : "Too Short"}).max(255, {message : "Too Long"}),
    password : z.string().min(5, {message : "Too Short"}).max(255, {message : "Too Long"}),
    confirmPassword : z.string().min(5,{
        message : "Too Short"
    }).max(255,{
        message : "Too Long"
    })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
})
const Register = () => {
    const navigate = useNavigate()
    const form = useForm<z.infer<typeof registerSchema>>({
    resolver : zodResolver(registerSchema),
    defaultValues : {
        email : "",
        password : "",
        confirmPassword : ""
    }
   })

  const  {mutate , isError}=useMutation({
    mutationFn : register,
    onSuccess : ()=>
        
        navigate('/', {replace : true})
    ,
    
  });
  const onSubmit =(data : z.infer<typeof registerSchema> )=>{
    console.log(data)
    mutate(data)
    form.reset()
  }
  return (
    <div className="flex min-h-screen min-w-full items-center justify-center">
      <div className="flex grow flex-col justify-center items-center">

        <h1 className="text-3xl font-semibold mb-6">Create an account</h1>
        <div className="w-1/3 ">
            {
                isError && (
                    <div>
                          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                        <p className="font-bold">Error</p>
                        <p>Something went wrong</p>
                        <Link to="/login" className="underline block text-right text-sm mb-0 mt-0">Sign in</Link>
                    </div>
                    </div>
                )
            }
            <Form {...form}>
                <form className="space-y-6 border-4 rounded-xl p-6 " onSubmit={form.handleSubmit(onSubmit)} >
                    <FormField
                    control= {form.control}
                    name= 'email'
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="enter email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    name="password"
                    control={form.control}
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="enter password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField 
                    name="confirmPassword"
                    control={form.control}
                    render ={({field})=>(
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="confirm password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />

                    
                 <Button className="w-full" type="submit">Sign Up</Button>       
                </form>
            </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;
