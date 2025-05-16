
// import React, { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { supabase } from '@/lib/supabase';
// import { useAuth } from '@/contexts/AuthContext';
// import { useToast } from '@/hooks/use-toast';
// import Navbar from '@/components/layout/Navbar';
// import Footer from '@/components/layout/Footer';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from '@/components/ui/alert-dialog';
// import { Button } from '@/components/ui/button';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Separator } from '@/components/ui/separator';
// import { Badge } from '@/components/ui/badge';
// import { 
//   User, Shield, AlertTriangle, CheckCircle, XCircle, Trash2, 
//   FileText, CalendarIcon, UsersIcon, BookIcon, ClipboardCheck
// } from 'lucide-react';
// import LawContentViewer from '@/components/admin/LawContentViewer';

// const AdminDashboard = () => {
//   const { user } = useAuth();
//   const { toast } = useToast();
//   const queryClient = useQueryClient();
//   const [activeTab, setActiveTab] = useState('pending');
//   const [selectedLawId, setSelectedLawId] = useState<string | null>(null);

//   // Check if user is admin
//   const { data: isAdmin, isLoading: isAdminLoading } = useQuery({
//     queryKey: ['isAdmin', user?.id],
//     queryFn: async () => {
//       if (!user) return false;
      
//       const { data, error } = await supabase
//         .from('profiles')
//         .select('is_admin')
//         .eq('id', user.id)
//         .single();
      
//       if (error) throw error;
//       return data.is_admin;
//     },
//     enabled: !!user,
//   });

//   // Fetch pending laws
//   const { data: pendingLaws, isLoading: pendingLoading } = useQuery({
//     queryKey: ['admin', 'laws', 'pending'],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from('laws')
//         .select(`
//           *,
//           profiles:author_id (username, full_name, avatar_url)
//         `)
//         .eq('is_approved', false)
//         .order('created_at', { ascending: false });
      
//       if (error) throw error;
//       return data;
//     },
//     enabled: !!isAdmin,
//   });

//   // Fetch all laws
//   const { data: allLaws, isLoading: allLawsLoading } = useQuery({
//     queryKey: ['admin', 'laws', 'all'],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from('laws')
//         .select(`
//           *,
//           profiles:author_id (username, full_name, avatar_url)
//         `)
//         .order('created_at', { ascending: false });
      
//       if (error) throw error;
//       return data;
//     },
//     enabled: !!isAdmin && activeTab === 'all',
//   });

//   // Fetch users
//   const { data: users, isLoading: usersLoading } = useQuery({
//     queryKey: ['admin', 'users'],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from('profiles')
//         .select('*')
//         .order('created_at', { ascending: false });
      
//       if (error) throw error;
//       return data;
//     },
//     enabled: !!isAdmin && activeTab === 'users',
//   });

//   // Approve law mutation
//   const approveLawMutation = useMutation({
//     mutationFn: async (lawId: string) => {
//       const { error } = await supabase
//         .from('laws')
//         .update({ is_approved: true })
//         .eq('id', lawId);
      
//       if (error) throw error;

//       // Get law details to create notification
//       const { data: law } = await supabase
//         .from('laws')
//         .select('author_id, title')
//         .eq('id', lawId)
//         .single();

//       if (law) {
//         // Create notification for law author
//         await supabase
//           .from('notifications')
//           .insert({
//             recipient_id: law.author_id,
//             type: 'approval',
//             message: `Your law "${law.title}" has been approved by an administrator.`,
//             related_law_id: lawId
//           });
//       }
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['admin', 'laws'] });
//       toast({
//         title: "Law approved",
//         description: "The law has been approved and is now public.",
//       });
//     },
//     onError: (error: any) => {
//       toast({
//         title: "Error approving law",
//         description: error.message,
//         variant: "destructive",
//       });
//     }
//   });

//   // Reject law mutation
//   const rejectLawMutation = useMutation({
//     mutationFn: async (lawId: string) => {
//       // Get law details to create notification before deleting
//       const { data: law } = await supabase
//         .from('laws')
//         .select('author_id, title')
//         .eq('id', lawId)
//         .single();

//       if (law) {
//         // Create rejection notification for law author
//         await supabase
//           .from('notifications')
//           .insert({
//             recipient_id: law.author_id,
//             type: 'rejection',
//             message: `Your law "${law.title}" was rejected by an administrator.`,
//           });
//       }

