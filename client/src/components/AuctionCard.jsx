import { Calendar, MapPin, TrendingUp, Package, Award } from 'lucide-react';

const AuctionCard = ({ auction, showActions = false, onAction }) => {
  const getAuctionStatusInfo = () => {
    if (auction.status === 'closed' || auction.status === 'completed') {
      return {
        bgColor: 'bg-gray-100',
        borderColor: 'border-gray-300',
        badgeColor: 'bg-gray-200 text-gray-700',
        badgeText: auction.status.toUpperCase(),
        statusIcon: '⚫'
      };
    }
    
    const now = new Date();
    const endTime = new Date(auction.endTime);
    const hoursRemaining = (endTime - now) / (1000 * 60 * 60);
    
    if (hoursRemaining <= 0) {
      return {
        bgColor: 'bg-gray-100',
        borderColor: 'border-gray-300',
        badgeColor: 'bg-gray-200 text-gray-700',
        badgeText: 'EXPIRED',
        statusIcon: '⚫'
      };
    }
    
    if (hoursRemaining < 24) {
      return {
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-300',
        badgeColor: 'bg-yellow-200 text-yellow-800',
        badgeText: 'CLOSING SOON',
        statusIcon: '🟡',
        timeRemaining: `${Math.floor(hoursRemaining)}h ${Math.floor((hoursRemaining % 1) * 60)}m remaining`
      };
    }
    
    return {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      badgeColor: 'bg-green-200 text-green-800',
      badgeText: 'LIVE',
      statusIcon: '🟢',
      timeRemaining: `${Math.floor(hoursRemaining / 24)}d ${Math.floor(hoursRemaining % 24)}h remaining`
    };
  };

  const statusInfo = getAuctionStatusInfo();

  return (
    <div className={`${statusInfo.bgColor} border-2 ${statusInfo.borderColor} rounded-xl p-5 hover:shadow-lg transition-all duration-200`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-xl mb-1">{auction.variety}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package className="w-4 h-4" />
            <span>{auction.quantity} KG</span>
            <span className="mx-1">•</span>
            <Award className="w-4 h-4" />
            <span>Grade {auction.qualityGrade}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusInfo.badgeColor}`}>
          {statusInfo.statusIcon} {statusInfo.badgeText}
        </span>
      </div>

      {/* Location */}
      <div className="flex items-center text-sm text-gray-700 mb-3">
        <MapPin className="w-4 h-4 mr-2 text-gray-500" />
        <span>{auction.location}</span>
      </div>

      {/* Time */}
      <div className="flex items-center text-sm text-gray-700 mb-4">
        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
        <div>
          <p>Ends: {new Date(auction.endTime).toLocaleString()}</p>
          {statusInfo.timeRemaining && (
            <p className="text-xs text-gray-600 mt-0.5">{statusInfo.timeRemaining}</p>
          )}
        </div>
      </div>

      {/* Image */}
      {auction.image && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img 
            src={auction.image} 
            alt={auction.variety}
            className="w-full h-40 object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Pricing */}
      <div className="border-t border-gray-300 pt-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Base Price:</span>
          <span className="font-bold text-gray-900">₹{auction.basePrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            Current Bid:
          </span>
          <span className="font-bold text-lg text-green-600">₹{auction.currentHighestBid.toLocaleString()}</span>
        </div>
        {auction.currentHighestBid > auction.basePrice && (
          <div className="text-xs text-green-600 text-right">
            +₹{(auction.currentHighestBid - auction.basePrice).toLocaleString()} above base
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && onAction && (
        <button
          onClick={() => onAction(auction)}
          className="w-full mt-4 px-4 py-2 bg-primary text-white hover:bg-primary-dark rounded-lg font-bold transition"
        >
          View Details
        </button>
      )}
    </div>
  );
};

export default AuctionCard;
