import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import { Check, X, Edit2, Save } from 'lucide-react';

const PendingAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ qualityGrade: '', basePrice: '' });

  useEffect(() => {
    fetchPendingAuctions();
  }, []);

  const fetchPendingAuctions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_ENDPOINTS.pendingAuctions);
      setAuctions(res.data);
    } catch (error) {
      console.error('Error fetching pending auctions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (auction) => {
    setEditingId(auction._id);
    setEditForm({
      qualityGrade: auction.qualityGrade,
      basePrice: auction.basePrice
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      await axios.put(API_ENDPOINTS.editAuction(id), editForm);
      alert('Auction updated successfully!');
      setEditingId(null);
      fetchPendingAuctions();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update auction');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ qualityGrade: '', basePrice: '' });
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(API_ENDPOINTS.approveAuction(id));
      alert('Auction approved successfully!');
      fetchPendingAuctions();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to approve auction');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Enter reason for rejection:');
    if (!reason) return;

    try {
      await axios.delete(API_ENDPOINTS.rejectAuction(id), { data: { reason } });
      alert('Auction rejected');
      fetchPendingAuctions();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to reject auction');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading font-bold text-primary">Pending Auctions - Quality Assurance</h1>
      
      {auctions.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm text-center">
          <p className="text-gray-500">No pending auctions for approval</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <div key={auction._id} className="bg-white rounded-xl shadow-sm border border-yellow-200 overflow-hidden">
              {auction.image ? (
                <img src={auction.image} alt={auction.variety} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              
              <div className="p-5 space-y-3">
                <h3 className="text-xl font-bold text-primary">{auction.variety}</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Farmer:</strong> {auction.farmer?.name}</p>
                  <p><strong>Quantity:</strong> {auction.quantity} kg</p>
                  
                  {editingId === auction._id ? (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Quality Grade:</label>
                        <select
                          value={editForm.qualityGrade}
                          onChange={(e) => setEditForm({ ...editForm, qualityGrade: e.target.value })}
                          className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-primary focus:outline-none"
                        >
                          <option value="A+">A+ - Super Premium</option>
                          <option value="A">A - Premium</option>
                          <option value="B">B - Standard</option>
                          <option value="C">C - Economy</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Base Price (₹/kg):</label>
                        <input
                          type="number"
                          value={editForm.basePrice}
                          onChange={(e) => setEditForm({ ...editForm, basePrice: e.target.value })}
                          className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <p><strong>Quality Grade:</strong> {auction.qualityGrade}</p>
                      <p><strong>Base Price:</strong> ₹{auction.basePrice}/kg</p>
                    </>
                  )}
                  
                  <p><strong>Location:</strong> {auction.location}</p>
                  <p><strong>End Time:</strong> {new Date(auction.endTime).toLocaleString()}</p>
                </div>

                {editingId === auction._id ? (
                  <div className="flex space-x-2 pt-4">
                    <button
                      onClick={() => handleSaveEdit(auction._id)}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition flex items-center justify-center"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2 pt-4">
                    <button
                      onClick={() => handleEdit(auction)}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleApprove(auction._id)}
                      className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(auction._id)}
                      className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingAuctions;
