import { useState, useEffect } from 'react';
import { Upload, X, Plus, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import type { FormItemType, UploadedImage } from '../../types/Items';

interface AddEditItemProps {
    itemId?: string | null;
    onBack?: () => void;
}
export default function AddEditItem({
    itemId = null,
    onBack = () => { }
}: AddEditItemProps) {
    const [formData, setFormData] = useState<FormItemType>({
        title: '',
        description: '',
        category: '',
        type: '',
        point: '',
        size: '',
        condition: '',
        images: []
    });

    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const [notification, setNotification] =
        useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const isEditMode = Boolean(itemId);

    const categories = [
        'Shirts', 'Pants', 'Dresses', 'Jackets', 'Shoes', 'Accessories', 'Other'
    ];

    const types = [
        'Casual', 'Formal', 'Sports', 'Party', 'Work', 'Seasonal'
    ];

    const sizes = [
        'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'
    ];

    const conditions = [
        'New', 'Like New', 'Good', 'Fair', 'Poor'
    ];

    // Fetch item data if in edit mode
    useEffect(() => {
        if (isEditMode) {
            fetchItemData();
        }
    }, [itemId]);

    const fetchItemData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/cloth/get-item-by-id/${itemId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const result = await response.json();

            if (result.success) {
                const item = result.item;
                setFormData({
                    title: item.title || '',
                    description: item.description || '',
                    category: item.category || '',
                    type: item.type || '',
                    point: item.point || '',
                    size: item.size || '',
                    condition: item.condition || '',
                    images: item.images || []
                });

                // Convert image URLs to uploaded images format for display
                if (item.images && item.images.length > 0) {
                    const existingImages = item.images.map((url: string, index: number) => ({
                        url: url,
                        filename: url.split('/').pop(),
                        originalName: `existing-image-${index}`,
                        isExisting: true
                    }));
                    setUploadedImages(existingImages);
                }
            } else {
                showNotification('Failed to load item data.', 'error');
            }
        } catch (error) {
            console.error('Fetch item error:', error);
            showNotification('Error loading item data.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
         const files = e.target.files ? Array.from(e.target.files) : [];
        if (files.length === 0) return;

        setIsUploading(true);

        try {
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData();
                formData.append('image', file);

                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/upload/single`, {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                if (result.success) {
                    return result.data;
                } else {
                    throw new Error(result.message);
                }
            });

            const results = await Promise.all(uploadPromises);
            setUploadedImages(prev => [...prev, ...results]);
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...results.map(img => img.url)]
            }));

            showNotification('Images uploaded successfully!', 'success');
        } catch (error) {
            console.error('Upload error:', error);
            showNotification('Failed to upload images. Please try again.', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = async (index: number) => {
        const img = uploadedImages[index];
        if (!img) return;
        try {
            if (!img) {
            await fetch(`${import.meta.env.VITE_APP_API_URL}/upload/${img.filename}`, { method: 'DELETE' });
            }

            // Remove from state
            const newUploadedImages = uploadedImages.filter((_, i) => i !== index);
            const newImageUrls = formData.images.filter((_, i) => i !== index);

            setUploadedImages(newUploadedImages);
            setFormData(prev => ({
                ...prev,
                images: newImageUrls
            }));

            showNotification('Image removed successfully!', 'success');
        } catch (error) {
            console.error('Remove image error:', error);
            showNotification('Failed to remove image.', 'error');
        }
    };

    const showNotification = (
        message: string,
        type: 'success' | 'error'
        ) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.description || !formData.category ||
            !formData.type || !formData.point || !formData.size || !formData.condition) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const url = isEditMode ? `${import.meta.env.VITE_APP_API_URL}/cloth/update-item/${itemId}` : `${import.meta.env.VITE_APP_API_URL}/cloth/add-item`;
            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                const message = isEditMode ? 'Item updated successfully!' : 'Item added successfully!';
                showNotification(message, 'success');

                if (!isEditMode) {
                    setFormData({
                        title: '',
                        description: '',
                        category: '',
                        type: '',
                        point: '',
                        size: '',
                        condition: '',
                        images: []
                    });
                    setUploadedImages([]);
                }
                if (onBack) {
                    setTimeout(() => onBack(), 1500);
                }
            } else {
                showNotification(result.message || `Failed to ${isEditMode ? 'update' : 'add'} item.`, 'error');
            }
        } catch (error) {
            console.error('Submit error:', error);
            showNotification('An error occurred. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4">
                        
                            <button
                                onClick={onBack}
                                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>

                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {isEditMode ? 'Edit Item' : 'Add New Item'}
                            </h1>
                            <p className="mt-2 text-sm text-gray-600">
                                {isEditMode
                                    ? 'Update the information for this clothing item.'
                                    : 'Fill out the form below to add a new clothing item to your collection.'
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Notification */}
                {notification && (
                    <div className={`mb-6 p-4 rounded-md flex items-center ${notification.type === 'success'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                        {notification.type === 'success' ? (
                            <CheckCircle className="h-5 w-5 mr-2" />
                        ) : (
                            <AlertCircle className="h-5 w-5 mr-2" />
                        )}
                        {notification.message}
                    </div>
                )}

                {/* Form */}
                {isLoading ? (
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-gray-600">Loading item data...</span>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white shadow-sm rounded-lg p-6 space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter item title"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Describe the item in detail"
                                required
                            />
                        </div>

                        {/* Category and Type */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                                    Type *
                                </label>
                                <select
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select type</option>
                                    {types.map(type => (
                                        <option key={type} value={type.toLowerCase()}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Point and Size */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="point" className="block text-sm font-medium text-gray-700 mb-2">
                                    Points *
                                </label>
                                <input
                                    type="number"
                                    id="point"
                                    name="point"
                                    value={formData.point}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
                                    Size *
                                </label>
                                <select
                                    id="size"
                                    name="size"
                                    value={formData.size}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select size</option>
                                    {sizes.map(size => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Condition */}
                        <div>
                            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                                Condition *
                            </label>
                            <select
                                id="condition"
                                name="condition"
                                value={formData.condition}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Select condition</option>
                                {conditions.map(condition => (
                                    <option key={condition} value={condition.toLowerCase()}>{condition}</option>
                                ))}
                            </select>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Images
                            </label>

                            {/* Upload Area */}
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
                                <div className="text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="mt-4">
                                        <label htmlFor="images" className="cursor-pointer">
                                            <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                <Plus className="h-4 w-4 mr-2" />
                                                {isUploading ? 'Uploading...' : 'Add Images'}
                                            </span>
                                        </label>
                                        <input
                                            id="images"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            disabled={isUploading}
                                        />
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">
                                        PNG, JPG, GIF up to 10MB each
                                    </p>
                                </div>
                            </div>

                            {/* Uploaded Images Preview */}
                            {uploadedImages.length > 0 && (
                                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {uploadedImages.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={image.url}
                                                alt={image.originalName}
                                                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSubmitting ? `${isEditMode ? 'Updating' : 'Adding'} Item...` : `${isEditMode ? 'Update' : 'Add'} Item`}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}