import { ArrowRightLeft, Home, LogOut, Menu, MessageCircle, Package, Settings, Users, X } from "lucide-react";
import { useState } from "react";


export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
      const navItems = [
    { name: 'Dashboard', icon: <Home className="w-5 h-5" />, active: true },
    { name: 'Users', icon: <Users className="w-5 h-5" />, active: false },
    { name: 'Items', icon: <Package className="w-5 h-5" />, active: false },
    { name: 'Exchanges', icon: <ArrowRightLeft className="w-5 h-5" />, active: false },
    { name: 'Requests', icon: <MessageCircle className="w-5 h-5" />, active: false },
    { name: 'Settings', icon: <Settings className="w-5 h-5" />, active: false }
  ];
  return (
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    item.active
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              ))}
            </div>

            {/* User Profile & Logout */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
                <span className="text-sm font-medium text-gray-700">Admin</span>
              </div>
              <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md">
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  className={`flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    item.active
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              ))}
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex items-center space-x-2 px-3 py-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">A</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Admin</span>
                </div>
                <button className="flex items-center space-x-2 w-full text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md">
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
  )
}
