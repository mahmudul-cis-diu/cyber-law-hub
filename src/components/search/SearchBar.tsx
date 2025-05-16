
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  className?: string;
  initialQuery?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex w-full max-w-3xl ${className}`}>
      <div className="relative flex-grow">
        <Input
          type="text"
          placeholder="Search cyber laws, countries, or categories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-4 pr-10 py-3 rounded-l-lg border-2 border-r-0 border-gray-300 focus:outline-none focus:border-cyberlaw-teal"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Search className="h-5 w-5" />
        </div>
      </div>
      <Button 
        type="submit" 
        className="bg-cyberlaw-teal text-cyberlaw-navy hover:bg-opacity-90 rounded-l-none"
      >
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
