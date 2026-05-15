import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './views/Dashboard/Dashboard';
import Sessions from './views/Sessions/Sessions';
import Journal from './views/Journal/Journal';
import Courses from './views/Courses/Courses';
import Profile from './views/Profile/Profile';
import MoodHistory from './views/History/MoodHistory';
import Fortaleza from './views/Fortaleza/Fortaleza';
import FactDetail from './views/Dashboard/FactDetail';
import VoiceSession from './views/Sessions/VoiceSession';
import VideoSession from './views/Sessions/VideoSession';
import Community from './views/Community/Community';
import LoginScreen from './views/Auth/LoginScreen';
import ResetPassword from './views/Auth/ResetPassword';
import OnboardingFlow from './views/Onboarding/OnboardingFlow';

function App() {
  return (
    <Router>
      <Routes>
        {/* Flujo de Inicio Elite (Mock) */}
        <Route path="/" element={<LoginScreen />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/onboarding" element={<OnboardingFlow />} />
        
        {/* Ecosistema Interno (Acceso Directo para Demo) */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<MoodHistory />} />
          <Route path="/fortaleza" element={<Fortaleza />} />
          <Route path="/fact-detail" element={<FactDetail />} />
          <Route path="/session/voice" element={<VoiceSession />} />
          <Route path="/session/video" element={<VideoSession />} />
          <Route path="/community" element={<Community />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;