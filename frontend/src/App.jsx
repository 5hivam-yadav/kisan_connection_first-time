import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { RoleSwitcherModal } from './components/common/RoleSwitcherModal';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { CropDetailsPage } from './pages/CropDetailsPage';
import { PriceDiscoveryPage } from './pages/PriceDiscoveryPage';
import { MapDiscoveryPage } from './pages/MapDiscoveryPage';
import { CommunityPage } from './pages/CommunityPage';
import { FarmerDashboardPage } from './pages/FarmerDashboardPage';
import { BuyerDashboardPage } from './pages/BuyerDashboardPage';
import { CreateListingPage } from './pages/CreateListingPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { FarmerProfilePage } from './pages/FarmerProfilePage';
import { SavedListingsPage } from './pages/SavedListingsPage';
import { ChatPage } from './pages/ChatPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';

export function App() {
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-earth-50/50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar onOpenRoleSwitcher={() => setRoleSwitcherOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage onOpenRoleSwitcher={() => setRoleSwitcherOpen(true)} />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/listings/:id" element={<CropDetailsPage />} />
          <Route path="/price-discovery" element={<PriceDiscoveryPage />} />
          <Route path="/map-discovery" element={<MapDiscoveryPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/farmer/:id" element={<FarmerProfilePage />} />
          <Route path="/saved-listings" element={<SavedListingsPage />} />
          <Route path="/chat" element={<ChatPage />} />

          <Route path="/login" element={<LoginPage onOpenRoleSwitcher={() => setRoleSwitcherOpen(true)} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faqs" element={<FaqPage />} />

          {/* Farmer Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['farmer', 'admin']} />}>
            <Route path="/farmer/dashboard" element={<FarmerDashboardPage />} />
            <Route path="/farmer/create-listing" element={<CreateListingPage />} />
            <Route path="/farmer/inquiries" element={<FarmerDashboardPage />} />
          </Route>

          {/* Buyer Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['buyer', 'admin']} />}>
            <Route path="/buyer/dashboard" element={<BuyerDashboardPage />} />
            <Route path="/buyer/inquiries" element={<BuyerDashboardPage />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Fixed Bottom Bar */}
      <MobileBottomNav />

      {/* Universal 1-Click Role Switcher Modal */}
      <RoleSwitcherModal
        isOpen={roleSwitcherOpen}
        onClose={() => setRoleSwitcherOpen(false)}
      />

    </div>
  );
}

export default App;
