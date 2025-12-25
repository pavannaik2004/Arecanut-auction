import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plus, Clock, CheckCircle } from 'lucide-react';

const FarmerDashboard = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/farmer/my-auctions');
        setAuctions(res.data);
      } catch (error) {
        console.error("Error fetching auctions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-heading">My Auctions</h2>
        <Link to="/farmer/create-auction" className="flex items-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-amber-700">
          <Plus className="w-4 h-4 mr-2" /> Create New
        </Link>
      </div>

      {auctions.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500 mb-4">You haven't listed any auctions yet.</p>
          <Link to="/farmer/create-auction" className="text-primary font-bold hover:underline">Start selling today</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <div key={auction._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition">
              <div className="h-40 bg-gray-200 relative">
                 {/* Placeholder for image if authentic image not available */}
                {auction.image ? (
                   <img src={auction.image} alt={auction.variety} className="w-full h-full object-cover" />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
                <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 rounded text-xs font-bold uppercase tracking-wider">
                  {auction.status}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold font-heading text-primary bg-clip-text mb-1">{auction.variety}</h3>
                <p className="text-sm text-gray-500 mb-3">{auction.location} • {auction.qualityGrade}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-semibold">{auction.quantity} kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Price:</span>
                    <span className="font-semibold">₹{auction.basePrice}/kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Highest Bid:</span>
                    <span className="font-bold text-secondary">₹{auction.currentHighestBid || 0}</span>
                  </div>
                </div>

                <div className="pt-3 border-t flex justify-between items-center text-xs text-gray-500">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(auction.endTime).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
