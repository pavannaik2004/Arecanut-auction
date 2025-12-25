import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserCheck, XCircle, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/pending-users');
      setPendingUsers(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/approve/${id}`);
      fetchPending(); // Refresh list
      alert('User Approved');
    } catch (error) {
      alert('Error approving user');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this user?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/reject/${id}`);
      fetchPending();
    } catch (error) {
      alert('Error rejecting user');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold font-heading mb-6">Admin Dashboard</h2>
      
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <UserCheck className="w-5 h-5 mr-2 text-primary" />
          Pending Approvals
        </h3>

        {pendingUsers.length === 0 ? (
          <p className="text-gray-500">No pending approvals.</p>
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
                        <button onClick={() => handleApprove(user._id)} className="flex items-center px-3 py-1 bg-green-50 text-green-700 hover:bg-green-100 rounded text-sm font-bold transition">
                          <CheckCircle className="w-4 h-4 mr-1" /> Approve
                        </button>
                        <button onClick={() => handleReject(user._id)} className="flex items-center px-3 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded text-sm font-bold transition">
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
    </div>
  );
};

export default AdminDashboard;
