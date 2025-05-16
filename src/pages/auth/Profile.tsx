
import React, { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }).max(30),
  full_name: z.string().min(2, { message: "Full name is required" }),
  bio: z.string().max(300, { message: "Bio cannot exceed 300 characters" }).optional(),
  avatar_url: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
});

const Profile = () => {
  const { user, loading, updateProfile, signOut } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      full_name: '',
      bio: '',
      avatar_url: '',
    },
  });

  // Update form values when user data is loaded
  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username || '',
        full_name: user.full_name || '',
        bio: user.bio || '',
        avatar_url: user.avatar_url || '',
      });
    }
  }, [user, form]);

  // If not authenticated, redirect to sign in
  if (!loading && !user) {
    return <Navigate to="/sign-in" />;
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await updateProfile(values);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-bold text-cyberlaw-navy mb-8">Your Profile</h1>
          
          {loading ? (
            <div className="text-center py-12">Loading profile...</div>
          ) : user ? (
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                  {user.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold">{user.full_name}</h2>
                  <p className="text-gray-600">@{user.username}</p>
                  <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm bg-cyberlaw-teal text-white">
                    {user.role}
                  </div>
                </div>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Tell us about yourself" 
                            className="h-32"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="avatar_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Avatar URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://example.com/avatar.png" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-between">
                    <Button 
                      type="submit" 
                      className="bg-cyberlaw-navy hover:bg-cyberlaw-navy/90"
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Save Changes"}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-50"
                      onClick={() => signOut()}
                      disabled={loading}
                    >
                      {loading ? "Signing out..." : "Sign Out"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          ) : null}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
