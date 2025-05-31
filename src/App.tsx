
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from './pages/Index';
import ConcertListingsPage from './pages/listings/ConcertListingsPage';
import UKFestivalsPage from './pages/listings/UKFestivalsPage';
import FranceFestivalsPage from './pages/listings/FranceFestivalsPage';
import GermanyFestivalsPage from './pages/listings/GermanyFestivalsPage';
import NetherlandsFestivalsPage from './pages/listings/NetherlandsFestivalsPage';
import SpainFestivalsPage from './pages/listings/SpainFestivalsPage';
import MapPage from './pages/listings/MapPage';
import EventDetailPage from './pages/listings/EventDetailPage';
import ConcertReviewsPage from './pages/reviews/ConcertReviewsPage';
import FestivalReviewsPage from './pages/reviews/FestivalReviewsPage';
import ConcertReviewDetail from './pages/reviews/ConcertReviewDetail';
import FestivalReviewDetail from './pages/reviews/FestivalReviewDetail';
import NewsPage from './pages/news/NewsPage';
import NewsDetailPage from './pages/news/NewsDetailPage';
import About from './pages/About';
import AdminPage from './pages/admin/AdminPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import NotFound from './pages/NotFound';
import MainLayout from './components/layout/MainLayout';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import MyEventsPage from './pages/user/MyEventsPage';
import JustAnnouncedPage from './pages/listings/JustAnnouncedPage';
import IrelandFestivalsPage from './pages/listings/IrelandFestivalsPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-dark-500 to-dark-600 text-white">
            <MainLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/listings/concerts" element={<ConcertListingsPage />} />
                <Route path="/listings/just-announced" element={<JustAnnouncedPage />} />
                <Route path="/listings/festivals/ireland" element={<IrelandFestivalsPage />} />
                <Route path="/listings/festivals/uk" element={<UKFestivalsPage />} />
                <Route path="/listings/festivals/france" element={<FranceFestivalsPage />} />
                <Route path="/listings/festivals/germany" element={<GermanyFestivalsPage />} />
                <Route path="/listings/festivals/netherlands" element={<NetherlandsFestivalsPage />} />
                <Route path="/listings/festivals/spain" element={<SpainFestivalsPage />} />
                <Route path="/listings/map" element={<MapPage />} />
                <Route path="/listings/:id" element={<EventDetailPage />} />
                <Route path="/reviews/concerts" element={<ConcertReviewsPage />} />
                <Route path="/reviews/festivals" element={<FestivalReviewsPage />} />
                <Route path="/reviews/concerts/:id" element={<ConcertReviewDetail />} />
                <Route path="/reviews/festivals/:id" element={<FestivalReviewDetail />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/news/:id" element={<NewsDetailPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/my-events" element={<MyEventsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
