
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';

// Define category metadata
const categoryColors: Record<string, string> = {
  "Privacy": "bg-blue-500",
  "Cybercrime": "bg-red-500",
  "Data Protection": "bg-green-500",
  "Intellectual Property": "bg-purple-500",
  "E-Commerce": "bg-yellow-500",
  "Cybersecurity": "bg-orange-500",
  // Default color for any other categories
  "default": "bg-gray-500" 
};

const categoryIcons: Record<string, string> = {
  "Privacy": "🔒",
  "Cybercrime": "🕵️",
  "Data Protection": "🛡️",
  "Intellectual Property": "©️",
  "E-Commerce": "🛒",
  "Cybersecurity": "🔐",
  // Default icon for any other categories
  "default": "📑"
};

const Categories = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      // First, get all the distinct categories
      const { data: distinctCategories, error: distinctError } = await supabase
        .from('laws')
        .select('category')
        .eq('is_approved', true)
        .order('category')
        .then(res => {
          if (res.error) throw res.error;
          
          // Get unique categories
          const uniqueCategories = Array.from(
            new Set(res.data.map(item => item.category))
          );
          
          return {
            data: uniqueCategories.filter(Boolean), // Filter out null/undefined
            error: null
          };
        });
        
      if (distinctError) throw distinctError;
      
      // For each category, count the number of laws
      const categoryCounts = await Promise.all(
        distinctCategories.map(async (category) => {
          const { count, error } = await supabase
            .from('laws')
            .select('*', { count: 'exact', head: true })
            .eq('is_approved', true)
            .eq('category', category);
            
          if (error) throw error;
          
          return {
            name: category,
            id: category.toLowerCase().replace(/\s+/g, '-'),
            count: count || 0,
            color: categoryColors[category] || categoryColors.default,
            icon: categoryIcons[category] || categoryIcons.default
          };
        })
      );
      
      return categoryCounts;
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-cyberlaw-navy mb-8">Categories</h1>
          <p className="text-lg text-gray-700 mb-10 max-w-3xl">
            Browse cyber laws and regulations by category. Each category represents a specific area of cyber law.
          </p>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-40 w-full rounded-lg" />
              ))}
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link 
                  to={`/categories/${category.id}`} 
                  key={category.id}
                  className="block group"
                >
                  <div className={`${category.color} h-full rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg p-6 text-white`}>
                    <div className="text-4xl mb-4">{category.icon}</div>
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="opacity-90">{category.count} {category.count === 1 ? 'Law' : 'Laws'}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">No categories found. Laws need to be added first.</p>
              <Link 
                to="/submit-law" 
                className="mt-4 inline-block bg-cyberlaw-navy text-white px-6 py-2 rounded hover:bg-cyberlaw-navy/90"
              >
                Submit a Law
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Categories;
