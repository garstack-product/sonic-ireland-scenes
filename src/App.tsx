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
import MapPage from "./pages/listings/MapPage";
import NewsPage from "./pages/news/NewsPage";
import AboutPage from "./pages/About";
import LoginPage from "./pages/auth/LoginPage";

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
            <Route path="/listings/map" element={<MapPage />} />
            
            {/* Other Pages */}
            <Route path="/news" element={<NewsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
