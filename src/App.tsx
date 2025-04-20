import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

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
import RegisterPage from "./pages/auth/RegisterPage";
import MyEventsPage from "./pages/user/MyEventsPage";
import AdminPage from "./pages/admin/AdminPage";
import EventDetailPage from "./pages/listings/EventDetailPage";
import UKFestivalsPage from "./pages/listings/UKFestivalsPage";
import FranceFestivalsPage from "./pages/listings/FranceFestivalsPage";
import SpainFestivalsPage from "./pages/listings/SpainFestivalsPage";
import GermanyFestivalsPage from "./pages/listings/GermanyFestivalsPage";
import NetherlandsFestivalsPage from "./pages/listings/NetherlandsFestivalsPage";
import IrelandFestivalsPage from "./pages/listings/IrelandFestivalsPage";

// Store API keys safely
const API_KEYS = {
  ticketmaster: "ARUuNeTjV7x8sxiLzbu94m0GOF5HwI3n",
  eventbrite: "6FFTEUYYIUZNPFWUBN", 
  googleMaps: "AIzaSyCPYwkRCOEQXx8MrXRbEPyApE8jpZW2sR4"
};

// Create a global variable to store API keys
window.API_KEYS = API_KEYS;

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
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
              <Route path="/listings/festivals/ireland" element={<IrelandFestivalsPage />} />
              <Route path="/listings/festivals/uk" element={<UKFestivalsPage />} />
              <Route path="/listings/festivals/france" element={<FranceFestivalsPage />} />
              <Route path="/listings/festivals/spain" element={<SpainFestivalsPage />} />
              <Route path="/listings/festivals/germany" element={<GermanyFestivalsPage />} />
              <Route path="/listings/festivals/netherlands" element={<NetherlandsFestivalsPage />} />
              <Route path="/listings/just-announced" element={<JustAnnouncedPage />} />
              <Route path="/listings/map" element={<MapPage />} />
              <Route path="/listings/my-events" element={<MyEventsPage />} />
              <Route path="/listings/:type/:id" element={<EventDetailPage />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Other Pages */}
              <Route path="/news" element={<NewsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/admin" element={<AdminPage />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
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
