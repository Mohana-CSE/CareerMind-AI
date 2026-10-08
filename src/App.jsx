import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ResumeUploadPage from './pages/ResumeUploadPage';
import TargetRolePage from './pages/TargetRolePage';
import SkillGapPage from './pages/SkillGapPage';
import ReadinessScorePage from './pages/ReadinessScorePage';
import RoadmapPage from './pages/RoadmapPage';
import JobsPage from './pages/JobsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderActiveView = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage setActiveTab={setActiveTab} />;
      case 'dashboard':
        return <DashboardPage setActiveTab={setActiveTab} />;
      case 'resume':
        return <ResumeUploadPage setActiveTab={setActiveTab} />;
      case 'target-role':
        return <TargetRolePage setActiveTab={setActiveTab} />;
      case 'skill-gap':
        return <SkillGapPage setActiveTab={setActiveTab} />;
      case 'readiness':
        return <ReadinessScorePage setActiveTab={setActiveTab} />;
      case 'roadmap':
        return <RoadmapPage setActiveTab={setActiveTab} />;
      case 'jobs':
        return <JobsPage setActiveTab={setActiveTab} />;
      case 'profile':
        return <ProfilePage setActiveTab={setActiveTab} />;
      case 'login':
        return <LoginPage setActiveTab={setActiveTab} />;
      case 'register':
        return <RegisterPage setActiveTab={setActiveTab} />;
      default:
        return <DashboardPage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-grow">
          {renderActiveView()}
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
}
