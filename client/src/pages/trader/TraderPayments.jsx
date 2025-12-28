import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import { CheckCircle, Clock, XCircle, CreditCard } from 'lucide-react';

const TraderPayments = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_ENDPOINTS.traderPayments);
      setPayments(res.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompletePayment = async (paymentId) => {
    if (!confirm('Confirm payment completion?')) return;
    
    try {
      await axios.put(API_ENDPOINTS.completePayment(paymentId));
      alert('Payment completed successfully!');
      fetchPayments();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to complete payment');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-800 border border-yellow-300', text: 'Pending Payment' },
      completed: { icon: CheckCircle, color: 'bg-green-100 text-green-800 border border-green-300', text: 'Payment Successful' },
      failed: { icon: XCircle, color: 'bg-red-100 text-red-800 border border-red-300', text: 'Payment Failed' }
    };
    const { icon: Icon, color, text } = badges[status] || badges.pending;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {text}
      </span>
    );
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading font-bold text-primary">My Payments</h1>
      </div>

      {payments.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm text-center">
          <p className="text-gray-500">No payments yet</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {payments.map((payment) => (
            <div key={payment._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-primary">{payment.auction?.variety} Arecanut</h3>
                    {getStatusBadge(payment.status)}
                  </div>
                  <p className="text-gray-600">📍 {payment.auction?.location} • ⚖️ {payment.auction?.quantity} kg</p>
                  <p className="text-sm text-gray-500 mt-1">Farmer: {payment.farmer?.name}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-secondary">₹{payment.amount}</div>
                  <p className="text-xs text-gray-500 mt-1 font-mono">{payment.transactionId}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-t border-b">
                <div>
                  <span className="text-sm text-gray-500">Payment Method</span>
                  <p className="font-medium capitalize">{payment.paymentMethod?.replace('_', ' ')}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Payment Date</span>
                  <p className="font-medium">
                    {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'Not completed'}
                  </p>
                </div>
              </div>

              {payment.notes && (
                <div className="mt-4">
                  <span className="text-sm text-gray-500">Notes:</span>
                  <p className="text-sm mt-1">{payment.notes}</p>
                </div>
              )}

              {payment.status === 'pending' && (
                <div className="mt-4">
                  <button
                    onClick={() => handleCompletePayment(payment._id)}
                    className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-green-900 transition"
                  >
                    <CreditCard className="w-5 h-5 inline mr-2" />
                    Complete Payment
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TraderPayments;
