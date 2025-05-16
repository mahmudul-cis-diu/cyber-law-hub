import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, Law, Comment, Rating, Like } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { ThumbsUp, Star, Calendar, User, MessageCircle } from 'lucide-react';

const LawDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  
  // Fetch law details
  const { data: law, isLoading: lawLoading } = useQuery({
    queryKey: ['law', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('laws')
        .select(`
          *,
          profiles:author_id (username, full_name, avatar_url)
        `)
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data as (Law & { profiles: { username: string, full_name: string, avatar_url: string } });
    },
    enabled: !!id
  });

  // Fetch comments
  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id (username, full_name, avatar_url)
        `)
        .eq('law_id', id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as (Comment & { profiles: { username: string, full_name: string, avatar_url: string } })[];
    },
    enabled: !!id
  });

  // Fetch ratings
  const { data: ratings } = useQuery({
    queryKey: ['ratings', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .eq('law_id', id);
        
      if (error) throw error;
      return data as Rating[];
    },
    enabled: !!id
  });

  // Fetch user's rating if logged in
  const { data: userRatingData } = useQuery({
    queryKey: ['user-rating', id, user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('ratings')
        .select('rating')
        .eq('law_id', id)
        .eq('user_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!id && !!user
  });

  // Fetch likes
  const { data: likes } = useQuery({
    queryKey: ['likes', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('likes')
        .select('*')
        .eq('law_id', id);
        
      if (error) throw error;
      return data as Like[];
    },
    enabled: !!id
  });

  // Check if user has liked this law
  const { data: userLike } = useQuery({
    queryKey: ['user-like', id, user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('likes')
        .select('*')
        .eq('law_id', id)
        .eq('user_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!id && !!user
  });

  // Set initial user rating
  useEffect(() => {
    if (userRatingData) {
      setUserRating(userRatingData.rating);
    }
  }, [userRatingData]);

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async () => {
      if (!user || !comment.trim()) return;
      
      const { data, error } = await supabase
        .from('comments')
        .insert({
          law_id: id,
          user_id: user.id,
          content: comment.trim()
        })
        .select();
        
      if (error) throw error;

      // Create notification for law author
      if (law?.author_id !== user.id) {
        await supabase
          .from('notifications')
          .insert({
            recipient_id: law?.author_id,
            type: 'comment',
            message: `${user.username} commented on your law: "${law?.title}"`,
            related_law_id: id
          });
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
      setComment('');
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error adding comment",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Rate law mutation
  const rateLawMutation = useMutation({
    mutationFn: async (rating: number) => {
      if (!user) return;
      
      // Check if user has already rated
      const { data: existingRating, error: checkError } = await supabase
        .from('ratings')
        .select('*')
        .eq('law_id', id)
        .eq('user_id', user.id)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') throw checkError;
      
      if (existingRating) {
        // Update existing rating
        const { error } = await supabase
          .from('ratings')
          .update({ rating })
          .eq('id', existingRating.id);
          
        if (error) throw error;
      } else {
        // Insert new rating
        const { error } = await supabase
          .from('ratings')
          .insert({
            law_id: id,
            user_id: user.id,
            rating
          });
          
        if (error) throw error;

        // Create notification for law author
        if (law?.author_id !== user.id) {
          await supabase
            .from('notifications')
            .insert({
              recipient_id: law?.author_id,
              type: 'update',
              message: `${user.username} rated your law: "${law?.title}"`,
              related_law_id: id
            });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratings', id] });
      queryClient.invalidateQueries({ queryKey: ['user-rating', id, user?.id] });
      toast({
        title: "Rating submitted",
        description: "Your rating has been recorded.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error submitting rating",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Like law mutation
  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      
      if (userLike) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('id', userLike.id);
          
        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert({
            law_id: id,
            user_id: user.id
          });
          
        if (error) throw error;

        // Create notification for law author
        if (law?.author_id !== user.id) {
          await supabase
            .from('notifications')
            .insert({
              recipient_id: law?.author_id,
              type: 'like',
              message: `${user.username} liked your law: "${law?.title}"`,
              related_law_id: id
            });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likes', id] });
      queryClient.invalidateQueries({ queryKey: ['user-like', id, user?.id] });
      toast({
        title: userLike ? "Unliked" : "Liked",
        description: userLike ? "You have unliked this law" : "You have liked this law",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Calculate average rating
  const averageRating = ratings && ratings.length > 0
    ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
    : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  // Star rating component
  const StarRating = ({ 
    value, 
    onChange, 
    interactive = false 
  }: { 
    value: number, 
    onChange?: (value: number) => void,
    interactive?: boolean
  }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onChange && onChange(star)}
            className={`${interactive ? 'cursor-pointer' : ''} p-1`}
            disabled={!interactive}
          >
            <Star 
              className={`h-5 w-5 ${
                star <= value 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-300'
              }`} 
            />
          </button>
        ))}
      </div>
    );
  };

  if (lawLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <Skeleton className="h-12 w-3/4 mb-8" />
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="space-y-6">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/3" />
                <div className="my-8">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!law) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-cyberlaw-navy mb-4">Law Not Found</h1>
            <p className="mb-8">The law you're looking for doesn't exist or has been removed.</p>
            <Link to="/laws">
              <Button>Back to Laws</Button>
            </Link>
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
          <div className="mb-8">
            <Link to="/laws" className="text-cyberlaw-teal hover:underline inline-flex items-center">
              ← Back to Laws
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-cyberlaw-navy mb-2">{law.title}</h1>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="bg-cyberlaw-navy text-white px-3 py-1 rounded-full text-sm">
                      {law.country}
                    </span>
                    <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                      {law.category}
                    </span>
                    {law.is_approved ? (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                        Approved
                      </span>
                    ) : (
                      <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm">
                        Pending Approval
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating value={averageRating} />
                    <span className="text-sm text-gray-600">
                      {ratings?.length || 0} {ratings?.length === 1 ? 'rating' : 'ratings'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className={`h-5 w-5 ${userLike ? 'fill-cyberlaw-teal text-cyberlaw-teal' : 'text-gray-400'}`} />
                      <span>{likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-5 w-5 text-gray-400" />
                      <span>{comments?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  {law.profiles?.avatar_url ? (
                    <img 
                      src={law.profiles.avatar_url} 
                      alt={law.profiles.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg text-gray-500">
                      {law.profiles?.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{law.profiles?.full_name || law.profiles?.username}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(law.created_at)}</span>
                    </div>
                    {law.updated_at !== law.created_at && (
                      <div className="flex items-center gap-1">
                        <span>Updated: {formatDate(law.updated_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content - Updated to properly render HTML */}
            <div className="p-8 prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: law.content }} />
            </div>
            
            {/* User actions */}
            {user && law.is_approved && (
              <div className="p-8 bg-gray-50 flex flex-wrap gap-8 items-center justify-between">
                <div className="flex flex-col">
                  <p className="text-sm font-medium mb-2">Rate this law:</p>
                  <StarRating 
                    value={userRating} 
                    onChange={(value) => {
                      setUserRating(value);
                      rateLawMutation.mutate(value);
                    }}
                    interactive={true}
                  />
                </div>
                
                <Button
                  variant={userLike ? "default" : "outline"}
                  onClick={() => toggleLikeMutation.mutate()}
                  className={userLike ? "bg-cyberlaw-teal hover:bg-cyberlaw-teal/80" : ""}
                >
                  <ThumbsUp className={`h-4 w-4 mr-2 ${userLike ? 'fill-white' : ''}`} />
                  {userLike ? 'Liked' : 'Like'}
                </Button>
              </div>
            )}
          </div>
          
          {/* Comments section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-cyberlaw-navy mb-6">Comments</h2>
            
            {user && law.is_approved ? (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-lg font-medium mb-4">Add a comment</h3>
                <Textarea
                  placeholder="Share your thoughts on this law..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mb-4"
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={() => addCommentMutation.mutate()}
                    disabled={!comment.trim() || addCommentMutation.isPending}
                    className="bg-cyberlaw-navy hover:bg-cyberlaw-navy/90"
                  >
                    Post Comment
                  </Button>
                </div>
              </div>
            ) : !law.is_approved ? (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8 text-amber-800">
                Comments are disabled until this law is approved by an administrator.
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                <p className="text-center">
                  <Link to="/sign-in" className="text-cyberlaw-teal hover:underline">
                    Sign in
                  </Link> to leave a comment
                </p>
              </div>
            )}
            
            {commentsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-start gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-grow">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-24 mb-4" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : comments && comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                        {comment.profiles?.avatar_url ? (
                          <img 
                            src={comment.profiles.avatar_url} 
                            alt={comment.profiles.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg text-gray-500">
                            {comment.profiles?.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">{comment.profiles?.full_name || comment.profiles?.username}</p>
                        <p className="text-sm text-gray-500 mb-2">{formatDate(comment.created_at)}</p>
                        <p className="text-gray-800">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-white rounded-lg shadow-md">
                <p className="text-gray-500">No comments yet</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LawDetail;
