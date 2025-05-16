
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import CountrySelector from '@/components/home/CountrySelector';
import FeaturedLaws from '@/components/home/FeaturedLaws';

const Index: React.FC = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/sign-up');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        

        {/* <div className="py-12 bg-white">
          <div className="container mx-auto px-4 flex justify-center">
            <SearchBar onSearch={handleSearch} className="mx-auto" />
          </div>
        </div> */}
        

        <CountrySelector />
        <FeaturedLaws />
        
        <section className="py-16 bg-gradient-to-r from-cyberlaw-navy to-blue-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="max-w-2xl mx-auto mb-8">
              Contribute to the knowledge base, interact with other legal professionals, and stay updated on the latest cyber law developments.
            </p>
            <button 
              onClick={handleRegisterClick}
              className="bg-cyberlaw-teal text-cyberlaw-navy hover:bg-opacity-90 px-8 py-3 rounded-lg font-medium text-lg transition-all duration-200 hover:shadow-lg"
            >
              Register Now
            </button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
