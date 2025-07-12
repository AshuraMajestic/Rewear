import { useEffect, useState } from 'react';
import { User, Package, ArrowLeftRight, Star, Edit3, Calendar, Eye, Trash2, CheckCircle, XCircle, Clock, Truck, Gift, } from 'lucide-react';
import type { UserData } from '../../types/User';
import { useNavigate } from 'react-router-dom';
import type { Items } from '../../types/Items';
import { toast } from 'react-toastify';
import AddPointsModal from '../../components/AddPointsModel';

// Define types for swap requests
interface SwapRequest {
  _id: string;
  requester: {
    _id: string;
    name: string;
    email: string;
  };
  owner: {
    _id: string;
    name: string;
    email: string;
  };
  itemRequested: {
    _id: string;
    title: string;
    images: string[];
    point: number;
  };
  itemOffered?: {
    _id: string;
    title: string;
    images: string[];
    point: number;
  } | null;
  pointsUsed: number;
  message: string;
  swapType: 'item' | 'points' | 'hybrid';
  status: 'requested' | 'accepted' | 'declined' | 'completed' | 'shipped';
  createdAt: string;
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState<UserData>({
    _id: '',
    name: '',
    email: '',
    createdAt: '',
    points: 0
  });
  const [userItems, setUserItems] = useState<Items[]>([]);
  const [receivedSwaps, setReceivedSwaps] = useState<SwapRequest[]>([]);
  const [sentSwaps, setSentSwaps] = useState<SwapRequest[]>([]);
  const [showAddPointsModal, setShowAddPointsModal] = useState(false);
  const [swapActionLoading, setSwapActionLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  const handlePointsAdded = (newPoints: number) => {
    setUser(prev => ({
      ...prev,
      points: prev.points + newPoints
    }));
  };
  const handleClick = (path: string) => {
    navigate(path);
  };

  // Fetch user profile
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${import.meta.env.VITE_APP_API_URL as string}/user/get-profile`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          const data = await response.json();
          if (data.success) {
            setUser(data.userData);
          } else {
            localStorage.removeItem('token');
            navigate('/auth/login');
          }
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
    };

    checkAuth();
  }, []);

  // Fetch user items
  useEffect(() => {
    const getData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${import.meta.env.VITE_APP_API_URL as string}/cloth/get-items-user`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          const data = await response.json();
          if (data.success) {
            setUserItems(data.items);
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        toast.error("UnAuthorized");
        navigate('/auth/login');
      }
    };

