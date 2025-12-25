import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TraderDashboard = () => {
  const [auctions, setAuctions] = useState([]);
  const [filters, setFilters] = useState({ location: '', variety: '' });

  useEffect(() => {
    fetchAuctions();
  }, [filters]); // Re-fetch when filters change (debouncing suggested for real apps)

  const fetchAuctions = async () => {
    try {
      const params = new URLSearchParams(filters);
      const res = await axios.get(`http://localhost:5000/api/trader/auctions?${params.toString()}`);
      setAuctions(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold font-heading">Live Auctions</h2>
        
        <div className="flex space-x-2 w-full md:w-auto">
          <input
            placeholder="Filter by Location..."
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50"
            value={filters.location}
            onChange={(e) => setFilters({...filters, location: e.target.value})}
          />
           <input
            placeholder="Filter by Variety..."
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50"
            value={filters.variety}
            onChange={(e) => setFilters({...filters, variety: e.target.value})}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auctions.map((auction) => (
          <div key={auction._id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden border border-gray-100">
             <div className="h-48 bg-gray-200 relative">
                 {/* Placeholder for image */}
                {auction.image ? (
                   <img src={auction.image} alt={auction.variety} className="w-full h-full object-cover" />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-white font-bold text-lg">{auction.variety}</h3>
                    <p className="text-gray-200 text-sm">{auction.location}</p>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">Grade: {auction.qualityGrade}</div>
                    <div className="text-xs text-gray-500">Ends: {new Date(auction.endTime).toLocaleDateString()}</div>
                </div>

                <div className="flex justify-between items-end mb-4">
                    <div>
                        <p className="text-xs text-gray-500">Current Highest Bid</p>
                        <p className="text-xl font-bold text-secondary">₹{auction.currentHighestBid || auction.basePrice}</p>
                    </div>
                     <div className="text-right">
                        <p className="text-xs text-gray-500">Quantity</p>
                        <p className="font-semibold">{auction.quantity} kg</p>
                    </div>
                </div>

                <Link to={`/trader/auction/${auction._id}`} className="block w-full text-center py-2 bg-primary text-white rounded-lg hover:bg-green-800 transition font-medium">
                    View & Bid
                </Link>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TraderDashboard;
