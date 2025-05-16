
// import React, { useEffect, useState } from 'react';
// import CountryCard from '@/components/ui/CountryCard';
// import { supabase } from '@/lib/supabase';

// const CountrySelector: React.FC = () => {
//   const [countries, setCountries] = useState([
//     { name: 'United States', code: 'us', lawCount: 0, flagUrl: 'https://images.unsplash.com/photo-1581079288675-e1b4dec1e8cd' },
//     { name: 'European Union', code: 'eu', lawCount: 0, flagUrl: 'https://images.unsplash.com/photo-1527866959252-deafcd7f2807' },
//     { name: 'Singapore', code: 'sg', lawCount: 0, flagUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963' },
//     { name: 'Australia', code: 'au', lawCount: 0, flagUrl: 'https://images.unsplash.com/photo-1493375366763-3ed5e0e6d8ec' },
//     { name: 'Japan', code: 'jp', lawCount: 0, flagUrl: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3' },
//     { name: 'United Kingdom', code: 'uk', lawCount: 0, flagUrl: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383' },
//     { name: 'Bangladesh', code: 'bd', lawCount: 0, flagUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded' },
//     { name: 'India', code: 'in', lawCount: 0, flagUrl: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c' },
//     { name: 'Pakistan', code: 'pk', lawCount: 0, flagUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded' }
//   ]);

//   useEffect(() => {
//     const fetchLawCounts = async () => {
//       try {
//         // Get all approved laws
//         const { data: laws, error } = await supabase
//           .from('laws')
//           .select('country')
//           .eq('is_approved', true);
        
//         if (error) {
//           throw error;
//         }
        
//         if (laws) {
//           // Count laws by country
//           const countryCounts: {[key: string]: number} = {};
          
//           laws.forEach((law) => {
//             if (law.country) {
//               countryCounts[law.country] = (countryCounts[law.country] || 0) + 1;
//             }
//           });
          
//           // Update country counts
//           setCountries(prevCountries => 
//             prevCountries.map(country => ({
//               ...country,
//               lawCount: countryCounts[country.code.toUpperCase()] || 0
//             }))
//           );
//         }
//       } catch (error) {
//         console.error("Error fetching law counts:", error);
//       }
//     };

//     fetchLawCounts();
//   }, []);

//   return (
//     <section className="py-12">
//       <div className="container mx-auto px-4">
//         <div className="mb-10 text-center">
//           <h2 className="text-3xl font-bold text-cyberlaw-navy mb-2">Browse by Country</h2>
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             Select a country to explore its cyber laws and regulations.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {countries.map((country) => (
//             <CountryCard
//               key={country.code}
//               name={country.name}
//               code={country.code}
//               lawCount={country.lawCount}
//               flagUrl={country.flagUrl}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CountrySelector;



import React, { useEffect, useState } from 'react';
import CountryCard from '@/components/ui/CountryCard';
import { supabase } from '@/lib/supabase';

const CountrySelector: React.FC = () => {
  const [countries, setCountries] = useState<Array<{
    name: string;
    code: string;
    lawCount: number;
    flagUrl: string;
  }>>([]);
  
  const [loading, setLoading] = useState(true);

  // Country name mapping - expanded to include all possible countries that may be in the database
  const countryNameMapping: { [key: string]: string } = {
    'US': 'United States',
    'EU': 'European Union',
    'UK': 'United Kingdom',
    'AU': 'Australia',
    'JP': 'Japan',
    'SG': 'Singapore',
    'BD': 'Bangladesh',
    'IN': 'India',
    'PK': 'Pakistan',
    'AFGHANISTAN': 'Afghanistan',
    'YEMEN': 'Yemen',
    'ALBANIA': 'Albania',
    'ALGERIA': 'Algeria',
    'ANDORRA': 'Andorra',
    'ANGOLA': 'Angola',
    'ANTIGUA AND BARBUDA': 'Antigua and Barbuda',
    'ARGENTINA': 'Argentina',
    'ARMENIA': 'Armenia',
    'AUSTRIA': 'Austria',
    'AZERBAIJAN': 'Azerbaijan',
    // Add any country that might appear in your database
  };
  
  // Flag URL mapping
  const countryFlagMapping: { [key: string]: string } = {
    'US': 'https://images.unsplash.com/photo-1581079288675-e1b4dec1e8cd',
    'EU': 'https://images.unsplash.com/photo-1527866959252-deafcd7f2807',
    'SG': 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963',
    'AU': 'https://images.unsplash.com/photo-1493375366763-3ed5e0e6d8ec',
    'JP': 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3',
    'UK': 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383',
    'BD': 'https://images.unsplash.com/photo-1583422409516-2895a77efded',
    'IN': 'https://images.unsplash.com/photo-1532375810709-75b1da00537c',
    'PK': 'https://images.unsplash.com/photo-1583422409516-2895a77efded',
    'AFGHANISTAN': 'https://images.unsplash.com/photo-1539468561344-f1a25c003db5',
    'YEMEN': 'https://images.unsplash.com/photo-1583422409516-2895a77efded',
    // Default image for other countries
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        // Fetch unique countries that have approved laws
        const { data, error } = await supabase
          .from('laws')
          .select('country')
          .eq('is_approved', true)
          .order('country');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Extract unique countries
          const uniqueCountries = Array.from(new Set(data.map(law => law.country)));
          
          // Count laws by country
          const countryCounts: {[key: string]: number} = {};
          data.forEach(law => {
            if (law.country) {
              countryCounts[law.country] = (countryCounts[law.country] || 0) + 1;
            }
          });
          
          // Format countries for display
          const formattedCountries = uniqueCountries.map(code => {
            // Try to find a name for this country code (case insensitive)
            let name = countryNameMapping[code] || countryNameMapping[code.toUpperCase()] || '';
            
            // If no name found, use the code directly with first letter capitalized
            if (!name) {
              name = code.charAt(0).toUpperCase() + code.slice(1).toLowerCase();
            }
            
            // Determine the URL for the flag (case insensitive)
            const flagUrl = countryFlagMapping[code] || countryFlagMapping[code.toUpperCase()] || 
                         'https://images.unsplash.com/photo-1583422409516-2895a77efded';
            
            return {
              name: name,
              code: code.toLowerCase(), // Always use lowercase for the route
              lawCount: countryCounts[code] || 0,
              flagUrl: flagUrl
            };
          });
          
          setCountries(formattedCountries);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-cyberlaw-navy mb-2">Browse by Country</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select a country to explore its cyber laws and regulations.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading countries...</div>
        ) : countries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {countries.map((country) => (
              <CountryCard
                key={country.code}
                name={country.name}
                code={country.code}
                lawCount={country.lawCount}
                flagUrl={country.flagUrl}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p>No countries with approved laws found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CountrySelector;