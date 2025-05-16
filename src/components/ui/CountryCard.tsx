
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

interface CountryCardProps {
  name: string;
  code: string;
  lawCount: number;
  flagUrl?: string;
}

const CountryCard: React.FC<CountryCardProps> = ({ name, code, lawCount, flagUrl }) => {
  return (
    <Link to={`/countries/${code}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-cyberlaw-navy relative">
          {flagUrl && (
            <div 
              className="absolute inset-0 opacity-20 bg-cover bg-center" 
              style={{ backgroundImage: `url(${flagUrl})` }}
            />
          )}
          <div className="absolute bottom-4 left-4">
            <h3 className="text-white text-xl font-bold">{name}</h3>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Country Code: {code.toUpperCase()}</p>
            <span className="bg-cyberlaw-navy text-white text-xs px-2 py-1 rounded-full">
              {lawCount} {lawCount === 1 ? 'Law' : 'Laws'}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CountryCard;
