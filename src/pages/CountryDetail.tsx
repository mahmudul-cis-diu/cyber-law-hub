// import React from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import Navbar from '@/components/layout/Navbar';
// import Footer from '@/components/layout/Footer';
// import LawCard from '@/components/ui/LawCard';
// import { supabase } from '@/lib/supabase';

// // Mock data for countries
// const countryData: { [key: string]: { name: string, flag: string, description: string } } = {
//   'us': {
//     name: 'United States',
//     flag: '🇺🇸',
//     description: 'The United States has a complex framework of cyber laws aimed at protecting digital infrastructure, consumer privacy, and preventing cybercrimes.'
//   },
//   'eu': {
//     name: 'European Union',
//     flag: '🇪🇺',
//     description: 'The European Union has established comprehensive regulations like GDPR that set high standards for data protection and digital privacy across member states.'
//   },
//   'uk': {
//     name: 'United Kingdom',
//     flag: '🇬🇧',
//     description: 'The United Kingdom maintains robust cyber security laws focusing on critical infrastructure protection and data privacy rights.'
//   },
//   'au': {
//     name: 'Australia',
//     flag: '🇦🇺',
//     description: 'Australia has enacted several laws to address cybercrime, data protection, and information security across governmental and private sectors.'
//   },
//   'jp': {
//     name: 'Japan',
//     flag: '🇯🇵',
//     description: 'Japan has implemented comprehensive cybersecurity measures to protect its technology-driven economy and critical infrastructure.'
//   },
//   'sg': {
//     name: 'Singapore',
//     flag: '🇸🇬',
//     description: 'Singapore maintains strict cybersecurity regulations as part of its strategy to become a secure digital hub for business and innovation.'
//   },
//   'bd': {
//     name: 'Bangladesh',
//     flag: '🇧🇩',
//     description: 'Bangladesh is developing its cyber laws framework to address digital security and cybercrime challenges as it expands its digital economy.'
//   },
//   'in': {
//     name: 'India',
//     flag: '🇮🇳',
//     description: "India is continuously evolving its cyber law framework to address challenges in one of the world's fastest growing digital economies."
//   },
//   'pk': {
//     name: 'Pakistan',
//     flag: '🇵🇰',
//     description: 'Pakistan has been enhancing its cybersecurity legislation to combat digital threats and promote a secure digital environment.'
//   },
// };

// const CountryDetail = () => {
//   const { code } = useParams<{ code: string }>();
//   const countryCode = code?.toLowerCase() || '';
//   const country = countryData[countryCode];

//   // Fetch laws for this country
//   const { data: laws, isLoading } = useQuery({
//     queryKey: ['laws', 'country', countryCode],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from('laws')
//         .select(`
//           *,
//           profiles:author_id (username, full_name)
//         `)
//         .eq('is_approved', true)
//         .eq('country', countryCode.toUpperCase())
//         .order('created_at', { ascending: false });
        
//       if (error) throw error;
//       return data;
//     },
//     enabled: !!countryCode
//   });

//   if (!country) {
//     return (
//       <div className="min-h-screen flex flex-col">
//         <Navbar />
//         <main className="flex-grow bg-gray-50 py-12">
//           <div className="container mx-auto px-4 text-center">
//             <h1 className="text-3xl font-bold text-cyberlaw-navy mb-4">Country Not Found</h1>
//             <p className="mb-8">The country you're looking for doesn't exist in our database.</p>
//             <Link to="/countries">
//               <button className="bg-cyberlaw-navy text-white px-6 py-2 rounded-md hover:bg-cyberlaw-navy/90">
//                 Back to Countries
//               </button>
//             </Link>
//           </div>
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />
      
//       <main className="flex-grow bg-gray-50">
//         <div className="bg-gradient-to-r from-cyberlaw-navy to-cyberlaw-slate text-white py-16">
//           <div className="container mx-auto px-4">
//             <div className="flex items-center mb-6">
//               <Link to="/countries" className="text-cyberlaw-teal hover:underline flex items-center">
//                 ← Back to Countries
//               </Link>
//             </div>
            
//             <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
//               <div className="text-8xl">{country.flag}</div>
//               <div>
//                 <h1 className="text-4xl font-bold mb-4">{country.name}</h1>
//                 <p className="text-lg max-w-2xl">{country.description}</p>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         <div className="container mx-auto px-4 py-12">
//           <h2 className="text-2xl font-bold text-cyberlaw-navy mb-8">Cyber Laws in {country.name}</h2>
          
//           {isLoading ? (
//             <div className="text-center py-8">Loading laws...</div>
//           ) : laws && laws.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {laws.map((law) => (
//                 <LawCard
//                   key={law.id}
//                   id={law.id}
//                   title={law.title}
//                   country={law.country}
//                   category={law.category}
//                   excerpt={law.content.substring(0, 150) + (law.content.length > 150 ? '...' : '')}
//                   author={law.profiles?.full_name || law.profiles?.username}
//                   date={new Date(law.created_at).toISOString().split('T')[0]}
//                 />
//               ))}
//             </div>
//           ) : (
//             <div className="bg-white p-8 rounded-lg shadow text-center">
//               <p className="text-gray-600 mb-4">No cyber laws have been added for {country.name} yet.</p>
//               <Link to="/submit-law">
//                 <button className="bg-cyberlaw-teal text-white px-6 py-2 rounded hover:bg-cyberlaw-teal/90">
//                   Submit a Law
//                 </button>
//               </Link>
//             </div>
//           )}
//         </div>
//       </main>
      
