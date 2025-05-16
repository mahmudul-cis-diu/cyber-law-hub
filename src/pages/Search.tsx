
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LawCard from '@/components/ui/LawCard';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('laws');
  
  // Parse initial search query from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
      setSearchQuery(q);
    }
  }, [location.search]);

  // Laws search
  const { data: lawResults, isLoading: lawsLoading } = useQuery({
    queryKey: ['search', 'laws', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      
      const { data, error } = await supabase
        .from('laws')
        .select(`
          *,
          profiles:author_id (username, full_name)
        `)
        .eq('is_approved', true)
        .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: !!searchQuery.trim()
  });

  // Countries search (matching laws by country)
  const { data: countryResults, isLoading: countriesLoading } = useQuery({
    queryKey: ['search', 'countries', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      
      const { data, error } = await supabase
        .from('laws')
        .select(`
          *,
          profiles:author_id (username, full_name)
        `)
        .eq('is_approved', true)
        .ilike('country', `%${searchQuery}%`)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: !!searchQuery.trim() && activeTab === 'countries'
  });

  // Categories search (matching laws by category)
  const { data: categoryResults, isLoading: categoriesLoading } = useQuery({
    queryKey: ['search', 'categories', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      
      const { data, error } = await supabase
        .from('laws')
        .select(`
          *,
          profiles:author_id (username, full_name)
        `)
        .eq('is_approved', true)
        .ilike('category', `%${searchQuery}%`)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: !!searchQuery.trim() && activeTab === 'categories'
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search query
    const url = new URL(window.location.href);
    url.searchParams.set('q', searchQuery);
    window.history.pushState({}, '', url);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-cyberlaw-navy mb-8">Search</h1>
          
          <div className="bg-white p-6 rounded-lg shadow-md mb-10">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="relative flex-grow">
                <Input
                  placeholder="Search laws, countries, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 text-lg py-6"
                />
                <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
              <Button 
                type="submit" 
                className="bg-cyberlaw-navy hover:bg-cyberlaw-navy/90"
              >
                Search
              </Button>
            </form>
          </div>
          
          {searchQuery.trim() && (
            <>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                <TabsList>
                  <TabsTrigger value="laws">
                    Laws {lawResults?.length ? `(${lawResults.length})` : ''}
                  </TabsTrigger>
                  <TabsTrigger value="countries">
                    Countries {countryResults?.length ? `(${countryResults.length})` : ''}
                  </TabsTrigger>
                  <TabsTrigger value="categories">
                    Categories {categoryResults?.length ? `(${categoryResults.length})` : ''}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="laws" className="mt-6">
                  {lawsLoading ? (
                    <div className="text-center py-8">Searching laws...</div>
                  ) : lawResults && lawResults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {lawResults.map((law) => (
                        <LawCard
                          key={law.id}
                          id={law.id}
                          title={law.title}
                          country={law.country}
                          category={law.category}
                          excerpt={law.content.substring(0, 150) + (law.content.length > 150 ? '...' : '')}
                          author={law.profiles?.full_name || law.profiles?.username}
                          date={new Date(law.created_at).toISOString().split('T')[0]}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-white rounded-lg shadow">
                      <p className="text-gray-600">No laws found matching "{searchQuery}"</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="countries" className="mt-6">
                  {countriesLoading ? (
                    <div className="text-center py-8">Searching countries...</div>
                  ) : countryResults && countryResults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {countryResults.map((law) => (
                        <LawCard
                          key={law.id}
                          id={law.id}
                          title={law.title}
                          country={law.country}
                          category={law.category}
                          excerpt={law.content.substring(0, 150) + (law.content.length > 150 ? '...' : '')}
                          author={law.profiles?.full_name || law.profiles?.username}
                          date={new Date(law.created_at).toISOString().split('T')[0]}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-white rounded-lg shadow">
                      <p className="text-gray-600">No countries found matching "{searchQuery}"</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="categories" className="mt-6">
                  {categoriesLoading ? (
                    <div className="text-center py-8">Searching categories...</div>
                  ) : categoryResults && categoryResults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryResults.map((law) => (
                        <LawCard
                          key={law.id}
                          id={law.id}
                          title={law.title}
                          country={law.country}
                          category={law.category}
                          excerpt={law.content.substring(0, 150) + (law.content.length > 150 ? '...' : '')}
                          author={law.profiles?.full_name || law.profiles?.username}
                          date={new Date(law.created_at).toISOString().split('T')[0]}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-white rounded-lg shadow">
                      <p className="text-gray-600">No categories found matching "{searchQuery}"</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Search;
