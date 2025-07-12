import { useEffect, useState } from 'react';
import { User, Package, ArrowLeftRight, Star, Edit3, Calendar, Eye, Trash2, CheckCircle, XCircle, Clock, Truck, Gift, } from 'lucide-react';
import type { UserData } from '../../types/User';
import { useNavigate } from 'react-router-dom';
import type { Items } from '../../types/Items';
import { toast } from 'react-toastify';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState<UserData>({
    _id: '',
    name: '',
    email: '',
    createdAt: '',
    points: 0
  });
  const navigate = useNavigate()

  const handleClick = (path: string) => {
    navigate(path);
  };
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
            setUser(data.userData)
          } else {
            localStorage.removeItem('token');
            navigate('/auth/login')
          }
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
    };

    checkAuth();
  }, []);


  const [userItems, setUserItems] = useState<Items[]>([]);
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
          console.log(data)
          if (data.success) {
            setUserItems(data.items)
          }
        } catch (error) {
          console.error(error)
        }
      } else {
        toast.error("UnAuthorized")
        navigate('/auth/login')
      }
    };

    getData();
  }, []);



  const [swapRequests, setSwapRequests] = useState([
    {
      _id: '1',
      requester: { name: 'Alice Smith', _id: 'user1' },
      owner: { name: 'John Doe', _id: 'user2' },
      itemRequested: {
        title: 'Vintage Leather Jacket',
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=200&fit=crop']
      },
      itemOffered: {
        title: 'Silk Scarf',
        images: ['https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=200&fit=crop']
      },
      pointsUsed: 0,
      status: 'requested',
      createdAt: '2024-07-10',
      type: 'incoming'
    },
    {
      _id: '2',
      requester: { name: 'John Doe', _id: 'user2' },
      owner: { name: 'Bob Johnson', _id: 'user3' },
      itemRequested: {
        title: 'Gaming Headset',
        images: ['https://images.unsplash.com/photo-1599669454699-248893623440?w=300&h=200&fit=crop']
      },
      itemOffered: null,
      pointsUsed: 100,
      status: 'accepted',
      createdAt: '2024-07-08',
      type: 'outgoing'
    }
  ]);

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
  const handleDelete =async (id: string) => {
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
          </div>
        </div>
      </div>
    </div>

    {/* Navigation Tabs */}
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <TabButton id="overview" label="Overview" icon={User} />
        <TabButton id="items" label="My Items" icon={Package} count={userItems.length} />
        <TabButton id="swaps" label="Swap Requests" icon={ArrowLeftRight} count={swapRequests.length} />
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border">
        {activeTab === 'overview' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      {swapRequests.filter(s => s.status === 'completed').length}
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
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {swapRequests.slice(0, 3).map((swap) => (
                  <div key={swap._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-full ${getStatusColor(swap.status)}`}>
                      {getStatusIcon(swap.status)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {swap.type === 'incoming' ? 'Received' : 'Sent'} swap request
                      </p>
                      <p className="text-sm text-gray-500">
                        {swap.itemRequested.title} • {new Date(swap.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
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
                <button className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                  Incoming ({swapRequests.filter(s => s.type === 'incoming').length})
                </button>
                <button className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                  Outgoing ({swapRequests.filter(s => s.type === 'outgoing').length})
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {swapRequests.map((swap) => (
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
                      </div>

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
                          ) : (
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium">{swap.pointsUsed} Points</span>
                            </div>
                          )}
                        </div>

                        {swap.type === 'incoming' && swap.status === 'requested' && (
                          <div className="flex gap-2">
                            <button className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700">
                              Accept
                            </button>
                            <button className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700">
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
}