//       // Delete the law
//       const { error } = await supabase
//         .from('laws')
//         .delete()
//         .eq('id', lawId);
      
//       if (error) throw error;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['admin', 'laws'] });
//       toast({
//         title: "Law rejected",
//         description: "The law has been rejected and removed.",
//       });
//     },
//     onError: (error: any) => {
//       toast({
//         title: "Error rejecting law",
//         description: error.message,
//         variant: "destructive",
//       });
//     }
//   });

//   // Delete law mutation
//   const deleteLawMutation = useMutation({
//     mutationFn: async (lawId: string) => {
//       // Get law details to create notification before deleting
//       const { data: law } = await supabase
//         .from('laws')
//         .select('author_id, title')
//         .eq('id', lawId)
//         .single();

//       // Delete related data first to avoid foreign key constraints
//       // 1. Delete comments
//       await supabase.from('comments').delete().eq('law_id', lawId);
      
//       // 2. Delete ratings
//       await supabase.from('ratings').delete().eq('law_id', lawId);
      
//       // 3. Delete likes
//       await supabase.from('likes').delete().eq('law_id', lawId);
      
//       // 4. Delete notifications related to this law
//       await supabase.from('notifications').delete().eq('related_law_id', lawId);

//       // 5. Finally delete the law
//       const { error } = await supabase.from('laws').delete().eq('id', lawId);
      
//       if (error) throw error;

//       if (law) {
//         // Create deletion notification for law author
//         await supabase
//           .from('notifications')
//           .insert({
//             recipient_id: law.author_id,
//             type: 'deletion',
//             message: `Your law "${law.title}" was deleted by an administrator.`,
//           });
//       }
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['admin', 'laws'] });
//       setSelectedLawId(null);
//       toast({
//         title: "Law deleted",
//         description: "The law and all related data have been removed.",
//       });
//     },
//     onError: (error: any) => {
//       toast({
//         title: "Error deleting law",
//         description: error.message,
//         variant: "destructive",
//       });
//     }
//   });

//   // Toggle user admin status mutation
//   const toggleAdminMutation = useMutation({
//     mutationFn: async ({ userId, isAdmin }: { userId: string, isAdmin: boolean }) => {
//       const { error } = await supabase
//         .from('profiles')
//         .update({ is_admin: isAdmin })
//         .eq('id', userId);
      
