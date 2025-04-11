
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout
import MainLayout from "./components/layout/MainLayout";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ConcertReviewsPage from "./pages/reviews/ConcertReviewsPage";
import FestivalReviewsPage from "./pages/reviews/FestivalReviewsPage";
import ConcertListingsPage from "./pages/listings/ConcertListingsPage";
import FestivalListingsPage from "./pages/listings/FestivalListingsPage";
import JustAnnouncedPage from "./pages/listings/JustAnnouncedPage";
import MapPage from "./pages/listings/MapPage";
import NewsPage from "./pages/news/NewsPage";
import AboutPage from "./pages/About";
import LoginPage from "./pages/auth/LoginPage";
import AdminPage from "./pages/admin/AdminPage";

// Store API keys safely
const API_KEYS = {
  ticketmaster: "ARUuNeTjV7x8sxiLzbu94m0GOF5HwI3n",
  eventbrite: "DA3YML7VKQ3X2WKUPCYE", 
  googleMaps: "AIzaSyCPYwkRCOEQXx8MrXRbEPyApE8jpZW2sR4"
};

// Create a global variable to store API keys
window.API_KEYS = API_KEYS;

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Index />} />
            
            {/* Reviews Routes */}
            <Route path="/reviews/concerts" element={<ConcertReviewsPage />} />
            <Route path="/reviews/festivals" element={<FestivalReviewsPage />} />
            
            {/* Listings Routes */}
            <Route path="/listings/concerts" element={<ConcertListingsPage />} />
            <Route path="/listings/festivals" element={<FestivalListingsPage />} />
            <Route path="/listings/just-announced" element={<JustAnnouncedPage />} />
            <Route path="/listings/map" element={<MapPage />} />
            
            {/* Other Pages */}
            <Route path="/news" element={<NewsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Add window global type definition
declare global {
  interface Window {
    API_KEYS: {
      ticketmaster: string;
      eventbrite: string;
      googleMaps: string;
    };
  }
}

export default App;
