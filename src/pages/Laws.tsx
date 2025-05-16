
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LawCard from '@/components/ui/LawCard';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Sample countries and categories for filters
const countries = ["All", "US", "EU", "UK", "Australia", "Canada", "Japan", "Singapore", "Germany", "France", "India"];
const categories = ["All", "Privacy", "Cybercrime", "Data Protection", "Intellectual Property", "E-Commerce", "Cybersecurity"];

const Laws = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch laws from Supabase
  const { data: laws, isLoading } = useQuery({
    queryKey: ['laws', selectedCountry, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('laws')
        .select(`
          *,
          profiles:author_id (username, full_name)
        `)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      
      // Apply filters
      if (selectedCountry !== 'All') {
        query = query.eq('country', selectedCountry);
      }
      
      if (selectedCategory !== 'All') {
        query = query.eq('category', selectedCategory);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    }
  });

  // Filter laws based on search query
  const filteredLaws = laws?.filter(law => 
    searchQuery === '' || 
    law.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    law.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper function to strip HTML tags for search purposes
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-cyberlaw-navy mb-8">Laws</h1>
          <p className="text-lg text-gray-700 mb-10 max-w-3xl">
            Explore all cyber laws and regulations from countries around the world.
          </p>
          
          {/* Search and filters */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-10">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Input
                  placeholder="Search laws by title or content"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
              
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Law cards */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden h-80">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-12 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>
                    </div>
                    <Skeleton className="h-7 w-3/4 mb-3" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredLaws && filteredLaws.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLaws.map((law) => (
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
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
              <p className="text-gray-500 mb-4">No laws found matching your criteria.</p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCountry('All');
                  setSelectedCategory('All');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Laws;
