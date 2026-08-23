import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { AthletePage } from './pages/AthletePage';
import { ScoutDashboard } from './components/scout/ScoutDashboard';
import { PercentileExplorer } from './components/benchmark/PercentileExplorer';

export const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-background text-slate-100">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/assess" element={<AthletePage />} />
            <Route path="/scout" element={<ScoutDashboard />} />
            <Route path="/benchmarks" element={<PercentileExplorer />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
