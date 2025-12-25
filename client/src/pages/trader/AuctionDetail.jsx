import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const AuctionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_ENDPOINTS.getAuction(id));
      setAuction(res.data.auction);
      setBids(res.data.bids);
    } catch (error) {
      console.error('Error fetching auction details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBid = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!bidAmount || Number(bidAmount) < minBid) {
      setError(`Minimum bid is ₹${minBid}`);
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(API_ENDPOINTS.placeBid, {
        auctionId: id,
        amount: Number(bidAmount)
      });
      setBidAmount('');
      fetchDetail(); // Refresh data
      alert('Bid placed successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Bid failed');
    } finally {
      setSubmitting(false);
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

  if (!auction) return <div>Loading...</div>;

  const minBid = (auction.currentHighestBid || auction.basePrice) + 1;

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* Left Column: Image & Details */}
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white p-2 rounded-xl border">
             {auction.image ? (
                   <img src={auction.image} alt={auction.variety} className="w-full h-96 object-cover rounded-lg" />
                ) : (
                   <div className="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-400 rounded-lg">No Image provided</div>
                )}
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h1 className="text-3xl font-heading font-bold text-primary mb-2">{auction.variety} Arecanut</h1>
            <div className="flex items-center text-gray-500 mb-6">
                <span className="mr-4">📍 {auction.location}</span>
                <span className="mr-4">⚖️ {auction.quantity} kg</span>
                <span>⭐ Grade {auction.qualityGrade}</span>
            </div>

            <div className="border-t pt-4">
                <h3 className="font-bold text-lg mb-2">Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-500 block">Farmer</span>
                        <span className="font-semibold">{auction.farmer?.name || 'Unknown'}</span>
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
                        <span className="text-red-500 font-medium">{new Date(auction.endTime).toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Right Column: Bidding */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-secondary">
            <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wider mb-1">Current Highest Bid</h3>
            <div className="text-4xl font-bold text-secondary mb-6">₹{auction.currentHighestBid || auction.basePrice}</div>
            
            <form onSubmit={handleBid} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Bid Amount</label>
                    <div className="relative">
                         <span className="absolute left-3 top-2 text-gray-500">₹</span>
                         <input 
                            type="number" 
                            min={minBid}
                            className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none font-bold"
                            placeholder={`${minBid}`}
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            required
                         />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Minimum bid: ₹{minBid}</p>
                </div>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <button 
                  type="submit" 
                  disabled={submitting || auction.status !== 'active'}
                  className="w-full py-3 bg-secondary text-white font-bold rounded-lg hover:bg-amber-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Placing Bid...' : auction.status !== 'active' ? 'Auction Closed' : 'Place Bid'}
                </button>
            </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="font-bold text-lg mb-4">Recent Bids</h3>
             <div className="space-y-3">
                 {bids.length === 0 ? (
                     <p className="text-gray-500 text-sm">No bids yet. Be the first!</p>
                 ) : (
                     bids.map((bid, index) => (
                         <div key={index} className="flex justify-between items-center text-sm border-b pb-2 last:border-0 last:pb-0">
                             <div className="font-medium">{bid.trader?.name || 'Trader'}</div>
                             <div className="font-bold">₹{bid.amount}</div>
                             <div className="text-gray-400 text-xs">{new Date(bid.time).toLocaleTimeString()}</div>
                         </div>
                     ))
                 )}
             </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;