//       <Footer />
//     </div>
//   );
// };

// export default CountryDetail;


import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LawCard from '@/components/ui/LawCard';
import { supabase } from '@/lib/supabase';

// Complete list of countries with their data
const countryData: { [key: string]: { name: string, flag: string, description: string } } = {
  'us': {
    name: 'United States',
    flag: '🇺🇸',
    description: 'The United States has a complex framework of cyber laws aimed at protecting digital infrastructure, consumer privacy, and preventing cybercrimes.'
  },
  'eu': {
    name: 'European Union',
    flag: '🇪🇺',
    description: 'The European Union has established comprehensive regulations like GDPR that set high standards for data protection and digital privacy across member states.'
  },
  'uk': {
    name: 'United Kingdom',
    flag: '🇬🇧',
    description: 'The United Kingdom maintains robust cyber security laws focusing on critical infrastructure protection and data privacy rights.'
  },
  'au': {
    name: 'Australia',
    flag: '🇦🇺',
    description: 'Australia has enacted several laws to address cybercrime, data protection, and information security across governmental and private sectors.'
  },
  'jp': {
    name: 'Japan',
    flag: '🇯🇵',
    description: 'Japan has implemented comprehensive cybersecurity measures to protect its technology-driven economy and critical infrastructure.'
  },
  'sg': {
    name: 'Singapore',
    flag: '🇸🇬',
    description: 'Singapore maintains strict cybersecurity regulations as part of its strategy to become a secure digital hub for business and innovation.'
  },
  'bd': {
    name: 'Bangladesh',
    flag: '🇧🇩',
    description: 'Bangladesh is developing its cyber laws framework to address digital security and cybercrime challenges as it expands its digital economy.'
  },
  'in': {
    name: 'India',
    flag: '🇮🇳',
    description: "India is continuously evolving its cyber law framework to address challenges in one of the world's fastest growing digital economies."
  },
  'pk': {
    name: 'Pakistan',
    flag: '🇵🇰',
    description: 'Pakistan has been enhancing its cybersecurity legislation to combat digital threats and promote a secure digital environment.'
  },
  'afghanistan': {
    name: 'Afghanistan',
    flag: '🇦🇫',
    description: 'Afghanistan is developing its legal framework to address cybersecurity and digital infrastructure challenges.'
  },
  'yemen': {
    name: 'Yemen',
    flag: '🇾🇪',
    description: 'Yemen is working on establishing cybersecurity regulations despite challenging circumstances.'
  }
};

const CountryDetail = () => {
  const { code } = useParams<{ code: string }>();
  const countryCode = code?.toLowerCase() || '';
  
  // Fetch laws for this country - using either the lowercase code or uppercase if needed
  const { data: laws, isLoading } = useQuery({
    queryKey: ['laws', 'country', countryCode],
    queryFn: async () => {
      // First try with the code as-is (could be lowercase or uppercase)
      let response = await supabase
        .from('laws')
        .select(`
          *,
          profiles:author_id (username, full_name)
        `)
        .eq('is_approved', true)
        .eq('country', countryCode)
        .order('created_at', { ascending: false });
      
      // If no results, try with uppercase
      if (response.data?.length === 0) {
        response = await supabase
          .from('laws')
          .select(`
            *,
            profiles:author_id (username, full_name)
          `)
          .eq('is_approved', true)
          .eq('country', countryCode.toUpperCase())
          .order('created_at', { ascending: false });
      }
      
      if (response.error) throw response.error;
      return response.data;
    },
    enabled: !!countryCode
  });

  // Create derived country data for display - fallback to a default if not found
  const country = countryData[countryCode] || {
    name: countryCode.charAt(0).toUpperCase() + countryCode.slice(1),
    flag: '🌐',
    description: `Information about cyber laws in ${countryCode.charAt(0).toUpperCase() + countryCode.slice(1)}.`
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="bg-gradient-to-r from-cyberlaw-navy to-cyberlaw-slate text-white py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-6">
              <Link to="/countries" className="text-cyberlaw-teal hover:underline flex items-center">
                ← Back to Countries
              </Link>
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="text-8xl">{country.flag}</div>
              <div>
                <h1 className="text-4xl font-bold mb-4">{country.name}</h1>
                <p className="text-lg max-w-2xl">{country.description}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-cyberlaw-navy mb-8">Cyber Laws in {country.name}</h2>
          
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
              <p className="text-gray-600 mb-4">No cyber laws have been added for {country.name} yet.</p>
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

export default CountryDetail;