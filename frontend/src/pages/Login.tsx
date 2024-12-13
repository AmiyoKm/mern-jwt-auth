
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/lib/api";
export const formSchema = z.object({
  email: z
    .string()
    .email("Please Enter a Valid Email")
    .min(5, { message: "Too Short" })
    .max(255, { message: "Too Long" }),
  password: z
    .string()
    .min(5, { message: "Too Short" })
    .max(255, { message: "Too Long" }),
});
const Login = () => {
  const location = useLocation()

    const navigate = useNavigate()

    const redirectUrl = location.state?.redirectUrl || '/'
   const {mutate , isError } = useMutation({
        mutationFn : login,
        onSuccess : ()=>{
            navigate(redirectUrl, {replace : true})
        }
    })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    mutate(data)
    form.reset();
  };
  return (
    <div>
      <div className="flex justify-center items-center min-h-[100vh]">
        <div className="mx-auto max-w-md py-12 px-6 ">
          <h1 className="text-3xl font-semibold mb-6">
            Sign into your account
          </h1>
            {
                isError && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                        <p className="font-bold">Error</p>
                        <p>Something went wrong</p>
                        <Link to="/sign-up" className="underline block text-right text-sm mb-0 mt-0">Sign up</Link>
                    </div>
                )
            }
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 border-2 rounded-xl p-8"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="enter email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="enter password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Link
                to={"/password/forgot"}
                className="underline block text-right text-sm mb-0 mt-0"
              >
                Forgot Password
              </Link>
              <Button
                disabled={form.formState.isSubmitting}
                className="w-full"
                type="submit"
              >
                Sign in
              </Button>
            </form>
            <div className="mt-6 text-center">
              <span className="text-sm">Don't have an account? </span>
              <Link to="/register" className="text-blue-500 ml-1">
                 Sign up
              </Link>
            </div>
          </Form>
          </div>
         
        </div>
      </div>
    
  );
};

export default Login;
