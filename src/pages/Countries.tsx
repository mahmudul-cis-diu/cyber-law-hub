
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CountrySelector from '@/components/home/CountrySelector';

const Countries = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-cyberlaw-navy mb-8">Countries</h1>
          <p className="text-lg text-gray-700 mb-10 max-w-3xl">
            Explore cyber laws and regulations from countries around the world. Select a country to view its specific laws and regulations.
          </p>
          
          <CountrySelector />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Countries;
