
// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Search, User, PlusCircle } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';
// import NotificationsDropdown from '@/components/notifications/NotificationsDropdown';

// const Navbar: React.FC = () => {
//   const { user, signOut } = useAuth();
//   const navigate = useNavigate();

//   return (
//     <nav className="bg-cyberlaw-navy text-white shadow-md py-4">
//       <div className="container mx-auto flex items-center justify-between px-4">
//         <div className="flex items-center space-x-6">
//           <Link to="/" className="flex items-center space-x-2">
//             <span className="text-cyberlaw-teal text-2xl font-bold">CLS</span>
//             <span className="font-semibold hidden md:inline">Cyber Law System</span>
//           </Link>
//           <div className="hidden md:flex space-x-6">
//             <Link to="/countries" className="hover:text-cyberlaw-teal transition-colors">
//               Countries
//             </Link>
//             <Link to="/categories" className="hover:text-cyberlaw-teal transition-colors">
//               Categories
//             </Link>
//             <Link to="/laws" className="hover:text-cyberlaw-teal transition-colors">
//               Laws
//             </Link>
//             <Link to="/about" className="hover:text-cyberlaw-teal transition-colors">
//               About
//             </Link>
//           </div>
//         </div>
//         <div className="flex items-center space-x-4">
//           <Link to="/search" className="hover:text-cyberlaw-teal transition-colors">
//             <Search className="h-5 w-5" />
//           </Link>
          
//           {user ? (
//             <div className="flex items-center space-x-4">
//               <NotificationsDropdown />
              
//               {user.role === 'admin' && (
//                 <Link 
//                   to="/admin"
//                   className="text-cyberlaw-teal hover:text-white transition-colors"
//                 >
//                   Admin
//                 </Link>
//               )}
//               <Link 
//                 to="/submit-law"
//                 className="flex items-center gap-1 text-cyberlaw-teal hover:text-white transition-colors"
//               >
//                 <PlusCircle className="h-4 w-4" />
//                 <span className="hidden md:inline">Submit Law</span>
//               </Link>
//               <Link to="/profile" className="flex items-center hover:text-cyberlaw-teal transition-colors">
//                 <div className="flex items-center gap-2">
//                   {user.avatar_url ? (
//                     <img 
//                       src={user.avatar_url} 
//                       alt={user.username}
//                       className="w-8 h-8 rounded-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-8 h-8 bg-cyberlaw-teal rounded-full flex items-center justify-center text-cyberlaw-navy font-medium">
//                       {user.username.charAt(0).toUpperCase()}
//                     </div>
//                   )}
//                   <span className="hidden lg:inline">{user.username}</span>
//                 </div>
//               </Link>
//             </div>
//           ) : (
//             <div className="flex items-center space-x-4">
//               <Button 
//                 variant="outline" 
//                 className="border-cyberlaw-teal text-cyberlaw-teal hover:bg-cyberlaw-teal hover:text-cyberlaw-navy"
//                 onClick={() => navigate('/sign-in')}
//               >
//                 Sign In
//               </Button>
//               <Button 
//                 className="bg-cyberlaw-teal text-cyberlaw-navy hover:bg-opacity-90"
//                 onClick={() => navigate('/sign-up')}
//               >
//                 Register
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, User, PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import NotificationsDropdown from '@/components/notifications/NotificationsDropdown';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      console.log('Current user in Navbar:', user.username);
      console.log('Current user role in Navbar:', user.role);
      console.log('Is admin?', user.role === 'admin');
    }
  }, [user]);

  return (
    <nav className="bg-cyberlaw-navy text-white shadow-md py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-cyberlaw-teal text-2xl font-bold">CLS</span>
            <span className="font-semibold hidden md:inline">Cyber Law System</span>
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link to="/countries" className="hover:text-cyberlaw-teal transition-colors">
              Countries
            </Link>
            <Link to="/categories" className="hover:text-cyberlaw-teal transition-colors">
              Categories
            </Link>
            <Link to="/laws" className="hover:text-cyberlaw-teal transition-colors">
              Laws
            </Link>
            <Link to="/about" className="hover:text-cyberlaw-teal transition-colors">
              About
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/search" className="hover:text-cyberlaw-teal transition-colors">
            <Search className="h-5 w-5" />
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <NotificationsDropdown />
              
              {user.role === 'admin' && (
                <Link 
                  to="/admin"
                  className="text-cyberlaw-teal hover:text-white transition-colors"
                  onClick={(e) => {
                    console.log('Admin link clicked, current role:', user.role);
                    if (user.role !== 'admin') {
                      e.preventDefault();
                      console.log('Preventing navigation - not admin');
                    }
                  }}
                >
                  Admin
                </Link>
              )}
              <Link 
                to="/submit-law"
                className="flex items-center gap-1 text-cyberlaw-teal hover:text-white transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                <span className="hidden md:inline">Submit Law</span>
              </Link>
              <Link to="/profile" className="flex items-center hover:text-cyberlaw-teal transition-colors">
                <div className="flex items-center gap-2">
                  {user.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-cyberlaw-teal rounded-full flex items-center justify-center text-cyberlaw-navy font-medium">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden lg:inline">{user.username}</span>
                </div>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                className="border-cyberlaw-teal text-cyberlaw-teal hover:bg-cyberlaw-teal hover:text-cyberlaw-navy"
                onClick={() => navigate('/sign-in')}
              >
                Sign In
              </Button>
              <Button 
                className="bg-cyberlaw-teal text-cyberlaw-navy hover:bg-opacity-90"
                onClick={() => navigate('/sign-up')}
              >
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;