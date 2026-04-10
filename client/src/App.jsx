import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home/Home';
import DashboardPreview from './pages/DashboardPreview/DashboardPreview';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Profile from './pages/Profile/Profile';
import ToolkitDashboard from './pages/Toolkit/ToolkitDashboard';
import AiCvOptimizer from './pages/Toolkit/AiCvOptimizer';
import AiLinkedInOptimizer from './pages/Toolkit/AiLinkedInOptimizer';
import SkillGapAnalyzer from './pages/Toolkit/SkillGapAnalyzer';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/demo" element={<DashboardPreview />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/toolkit" element={
              <ProtectedRoute>
                <ToolkitDashboard />
              </ProtectedRoute>
            } />
            <Route path="/toolkit/cv-optimizer" element={
              <ProtectedRoute>
                <AiCvOptimizer />
              </ProtectedRoute>
            } />
            <Route path="/toolkit/linkedin-optimizer" element={
              <ProtectedRoute>
                <AiLinkedInOptimizer />
              </ProtectedRoute>
            } />
            <Route path="/toolkit/skill-gap" element={
              <ProtectedRoute>
                <SkillGapAnalyzer />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
