import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Eye, Calendar, User, Package, Layers, Ruler, Shield, Activity } from 'lucide-react';
import type { Items } from '../../types/Items';
import { useParams } from 'react-router-dom';

export default function ItemsDetails() {
  const id=useParams<{ id: string }>();
  const [item, setItem] = useState<Items | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchItems=async()=>{

  }
  useEffect(() => {
    fetchItems()
  }, [id]);

  const nextImage = () => {
    if (item && item.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
    }
  };

  const prevImage = () => {
    if (item && item.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'swapped':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Item Not Found</h2>
          <p className="text-gray-600">The item you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left side - Image slideshow */}
            <div className="relative">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {item.images.length > 0 ? (
                  <img
                    src={item.images[currentImageIndex]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Package size={64} />
                  </div>
                )}
                
                {/* Navigation arrows */}
                {item.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all"
                    >
                      <ChevronLeft size={24} className="text-gray-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all"
                    >
                      <ChevronRight size={24} className="text-gray-700" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Image indicators */}
              {item.images.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  {item.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
              
              {/* Thumbnail strip */}
              {item.images.length > 1 && (
                <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
                  {item.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex ? 'border-blue-600' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${item.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right side - Item details */}
            <div className="p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Eye size={16} className="mr-1" />
                    <span>{item.views} views</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    <span>Listed on {formatDate(item.createdAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <User size={16} className="mr-1" />
                    <span>by {item.user.name}</span>
                  </div>
                </div>
              </div>

              {/* Points */}
              <div className="mb-6">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {item.point} Points
                </div>
                <p className="text-gray-600 text-sm">Swap value for this item</p>
              </div>

              {/* Status and Condition */}
              <div className="mb-6 flex space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(item.condition)}`}>
                  {item.condition}
                </span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>

              {/* Item specifications */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Layers size={16} className="mr-2 text-gray-400" />
                    <span className="text-sm text-gray-600">Category:</span>
                    <span className="ml-2 text-sm font-medium">{item.category}</span>
                  </div>
                  <div className="flex items-center">
                    <Package size={16} className="mr-2 text-gray-400" />
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className="ml-2 text-sm font-medium">{item.type}</span>
                  </div>
                  <div className="flex items-center">
                    <Ruler size={16} className="mr-2 text-gray-400" />
                    <span className="text-sm text-gray-600">Size:</span>
                    <span className="ml-2 text-sm font-medium">{item.size}</span>
                  </div>
                  <div className="flex items-center">
                    <Shield size={16} className="mr-2 text-gray-400" />
                    <span className="text-sm text-gray-600">Condition:</span>
                    <span className="ml-2 text-sm font-medium">{item.condition}</span>
                  </div>
                </div>
              </div>

              {/* Request Swap Button */}
              <div className="space-y-3">
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  disabled={item.status.toLowerCase() !== 'available'}
                >
                  <Activity size={20} className="mr-2" />
                  {item.status.toLowerCase() === 'available' ? 'Request Swap' : 'Not Available'}
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                  Add to Wishlist
                </button>
              </div>

              {/* Additional info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Swap Information</h4>
                <p className="text-sm text-gray-600">
                  By requesting a swap, you'll enter into a negotiation with the item owner. 
                  Make sure you have items of similar value to offer in return.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}