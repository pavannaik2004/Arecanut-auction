// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  login: `${API_BASE_URL}/api/auth/login`,
  register: `${API_BASE_URL}/api/auth/register`,
  
  // Farmer endpoints
  createAuction: `${API_BASE_URL}/api/farmer/create-auction`,
  myAuctions: `${API_BASE_URL}/api/farmer/my-auctions`,
  
  // Trader endpoints
  browseAuctions: `${API_BASE_URL}/api/trader/auctions`,
  getAuction: (id) => `${API_BASE_URL}/api/trader/auctions/${id}`,
  placeBid: `${API_BASE_URL}/api/trader/bid`,
  myBids: `${API_BASE_URL}/api/trader/my-bids`,
  
  // Admin endpoints
  pendingUsers: `${API_BASE_URL}/api/admin/pending-users`,
  approveUser: (id) => `${API_BASE_URL}/api/admin/approve-user/${id}`,
  rejectUser: (id) => `${API_BASE_URL}/api/admin/reject-user/${id}`,
  allAuctions: `${API_BASE_URL}/api/admin/all-auctions`,
  getAdminAuction: (id) => `${API_BASE_URL}/api/admin/auctions/${id}`,
  allTransactions: `${API_BASE_URL}/api/admin/transactions`,
  terminateAuction: (id) => `${API_BASE_URL}/api/admin/terminate-auction/${id}`,
  dashboardStats: `${API_BASE_URL}/api/admin/stats`,
};

export default API_BASE_URL;
