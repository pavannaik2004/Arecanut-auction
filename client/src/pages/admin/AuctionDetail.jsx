import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const AuctionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [terminating, setTerminating] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_ENDPOINTS.getAdminAuction(id));
      setAuction(res.data.auction);
      setBids(res.data.bids);
    } catch (error) {
      console.error('Error fetching auction details:', error);
      alert('Failed to load auction details');
    } finally {
      setLoading(false);
    }
  };

  const handleTerminate = async () => {
    if (!window.confirm('Are you sure you want to terminate this auction? This action cannot be undone.')) {
      return;
    }

    try {
      setTerminating(true);
      await axios.put(API_ENDPOINTS.terminateAuction(id));
      alert('Auction terminated successfully!');
      fetchDetail(); // Refresh data
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to terminate auction');
    } finally {
      setTerminating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading auction details...</p>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">Auction not found</p>
        <button 
          onClick={() => navigate('/admin/dashboard')}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusColors = {
      active: 'bg-green-100 text-green-800',
      closed: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      terminated: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center text-primary hover:text-green-700 font-medium"
        >
          ← Back to Dashboard
        </button>
        {auction.status === 'active' && (
          <button
            onClick={handleTerminate}
            disabled={terminating}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {terminating ? 'Terminating...' : 'Terminate Auction'}
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Image & Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-2 rounded-xl border">
            {auction.image ? (
              <img src={auction.image} alt={auction.variety} className="w-full h-96 object-cover rounded-lg" />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-400 rounded-lg">
                No Image provided
              </div>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-heading font-bold text-primary mb-2">{auction.variety} Arecanut</h1>
                <div className="flex items-center gap-3 text-gray-500 mb-2">
                  <span>📍 {auction.location}</span>
                  <span>⚖️ {auction.quantity} kg</span>
                  <span>⭐ Grade {auction.qualityGrade}</span>
                </div>
              </div>
              {getStatusBadge(auction.status)}
            </div>

            <div className="border-t pt-4">
              <h3 className="font-bold text-lg mb-3">Auction Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 block">Farmer Name</span>
                  <span className="font-semibold">{auction.farmer?.name || 'Unknown'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Farmer Email</span>
                  <span className="font-semibold">{auction.farmer?.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Farm Location</span>
                  <span className="font-semibold">{auction.farmer?.farmLocation || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Base Price</span>
                  <span className="font-semibold">₹{auction.basePrice}/kg</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Start Time</span>
                  <span>{new Date(auction.startTime).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">End Time</span>
                  <span className={auction.status === 'active' ? 'text-red-500 font-medium' : ''}>
                    {new Date(auction.endTime).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Created At</span>
                  <span>{new Date(auction.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Auction ID</span>
                  <span className="font-mono text-xs">{auction._id}</span>
                </div>
              </div>
            </div>

            {auction.description && (
              <div className="border-t pt-4 mt-4">
                <h3 className="font-bold text-lg mb-2">Description</h3>
                <p className="text-gray-700">{auction.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Bidding Information */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-secondary">
            <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wider mb-1">Current Highest Bid</h3>
            <div className="text-4xl font-bold text-secondary mb-2">
              ₹{auction.currentHighestBid || auction.basePrice}
            </div>
            <p className="text-sm text-gray-500">
              {bids.length > 0 ? `${bids.length} bid(s) placed` : 'No bids yet'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-4">Bid History</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {bids.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No bids placed yet</p>
              ) : (
                bids.map((bid, index) => (
                  <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <div className="font-medium text-sm">{bid.trader?.name || 'Trader'}</div>
                        <div className="text-xs text-gray-500">{bid.trader?.email || 'N/A'}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-secondary">₹{bid.amount}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(bid.time).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Additional Stats */}
          <div className="bg-gradient-to-br from-primary to-green-700 p-6 rounded-xl text-white">
            <h3 className="font-bold mb-3">Auction Statistics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="opacity-90">Total Bids:</span>
                <span className="font-bold">{bids.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">Total Value:</span>
                <span className="font-bold">₹{(auction.currentHighestBid || auction.basePrice) * auction.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">Status:</span>
                <span className="font-bold">{auction.status.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;
