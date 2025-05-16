
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LawCard from '@/components/ui/LawCard';
import { supabase } from '@/lib/supabase';

// Same category metadata as in Categories.tsx
const categoryColors: Record<string, string> = {
  "privacy": "bg-blue-500",
  "cybercrime": "bg-red-500",
  "data-protection": "bg-green-500",
  "intellectual-property": "bg-purple-500",
  "e-commerce": "bg-yellow-500",
  "cybersecurity": "bg-orange-500",
  "default": "bg-gray-500"
};

const categoryIcons: Record<string, string> = {
  "privacy": "🔒",
  "cybercrime": "🕵️",
  "data-protection": "🛡️",
  "intellectual-property": "©️",
  "e-commerce": "🛒",
  "cybersecurity": "🔐",
  "default": "📑"
};

// Mapping from URL slugs to actual category names
const categoryMapping: Record<string, string> = {
  "privacy": "Privacy",
  "cybercrime": "Cybercrime",
  "data-protection": "Data Protection",
  "intellectual-property": "Intellectual Property",
  "e-commerce": "E-Commerce",
  "cybersecurity": "Cybersecurity"
};

const categoryDescriptions: Record<string, string> = {
  "privacy": "Laws governing the collection, use, and disclosure of personal information, ensuring individual privacy in the digital age.",
  "cybercrime": "Legal frameworks targeting offenses committed using computers or networks, including hacking, fraud, and identity theft.",
  "data-protection": "Regulations concerning how organizations handle, store, and process data, especially personal and sensitive information.",
  "intellectual-property": "Laws protecting creative works in the digital realm, including copyright, patents, and trademarks.",
  "e-commerce": "Legal standards for online business transactions, consumer protection, and electronic contracts.",
  "cybersecurity": "Regulations focused on securing computer systems, networks, and data from attacks and unauthorized access."
};

const CategoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const categoryId = id?.toLowerCase() || '';
  const categoryName = categoryMapping[categoryId] || categoryId.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  const color = categoryColors[categoryId] || categoryColors.default;
  const icon = categoryIcons[categoryId] || categoryIcons.default;
  const description = categoryDescriptions[categoryId] || 
    "Laws and regulations related to this area of cyber law.";

  // Fetch laws for this category
  const { data: laws, isLoading } = useQuery({
    queryKey: ['laws', 'category', categoryName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('laws')
        .select(`
          *,
          profiles:author_id (username, full_name)
        `)
        .eq('is_approved', true)
        .eq('category', categoryName)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: !!categoryName
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className={`${color} text-white py-16`}>
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-6">
              <Link to="/categories" className="text-white hover:underline flex items-center">
                ← Back to Categories
              </Link>
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="text-8xl">{icon}</div>
              <div>
                <h1 className="text-4xl font-bold mb-4">{categoryName}</h1>
                <p className="text-lg max-w-2xl">{description}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-cyberlaw-navy mb-8">
            {categoryName} Laws
          </h2>
          
          {isLoading ? (
            <div className="text-center py-8">Loading laws...</div>
          ) : laws && laws.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {laws.map((law) => (
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
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-600 mb-4">No laws have been added in the {categoryName} category yet.</p>
              <Link to="/submit-law">
                <button className="bg-cyberlaw-teal text-white px-6 py-2 rounded hover:bg-cyberlaw-teal/90">
                  Submit a Law
                </button>
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryDetail;
