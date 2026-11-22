import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { JoinQueuePage } from './pages/JoinQueuePage';
import { TrackQueuePage } from './pages/TrackQueuePage';
import { LoginPage } from './pages/LoginPage';
import { StaffDashboard } from './pages/StaffDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { LiveDisplayPage } from './pages/LiveDisplayPage';

export function App() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [trackToken, setTrackToken] = useState<string | undefined>(undefined);

  // Parse URL search params if visiting ?track=XYZ
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('track');
    if (token) {
      setTrackToken(token);
      setCurrentView('track');
    }
  }, []);

  const handleNavigate = (view: string, data?: any) => {
    if (view === 'track' && data) {
      setTrackToken(data);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTicketGenerated = (response: any) => {
    if (response?.entry?.secretToken) {
      setTrackToken(response.entry.secretToken);
      setCurrentView('track');
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        {/* Do not render standard top navbar on the TV Live Reception Display */}
        {currentView !== 'display' && (
          <Navbar currentView={currentView} onNavigate={handleNavigate} />
        )}

        <main className="flex-1">
          {currentView === 'landing' && (
            <LandingPage onNavigate={handleNavigate} />
          )}

          {currentView === 'join' && (
            <JoinQueuePage 
              onTicketGenerated={handleTicketGenerated} 
              onNavigate={handleNavigate} 
            />
          )}

          {currentView === 'track' && (
            <TrackQueuePage 
              tokenParam={trackToken} 
              onNavigate={handleNavigate} 
            />
          )}

          {currentView === 'login' && (
            <LoginPage 
              onLoginSuccess={(role) => {
                if (role === 'ADMIN') setCurrentView('admin');
                else setCurrentView('staff');
              }} 
            />
          )}

          {currentView === 'staff' && (
            <StaffDashboard />
          )}

          {currentView === 'admin' && (
            <AdminDashboard />
          )}

          {currentView === 'display' && (
            <LiveDisplayPage />
          )}
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