//       if (error) throw error;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
//       toast({
//         title: "User updated",
//         description: "The user's admin status has been updated.",
//       });
//     },
//     onError: (error: any) => {
//       toast({
//         title: "Error updating user",
//         description: error.message,
//         variant: "destructive",
//       });
//     }
//   });

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat('en-US', { 
//       year: 'numeric', 
//       month: 'short', 
//       day: 'numeric' 
//     }).format(date);
//   };

//   if (!user || isAdminLoading) {
//     return (
//       <div className="min-h-screen flex flex-col">
//         <Navbar />
//         <main className="flex-grow bg-gray-50 py-12">
//           <div className="container mx-auto px-4">
//             <h1 className="text-2xl font-bold text-cyberlaw-navy mb-4">Loading...</h1>
//           </div>
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   if (!isAdmin) {
//     return (
//       <div className="min-h-screen flex flex-col">
//         <Navbar />
//         <main className="flex-grow bg-gray-50 py-12">
//           <div className="container mx-auto px-4">
//             <div className="bg-white rounded-lg shadow-md p-8 text-center">
//               <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
//               <h1 className="text-2xl font-bold text-cyberlaw-navy mb-4">Access Denied</h1>
//               <p className="mb-8">You don't have permission to access the admin dashboard.</p>
//               <Button 
//                 onClick={() => window.location.href = '/'}
//                 className="bg-cyberlaw-navy hover:bg-cyberlaw-navy/90"
//               >
//                 Back to Home
//               </Button>
//             </div>
//           </div>
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />
//       <main className="flex-grow bg-gray-50 py-12">
//         <div className="container mx-auto px-4">
//           <div className="flex items-center justify-between mb-8">
//             <div>
//               <h1 className="text-3xl font-bold text-cyberlaw-navy">Admin Dashboard</h1>
//               <p className="text-gray-600">Manage laws, users, and other system settings.</p>
//             </div>
//             <div className="flex items-center gap-2 bg-cyberlaw-navy/10 px-4 py-2 rounded-md">
//               <Shield className="h-5 w-5 text-cyberlaw-navy" />
//               <span className="text-sm font-medium">Admin Mode</span>
//             </div>
//           </div>

//           <Tabs 
//             defaultValue="pending" 
//             value={activeTab}
//             onValueChange={(value) => {
//               setActiveTab(value);
//               setSelectedLawId(null);
//             }}
//             className="space-y-4"
//           >
//             <TabsList className="grid grid-cols-3 md:grid-cols-3 lg:w-[400px]">
//               <TabsTrigger value="pending" className="relative">
//                 Pending Laws
//                 {pendingLaws && pendingLaws.length > 0 && (
//                   <Badge variant="destructive" className="ml-2 absolute -top-1 -right-1 text-xs">
//                     {pendingLaws.length}
//                   </Badge>
//                 )}
//               </TabsTrigger>
//               <TabsTrigger value="all">All Laws</TabsTrigger>
//               <TabsTrigger value="users">Users</TabsTrigger>
//             </TabsList>

//             {/* Pending Laws Tab */}
//             <TabsContent value="pending" className="space-y-4">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <ClipboardCheck className="h-5 w-5" />
//                     Laws Pending Approval
//                   </CardTitle>
//                   <CardDescription>
//                     Review and approve or reject submitted laws.
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   {pendingLoading ? (
//                     <div className="text-center py-4">Loading pending laws...</div>
//                   ) : pendingLaws && pendingLaws.length > 0 ? (
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                       {selectedLawId ? (
//                         <div className="lg:col-span-1">
//                           <ScrollArea className="h-[60vh] pr-4">
//                             {pendingLaws.map((law) => (
//                               <div
//                                 key={law.id}
//                                 onClick={() => setSelectedLawId(law.id)}
//                                 className={`mb-4 p-4 border rounded-md cursor-pointer transition-colors ${
//                                   selectedLawId === law.id
//                                     ? 'border-cyberlaw-teal bg-cyberlaw-teal/5'
//                                     : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
//                                 }`}
//                               >
//                                 <h3 className="font-medium text-lg mb-1">{law.title}</h3>
//                                 <div className="flex items-center text-sm text-gray-500 mb-2">
//                                   <CalendarIcon className="h-3 w-3 mr-1" />
//                                   <span>{formatDate(law.created_at)}</span>
//                                   <span className="mx-2">•</span>
//                                   <User className="h-3 w-3 mr-1" />
//                                   <span>{law.profiles?.username}</span>
//                                 </div>
//                                 <div className="flex gap-2">
//                                   <Badge variant="outline" className="bg-gray-100">
//                                     {law.country}
//                                   </Badge>
//                                   <Badge variant="outline" className="bg-gray-100">
//                                     {law.category}
//                                   </Badge>
//                                 </div>
//                               </div>
//                             ))}
//                           </ScrollArea>
//                         </div>
//                       ) : (
//                         <div className="lg:col-span-1">
//                           <div className="space-y-4">
//                             {pendingLaws.slice(0, 5).map((law) => (
//                               <div
//                                 key={law.id}
//                                 onClick={() => setSelectedLawId(law.id)}
//                                 className="p-4 border border-gray-200 rounded-md cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-colors"
//                               >
//                                 <h3 className="font-medium text-lg mb-1">{law.title}</h3>
//                                 <div className="flex items-center text-sm text-gray-500 mb-2">
//                                   <CalendarIcon className="h-3 w-3 mr-1" />
//                                   <span>{formatDate(law.created_at)}</span>
//                                   <span className="mx-2">•</span>
//                                   <User className="h-3 w-3 mr-1" />
//                                   <span>{law.profiles?.username}</span>
//                                 </div>
//                                 <div className="flex gap-2">
//                                   <Badge variant="outline" className="bg-gray-100">
//                                     {law.country}
//                                   </Badge>
//                                   <Badge variant="outline" className="bg-gray-100">
//                                     {law.category}
//                                   </Badge>
//                                 </div>
//                               </div>
//                             ))}
//                             {pendingLaws.length > 5 && (
//                               <p className="text-sm text-center text-gray-500">
//                                 {pendingLaws.length - 5} more pending laws...
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                       )}

//                       {selectedLawId && (
//                         <div className="lg:col-span-1">
//                           {pendingLaws.filter((law) => law.id === selectedLawId).map((law) => (
//                             <div key={law.id} className="space-y-4">
//                               <div className="bg-white p-4 border rounded-md">
//                                 <h2 className="text-xl font-bold mb-2">{law.title}</h2>
//                                 <div className="flex flex-wrap gap-2 mb-4">
//                                   <Badge>{law.country}</Badge>
//                                   <Badge variant="outline">{law.category}</Badge>
//                                 </div>

//                                 <div className="flex items-center gap-2 mb-4">
//                                   <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
//                                     {law.profiles?.avatar_url ? (
//                                       <img
//                                         src={law.profiles.avatar_url}
//                                         alt={law.profiles.username}
//                                         className="w-full h-full object-cover"
//                                       />
//                                     ) : (
//                                       <div className="w-full h-full flex items-center justify-center text-gray-500">
//                                         {law.profiles?.username.charAt(0).toUpperCase()}
//                                       </div>
//                                     )}
//                                   </div>
//                                   <div>
//                                     <p className="text-sm font-medium">
//                                       {law.profiles?.full_name || law.profiles?.username}
//                                     </p>
//                                     <p className="text-xs text-gray-500">
//                                       {formatDate(law.created_at)}
//                                     </p>
//                                   </div>
//                                 </div>

//                                 <LawContentViewer content={law.content} maxHeight="400px" />

//                                 <div className="flex flex-col sm:flex-row gap-2 mt-6">
//                                   <Button
//                                     onClick={() => approveLawMutation.mutate(law.id)}
//                                     className="flex-1 bg-green-600 hover:bg-green-700"
//                                     disabled={approveLawMutation.isPending}
//                                   >
//                                     <CheckCircle className="h-4 w-4 mr-2" />
//                                     Approve Law
//                                   </Button>
//                                   <AlertDialog>
//                                     <AlertDialogTrigger asChild>
//                                       <Button
//                                         variant="destructive"
//                                         className="flex-1"
//                                         disabled={rejectLawMutation.isPending}
//                                       >
//                                         <XCircle className="h-4 w-4 mr-2" />
//                                         Reject Law
//                                       </Button>
//                                     </AlertDialogTrigger>
//                                     <AlertDialogContent>
//                                       <AlertDialogHeader>
//                                         <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                                         <AlertDialogDescription>
//                                           This will reject and delete the law. The author will be
//                                           notified of the rejection. This action cannot be undone.
//                                         </AlertDialogDescription>
//                                       </AlertDialogHeader>
//                                       <AlertDialogFooter>
//                                         <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                         <AlertDialogAction
//                                           onClick={() => rejectLawMutation.mutate(law.id)}
//                                           className="bg-red-600 hover:bg-red-700"
//                                         >
//                                           Yes, Reject Law
//                                         </AlertDialogAction>
//                                       </AlertDialogFooter>
//                                     </AlertDialogContent>
//                                   </AlertDialog>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <div className="text-center py-8">
//                       <BookIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//                       <p className="text-gray-500">No laws pending approval</p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             {/* All Laws Tab */}
//             <TabsContent value="all" className="space-y-4">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <FileText className="h-5 w-5" />
//                     All Laws
//                   </CardTitle>
//                   <CardDescription>
//                     View, manage, and delete any laws in the system.
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   {allLawsLoading ? (
//                     <div className="text-center py-4">Loading laws...</div>
//                   ) : allLaws && allLaws.length > 0 ? (
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                       <div className="lg:col-span-1">
//                         <ScrollArea className="h-[60vh] pr-4">
//                           {allLaws.map((law) => (
//                             <div
//                               key={law.id}
//                               onClick={() => setSelectedLawId(law.id)}
//                               className={`mb-4 p-4 border rounded-md cursor-pointer transition-colors ${
//                                 selectedLawId === law.id
//                                   ? 'border-cyberlaw-teal bg-cyberlaw-teal/5'
//                                   : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
//                               }`}
//                             >
//                               <div className="flex justify-between items-start mb-2">
//                                 <h3 className="font-medium text-lg">{law.title}</h3>
//                                 {law.is_approved ? (
//                                   <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
//                                     Approved
//                                   </Badge>
//                                 ) : (
//                                   <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
//                                     Pending
//                                   </Badge>
//                                 )}
//                               </div>
//                               <div className="flex items-center text-sm text-gray-500 mb-2">
//                                 <CalendarIcon className="h-3 w-3 mr-1" />
//                                 <span>{formatDate(law.created_at)}</span>
//                                 <span className="mx-2">•</span>
//                                 <User className="h-3 w-3 mr-1" />
//                                 <span>{law.profiles?.username}</span>
//                               </div>
//                               <div className="flex gap-2">
//                                 <Badge variant="outline" className="bg-gray-100">
//                                   {law.country}
//                                 </Badge>
//                                 <Badge variant="outline" className="bg-gray-100">
//                                   {law.category}
//                                 </Badge>
//                               </div>
//                             </div>
//                           ))}
//                         </ScrollArea>
//                       </div>

//                       {selectedLawId && (
//                         <div className="lg:col-span-1">
//                           {allLaws.filter((law) => law.id === selectedLawId).map((law) => (
//                             <div key={law.id} className="space-y-4">
//                               <div className="bg-white p-4 border rounded-md">
//                                 <div className="flex justify-between items-start">
//                                   <h2 className="text-xl font-bold mb-2">{law.title}</h2>
//                                   {law.is_approved ? (
//                                     <Badge className="bg-green-100 text-green-800 border-0">
//                                       Approved
//                                     </Badge>
//                                   ) : (
//                                     <Badge variant="outline" className="bg-amber-50 text-amber-600">
//                                       Pending Approval
//                                     </Badge>
//                                   )}
//                                 </div>

//                                 <div className="flex flex-wrap gap-2 mb-4">
//                                   <Badge>{law.country}</Badge>
//                                   <Badge variant="outline">{law.category}</Badge>
//                                 </div>

//                                 <div className="flex items-center gap-2 mb-4">
//                                   <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
//                                     {law.profiles?.avatar_url ? (
//                                       <img
//                                         src={law.profiles.avatar_url}
//                                         alt={law.profiles.username}
//                                         className="w-full h-full object-cover"
//                                       />
//                                     ) : (
//                                       <div className="w-full h-full flex items-center justify-center text-gray-500">
//                                         {law.profiles?.username.charAt(0).toUpperCase()}
//                                       </div>
//                                     )}
//                                   </div>
//                                   <div>
//                                     <p className="text-sm font-medium">
//                                       {law.profiles?.full_name || law.profiles?.username}
//                                     </p>
//                                     <p className="text-xs text-gray-500">
//                                       {formatDate(law.created_at)}
//                                     </p>
//                                   </div>
//                                 </div>

//                                 <LawContentViewer content={law.content} maxHeight="400px" />

//                                 <div className="flex flex-col sm:flex-row gap-2 mt-6">
//                                   <Button
//                                     onClick={() => window.open(`/laws/${law.id}`, '_blank')}
//                                     variant="outline"
//                                     className="flex-1"
//                                   >
//                                     <FileText className="h-4 w-4 mr-2" />
//                                     View Law
//                                   </Button>
                                  
//                                   {!law.is_approved && (
//                                     <Button
//                                       onClick={() => approveLawMutation.mutate(law.id)}
//                                       className="flex-1 bg-green-600 hover:bg-green-700"
//                                       disabled={approveLawMutation.isPending}
//                                     >
//                                       <CheckCircle className="h-4 w-4 mr-2" />
//                                       Approve
//                                     </Button>
//                                   )}

//                                   <AlertDialog>
//                                     <AlertDialogTrigger asChild>
//                                       <Button
//                                         variant="destructive"
//                                         className="flex-1"
//                                       >
//                                         <Trash2 className="h-4 w-4 mr-2" />
//                                         Delete Law
//                                       </Button>
//                                     </AlertDialogTrigger>
//                                     <AlertDialogContent>
//                                       <AlertDialogHeader>
//                                         <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                                         <AlertDialogDescription>
//                                           This will permanently delete the law and all related data (comments, ratings, likes).
//                                           The author will be notified of the deletion. This action cannot be undone.
//                                         </AlertDialogDescription>
//                                       </AlertDialogHeader>
//                                       <AlertDialogFooter>
//                                         <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                         <AlertDialogAction
//                                           onClick={() => deleteLawMutation.mutate(law.id)}
//                                           className="bg-red-600 hover:bg-red-700"
//                                         >
//                                           Yes, Delete Law
//                                         </AlertDialogAction>
//                                       </AlertDialogFooter>
//                                     </AlertDialogContent>
//                                   </AlertDialog>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <div className="text-center py-8">
//                       <BookIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//                       <p className="text-gray-500">No laws in the system</p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             {/* Users Tab */}
//             <TabsContent value="users" className="space-y-4">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <UsersIcon className="h-5 w-5" />
//                     User Management
//                   </CardTitle>
//                   <CardDescription>
//                     Manage users and their permissions.
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   {usersLoading ? (
//                     <div className="text-center py-4">Loading users...</div>
//                   ) : users && users.length > 0 ? (
//                     <div className="overflow-x-auto">
//                       <table className="w-full">
//                         <thead>
//                           <tr className="border-b">
//                             <th className="text-left py-3 px-4">User</th>
//                             <th className="text-left py-3 px-4">Email</th>
//                             <th className="text-left py-3 px-4">Joined</th>
//                             <th className="text-left py-3 px-4">Role</th>
//                             <th className="text-right py-3 px-4">Actions</th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y">
//                           {users.map((userItem) => (
//                             <tr key={userItem.id} className="hover:bg-gray-50">
//                               <td className="py-3 px-4">
//                                 <div className="flex items-center gap-3">
//                                   <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
//                                     {userItem.avatar_url ? (
//                                       <img
//                                         src={userItem.avatar_url}
//                                         alt={userItem.username}
//                                         className="w-full h-full object-cover"
//                                       />
//                                     ) : (
//                                       <div className="w-full h-full flex items-center justify-center text-gray-500">
//                                         {userItem.username.charAt(0).toUpperCase()}
//                                       </div>
//                                     )}
//                                   </div>
//                                   <div>
//                                     <p className="font-medium">{userItem.full_name || userItem.username}</p>
//                                     <p className="text-xs text-gray-500">@{userItem.username}</p>
//                                   </div>
//                                 </div>
//                               </td>
//                               <td className="py-3 px-4">
//                                 <span className="text-sm">{userItem.email}</span>
//                               </td>
//                               <td className="py-3 px-4">
//                                 <span className="text-sm">{formatDate(userItem.created_at)}</span>
//                               </td>
//                               <td className="py-3 px-4">
//                                 {userItem.is_admin ? (
//                                   <Badge className="bg-purple-100 text-purple-800 border-0">
//                                     Admin
//                                   </Badge>
//                                 ) : (
//                                   <Badge variant="outline" className="bg-blue-50 text-blue-700">
//                                     User
//                                   </Badge>
//                                 )}
//                               </td>
//                               <td className="py-3 px-4 text-right">
//                                 {user.id !== userItem.id && (
//                                   <Button
//                                     variant={userItem.is_admin ? "destructive" : "outline"}
//                                     size="sm"
//                                     onClick={() => toggleAdminMutation.mutate({
//                                       userId: userItem.id,
//                                       isAdmin: !userItem.is_admin
//                                     })}
//                                     disabled={toggleAdminMutation.isPending}
//                                   >
//                                     {userItem.is_admin ? "Remove Admin" : "Make Admin"}
//                                   </Button>
//                                 )}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : (
//                     <div className="text-center py-8">
//                       <UsersIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//                       <p className="text-gray-500">No users found</p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default AdminDashboard;



import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Navigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Trash2, UserPlus, UserMinus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('pending-laws');
  const [lawToDelete, setLawToDelete] = useState<string | null>(null);

  // Check if user has admin role before rendering admin content
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center py-16">Loading...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    toast({
      title: "Access Denied",
      description: "You must be an admin to access this page.",
      variant: "destructive"
    });
    return <Navigate to="/" />;
  }

  const { data: pendingLaws, isLoading: pendingLoading } = useQuery({
    queryKey: ['admin', 'pending-laws'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('laws')
        .select(`
          *,
          profiles:author_id (username, full_name)
        `)
        .eq('is_approved', false)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: !!user && user.role === 'admin'
  });

  const { data: allLaws, isLoading: allLawsLoading } = useQuery({
    queryKey: ['admin', 'all-laws'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('laws')
        .select(`
          *,
          profiles:author_id (username, full_name)
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: activeTab === 'all-laws' && !!user && user.role === 'admin'
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: activeTab === 'users' && !!user && user.role === 'admin'
  });

  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ['admin', 'comments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id (username, full_name),
          laws:law_id (title)
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: activeTab === 'comments' && !!user && user.role === 'admin'
  });

  const approveLawMutation = useMutation({
    mutationFn: async (lawId: string) => {
      const { error } = await supabase
        .from('laws')
        .update({ is_approved: true })
        .eq('id', lawId);
        
      if (error) throw error;
      
      const { data: law } = await supabase
        .from('laws')
        .select('title, author_id')
        .eq('id', lawId)
        .single();
      
      if (law) {
        await supabase
          .from('notifications')
          .insert({
            recipient_id: law.author_id,
            type: 'moderation',
            message: `Your law "${law.title}" has been approved.`,
            related_law_id: lawId
          });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pending-laws'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'all-laws'] });
      toast({
        title: "Law approved",
        description: "The law has been approved and is now public.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error approving law",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const rejectLawMutation = useMutation({
    mutationFn: async (lawId: string) => {
      try {
        // First, check if there are any notifications referencing this law
        const { data: notifications } = await supabase
          .from('notifications')
          .select('id')
          .eq('related_law_id', lawId);
        
        // If notifications exist, delete them first to avoid foreign key constraint errors
        if (notifications && notifications.length > 0) {
          await supabase
            .from('notifications')
            .delete()
            .eq('related_law_id', lawId);
        }
        
        // Get law details before deleting
        const { data: law } = await supabase
          .from('laws')
          .select('title, author_id')
          .eq('id', lawId)
          .single();
        
        // Now delete the law
        const { error } = await supabase
          .from('laws')
          .delete()
          .eq('id', lawId);
          
        if (error) throw error;
        
        // Create rejection notification with null related_law_id
        if (law) {
          await supabase
            .from('notifications')
            .insert({
              recipient_id: law.author_id,
              type: 'moderation',
              message: `Your law "${law.title}" has been rejected.`,
              related_law_id: null
            });
        }
      } catch (error: any) {
        console.error('Error in reject law mutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pending-laws'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'all-laws'] });
      toast({
        title: "Law rejected",
        description: "The law has been rejected and removed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error rejecting law",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const deleteLawMutation = useMutation({
    mutationFn: async (lawId: string) => {
      try {
        // First, check if there are any notifications referencing this law
        const { data: notifications } = await supabase
          .from('notifications')
          .select('id')
          .eq('related_law_id', lawId);
        
        // If notifications exist, delete them first to avoid foreign key constraint errors
        if (notifications && notifications.length > 0) {
          await supabase
            .from('notifications')
            .delete()
            .eq('related_law_id', lawId);
        }

        // Check if there are any comments referencing this law
        const { data: lawComments } = await supabase
          .from('comments')
          .select('id')
          .eq('law_id', lawId);
        
        // If comments exist, delete them first to avoid foreign key constraint errors
        if (lawComments && lawComments.length > 0) {
          await supabase
            .from('comments')
            .delete()
            .eq('law_id', lawId);
        }

        // Check if there are any ratings referencing this law
        const { data: lawRatings } = await supabase
          .from('ratings')
          .select('id')
          .eq('law_id', lawId);
        
        // If ratings exist, delete them first
        if (lawRatings && lawRatings.length > 0) {
          await supabase
            .from('ratings')
            .delete()
            .eq('law_id', lawId);
        }

        // Check if there are any likes referencing this law
        const { data: lawLikes } = await supabase
          .from('likes')
          .select('id')
          .eq('law_id', lawId);
        
        // If likes exist, delete them first
        if (lawLikes && lawLikes.length > 0) {
          await supabase
            .from('likes')
            .delete()
            .eq('law_id', lawId);
        }
        
        // Get law details before deleting
        const { data: law } = await supabase
          .from('laws')
          .select('title, author_id')
          .eq('id', lawId)
          .single();
        
        // Finally delete the law
        const { error } = await supabase
          .from('laws')
          .delete()
          .eq('id', lawId);
          
        if (error) throw error;
        
        // Create deletion notification for the author
        if (law) {
          await supabase
            .from('notifications')
            .insert({
              recipient_id: law.author_id,
              type: 'moderation',
              message: `Your law "${law.title}" has been deleted by an administrator.`,
              related_law_id: null
            });
        }
      } catch (error: any) {
        console.error('Error in delete law mutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      setLawToDelete(null);
      queryClient.invalidateQueries({ queryKey: ['admin', 'all-laws'] });
      toast({
        title: "Law deleted",
        description: "The law has been permanently deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting law",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'comments'] });
      toast({
        title: "Comment deleted",
        description: "The comment has been removed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting comment",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const changeRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string, role: 'user' | 'admin' }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast({
        title: "Role updated",
        description: "The user's role has been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating role",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center py-16">Loading...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-cyberlaw-navy mb-8">Admin Dashboard</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="pending-laws">Pending Laws</TabsTrigger>
              <TabsTrigger value="all-laws">All Laws</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending-laws">
              <h2 className="text-xl font-medium mb-6">Laws Pending Approval</h2>
              {pendingLoading ? (
                <div className="text-center py-8">Loading laws...</div>
              ) : pendingLaws && pendingLaws.length > 0 ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {pendingLaws.map((law: any) => (
                          <tr key={law.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link to={`/laws/${law.id}`} className="text-cyberlaw-navy hover:text-cyberlaw-teal">
                                {law.title}
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {law.profiles?.full_name || law.profiles?.username}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {formatDate(law.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                                {law.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => approveLawMutation.mutate(law.id)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" /> Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => rejectLawMutation.mutate(law.id)}
                                >
                                  <XCircle className="h-4 w-4 mr-1" /> Reject
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center bg-white py-12 rounded-lg shadow">
                  <p className="text-gray-500">No pending laws found</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="all-laws">
              <h2 className="text-xl font-medium mb-6">All Laws</h2>
              {allLawsLoading ? (
                <div className="text-center py-8">Loading laws...</div>
              ) : allLaws && allLaws.length > 0 ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allLaws.map((law: any) => (
                        <TableRow key={law.id}>
                          <TableCell className="font-medium">
                            <Link to={`/laws/${law.id}`} className="text-cyberlaw-navy hover:text-cyberlaw-teal">
                              {law.title}
                            </Link>
                          </TableCell>
                          <TableCell>{law.profiles?.full_name || law.profiles?.username}</TableCell>
                          <TableCell>{law.country}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                              {law.category}
                            </span>
                          </TableCell>
                          <TableCell>
                            {law.is_approved ? (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                Approved
                              </span>
                            ) : (
                              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                Pending
                              </span>
                            )}
                          </TableCell>
                          <TableCell>{formatDate(law.created_at)}</TableCell>
                          <TableCell>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  className="flex items-center"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the law
                                    "{law.title}" and remove all associated data including comments,
                                    ratings, and likes.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => deleteLawMutation.mutate(law.id)}
                                    className="bg-red-600 hover:bg-red-700">
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center bg-white py-12 rounded-lg shadow">
                  <p className="text-gray-500">No laws found</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="users">
              <h2 className="text-xl font-medium mb-6">User Management</h2>
              {usersLoading ? (
                <div className="text-center py-8">Loading users...</div>
              ) : users && users.length > 0 ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((u: any) => (
                          <tr key={u.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 overflow-hidden">
                                  {u.avatar_url ? (
                                    <img src={u.avatar_url} alt={u.username} className="h-full w-full object-cover" />
                                  ) : (
                                    <span className="text-gray-500 font-medium">{u.username.charAt(0).toUpperCase()}</span>
                                  )}
                                </div>
                                <span>{u.full_name || 'N/A'}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{u.username}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                u.role === 'admin' ? 'bg-cyberlaw-teal text-white' : 'bg-gray-100'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {formatDate(u.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {user.id !== u.id && (
                                <Button 
                                  size="sm"
                                  variant="outline" 
                                  onClick={() => changeRoleMutation.mutate({ 
                                    userId: u.id, 
                                    role: u.role === 'admin' ? 'user' : 'admin'
                                  })}
                                  className={u.role === 'admin' ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'}
                                >
                                  {u.role === 'admin' ? (
                                    <>
                                      <UserMinus className="h-4 w-4 mr-1" />
                                      Remove Admin
                                    </>
                                  ) : (
                                    <>
                                      <UserPlus className="h-4 w-4 mr-1" />
                                      Make Admin
                                    </>
                                  )}
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center bg-white py-12 rounded-lg shadow">
                  <p className="text-gray-500">No users found</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="comments">
              <h2 className="text-xl font-medium mb-6">Comment Moderation</h2>
              {commentsLoading ? (
                <div className="text-center py-8">Loading comments...</div>
              ) : comments && comments.length > 0 ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Law</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {comments.map((comment: any) => (
                          <tr key={comment.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {comment.profiles?.username}
                            </td>
                            <td className="px-6 py-4">
                              <div className="max-w-md truncate">{comment.content}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link to={`/laws/${comment.law_id}`} className="text-cyberlaw-teal hover:underline">
                                {comment.laws?.title}
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {formatDate(comment.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => deleteCommentMutation.mutate(comment.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" /> Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center bg-white py-12 rounded-lg shadow">
                  <p className="text-gray-500">No comments found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
