import { Heart, Recycle, Users, Shirt, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';

const Home = () => {
  const navigate = useNavigate();

  const handleClick = (path: string) => {
    navigate(path);
  };

  const featuredItems = [
    {
      id: 1,
      title: "Vintage Denim Jacket",
      category: "Outerwear",
      condition: "Like New",
      points: 45,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
      user: "Sarah M."
    },
    {
      id: 2,
      title: "Designer Silk Scarf",
      category: "Accessories",
      condition: "Excellent",
      points: 30,
      image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop",
      user: "Emma K."
    },
    {
      id: 3,
      title: "Cashmere Sweater",
      category: "Knitwear",
      condition: "Good",
      points: 60,
      image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop",
      user: "Lisa R."
    },
    {
      id: 4,
      title: "Leather Boots",
      category: "Footwear",
      condition: "Like New",
      points: 55,
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop",
      user: "Alex T."
    }
  ];

  const stats = [
    { icon: Shirt, value: "10K+", label: "Items Swapped" },
    { icon: Users, value: "5K+", label: "Active Users" },
    { icon: Recycle, value: "50K+", label: "Items Saved" },
    { icon: Heart, value: "95%", label: "Satisfaction Rate" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Swap, Share,
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                {" "}Sustain
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform your wardrobe sustainably. Exchange unused clothing through direct swaps
              or our point-based system. Join thousands reducing textile waste while discovering unique pieces.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button onClick={() => handleClick("/items")} className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg">
                Start Swapping
              </button>
              <button onClick={() => handleClick("/items")} className="border-2 border-emerald-500 text-emerald-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-50 transition-all">
                Browse Items
              </button>
              <button onClick={() => handleClick("/profile")} className="bg-white text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all border border-gray-300">
                List an Item
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Items
            </h2>
            <p className="text-lg text-gray-600">
              Discover unique pieces from our community of sustainable fashion enthusiasts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredItems.map((item) => (
              <div key={item.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">{item.title}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">4.8</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2">{item.category}</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      {item.condition}
                    </span>
                    <span className="text-emerald-600 font-semibold">
                      {item.points} pts
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">by {item.user}</span>
                    <button className="text-emerald-600 hover:text-emerald-700 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-r from-emerald-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How ReWear Works
            </h2>
            <p className="text-lg text-gray-600">
              Simple steps to start your sustainable fashion journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">List Your Items</h3>
              <p className="text-gray-600">
                Upload photos and details of clothing you no longer wear.
                Our community values quality and authenticity.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Swap or Redeem</h3>
              <p className="text-gray-600">
                Choose direct swaps with other users or use points earned
                from your listings to redeem items you love.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Refresh Your Style</h3>
              <p className="text-gray-600">
                Discover unique pieces while contributing to a more
                sustainable fashion ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;