import { User, Plus, Search, MessageCircle, Shield, CheckCircle, UserCheck, Edit3, Eye, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Works() {
    const navigate=useNavigate();
    const handleClick=(path:string)=>{
        navigate(path)
    }
  const steps = [
    {
      icon: <UserCheck className="w-8 h-8 text-blue-500" />,
      title: "Sign Up & Login",
      description: "Create your account or log in to access all features",
      details: [
        "Quick registration with email and password",
        "Secure authentication with JWT tokens",
        "Protected routes for authenticated users only",
        "Profile management and customization"
      ]
    },
    {
      icon: <Plus className="w-8 h-8 text-green-500" />,
      title: "Add Your Items",
      description: "List your items with detailed information",
      details: [
        "Easy-to-use item creation form",
        "Upload multiple images for your items",
        "Set descriptions, prices, and categories",
        "Edit or update your listings anytime"
      ]
    },
    {
      icon: <Search className="w-8 h-8 text-purple-500" />,
      title: "Browse & Discover",
      description: "Find items that match your needs",
      details: [
        "Browse all available items on the platform",
        "Detailed item views with full descriptions",
        "Search and filter functionality",
        "View item history and seller information"
      ]
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-orange-500" />,
      title: "Connect & Request",
      description: "Make requests and connect with sellers",
      details: [
        "Send direct requests to item owners",
        "Built-in messaging system for communication",
        "Negotiate terms and conditions",
        "Track your request status"
      ]
    }
  ]

  const features = [
    {
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      title: "Secure Authentication",
      description: "Your account is protected with industry-standard security measures and JWT token authentication."
    },
    {
      icon: <Edit3 className="w-6 h-6 text-green-500" />,
      title: "Easy Item Management",
      description: "Add, edit, and manage your listings with our intuitive interface designed for simplicity."
    },
    {
      icon: <Eye className="w-6 h-6 text-purple-500" />,
      title: "Detailed Item Views",
      description: "Each item has a dedicated page with comprehensive details, images, and seller information."
    },
    {
      icon: <User className="w-6 h-6 text-orange-500" />,
      title: "Profile Management",
      description: "Customize your profile, manage your listings, and track your activity in one place."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">How It Works</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Discover how our platform makes it easy to list, find, and request items. 
            Follow our simple process to get started today.
          </p>
        </div>
      </div>

      {/* Main Process Steps */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Simple 4-Step Process</h2>
          <p className="text-xl text-gray-600">Get started in minutes with our streamlined approach</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-gray-100 p-3 rounded-full mr-4">
                  {step.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-blue-600 mb-1">STEP {index + 1}</div>
                  <h3 className="text-2xl font-bold text-gray-800">{step.title}</h3>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6 text-lg">{step.description}</p>
              
              <ul className="space-y-3">
                {step.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Platform Features</h2>
            <p className="text-xl text-gray-600">Everything you need for a seamless experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

     

      {/* Navigation Routes */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Platform Navigation</h2>
            <p className="text-gray-300">Quick access to all platform features</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 text-center cursor-pointer" onClick={()=>handleClick("/")}>
              <Home className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-xl font-semibold mb-2">Home</h3>
              <p className="text-gray-300 text-sm">Browse featured items and get started</p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 text-center cursor-pointer" onClick={()=>handleClick("/items")}>
              <Search className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h3 className="text-xl font-semibold mb-2">Items</h3>
              <p className="text-gray-300 text-sm">View all available items on the platform</p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 text-center cursor-pointer" onClick={()=>handleClick("/profile")}>
              <User className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h3 className="text-xl font-semibold mb-2">Profile</h3>
              <p className="text-gray-300 text-sm">Manage your account and listings</p>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  )
}