import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, Navigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }).max(200),
  content: z.string().min(20, { message: "Content must be at least 20 characters" }),
  country: z.string().min(2, { message: "Country is required" }),
  category: z.string().min(2, { message: "Category is required" }),
});

// Complete list of countries in the world
const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", 
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", 
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", 
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", 
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", 
  "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "EU", "Fiji", "Finland", 
  "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", 
  "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", 
  "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", 
  "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", 
  "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", 
  "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", 
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", 
  "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", 
  "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", 
  "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", 
  "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", 
  "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", 
  "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "UK", "Ukraine", "United Arab Emirates", "US", "Uruguay", "Uzbekistan", 
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const categories = [
  "Privacy",
  "Cybercrime",
  "Data Protection",
  "Intellectual Property",
  "E-Commerce",
  "Cybersecurity",
  "Digital Identity",
  "Online Harassment",
  "AI & Automation Law",
  "Blockchain & Cryptocurrency",
  "Freedom of Expression",
  "Digital Contracts",
  "Internet Governance",
  "Cyberterrorism",
  "Digital Evidence",
  "Child Online Protection",
  "Online Defamation",
  "Computer Misuse",
  "Telecommunications Regulation",
  "Social Media Regulation",
  "Digital Rights Management (DRM)",
  "Cross-Border Data Transfers",
  "Cyberwarfare",
  "Platform Liability",
  "Biometric Data Law",
];


// Quill editor modules and formats
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['blockquote'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline',
  'list', 'bullet',
  'blockquote'
];

const SubmitLaw = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableCountries, setAvailableCountries] = useState(countries);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      country: "",
      category: "",
    },
  });

  // If not authenticated, redirect to sign in
  if (!loading && !user) {
    return <Navigate to="/sign-in" />;
  }

  // Fetch available countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        // This implementation keeps all hardcoded countries available
        // for law submission, even if they don't have approved laws yet
        setAvailableCountries(countries);
      } catch (error) {
        console.error("Error fetching countries:", error);
        toast({
          title: "Error",
          description: "Could not load countries. Using default list.",
          variant: "destructive",
        });
      }
    };

    fetchCountries();
  }, [toast]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to submit a law.",
          variant: "destructive",
        });
        return;
      }
      
      // Prevent multiple submissions
      if (isSubmitting) return;
      
      setIsSubmitting(true);
      toast({
        title: "Submitting law...",
        description: "Please wait while we process your submission.",
      });
      
      // Prepare the data - trim content to avoid excessive size
      const trimmedContent = values.content.trim();
      
      // Insert the law into the database
      const { data: lawData, error: lawError } = await supabase
        .from('laws')
        .insert({
          title: values.title.trim(),
          content: trimmedContent,
          country: values.country.toUpperCase(), // Ensure country code is uppercase
          category: values.category,
          author_id: user.id,
          is_approved: false,
        })
        .select();

      if (lawError) {
        console.error("Law submission error:", lawError);
        throw new Error(lawError.message || "Failed to submit law");
      }

      if (!lawData || lawData.length === 0) {
        throw new Error("No data returned from law submission");
      }

      // Get the law ID for notifications
      const lawId = lawData[0].id;
      
      try {
        // Get admin users to notify them about the new submission
        const { data: adminUsers, error: adminError } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'admin');

        if (adminError) {
          console.error("Error fetching admin users:", adminError);
          // Don't throw here, continue with submission success
        }

        // Create notifications for admin users if any found
        if (adminUsers && adminUsers.length > 0) {
          const notifications = adminUsers.map((admin) => ({
            recipient_id: admin.id,
            type: 'moderation',
            message: `New law submission: "${values.title}" needs review`,
            related_law_id: lawId,
            is_read: false
          }));

          const { error: notificationError } = await supabase
            .from('notifications')
            .insert(notifications);

          if (notificationError) {
            console.error("Notification creation error:", notificationError);
            // Don't throw here, continue with submission success
          }
        }
      } catch (notificationIssue) {
        console.error("Error in notification process:", notificationIssue);
        // Don't throw here, continue with submission success
      }

      toast({
        title: "Law submitted successfully!",
        description: "Your law has been submitted for review.",
      });

      // Reset form
      form.reset();
      
      // Navigate to laws page after successful submission
      navigate('/laws');
    } catch (error: any) {
      toast({
        title: "Error submitting law",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-bold text-cyberlaw-navy mb-8">Submit a New Cyber Law</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Law Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter the title of the law" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[300px]">
                            {countries.map((country) => (
                              <SelectItem key={country} value={country}>{country}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Law Content</FormLabel>
                      <FormControl>
                        <Controller
                          name="content"
                          control={form.control}
                          render={({ field }) => (
                            <div className="min-h-[200px] border border-input rounded-md">
                              <ReactQuill 
                                theme="snow" 
                                modules={modules}
                                formats={formats}
                                value={field.value} 
                                onChange={field.onChange}
                                className="h-[300px] mb-12"
                              />
                            </div>
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground mt-2">
                        Use the formatting toolbar to structure your law content effectively.
                      </p>
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-cyberlaw-navy hover:bg-cyberlaw-navy/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Law for Review"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SubmitLaw;
