import React, { useState, useEffect } from 'react';
import { Users, Package, ArrowRightLeft, MessageCircle, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

interface ApiData {
  users: number;
  items: number;
  exchanges: number;
  requests: number;
}

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate=useNavigate()

  const fetchDashboardData = async (): Promise<ApiData> => {
  const token = localStorage.getItem('adminToken');

  if (!token) {
    // no token → force login
    navigate('/auth/admin/login');
    // return zeros just to satisfy the signature (this will likely never be used)
    return { users: 0, items: 0, exchanges: 0, requests: 0 };
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/dashboard`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 401 || response.status === 403) {
      // unauthorized or forbidden → redirect to login
      navigate('/auth/admin/login');
      return { users: 0, items: 0, exchanges: 0, requests: 0 };
    }

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const json = await response.json();
    const { usersCount, itemsCount, itemsExchanged, itemsRequested } = json.data;

    return {
      users: usersCount,
      items: itemsCount,
      exchanges: itemsExchanged,
      requests: itemsRequested,
    };
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    // fallback or you could throw and handle upstream
    return {
      users: 0,
      items: 0,
      exchanges: 0,
      requests: 0,
    };
  }
};
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const dashboardData = await fetchDashboardData();
        setData(dashboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const dashboardCards: DashboardCard[] = [
    {
      title: "Number of Users",
      value: data?.users || 0,
      icon: <Users className="w-8 h-8" />,
      bgColor: "bg-blue-500",
      textColor: "text-blue-500"
    },
    {
      title: "Number of Items",
      value: data?.items || 0,
      icon: <Package className="w-8 h-8" />,
      bgColor: "bg-green-500",
      textColor: "text-green-500"
    },
    {
      title: "Items Exchanged",
      value: data?.exchanges || 0,
      icon: <ArrowRightLeft className="w-8 h-8" />,
      bgColor: "bg-purple-500",
      textColor: "text-purple-500"
    },
    {
      title: "Items Requested",
      value: data?.requests || 0,
      icon: <MessageCircle className="w-8 h-8" />,
      bgColor: "bg-orange-500",
      textColor: "text-orange-500"
    }
  ];

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await fetchDashboardData();
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's an overview of your platform.</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRightLeft className="w-4 h-4" />
              )}
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardCards.map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 relative"
              >
                {loading && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">{card.title}</h3>
                    <p className="text-3xl font-bold text-gray-900">
                      {card.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${card.bgColor} bg-opacity-10`}>
                    <div className={card.textColor}>
                      {card.icon}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Last Updated Info */}
          {data && !loading && (
            <div className="mt-6 text-sm text-gray-500 text-center">
              Last updated: {new Date().toLocaleString()}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;