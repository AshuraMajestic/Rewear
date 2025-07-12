import React, { useState } from 'react';
import { X, Star, CreditCard, Check } from 'lucide-react';
import { toast } from 'react-toastify';

interface PointsPackage {
  id: string;
  rupees: number;
  points: number;
  bonus?: number;
  popular?: boolean;
}

interface AddPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPointsAdded: (points: number) => void;
  currentPoints: number;
}

const AddPointsModal: React.FC<AddPointsModalProps> = ({ 
  isOpen, 
  onClose, 
  onPointsAdded,
  currentPoints 
}) => {
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const pointsPackages: PointsPackage[] = [
    {
      id: 'starter',
      rupees: 99,
      points: 100,
    },
    {
      id: 'basic',
      rupees: 199,
      points: 220,
      bonus: 20,
    },
    {
      id: 'premium',
      rupees: 499,
      points: 600,
      bonus: 100,
      popular: true,
    },
    {
      id: 'mega',
      rupees: 999,
      points: 1300,
      bonus: 300,
    },
    {
      id: 'ultimate',
      rupees: 1999,
      points: 2800,
      bonus: 800,
    },
  ];

  const handlePurchase = async () => {
    if (!selectedPackage) {
      toast.error('Please select a package');
      return;
    }

    const packageData = pointsPackages.find(pkg => pkg.id === selectedPackage);
    if (!packageData) return;

    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to purchase points');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/user/add-points`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          packageId: packageData.id,
          rupees: packageData.rupees,
          points: packageData.points,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`Successfully added ${packageData.points} points!`);
        onPointsAdded(packageData.points);
        onClose();
      } else {
        toast.error(data.message || 'Failed to purchase points');
      }
    } catch (error) {
      console.error('Error purchasing points:', error);
      toast.error('Error purchasing points. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Add Points</h2>
              <p className="text-sm text-gray-500">Current Balance: {currentPoints} Points</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Choose Your Package</h3>
            <p className="text-gray-600 text-sm">
              Select a points package to enhance your swapping experience
            </p>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {pointsPackages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg ${
                  selectedPackage === pkg.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${pkg.popular ? 'ring-2 ring-purple-500 ring-opacity-50' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <span className="font-bold text-xl text-gray-900">₹{pkg.rupees}</span>
                  </div>
                  {selectedPackage === pkg.id && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-blue-900">{pkg.points} Points</span>
                  </div>
                  
                  {pkg.bonus && (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">+</span>
                      </div>
                      <span className="text-green-600 font-medium">
                        {pkg.bonus} Bonus Points
                      </span>
                    </div>
                  )}
                  
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Points:</span>
                      <span className="font-bold text-lg text-gray-900">
                        {pkg.points}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">Price per point:</span>
                      <span className="text-xs text-gray-500">
                        ₹{(pkg.rupees / pkg.points).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Package Summary */}
          {selectedPackage && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Purchase Summary</h4>
              {(() => {
                const pkg = pointsPackages.find(p => p.id === selectedPackage);
                if (!pkg) return null;
                return (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Package:</span>
                      <span className="font-medium capitalize">{pkg.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-bold text-lg">₹{pkg.rupees}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Points:</span>
                      <span className="font-bold text-lg text-blue-600">{pkg.points}</span>
                    </div>
                    {pkg.bonus && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Bonus:</span>
                        <span className="font-bold text-lg text-green-600">+{pkg.bonus}</span>
                      </div>
                    )}
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">New Balance:</span>
                        <span className="font-bold text-xl text-purple-600">
                          {currentPoints + pkg.points} Points
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handlePurchase}
              disabled={!selectedPackage || loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Purchase Points
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
            <span>Instant point delivery • Secure payment • 24/7 support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPointsModal;