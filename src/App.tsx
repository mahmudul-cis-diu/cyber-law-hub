import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Countries from "./pages/Countries";
import CountryDetail from "./pages/CountryDetail";
import Categories from "./pages/Categories";
import CategoryDetail from "./pages/CategoryDetail";
import Laws from "./pages/Laws";
import LawDetail from "./pages/LawDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Search from "./pages/Search";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Profile from "./pages/auth/Profile";
import SubmitLaw from "./pages/laws/SubmitLaw";
import AdminDashboard from "./pages/admin/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
            
            <Route path="/countries" element={<Countries />} />
            <Route path="/countries/:code" element={<CountryDetail />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:id" element={<CategoryDetail />} />
            <Route path="/laws" element={<Laws />} />
            <Route path="/laws/:id" element={<LawDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/search" element={<Search />} />
            
            <Route path="/submit-law" element={<SubmitLaw />} />
            <Route path="/admin" element={<AdminDashboard />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
