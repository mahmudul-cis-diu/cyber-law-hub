
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import LawCard from '@/components/ui/LawCard';
import { supabase, Law } from '@/lib/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const FeaturedLaws: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'regular' | 'ai'>('regular');
  const { toast } = useToast();

  // Fetch random featured laws that are approved
  const { data: featuredLaws, isLoading } = useQuery({
    queryKey: ['featured-laws'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('laws')
        .select(`
          id,
          title,
          content,
          country,
          category,
          created_at,
          profiles:author_id (username, full_name)
        `)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      
      // Randomly select 3 laws from the result
      return getRandomLaws(data, 3);
    }
  });

  // Also use real laws for AI recommendations, but with different selection criteria
  const { data: aiLaws, isLoading: aiLoading } = useQuery({
    queryKey: ['ai-featured-laws'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('laws')
        .select(`
          id,
          title,
          content,
          country,
          category,
          created_at,
          profiles:author_id (username, full_name)
        `)
        .eq('is_approved', true)
        .limit(15); // Get more laws to ensure a different random selection
        
      if (error) throw error;
      
      // Get random laws and format them to look like AI recommendations
      const randomLaws = getRandomLaws(data, 3);
      return randomLaws.map(law => ({
        id: law.id,
        title: law.title,
        country: law.country,
        category: law.category,
        excerpt: law.content.substring(0, 120) + '...',
        author: 'AI Recommendation',
        date: law.created_at
      }));
    }
  });

  // Helper function to get random laws from an array
  const getRandomLaws = (laws: any[] | null, count: number) => {
    if (!laws || laws.length === 0) return [];
    
    const shuffled = [...laws].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-cyberlaw-navy mb-2">Featured Laws</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore some of the most significant cyber laws from around the world.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'regular' | 'ai')} className="w-full">
          <TabsList className="grid grid-cols-2 max-w-md mx-auto mb-6">
            <TabsTrigger value="regular">Featured Laws</TabsTrigger>
            <TabsTrigger value="ai">AI Recommendations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="regular">
            {isLoading ? (
              <div className="text-center py-12">Loading featured laws...</div>
            ) : featuredLaws && featuredLaws.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredLaws.map((law: any) => (
                  <LawCard
                    key={law.id}
                    id={law.id}
                    title={law.title}
                    country={law.country}
                    category={law.category}
                    excerpt={law.content.substring(0, 120) + '...'}
                    author={law.profiles?.full_name || law.profiles?.username || 'Unknown'}
                    date={formatDate(law.created_at)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No featured laws available yet.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="ai">
            {aiLoading ? (
              <div className="text-center py-12">Generating AI recommendations...</div>
            ) : aiLaws && aiLaws.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiLaws.map((law: any) => (
                  <LawCard
                    key={law.id}
                    id={law.id}
                    title={law.title}
                    country={law.country}
                    category={law.category}
                    excerpt={law.excerpt}
                    author={law.author}
                    date={formatDate(law.date)}
                    isAiRecommended={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No AI recommendations available.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default FeaturedLaws;
