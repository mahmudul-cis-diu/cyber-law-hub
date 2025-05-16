
import React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6),
  username: z.string().min(3, { message: "Username must be at least 3 characters" }).max(30),
  fullName: z.string().min(2, { message: "Full name is required" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp, loading } = useAuth();
  const [loadingProgress, setLoadingProgress] = React.useState(0);
  
  // Auto-increment progress during loading to provide visual feedback
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (loading) {
      // Start at 10% to show immediate feedback
      setLoadingProgress(10);
      
      interval = setInterval(() => {
        setLoadingProgress(prev => {
          // Slowly increase up to 95% (the last 5% will be when actually complete)
          if (prev < 95) {
            return prev + 5;
          }
          return prev;
        });
      }, 500);
    } else {
      // Complete the progress bar when loading is done
      setLoadingProgress(100);
      
      // Reset after animation completes
      const timeout = setTimeout(() => {
        setLoadingProgress(0);
      }, 500);
      
      return () => clearTimeout(timeout);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      fullName: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await signUp(values.email, values.password, values.username, values.fullName);
      toast.success("Account created successfully!");
      navigate('/');
    } catch (error: any) {
      console.error("Error during sign up:", error);
      // Error handling is already in signUp function
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 flex items-center justify-center py-12">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-cyberlaw-navy">Sign Up</h1>
            <p className="mt-2 text-gray-600">Create your Cyber Law System account</p>
          </div>
          
          {loadingProgress > 0 && (
            <div className="w-full">
              <Progress value={loadingProgress} className="h-1 w-full bg-gray-200" />
            </div>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
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
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-cyberlaw-navy hover:bg-cyberlaw-navy/90 mt-6"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/sign-in" className="font-medium text-cyberlaw-teal hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SignUp;
