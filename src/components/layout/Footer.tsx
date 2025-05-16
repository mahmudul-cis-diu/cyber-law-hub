
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-cyberlaw-navy text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-cyberlaw-teal">Cyber Law System</h3>
            <p className="text-sm mb-4">
              A comprehensive platform for accessing and understanding cyber laws around the world.
            </p>
            <p className="text-sm">© {new Date().getFullYear()} Cyber Law System. All rights reserved.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm hover:text-cyberlaw-teal transition-colors">Home</Link></li>
              <li><Link to="/countries" className="text-sm hover:text-cyberlaw-teal transition-colors">Countries</Link></li>
              <li><Link to="/categories" className="text-sm hover:text-cyberlaw-teal transition-colors">Categories</Link></li>
              <li><Link to="/about" className="text-sm hover:text-cyberlaw-teal transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm hover:text-cyberlaw-teal transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-sm mb-2">Have questions or suggestions?</p>
            <Link 
              to="/contact" 
              className="inline-block bg-cyberlaw-teal text-cyberlaw-navy px-4 py-2 rounded text-sm font-medium hover:bg-opacity-90 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
