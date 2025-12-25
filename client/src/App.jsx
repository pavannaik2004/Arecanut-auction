import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardLayout from './layouts/DashboardLayout';

// Farmer Pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import CreateAuction from './pages/farmer/CreateAuction';

// Trader Pages
import TraderDashboard from './pages/trader/TraderDashboard';
import AuctionDetail from './pages/trader/AuctionDetail';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Farmer Routes */}
          <Route element={<ProtectedRoute allowedRoles={['farmer']}><DashboardLayout /></ProtectedRoute>}>
            <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
            <Route path="/farmer/create-auction" element={<CreateAuction />} />
          </Route>

          {/* Trader Routes */}
          <Route element={<ProtectedRoute allowedRoles={['trader']}><DashboardLayout /></ProtectedRoute>}>
            <Route path="/trader/dashboard" element={<TraderDashboard />} />
            <Route path="/trader/auction/:id" element={<AuctionDetail />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout /></ProtectedRoute>}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
