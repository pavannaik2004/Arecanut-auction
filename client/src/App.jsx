import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardLayout from './layouts/DashboardLayout';

// Farmer Pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import CreateAuction from './pages/farmer/CreateAuction';
import FarmerPayments from './pages/farmer/FarmerPayments';

// Trader Pages
import TraderDashboard from './pages/trader/TraderDashboard';
import BrowseAuctions from './pages/trader/BrowseAuctions';
import MyBids from './pages/trader/MyBids';
import AuctionDetail from './pages/trader/AuctionDetail';
import TraderPayments from './pages/trader/TraderPayments';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAuctionDetail from './pages/admin/AuctionDetail';
import PendingApprovals from './pages/admin/PendingApprovals';
import PendingAuctions from './pages/admin/PendingAuctions';
import AllFarmers from './pages/admin/AllFarmers';
import AllTraders from './pages/admin/AllTraders';
import AllPayments from './pages/admin/AllPayments';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
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
            <Route path="/farmer/payments" element={<FarmerPayments />} />
          </Route>

          {/* Trader Routes */}
          <Route element={<ProtectedRoute allowedRoles={['trader']}><DashboardLayout /></ProtectedRoute>}>
            <Route path="/trader/dashboard" element={<TraderDashboard />} />
            <Route path="/trader/browse" element={<BrowseAuctions />} />
            <Route path="/trader/my-bids" element={<MyBids />} />
            <Route path="/trader/auction/:id" element={<AuctionDetail />} />
            <Route path="/trader/payments" element={<TraderPayments />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout /></ProtectedRoute>}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/pending-approvals" element={<PendingApprovals />} />
            <Route path="/admin/pending-auctions" element={<PendingAuctions />} />
            <Route path="/admin/farmers" element={<AllFarmers />} />
            <Route path="/admin/traders" element={<AllTraders />} />
            <Route path="/admin/payments" element={<AllPayments />} />
            <Route path="/admin/auction/:id" element={<AdminAuctionDetail />} />
          </Route>

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
