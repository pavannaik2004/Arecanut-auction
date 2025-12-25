import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, Package, DollarSign } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
import AuctionCard from '../../components/AuctionCard';

const FarmerDashboard = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.myAuctions);
        setAuctions(res.data);
      } catch (error) {
        console.error("Error fetching auctions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  const filteredAuctions = auctions.filter(auction => {
    if (filter === 'all') return true;
    return auction.status === filter;
  });

  const stats = {
    total: auctions.length,
    active: auctions.filter(a => a.status === 'active').length,
    completed: auctions.filter(a => a.status === 'completed').length,
    totalRevenue: auctions
      .filter(a => a.status === 'completed')
      .reduce((sum, a) => sum + a.currentHighestBid, 0)
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your auctions...</p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-heading">My Auctions</h2>
        <Link 
          to="/farmer/create-auction" 
          className="flex items-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-amber-700 transition font-bold"
        >
          <Plus className="w-4 h-4 mr-2" /> Create New Auction
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Auctions</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <Package className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active</p>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-blue-600">{stats.completed}</p>
            </div>
            <Package className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-orange-600">₹{(stats.totalRevenue / 1000).toFixed(1)}K</p>
            </div>
            <DollarSign className="w-10 h-10 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-bold transition ${
            filter === 'all' ? 'bg-primary text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'
          }`}
        >
          All ({auctions.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg font-bold transition ${
            filter === 'active' ? 'bg-green-500 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'
          }`}
        >
          Live ({stats.active})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg font-bold transition ${
            filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'
          }`}
        >
          Completed ({stats.completed})
        </button>
        <button
          onClick={() => setFilter('closed')}
          className={`px-4 py-2 rounded-lg font-bold transition ${
            filter === 'closed' ? 'bg-gray-500 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'
          }`}
        >
          Closed ({auctions.filter(a => a.status === 'closed').length})
        </button>
      </div>

      {/* Auctions Grid */}
      {filteredAuctions.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">
            {filter === 'all' 
              ? "You haven't listed any auctions yet." 
              : `No ${filter} auctions found.`}
          </p>
          <Link 
            to="/farmer/create-auction" 
            className="text-primary font-bold hover:underline"
          >
            Create your first auction
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map((auction) => (
            <AuctionCard 
              key={auction._id} 
              auction={auction}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