    getData();
  }, []);

  // Fetch received swap requests
  useEffect(() => {
    const getReceivedSwaps = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${import.meta.env.VITE_APP_API_URL as string}/swap/received`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          const data = await response.json();
          if (data.success) {
            setReceivedSwaps(data.swaps);
          }
        } catch (error) {
          console.error('Error fetching received swaps:', error);
        }
      }
    };

    getReceivedSwaps();
  }, []);

  // Fetch sent swap requests
  useEffect(() => {
    const getSentSwaps = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${import.meta.env.VITE_APP_API_URL as string}/swap/sent`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          const data = await response.json();
          if (data.success) {
            setSentSwaps(data.swaps);
          }
        } catch (error) {
          console.error('Error fetching sent swaps:', error);
        }
      }
    };

    getSentSwaps();
  }, []);

  // Combine and format swap requests for display
  const getAllSwaps = () => {
    const received = receivedSwaps.map(swap => ({
      ...swap,
      type: 'incoming' as const
    }));
    const sent = sentSwaps.map(swap => ({
      ...swap,
      type: 'outgoing' as const
    }));
    return [...received, ...sent].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  // Get recent activity for overview
  const getRecentActivity = () => {
    const allSwaps = getAllSwaps();
    const recentSwaps = allSwaps.slice(0, 5).map(swap => ({
      id: swap._id,
      type: 'swap',
      action: swap.type === 'incoming' ? 'Received swap request' : 'Sent swap request',
      description: `${swap.itemRequested.title} • ${swap.status}`,
      date: swap.createdAt,
      status: swap.status,
      icon: getStatusIcon(swap.status)
    }));

    return recentSwaps;
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: user.name });

  const handleUpdateProfile = () => {
    setUser(prev => ({ ...prev, name: editForm.name }));
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'declined': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'requested': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'completed': return <Gift className="w-4 h-4" />;
      case 'declined': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL as string}/cloth/delete-item/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          toast.success("Item Deleted");
          setUserItems(prev => prev.filter(item => item._id !== id));
        } else {
          toast.error("Item Deletion Failed");
        }
      } catch (error) {
        toast.error("Item Deletion Failed");
      }
    }
  };

  // Handle swap request actions
  const handleAcceptSwap = async (swapId: string) => {
    setSwapActionLoading(swapId);
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL as string}/swap/accept/${swapId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          toast.success("Swap request accepted!");
          // Update the swap in state
          setReceivedSwaps(prev =>
            prev.map(swap =>
              swap._id === swapId ? { ...swap, status: 'accepted' } : swap
            )
          );
        } else {
          toast.error(data.message || "Failed to accept swap request");
        }
      } catch (error) {
        toast.error("Error accepting swap request");
      }
    }
    setSwapActionLoading(null);
  };

  const handleDeclineSwap = async (swapId: string) => {
    setSwapActionLoading(swapId);
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL as string}/swap/decline/${swapId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          toast.success("Swap request declined!");
          // Update the swap in state
          setReceivedSwaps(prev =>
            prev.map(swap =>
              swap._id === swapId ? { ...swap, status: 'declined' } : swap
            )
          );
        } else {
          toast.error(data.message || "Failed to decline swap request");
        }
      } catch (error) {
        toast.error("Error declining swap request");
      }
    }
    setSwapActionLoading(null);
  };

  const TabButton = ({ id, label, icon: Icon, count }: { id: string, label: string, icon: React.ComponentType<any>, count?: number }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg cursor-pointer font-medium transition-all ${activeTab === id
        ? 'bg-blue-600 text-white shadow-lg'
        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
        }`}
    >
      <Icon className="w-5 h-5" />
      {label}
      {count !== undefined && (
        <span className={`px-2 py-1 text-xs rounded-full ${activeTab === id ? 'bg-blue-500' : 'bg-gray-200 text-gray-700'
          }`}>
          {count}
        </span>
      )}
    </button>
  );

  const allSwaps = getAllSwaps();
  const recentActivity = getRecentActivity();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="text-2xl font-bold border-b-2 border-blue-500 bg-transparent focus:outline-none"
                      />
                      <button
                        onClick={handleUpdateProfile}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <Edit3 className="w-4 h-4 text-gray-500" />
                      </button>
                    </>
                  )}
                </div>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-2xl font-bold text-blue-600">
                <Star className="w-6 h-6" />
                {user.points}
              </div>
              <p className="text-sm text-gray-500">Points Available</p>
              <button
                onClick={() => setShowAddPointsModal(true)}
                className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all text-sm font-medium"
              >
                Add Points
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <TabButton id="overview" label="Overview" icon={User} />
          <TabButton id="items" label="My Items" icon={Package} count={userItems.length} />
          <TabButton id="swaps" label="Swap Requests" icon={ArrowLeftRight} count={allSwaps.length} />
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border">
          {activeTab === 'overview' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Stats Cards */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Package className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-blue-900">{userItems.length}</p>
                      <p className="text-blue-700">Items Listed</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ArrowLeftRight className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-green-900">
                        {allSwaps.filter(s => s.status === 'completed').length}
                      </p>
                      <p className="text-green-700">Completed Swaps</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Star className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold text-purple-900">{user.points}</p>
                      <p className="text-purple-700">Points Available</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-8 h-8 text-orange-600" />
                    <div>
                      <p className="text-2xl font-bold text-orange-900">
                        {allSwaps.filter(s => s.status === 'requested').length}
                      </p>
                      <p className="text-orange-700">Pending Requests</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                          {activity.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-gray-500">
                            {activity.description} • {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <ArrowLeftRight className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p>No recent activity</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Swap History Summary */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Swap History Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">Received Requests</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-medium">{receivedSwaps.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending:</span>
                        <span className="font-medium text-yellow-600">
                          {receivedSwaps.filter(s => s.status === 'requested').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Accepted:</span>
                        <span className="font-medium text-green-600">
                          {receivedSwaps.filter(s => s.status === 'accepted').length}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">Sent Requests</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-medium">{sentSwaps.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending:</span>
                        <span className="font-medium text-yellow-600">
                          {sentSwaps.filter(s => s.status === 'requested').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Accepted:</span>
                        <span className="font-medium text-green-600">
                          {sentSwaps.filter(s => s.status === 'accepted').length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'items' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">My Items</h3>
                <button onClick={() => handleClick("/addItem")} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Add New Item
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userItems.map((item) => (
                  <div key={item._id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-lg">{item.title}</h4>
                        <div className="flex items-center gap-1 text-blue-600 font-bold">
                          <Star className="w-4 h-4" />
                          {item.point}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{item.category} • {item.condition}</p>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'available'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                          }`}>
                          {item.status}
                        </span>
                        <div className="flex gap-2">
                          <button onClick={() => handleClick(`/editItem/${item._id}`)} className="cursor-pointer p-1 hover:bg-gray-100 rounded-full">
                            <Edit3 className="w-4 h-4 text-gray-500" />
                          </button>
                          <button className="cursor-pointer p-1 hover:bg-gray-100 rounded-full">
                            <Trash2 onClick={() => handleDelete(item._id)} className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'swaps' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Swap Requests</h3>
                <div className="flex gap-2">
                  <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                    Incoming ({receivedSwaps.length})
                  </span>
                  <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                    Outgoing ({sentSwaps.length})
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {allSwaps.map((swap) => (
                  <div key={swap._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={swap.itemRequested.images[0]}
                          alt={swap.itemRequested.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{swap.itemRequested.title}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(swap.status)}`}>
                              {swap.status}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(swap.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${swap.type === 'incoming'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                            }`}>
                            {swap.type === 'incoming' ? 'Incoming' : 'Outgoing'}
                          </span>
                          <span>•</span>
                          <span>
                            {swap.type === 'incoming'
                              ? `From ${swap.requester.name}`
                              : `To ${swap.owner.name}`}
                          </span>
                          <span>•</span>
                          <span className="capitalize">{swap.swapType} swap</span>
                        </div>

                        {swap.message && (
                          <p className="text-sm text-gray-600 mb-3 italic">"{swap.message}"</p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {swap.itemOffered ? (
                              <div className="flex items-center gap-2">
                                <ArrowLeftRight className="w-4 h-4 text-gray-400" />
                                <img
                                  src={swap.itemOffered.images[0]}
                                  alt={swap.itemOffered.title}
                                  className="w-8 h-8 object-cover rounded"
                                />
                                <span className="text-sm">{swap.itemOffered.title}</span>
                              </div>
                            ) : null}
                            {swap.pointsUsed > 0 && (
                              <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium">{swap.pointsUsed} Points</span>
                              </div>
                            )}
                          </div>

                          {swap.type === 'incoming' && swap.status === 'requested' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAcceptSwap(swap._id)}
                                disabled={swapActionLoading === swap._id}
                                className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {swapActionLoading === swap._id ? 'Processing...' : 'Accept'}
                              </button>
                              <button
                                onClick={() => handleDeclineSwap(swap._id)}
                                disabled={swapActionLoading === swap._id}
                                className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {swapActionLoading === swap._id ? 'Processing...' : 'Decline'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {allSwaps.length === 0 && (
                <div className="text-center py-12">
                  <ArrowLeftRight className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No swap requests</h3>
                  <p className="text-gray-500">You haven't sent or received any swap requests yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <AddPointsModal
        isOpen={showAddPointsModal}
        onClose={() => setShowAddPointsModal(false)}
        onPointsAdded={handlePointsAdded}
        currentPoints={user.points}
      />
    </div>
  );
}