import { Menu, Recycle, X, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const handleClick = (path: string) => {
        navigate(path);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/');
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            
            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL as string}/user/get-profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                console.log(data)
                if (data.success) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                setIsAuthenticated(false);
                localStorage.removeItem('token');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div onClick={() => handleClick("/")} className="flex items-center space-x-2 cursor-pointer">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <Recycle className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                            ReWear
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="/items" className="text-gray-700 hover:text-emerald-600 transition-colors">Browse Items</a>
                        <a href="/works" className="text-gray-700 hover:text-emerald-600 transition-colors">How It Works</a>
                        <a href="/about" className="text-gray-700 hover:text-emerald-600 transition-colors">About</a>
                    </div>

                    {/* Desktop Auth Section */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isLoading ? (
                            <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
                        ) : isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <button 
                                    onClick={() => handleClick("/profile")} 
                                    className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors"
                                >
                                    <User className="w-5 h-5" />
                                    <span>Profile</span>
                                </button>
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <>
                                <button 
                                    onClick={() => handleClick("/auth/login")} 
                                    className="text-gray-700 hover:text-emerald-600 transition-colors"
                                >
                                    Login
                                </button>
                                <button 
                                    onClick={() => handleClick("/auth/signup")} 
                                    className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-2 rounded-full hover:from-emerald-600 hover:to-blue-600 transition-all transform hover:scale-105"
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-200">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <a href="/items" className="block px-3 py-2 text-gray-700 hover:text-emerald-600">Browse Items</a>
                            <a href="/works" className="block px-3 py-2 text-gray-700 hover:text-emerald-600">How It Works</a>
                            <a href="/about" className="block px-3 py-2 text-gray-700 hover:text-emerald-600">About</a>
                            
                            <div className="pt-2 border-t border-gray-200">
                                {isLoading ? (
                                    <div className="px-3 py-2">
                                        <div className="w-full h-8 bg-gray-200 animate-pulse rounded"></div>
                                    </div>
                                ) : isAuthenticated ? (
                                    <>
                                        <button 
                                            onClick={() => handleClick("/profile")} 
                                            className="flex items-center space-x-2 w-full px-3 py-2 text-gray-700 hover:text-emerald-600"
                                        >
                                            <User className="w-5 h-5" />
                                            <span>Profile</span>
                                        </button>
                                        <button 
                                            onClick={handleLogout}
                                            className="flex items-center space-x-2 w-full px-3 py-2 text-gray-700 hover:text-red-600"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            <span>Logout</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button 
                                            onClick={() => handleClick("/auth/login")} 
                                            className="block w-full text-left px-3 py-2 text-gray-700 hover:text-emerald-600"
                                        >
                                            Login
                                        </button>
                                        <button 
                                            onClick={() => handleClick("/auth/signup")} 
                                            className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-2 rounded-full"
                                        >
                                            Sign Up
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}