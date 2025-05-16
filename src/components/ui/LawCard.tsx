
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Globe, Tag, Sparkles } from 'lucide-react';

interface LawCardProps {
  id: string;
  title: string;
  country: string;
  category: string;
  excerpt: string;
  author: string;
  date: string;
  isAiRecommended?: boolean;
}

const LawCard: React.FC<LawCardProps> = ({
  id,
  title,
  country,
  category,
  excerpt,
  author,
  date,
  isAiRecommended = false
}) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-cyberlaw-navy">
            {title}
            {isAiRecommended && (
              <span className="inline-flex items-center ml-2 px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                <Sparkles className="h-3 w-3 mr-1" /> AI Powered
              </span>
            )}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="inline-flex items-center text-xs text-gray-600">
            <Globe className="h-3 w-3 mr-1" /> {country}
          </span>
          <span className="inline-flex items-center text-xs text-gray-600">
            <Tag className="h-3 w-3 mr-1" /> {category}
          </span>
          <span className="inline-flex items-center text-xs text-gray-600">
            <CalendarIcon className="h-3 w-3 mr-1" /> {date}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div 
          className="text-gray-600 text-sm prose-sm line-clamp-4" 
          dangerouslySetInnerHTML={{ __html: excerpt }}
        />
      </CardContent>
      
      <CardFooter className="pt-4 flex flex-col items-start">
        <div className="text-sm text-gray-500 mb-3">By {author}</div>
        <Button 
          asChild 
          variant="outline" 
          className="border-cyberlaw-teal text-cyberlaw-teal hover:bg-cyberlaw-teal/10"
        >
          <Link to={isAiRecommended ? `/search?q=${encodeURIComponent(title)}` : `/laws/${id}`}>
            {isAiRecommended ? 'Find Similar' : 'Read More'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LawCard;
