import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WizardProvider } from './context/WizardContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './pages/LandingPage';
import { WizardPage } from './pages/WizardPage';
import { DashboardPage } from './pages/DashboardPage';
import { PreviewPage } from './pages/PreviewPage';
import { RecipientPage } from './pages/RecipientPage';

const getBasename = (): string => {
  if (typeof window !== 'undefined') {
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (parts.length > 0 && !['create', 'dashboard', 'b', 'preview'].includes(parts[0])) {
      return '/' + parts[0];
    }
  }
  return '';
};

export const App: React.FC = () => {
  return (
    <WizardProvider>
      <BrowserRouter basename={getBasename()}>
        <div className="flex flex-col min-h-screen text-stone-900 bg-stone-50 selection:bg-pink-200 selection:text-pink-900">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* Multi-Step Creation Wizard */}
              <Route path="/create" element={<WizardPage />} />

              {/* Creator Dashboard */}
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* Creator Preview */}
              <Route path="/preview/:id" element={<PreviewPage />} />

              {/* Public Recipient Experience */}
              <Route path="/b/:slug" element={<RecipientPage />} />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </WizardProvider>
  );
};

export default App;

