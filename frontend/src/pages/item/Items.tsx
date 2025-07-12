import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Search, Filter, Calendar, Eye, Star, Grid, List, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import type { Items } from '../../types/Items';
import { useNavigate } from 'react-router-dom';
interface Filters {
    search: string
    category: string
    sortBy: 'createdAt' | 'views' | 'point' | 'title'
    sortOrder: 'asc' | 'desc'
    minPoints: string
    maxPoints: string
    condition: string
    type: string
}
interface ActiveFilter {
    key: keyof Filters
    value: string
    label: string
}
export default function Items() {
    const [items, setItems] = useState<Items[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<Filters>({
        search: '',
        category: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
        minPoints: '',
        maxPoints: '',
        condition: '',
        type: ''
    })
    const navigate=useNavigate()

    // Use ref to track the latest filters without causing re-renders
    const filtersRef = useRef(filters);
    filtersRef.current = filters;

    const categories = [
        'shirts', 'pants', 'dresses', 'jackets', 'shoes', 'accessories', 'other'
    ];

    const types = [
        'casual', 'formal', 'sports', 'party', 'work', 'seasonal'
    ];

    const conditions = [
        'new', 'like new', 'good', 'fair', 'poor'
    ];

    const sortOptions = [
        { value: 'createdat', label: 'Creation Date' },
        { value: 'views', label: 'Views' },
        { value: 'point', label: 'Points' },
        { value: 'title', label: 'Title' }
    ];

    // Stable function that doesn't depend on filters state
    const buildQueryString = useCallback((filterObj: Filters): string => {
        const params = new URLSearchParams()
        Object.entries(filterObj).forEach(([key, value]) => {
            if (value) params.append(key, value)
        })
        return params.toString()
    }, [])

    // Stable function that doesn't change on filter updates
    const fetchItems = useCallback(async (filterObj = null) => {
        setLoading(true);
        try {
            const filtersToUse = filterObj || filtersRef.current;
            const query = buildQueryString(filtersToUse);
            const response = await fetch(
                `${import.meta.env.VITE_APP_API_URL}/cloth/get-items?${query}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API Response:', data);

            if (data.success) {
                setItems(data.items || []);
            } else {
                console.error('API returned error:', data.message);
                setItems([]);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, [buildQueryString]);

    // Debounced fetch function
    const debouncedFetch = useCallback(
        debounce((filterObj) => {
            fetchItems(filterObj);
        }, 300),
        [fetchItems]
    );

    // Initial fetch
    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    useEffect(() => {
        debouncedFetch(filters);
    }, [filters, debouncedFetch]);

    const handleFilterChange = useCallback(
        (key: keyof Filters, value: string) => {
            setFilters(f => ({ ...f, [key]: value }))
        },
        []
    )

    const handleUrl=(path:string)=>{
        navigate(path)
    }
    const clearFilters = useCallback(() => {
        const clearedFilters = {
            search: '',
            category: '',
            sortBy:'createdAt',
            sortOrder: 'desc',
            minPoints: '',
            maxPoints: '',
            condition: '',
            type: ''
        };
        setFilters(clearedFilters);
    }, []);

    const removeFilter = useCallback((key: keyof Filters) => {
        setFilters(prev => ({
            ...prev,
            [key]: key === 'sortBy' ? 'createdat' : key === 'sortOrder' ? 'desc' : ''
        }));
    }, []);

    const getFilterLabel = useCallback(
        (key: keyof Filters, value: string): string => {
            switch (key) {
                case 'search':
                    return `Search: "${value}"`;
                case 'category':
                    return `Category: ${value}`;
                case 'condition':
                    return `Condition: ${value}`;
                case 'type':
                    return `Type: ${value}`;
                case 'minPoints':
                    return `Min Points: ${value}`;
                case 'maxPoints':
                    return `Max Points: ${value}`;
                default:
                    // For sortBy / sortOrder or any future keys
                    return `${key}: ${value}`;
            }
        },
        []
    );


    const activeFilters = useMemo<ActiveFilter[]>(() => {
        return (Object.entries(filters) as [keyof Filters, string][])
            .filter(([k, v]) => v !== '' && k !== 'sortBy' && k !== 'sortOrder')
            .map(([key, value]) => ({
                key,
                value,
                label: getFilterLabel(key, value)
            }))
    }, [filters, getFilterLabel])

    const formatDate = (dateString: string): string =>
        new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        })

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
                        <div className="h-16 bg-gray-200 rounded mb-6"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="bg-white rounded-lg shadow-sm border p-4">
                                    <div className="h-48 bg-gray-200 rounded mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Items</h1>
                    <p className="text-gray-600">Discover and exchange items with other users</p>
                </div>

                {/* Mobile Filter Toggle */}
                <div className="lg:hidden mb-4">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="w-full bg-white border rounded-lg p-3 flex items-center justify-between"
                    >
                        <span className="flex items-center text-gray-700">
                            <SlidersHorizontal className="h-5 w-5 mr-2" />
                            Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
                        </span>
                        <ChevronDown className={`h-5 w-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Filters Section */}
                <div className={`bg-white rounded-lg shadow-sm border p-6 mb-6 ${!showFilters ? 'hidden lg:block' : ''}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                            <Filter className="h-5 w-5 mr-2" />
                            Filters
                        </h2>
                        <button
                            onClick={clearFilters}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Clear All
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search items..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Category */}
                        <select
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category} className="capitalize">{category}</option>
                            ))}
                        </select>

                        {/* Sort By */}
                        <select
                            value={filters.sortBy}
                            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>

                        {/* Sort Order */}
                        <select
                            value={filters.sortOrder}
                            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="desc">Newest First</option>
                            <option value="asc">Oldest First</option>
                        </select>

                        {/* Condition */}
                        <select
                            value={filters.condition}
                            onChange={(e) => handleFilterChange('condition', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Conditions</option>
                            {conditions.map(condition => (
                                <option key={condition} value={condition} className="capitalize">{condition}</option>
                            ))}
                        </select>

                        {/* Type */}
                        <select
                            value={filters.type}
                            onChange={(e) => handleFilterChange('type', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Types</option>
                            {types.map(type => (
                                <option key={type} value={type} className="capitalize">{type}</option>
                            ))}
                        </select>

                        {/* Points Range */}
                        <input
                            type="number"
                            placeholder="Min points"
                            value={filters.minPoints}
                            onChange={(e) => handleFilterChange('minPoints', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />

                        <input
                            type="number"
                            placeholder="Max points"
                            value={filters.maxPoints}
                            onChange={(e) => handleFilterChange('maxPoints', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Active Filters */}
                {activeFilters.length > 0 && (
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                            {activeFilters.map(filter => (
                                <span
                                    key={filter.key}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700"
                                >
                                    {filter.label}
                                    <button
                                        onClick={() => removeFilter(filter.key)}
                                        className="ml-2 hover:text-blue-900"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* View Toggle and Results Count */}
                <div className="flex items-center justify-between mb-6">
                    <div className="text-sm text-gray-600">
                        {items.length} items found
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Grid className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <List className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Items Grid/List */}
                {items.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-lg mb-2">No items found</div>
                        <div className="text-gray-500">Try adjusting your filters</div>
                    </div>
                ) : (
                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                        {items.map(item => (
                            <div onClick={()=>handleUrl(`/items-detail/${item._id}`)} key={item._id} className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer ${viewMode === 'list' ? 'flex' : ''}`}>
                                <div className={viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}>
                                    <img
                                        src={item.images && item.images.length > 0 ? item.images[0] : '/placeholder-image.jpg'}
                                        alt={item.title}
                                        className={`w-full object-cover ${viewMode === 'list' ? 'h-32 rounded-l-lg' : 'h-48 rounded-t-lg'}`}
                                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                            e.currentTarget.src = '/placeholder-image.jpg'
                                        }}
                                    />
                                </div>
                                <div className="p-4 flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">{item.title}</h3>
                                        <span className="text-lg font-bold text-blue-600 ml-2">{item.point} pts</span>
                                    </div>

                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                                        <span className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            {formatDate(item.createdAt)}
                                        </span>
                                        <span className="flex items-center">
                                            <Eye className="h-4 w-4 mr-1" />
                                            {item.views || 0} views
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-wrap gap-1">
                                            {item.category && (
                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full capitalize">
                                                    {item.category}
                                                </span>
                                            )}
                                            {item.condition && (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full capitalize">
                                                    {item.condition}
                                                </span>
                                            )}
                                            {item.type && (
                                                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full capitalize">
                                                    {item.type}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            by {item.user?.name || 'Unknown'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Debounce utility function
function debounce<Func extends (...args: any[]) => void>(
    func: Func,
    wait: number
): (...args: Parameters<Func>) => void {
    let timeout: ReturnType<typeof setTimeout>
    return (...args: Parameters<Func>) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
    }
}