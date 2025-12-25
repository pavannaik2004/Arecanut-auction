import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
import AuctionCard from '../../components/AuctionCard';

const TraderDashboard = () => {
  const [auctions, setAuctions] = useState([]);
  const [filters, setFilters] = useState({ location: '', variety: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAuctions();
  }, [filters]); // Re-fetch when filters change

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters);
      const res = await axios.get(`${API_ENDPOINTS.browseAuctions}?${params.toString()}`);
      setAuctions(res.data);
    } catch (error) {
      console.error('Error fetching auctions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAuction = (auction) => {
    navigate(`/trader/auction/${auction._id}`);
  };

  const activeAuctions = auctions.filter(a => a.status === 'active');

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading">Browse Auctions</h2>
          <p className="text-gray-600 text-sm mt-1">{activeAuctions.length} live auctions available</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              placeholder="Search by location..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
            />
          </div>
          <div className="relative flex-1 md:flex-initial">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              placeholder="Search by variety..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={filters.variety}
              onChange={(e) => setFilters({...filters, variety: e.target.value})}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading auctions...</p>
          </div>
        </div>
      ) : activeAuctions.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No active auctions found</p>
          <p className="text-sm text-gray-400">Try adjusting your filters or check back later</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeAuctions.map((auction) => (
            <AuctionCard 
              key={auction._id} 
              auction={auction}
              showActions={true}
              onAction={handleViewAuction}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TraderDashboard;
