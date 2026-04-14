import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/shared/ScrollToTop';
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
import History from './pages/History/History';
import Bootcamps from './pages/Bootcamps/Bootcamps';
import Contact from './pages/Contact/Contact';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="app-container">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/demo" element={<DashboardPreview />} />
            <Route path="/bootcamps" element={<Bootcamps />} />
            <Route path="/contact" element={<Contact />} />
            
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
            <Route path="/history" element={
              <ProtectedRoute>
                <History />
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
