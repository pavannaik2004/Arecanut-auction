import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserCheck, XCircle, CheckCircle, TrendingUp, Users, Gavel, DollarSign, Activity, AlertCircle, Calendar, MapPin, Eye } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [pendingUsers, setPendingUsers] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [auctionFilter, setAuctionFilter] = useState('all');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchPendingUsers(),
        fetchAuctions(),
        fetchTransactions(),
        fetchStats()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingUsers = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.pendingUsers);
      setPendingUsers(res.data);
    } catch (error) {
      console.error('Error fetching pending users:', error);
    }
  };

  const fetchAuctions = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.allAuctions);
      setAuctions(res.data);
    } catch (error) {
      console.error('Error fetching auctions:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.allTransactions);
      setTransactions(res.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.dashboardStats);
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(API_ENDPOINTS.approveUser(id));
      fetchPendingUsers();
      fetchStats();
      alert('User Approved');
    } catch (error) {
      alert('Error approving user');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this user?')) return;
    try {
      await axios.delete(API_ENDPOINTS.rejectUser(id));
      fetchPendingUsers();
      alert('User Rejected');
    } catch (error) {
      alert('Error rejecting user');
    }
  };

  const handleTerminateAuction = async (id) => {
    if (!window.confirm('Are you sure you want to terminate this auction? This will close it immediately.')) return;
    try {
      await axios.put(API_ENDPOINTS.terminateAuction(id));
      fetchAuctions();
      fetchTransactions();
      fetchStats();
      alert('Auction terminated successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Error terminating auction');
    }
  };

  const getAuctionStatusColor = (auction) => {
    if (auction.status === 'closed' || auction.status === 'completed') {
      return 'bg-gray-100 border-gray-300';
    }
    
    const now = new Date();
    const endTime = new Date(auction.endTime);
    const hoursRemaining = (endTime - now) / (1000 * 60 * 60);
    
    if (hoursRemaining < 24) {
      return 'bg-yellow-50 border-yellow-300';
    }
    
    return 'bg-green-50 border-green-300';
  };

  const getAuctionStatusBadge = (auction) => {
    if (auction.status === 'closed' || auction.status === 'completed') {
      return <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-bold">{auction.status.toUpperCase()}</span>;
    }
    
    const now = new Date();
    const endTime = new Date(auction.endTime);
    const hoursRemaining = (endTime - now) / (1000 * 60 * 60);
    
    if (hoursRemaining < 24 && hoursRemaining > 0) {
      return <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-xs font-bold">CLOSING SOON</span>;
    }
    
    if (hoursRemaining > 0) {
      return <span className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-bold">LIVE</span>;
    }
    
    return <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-bold">EXPIRED</span>;
  };

  const filteredAuctions = auctions.filter(auction => {
    if (auctionFilter === 'all') return true;
    return auction.status === auctionFilter;
  });

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <Activity className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold font-heading mb-6">Admin Dashboard</h2>
      
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold">{stats.users.total}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.users.farmers} Farmers, {stats.users.traders} Traders
                </p>
              </div>
              <Users className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Auctions</p>
                <p className="text-3xl font-bold">{stats.auctions.total}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.auctions.active} Active
                </p>
              </div>
              <Gavel className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Bids</p>
                <p className="text-3xl font-bold">{stats.bidding.totalBids}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.bidding.totalTransactions} Completed
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Transaction Value</p>
                <p className="text-3xl font-bold">₹{(stats.bidding.totalTransactionValue / 1000).toFixed(1)}K</p>
                <p className="text-xs text-gray-500 mt-1">
                  Total Revenue
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-orange-500" />
            </div>
          </div>
        </div>
      )}

      {/* Pending Approvals Alert */}
      {pendingUsers.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mb-6 flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
          <div>
            <p className="font-bold text-yellow-900">Pending Approvals</p>
            <p className="text-sm text-yellow-700">
              You have {pendingUsers.length} user(s) waiting for approval
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-6 py-4 font-bold transition ${
              activeTab === 'overview' 
                ? 'bg-primary text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 px-6 py-4 font-bold transition ${
              activeTab === 'users' 
                ? 'bg-primary text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            User Approvals {pendingUsers.length > 0 && <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">{pendingUsers.length}</span>}
          </button>
          <button
            onClick={() => setActiveTab('auctions')}
            className={`flex-1 px-6 py-4 font-bold transition ${
              activeTab === 'auctions' 
                ? 'bg-primary text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Auctions
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 px-6 py-4 font-bold transition ${
              activeTab === 'transactions' 
                ? 'bg-primary text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Transactions
          </button>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-4">Platform Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600 font-bold mb-2">Active Auctions</p>
                    <p className="text-2xl font-bold text-blue-900">{stats?.auctions.active || 0}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600 font-bold mb-2">Completed Auctions</p>
                    <p className="text-2xl font-bold text-green-900">{stats?.auctions.completed || 0}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 font-bold mb-2">Closed (No Bids)</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.auctions.closed || 0}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
                <div className="space-y-2">
                  {transactions.slice(0, 5).map((txn, index) => (
                    <div key={txn._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">
                          {txn.auction?.variety} - {txn.auction?.quantity} KG
                        </p>
                        <p className="text-sm text-gray-600">
                          {txn.farmer?.name} → {txn.trader?.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">₹{txn.finalAmount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{new Date(txn.transactionDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <UserCheck className="w-5 h-5 mr-2 text-primary" />
                Pending Approvals
              </h3>

              {pendingUsers.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-500">No pending approvals. All users have been processed!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="pb-3 text-sm font-semibold text-gray-600">Name</th>
                        <th className="pb-3 text-sm font-semibold text-gray-600">Email</th>
                        <th className="pb-3 text-sm font-semibold text-gray-600">Role</th>
                        <th className="pb-3 text-sm font-semibold text-gray-600">Details</th>
                        <th className="pb-3 text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {pendingUsers.map((user) => (
                        <tr key={user._id}>
                          <td className="py-4 font-medium">{user.name}</td>
                          <td className="py-4 text-gray-600">{user.email}</td>
                          <td className="py-4 capitalize">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'farmer' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-4 text-sm text-gray-500">
                            {user.role === 'farmer' ? user.farmLocation : user.apmcLicense}
                          </td>
                          <td className="py-4">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleApprove(user._id)} 
                                className="flex items-center px-3 py-1 bg-green-50 text-green-700 hover:bg-green-100 rounded text-sm font-bold transition"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" /> Approve
                              </button>
                              <button 
                                onClick={() => handleReject(user._id)} 
                                className="flex items-center px-3 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded text-sm font-bold transition"
                              >
                                <XCircle className="w-4 h-4 mr-1" /> Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Auctions Tab */}
          {activeTab === 'auctions' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center">
                  <Gavel className="w-5 h-5 mr-2 text-primary" />
                  All Auctions ({filteredAuctions.length})
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAuctionFilter('all')}
                    className={`px-3 py-1 rounded text-sm font-bold transition ${
                      auctionFilter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setAuctionFilter('active')}
                    className={`px-3 py-1 rounded text-sm font-bold transition ${
                      auctionFilter === 'active' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Live
                  </button>
                  <button
                    onClick={() => setAuctionFilter('completed')}
                    className={`px-3 py-1 rounded text-sm font-bold transition ${
                      auctionFilter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => setAuctionFilter('closed')}
                    className={`px-3 py-1 rounded text-sm font-bold transition ${
                      auctionFilter === 'closed' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Closed
                  </button>
                </div>
              </div>

              {filteredAuctions.length === 0 ? (
                <div className="text-center py-12">
                  <Gavel className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No auctions found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAuctions.map((auction) => (
                    <div 
                      key={auction._id} 
                      className={`border-2 rounded-xl p-5 transition ${getAuctionStatusColor(auction)}`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-lg">{auction.variety}</h4>
                          <p className="text-sm text-gray-600">{auction.quantity} KG • Grade {auction.qualityGrade}</p>
                        </div>
                        {getAuctionStatusBadge(auction)}
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm">
                          <Users className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-gray-600">
                            {auction.farmer?.name}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-gray-600">{auction.location}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-gray-600">
                            {new Date(auction.endTime).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm text-gray-600">Base Price:</span>
                          <span className="font-bold">₹{auction.basePrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Highest Bid:</span>
                          <span className="font-bold text-green-600">₹{auction.currentHighestBid.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => navigate(`/admin/auction/${auction._id}`)}
                          className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-bold transition flex items-center justify-center"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </button>
                        {auction.status === 'active' && (
                          <button
                            onClick={() => handleTerminateAuction(auction._id)}
                            className="flex-1 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-bold transition flex items-center justify-center"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Terminate
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-primary" />
                All Transactions ({transactions.length})
              </h3>

              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No transactions yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="pb-3 text-sm font-semibold text-gray-600">Date</th>
                        <th className="pb-3 text-sm font-semibold text-gray-600">Product</th>
                        <th className="pb-3 text-sm font-semibold text-gray-600">Farmer</th>
                        <th className="pb-3 text-sm font-semibold text-gray-600">Trader</th>
                        <th className="pb-3 text-sm font-semibold text-gray-600">Amount</th>
                        <th className="pb-3 text-sm font-semibold text-gray-600">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {transactions.map((txn) => (
                        <tr key={txn._id}>
                          <td className="py-4 text-sm">
                            {new Date(txn.transactionDate).toLocaleDateString()}
                          </td>
                          <td className="py-4">
                            <div>
                              <p className="font-medium">{txn.auction?.variety}</p>
                              <p className="text-sm text-gray-600">
                                {txn.auction?.quantity} KG • {txn.auction?.location}
                              </p>
                            </div>
                          </td>
                          <td className="py-4">
                            <div>
                              <p className="font-medium">{txn.farmer?.name}</p>
                              <p className="text-sm text-gray-600">{txn.farmer?.email}</p>
                            </div>
                          </td>
                          <td className="py-4">
                            <div>
                              <p className="font-medium">{txn.trader?.name}</p>
                              <p className="text-sm text-gray-600">{txn.trader?.email}</p>
                            </div>
                          </td>
                          <td className="py-4 font-bold text-green-600">
                            ₹{txn.finalAmount.toLocaleString()}
                          </td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              txn.paymentStatus === 'paid' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {txn.paymentStatus.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
