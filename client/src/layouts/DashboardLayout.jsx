import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Gavel, LogOut, Package, UserCheck, PlusCircle } from 'lucide-react';
import clsx from 'clsx';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = {
    farmer: [
      { label: 'Dashboard', path: '/farmer/dashboard', icon: LayoutDashboard },
      { label: 'Create Auction', path: '/farmer/create-auction', icon: PlusCircle },
    ],
    trader: [
      { label: 'Dashboard', path: '/trader/dashboard', icon: LayoutDashboard },
      { label: 'Browse Auctions', path: '/trader/dashboard', icon: Gavel }, // Initially dashboard is browse
    ],
    admin: [
      { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Approvals', path: '/admin/dashboard', icon: UserCheck },
    ]
  };

  const currentNavs = user ? navItems[user.role] : [];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className={clsx("bg-primary text-white w-64 flex-shrink-0 transition-all duration-300", !isSidebarOpen && "-ml-64")}>
        <div className="p-6">
          <h1 className="text-2xl font-heading font-bold">ArecaAuction</h1>
          <p className="text-sm text-green-200 mt-1 capitalize">{user?.role} Portal</p>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          {currentNavs.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                "flex items-center px-4 py-3 rounded-lg transition-colors",
                location.pathname === item.path ? "bg-white/20" : "hover:bg-white/10"
              )}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 mt-8 hover:bg-red-500/20 rounded-lg text-red-200 hover:text-red-100 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-600 hover:text-primary">
            <LayoutDashboard className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-4">
            <span className="font-medium text-gray-700">Welcome, {user?.name}</span>
          </div>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
