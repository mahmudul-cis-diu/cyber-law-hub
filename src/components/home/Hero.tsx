
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-cyberlaw-navy to-blue-900 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Cyber Laws <span className="text-cyberlaw-teal">Made Accessible</span>
          </h1>
          <p className="text-lg mb-8 opacity-90">
            Explore, contribute, and understand cyber regulations from countries around the world. 
            Your gateway to digital legal knowledge.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-cyberlaw-teal text-cyberlaw-navy hover:bg-opacity-90 text-lg px-8 py-6">
              <Link to="/countries">Explore Laws</Link>
            </Button>
            <Button variant="outline" className="border-cyberlaw-teal text-cyberlaw-teal hover:bg-cyberlaw-teal hover:text-cyberlaw-navy text-lg px-8 py-6">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
