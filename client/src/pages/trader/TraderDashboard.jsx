import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Bell, CreditCard, AlertCircle } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
import AuctionCard from '../../components/AuctionCard';

const TraderDashboard = () => {
  const [auctions, setAuctions] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [filters, setFilters] = useState({ location: '', variety: '' });
  const [loading, setLoading] = useState(true);
  const [showPaymentAlert, setShowPaymentAlert] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAuctions();
    fetchPendingPayments();
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

  const fetchPendingPayments = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.traderPendingPayments);
      setPendingPayments(res.data);
    } catch (error) {
      console.error('Error fetching pending payments:', error);
    }
  };

  const handleViewAuction = (auction) => {
    navigate(`/trader/auction/${auction._id}`);
  };

  const activeAuctions = auctions.filter(a => a.status === 'active');

  return (
    <div>
      {/* Payment Notification Banner */}
      {pendingPayments.length > 0 && showPaymentAlert && (
        <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Bell className="h-6 w-6 text-amber-500 animate-bounce" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-bold text-amber-800 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    You have {pendingPayments.length} pending payment{pendingPayments.length > 1 ? 's' : ''}!
                  </h3>
                  <p className="mt-1 text-sm text-amber-700">
                    Congratulations on winning! Please complete the payment to the farmer.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowPaymentAlert(false)}
                className="text-amber-500 hover:text-amber-700"
              >
                ✕
              </button>
            </div>
            
            <div className="mt-4 space-y-3">
              {pendingPayments.map((payment) => (
                <div key={payment._id} className="bg-white rounded-lg p-4 border border-amber-200 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {payment.auction?.image && (
                      <img 
                        src={payment.auction.image} 
                        alt={payment.auction.variety}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <p className="font-bold text-gray-800">{payment.auction?.variety} Arecanut</p>
                      <p className="text-sm text-gray-600">📍 {payment.auction?.location} • ⚖️ {payment.auction?.quantity} kg</p>
                      <p className="text-sm text-gray-500">Farmer: {payment.farmer?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-secondary">₹{payment.amount?.toLocaleString()}</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending Payment
                    </span>
                    <button
                      onClick={() => navigate('/trader/payments')}
                      className="mt-2 flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-800 transition text-sm font-bold"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
