import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const CreateAuction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    variety: '', quantity: '', qualityGrade: '', basePrice: '', location: '', endTime: '', image: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      setLoading(true);
      await axios.post(API_ENDPOINTS.createAuction, formData);
      navigate('/farmer/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating auction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold font-heading mb-6">Create New Auction</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-1">Arecanut Variety</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="e.g. Rashi"
              value={formData.variety}
              onChange={(e) => setFormData({...formData, variety: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Quantity (kg)</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-1">Quality Grade</label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              value={formData.qualityGrade}
              onChange={(e) => setFormData({...formData, qualityGrade: e.target.value})}
              required
            >
              <option value="">Select Grade</option>
              <option value="A+">A+ (Export Quality)</option>
              <option value="A">A (Premium)</option>
              <option value="B">B (Standard)</option>
              <option value="C">C (Low)</option>
            </select>
          </div>
          <div>
             <label className="block text-gray-700 mb-1">APMC Location</label>
             <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="e.g. Shimoga"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
           <div>
            <label className="block text-gray-700 mb-1">Base Price (per kg)</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">₹</span>
              <input
                type="number"
                className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.basePrice}
                onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Auction End Time</label>
            <input
              type="datetime-local"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              value={formData.endTime}
              onChange={(e) => setFormData({...formData, endTime: e.target.value})}
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Image URL (Optional)</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="https://example.com/image.jpg"
            value={formData.image}
            onChange={(e) => setFormData({...formData, image: e.target.value})}
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button 
            type="button" 
            onClick={() => navigate('/farmer/dashboard')} 
            className="px-6 py-2 border rounded-lg hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-800 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Auction'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAuction;
