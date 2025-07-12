import React, { useState, useEffect } from 'react';
import { X, Package, Coins, Send, AlertCircle, User, Star, Clock, Check, XCircle, Plus, Minus } from 'lucide-react';

export const SwapRequestModal = ({ isOpen, onClose, targetItem, user, onSwapRequested }) => {
  const [userItems, setUserItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [swapType, setSwapType] = useState('item');

  useEffect(() => {
    if (isOpen && user) {
      fetchUserItems();
    }
  }, [isOpen, user]);

  // Clear selected item when swap type changes
  useEffect(() => {
    if (swapType === 'points') {
      setSelectedItem(null);
    }
  }, [swapType]);

  const fetchUserItems = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/cloth/get-items-user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      if (result.success) {
        const availableItems = result.items.filter(item => item.status === 'available');
        setUserItems(availableItems);
      }
    } catch (error) {
      console.error('Error fetching user items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemSelection = (item) => {
    // Toggle selection - if clicking the same item, deselect it
    if (selectedItem?._id === item._id) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
    }
  };

  const handleSubmitSwapRequest = async () => {
    if (!targetItem || !user) return;

    if (swapType === 'item' && !selectedItem) {
      alert('Please select an item to offer');
      return;
    }

    if (swapType === 'points' && pointsToUse <= 0) {
      alert('Please enter a valid number of points');
      return;
    }

    if (swapType === 'points' && pointsToUse > user.points) {
      alert('You don\'t have enough points');
      return;
    }

    if (swapType === 'hybrid' && (!selectedItem || pointsToUse <= 0)) {
      alert('Please select an item and enter points for hybrid swap');
      return;
    }

    setSubmitLoading(true);
    try {
      const token = localStorage.getItem('token');
      const swapData = {
        owner: targetItem.user._id,
        itemRequested: targetItem._id,
        itemOffered: selectedItem ? selectedItem._id : null,
        pointsUsed: pointsToUse,
        message: message.trim(),
        swapType: swapType
      };

      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/swap/create-request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(swapData)
      });

      const result = await response.json();
      
      if (result.success) {
        onSwapRequested('Swap request sent successfully!', 'success');
        onClose();
        resetForm();
      } else {
        onSwapRequested(result.message || 'Failed to send swap request', 'error');
      }
    } catch (error) {
      console.error('Error submitting swap request:', error);
      onSwapRequested('Error sending swap request', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedItem(null);
    setPointsToUse(0);
    setMessage('');
    setSwapType('item');
  };

  const getSwapValue = () => {
    let totalValue = pointsToUse;
    if (selectedItem) {
      totalValue += selectedItem.point;
    }
    return totalValue;
  };

  const isSwapValueValid = () => {
    const offerValue = getSwapValue();
    const targetValue = targetItem?.point || 0;
    return offerValue >= targetValue * 0.8;
  };

  const adjustPoints = (increment) => {
    const newValue = pointsToUse + increment;
    if (newValue >= 0 && newValue <= (user?.points || 0)) {
      setPointsToUse(newValue);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Request Swap</h2>
            <p className="text-sm text-gray-600">Make an offer for this item</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Target Item Info */}
          <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Package className="mr-2 text-blue-600" size={20} />
              Item you want:
            </h3>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shadow-sm">
                {targetItem?.images?.[0] ? (
                  <img 
                    src={targetItem.images[0]} 
                    alt={targetItem.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={24} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-lg">{targetItem?.title}</h4>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Coins size={12} className="mr-1" />
                    {targetItem?.point} points
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <User size={12} className="mr-1" />
                    {targetItem?.user?.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Swap Type Selection */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Choose your swap method:</h3>
            <div className="space-y-3">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="swapType"
                  value="item"
                  checked={swapType === 'item'}
                  onChange={(e) => setSwapType(e.target.value)}
                  className="mr-3 text-blue-600"
                />
                <div className="flex items-center">
                  <Package className="mr-2 text-blue-600" size={18} />
                  <span className="font-medium">Trade an item from my collection</span>
                </div>
              </label>
              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="swapType"
                  value="points"
                  checked={swapType === 'points'}
                  onChange={(e) => setSwapType(e.target.value)}
                  className="mr-3 text-blue-600"
                />
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <Coins className="mr-2 text-green-600" size={18} />
                    <span className="font-medium">Use points only</span>
                  </div>
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    Available: {user?.points || 0} points
                  </span>
                </div>
              </label>
              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="swapType"
                  value="hybrid"
                  checked={swapType === 'hybrid'}
                  onChange={(e) => setSwapType(e.target.value)}
                  className="mr-3 text-blue-600"
                />
                <div className="flex items-center">
                  <div className="flex items-center mr-2">
                    <Package className="text-blue-600" size={16} />
                    <Plus className="text-gray-400 mx-1" size={12} />
                    <Coins className="text-green-600" size={16} />
                  </div>
                  <span className="font-medium">Combination of item + points</span>
                </div>
              </label>
            </div>
          </div>

          {/* Item Selection */}
          {(swapType === 'item' || swapType === 'hybrid') && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Select an item to offer:</h3>
                {selectedItem && (
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center"
                  >
                    <X size={14} className="mr-1" />
                    Clear Selection
                  </button>
                )}
              </div>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading your items...</p>
                </div>
              ) : userItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  <Package size={48} className="mx-auto mb-2 text-gray-300" />
                  <p className="font-medium">No items available</p>
                  <p className="text-sm">You don't have any available items to offer</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {userItems.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleItemSelection(item)}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedItem?._id === item._id
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                          {item.images?.[0] ? (
                            <img 
                              src={item.images[0]} 
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={16} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm truncate">{item.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              {item.point} pts
                            </span>
                            <span className="text-xs text-gray-500">{item.condition}</span>
                          </div>
                        </div>
                        {selectedItem?._id === item._id && (
                          <Check className="text-blue-600 flex-shrink-0" size={16} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Points Input */}
          {(swapType === 'points' || swapType === 'hybrid') && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Points to use:</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    type="button"
                    onClick={() => adjustPoints(-10)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    disabled={pointsToUse <= 0}
                  >
                    <Minus size={16} className="text-gray-600" />
                  </button>
                  <input
                    type="number"
                    value={pointsToUse}
                    onChange={(e) => setPointsToUse(Math.max(0, Math.min(user?.points || 0, parseInt(e.target.value) || 0)))}
                    max={user?.points || 0}
                    min="0"
                    className="w-24 px-3 py-2 text-center border-0 focus:outline-none focus:ring-0"
                    placeholder="0"
                  />
                  <button
                    type="button"
                    onClick={() => adjustPoints(10)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    disabled={pointsToUse >= (user?.points || 0)}
                  >
                    <Plus size={16} className="text-gray-600" />
                  </button>
                </div>
                <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                  <Coins size={16} className="mr-1" />
                  <span>Available: {user?.points || 0}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPointsToUse(user?.points || 0)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Use All
                </button>
              </div>
            </div>
          )}

          {/* Value Comparison */}
          <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Swap Value Comparison:</h3>
            <div className="flex justify-between items-center">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Your offer</p>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-2xl font-bold text-blue-600">{getSwapValue()}</span>
                  <Coins className="text-blue-600" size={20} />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedItem && `${selectedItem.point} from item`}
                  {selectedItem && pointsToUse > 0 && ' + '}
                  {pointsToUse > 0 && `${pointsToUse} points`}
                </p>
              </div>
              <div className="text-3xl text-gray-300">⇄</div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Their item</p>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-2xl font-bold text-green-600">{targetItem?.point || 0}</span>
                  <Coins className="text-green-600" size={20} />
                </div>
                <p className="text-xs text-gray-500 mt-1">Target value</p>
              </div>
            </div>
            {!isSwapValueValid() && (
              <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center text-amber-700">
                  <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                  <span className="text-sm">Your offer is below 80% of the item's value. Consider increasing your offer.</span>
                </div>
              </div>
            )}
          </div>

          {/* Message */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Personal message (optional):</h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message to increase your chances of acceptance..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
              maxLength="500"
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">{message.length}/500 characters</p>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setMessage("Hi! I'm really interested in this item. Would you consider my offer?")}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Use template
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitSwapRequest}
              disabled={
                submitLoading || 
                (swapType === 'item' && !selectedItem) || 
                (swapType === 'points' && pointsToUse <= 0) ||
                (swapType === 'hybrid' && (!selectedItem || pointsToUse <= 0)) ||
                pointsToUse > (user?.points || 0)
              }
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center font-medium"
            >
              {submitLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send size={16} className="mr-2" />
                  Send Request
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Swap Management Component
const SwapManagement = ({ user }) => {
  const [receivedSwaps, setReceivedSwaps] = useState([]);
  const [sentSwaps, setSentSwaps] = useState([]);
  const [activeTab, setActiveTab] = useState('received');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSwapRequests();
    }
  }, [user, activeTab]);

  const fetchSwapRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const endpoint = activeTab === 'received' ? 'received' : 'sent';
      
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/swap/${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      if (result.success) {
        if (activeTab === 'received') {
          setReceivedSwaps(result.swaps);
        } else {
          setSentSwaps(result.swaps);
        }
      }
    } catch (error) {
      console.error('Error fetching swap requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapAction = async (swapId, action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/swap/${action}/${swapId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      if (result.success) {
        fetchSwapRequests();
        alert(`Swap request ${action}ed successfully!`);
      } else {
        alert(result.message || `Failed to ${action} swap request`);
      }
    } catch (error) {
      console.error(`Error ${action}ing swap request:`, error);
      alert(`Error ${action}ing swap request`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'requested': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'requested': return <Clock size={14} />;
      case 'accepted': return <Check size={14} />;
      case 'declined': return <XCircle size={14} />;
      default: return null;
    }
  };

  const swaps = activeTab === 'received' ? receivedSwaps : sentSwaps;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('received')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'received'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Received Requests
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'sent'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Sent Requests
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading swap requests...</p>
            </div>
          ) : swaps.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package size={48} className="mx-auto mb-2 text-gray-300" />
              <p className="font-medium">No swap requests found</p>
              <p className="text-sm">
                {activeTab === 'received' 
                  ? "You haven't received any swap requests yet"
                  : "You haven't sent any swap requests yet"
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {swaps.map((swap) => (
                <div key={swap._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(swap.status)}`}>
                          {getStatusIcon(swap.status)}
                          <span className="ml-1 capitalize">{swap.status}</span>
                        </span>
                        <span className="text-sm text-gray-500">
                          {activeTab === 'received' ? swap.requester.name : swap.owner.name}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            {activeTab === 'received' ? 'They want:' : 'You want:'}
                          </p>
                          <p className="text-sm text-gray-900">{swap.itemRequested.title}</p>
                          <p className="text-xs text-gray-500">{swap.itemRequested.point} points</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            {activeTab === 'received' ? 'They offer:' : 'You offer:'}
                          </p>
                          {swap.itemOffered ? (
                            <>
                              <p className="text-sm text-gray-900">{swap.itemOffered.title}</p>
                              <p className="text-xs text-gray-500">{swap.itemOffered.point} points</p>
                            </>
                          ) : (
                            <p className="text-sm text-gray-900">Points only</p>
                          )}
                          {swap.pointsUsed > 0 && (
                            <p className="text-xs text-blue-600">+ {swap.pointsUsed} points</p>
                          )}
                        </div>
                      </div>

                      {swap.message && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="text-sm text-gray-700">{swap.message}</p>
                        </div>
                      )}
                    </div>

                    {activeTab === 'received' && swap.status === 'requested' && (
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleSwapAction(swap._id, 'accept')}
                          className="px-3 py-1 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleSwapAction(swap._id, 'decline')}
                          className="px-3 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};