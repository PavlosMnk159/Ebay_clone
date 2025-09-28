import fetch_with_auth from "@/Authentication/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { fetch_get, BASE_URL } from "@/config/url";


interface Bid {
    bidder: Bidder;
    time: number; //time the bid was made
    amount: number;
}

interface Bidder {
    userID: string;
    rating: number;
    location: {
        lat: number,
        lng: number
    }
    country: string;
}

interface Product {
    id: number;
    name: string;
    categories: string[];
    currently: number;
    Buy_Price: number;
    First_Bid:number;
    Number_of_Bids: number;
    Bids: Bid[] | null;
    started: string;
    ends: number;
    time_left: string;
    seller: {
        sellerId: string,
        rating: string
    };
    description: string;
    image: string;
    location: {
        lat: number,
        lng: number
    };
    city: string;
    country: string;
    images: string[];
    isActive: number;

}

interface EditProduct {
    id: number;
    name: string;
    categories: string[];
    currently: number;
    Buy_Price: number;
    First_Bid: number;
    Number_of_Bids: number;
    Bids: Bid[] | null;
    started: string;
    ends: number;
    seller: {
        sellerId: string,
        rating: string
    };
    description: string;
    images: File[]; 
    city: string;
    country: string;
    location : {
        lat : number;
        lng : number;
    }
    isActive: number;
}


// Helper function to convert a URL/path to a File object
async function urlToFile(url: string, filename: string): Promise<File> {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], filename, { type: blob.type });
    } catch (error) {
        console.error(`Failed to convert ${url} to File:`, error);
        throw error;
    }
}
// Helper function to convert Product to EditProduct
async function productToEditProduct(product: Product, BASE_URL: string): Promise<EditProduct> {
  try {
    // Handle null or empty images array
    const imageFiles: File[] = product.images && product.images.length > 0 
      ? await Promise.all(
          product.images.map(async (imageName: string) => {
            const imageUrl = `${BASE_URL}/${imageName}`;
            return await urlToFile(imageUrl, imageName);
          })
        )
      : [];

    return {
      ...product,
      categories: product.categories ?? [],
      images: imageFiles,
    };
  } catch (error) {
    console.error('Failed to convert product images to files:', error);
    // Return with empty images array if conversion fails
    return {
      ...product,
      categories: product.categories ?? [],  
      images: [],
    };
  }
}


interface ItemModalProps  {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

interface EditAuctionModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedProduct: EditProduct) => void;
}

interface DeleteAuctionModalProps {
    product: Product | null;
    isOpen: boolean;
    onDelete: (deleteProduct: Product) => void;
    onClose: () => void;
}


function ItemModal({product, isOpen, onClose }: ItemModalProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0); 
    
   

    if (!isOpen || !product) return null;

    // Check if product has the images property, if not, handle gracefully
    const productImages = product.images ? product.images : "No image";


    const nextImage = () => {
        if (productImages.length > 1) {
            setSelectedImageIndex((prev) => (prev + 1) % productImages.length);
        }
    };

    const prevImage = () => {
        if (productImages.length > 1) {
            setSelectedImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}> 
                <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="p-6">
                        {/* Header with close button */}
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold text-gray-800 pr-4">{product.name}</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Left column - Image and basic info */}
                            <div>
                                {/* Image display */}
                                <div className="relative h-64 w-full mb-4 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                                    {product.images && product.images.length > 0 ? (
                                        <>
                                        <img 
                                        
                                            src={`${BASE_URL}/${product.images[selectedImageIndex]}`} 
                                            alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                            // Replace with fallback letter on error
                                            const target = e.currentTarget;
                                            const parent = target.parentElement;
                                            if (parent) {
                                                parent.innerHTML = "No Image";
                                            }
                                        }}
                                          
                                        />
                                        {/* Navigation arrows for multiple images */}
                                        {product.images.length > 1 && (
                                            <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                                            >
                                                ←
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                                            >
                                                →
                                            </button>
                                            {/* Image counter */}
                                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-sm px-3 py-1 rounded-full">
                                                {selectedImageIndex + 1} / {product.images.length}
                                            </div>
                                            </>
                                        )}
                                        </>
                                    ) : "No Image"}
                                    
                                </div>

                                <div className="space-y-2">
                                    {product.Buy_Price && (<div className="text-2xl font-bold text-green-600">Buy It Now for: {product.Buy_Price}</div>)}
                                    <div className="text-2xl font-bold text-green-600">Current best bid: {product.currently}</div>
                                    <div className="text-sm text-gray-600">Seller: <span className="font-medium text-blue-600">{product.seller.sellerId}</span>
                                        <span className="text-green-600 ml-2">({product.seller.rating} positive)</span>
                                    </div>
                                    <div className="text-sm text-gray-600">Location: <span className="font-medium">{product.city}, {product.country}</span></div>
                                    <div className="text-sm text-gray-600">Coordinates: <span className="font-medium">{product.location.lat}, {product.location.lng}</span></div>
                                </div>

                                
                            </div>

                            {/* Right column - Details and actions */}
                            <div>
                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {product.description || "Here is empty space and should be filled with words. Thus I am placing words in this empty space to keep it not empty."}
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-800 mb-2">Item Details</h3>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Item ID:</span>
                                            <span className="font-medium">#{product.id.toString().padStart(6, '0')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            {product.categories && (<span className="text-gray-600">categories:</span>)}
                                            <span className="font-medium">{product.categories}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Images:</span>
                                            <span className="font-medium">{productImages.length}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-800 mb-2">Seller Information</h3>
                                    <div className="bg-gray-50 p-3 rounded-lg text-sm">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-600">Feedback Score:</span>
                                            <span className="font-medium text-green-600">{product.seller.rating}</span>
                                        </div>
                                    </div>
                                </div>

                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function EditAuctionModal ({ product, isOpen, onClose, onSave} : EditAuctionModalProps) {
    const [editedProduct, setEditedProduct] = useState<EditProduct | null>(null);
    const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && product) {
      productToEditProduct(product, BASE_URL)
        .then(convertedProduct => {
          setEditedProduct(convertedProduct);
        })
        .catch(error => {
          console.error('Failed to convert product:', error);
          // Fallback: create EditProduct with empty images
          setEditedProduct({
            id: product.id,
            name: product.name,
            categories: [],
            currently: product.currently,
            Buy_Price: product.Buy_Price,
            First_Bid: product.First_Bid,
            Number_of_Bids: product.Number_of_Bids,
            Bids: product.Bids,
            started: product.started,
            ends: product.ends,
            seller: product.seller,
            description: product.description,
            images: [], // Empty array as fallback
            city: product.city,
            country: product.country,
            location: product.location,
            isActive: product.isActive
          });
        });
    }
  }, [isOpen, product]);

      useEffect(() => {
    
          const fetch_categories = async () => {
              try {
                  const data = await fetch_get('/categories');
                  setCategories(data);
                  console.log(data);
              } catch (error) {
                  console.log("Error while fetching categories: ", error);
              }
          }
    
          fetch_categories();
      }, []);

    // Reset when modal closes
    if (!isOpen && editedProduct) {
        setEditedProduct(null);
    }
    if (!isOpen || !product|| !editedProduct) return null;

     const handleInputChange = (field: string, value: number | string | string[] | File[] | null) => {
        setEditedProduct(prev => prev ? ({ ...prev, [field]: value }) : null);
    };

    const handleSave = async () => {
        if (editedProduct) {
            
            onSave(editedProduct);
            setEditedProduct(null);
        }
    };

    const handleCancel = () => {
        setEditedProduct(null);
        onClose();
    };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    // Add new files to existing images instead of replacing them
    handleInputChange('images', [...editedProduct.images, ...files]);
  };

  const removeImage = (indexToRemove: number) => {
    const updatedImages = editedProduct.images.filter((_, index) => index !== indexToRemove);
    handleInputChange('images', updatedImages);
  };

  const clearAllImages = () => {
    handleInputChange('images', []);
    // Reset file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

   
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCancel}> 
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    {/* Header with close button */}
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold text-gray-800 pr-4">Edit Auction</h2>
                        <button
                            onClick={handleCancel}
                            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        >
                            ×
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Left column - Image and basic info */}
                        <div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={editedProduct.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Category *
                                    </label>
                                    <div className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <div className="text-lg text-gray-700 mb-3">Select categories:</div>
                                    <div className="max-h-48 overflow-y-auto">
                                        {categories
                                            .filter(cat => cat.toLowerCase() !== "none")
                                            .map((cat, index) => (
                                            <label
                                                key={index}
                                                className="flex items-center mb-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                                            >
                                                <input
                                                type="radio"
                                                name="category" // same name for all radios ensures only one is selected
                                                value={cat}
                                                checked={editedProduct.categories[0] === cat} // single category stored at index 0
                                                onChange={() => handleInputChange('categories', [cat])} // replace with selected category
                                                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <span className="text-lg">{cat}</span>
                                            </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Item Images (Optional) - {editedProduct.images.length} uploaded
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                        <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        />
                                        
                                        {editedProduct.images.length > 0 ? (
                                        <div className="space-y-4">
                                            {/* Image Grid Display */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {editedProduct.images.map((file, index) => (
                                                <div key={index} className="relative group">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                    title="Remove this image"
                                                >
                                                    ×
                                                </button>
                                                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                                    {index + 1}
                                                </div>
                                                </div>
                                            ))}
                                            </div>
                                            
                                            {/* Action Buttons */}
                                            <div className="flex gap-3 justify-center flex-wrap">
                                            <label
                                                htmlFor="image-upload"
                                                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer inline-flex items-center gap-2"
                                            >
                                                <span>📷</span>
                                                Add More Images
                                            </label>
                                            <button
                                                type="button"
                                                onClick={clearAllImages}
                                                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors inline-flex items-center gap-2"
                                            >
                                                <span>🗑️</span>
                                                Clear All Images
                                            </button>
                                            </div>
                                            
                                            {/* Images Info */}
                                            <div className="bg-blue-50 p-3 rounded-lg">
                                            <p className="text-sm text-blue-700">
                                                ✅ {editedProduct.images.length} image{editedProduct.images.length !== 1 ? 's' : ''} uploaded
                                                {editedProduct.images.length > 0 && (
                                                <span className="ml-2">
                                                    ({(editedProduct.images.reduce((total, file) => total + file.size, 0) / 1024 / 1024).toFixed(1)} MB total)
                                                </span>
                                                )}
                                            </p>
                                            </div>
                                        </div>
                                        ) : (
                                        <div className="space-y-4">
                                            <div className="text-4xl text-gray-400">📷</div>
                                            <div>
                                            <label
                                                htmlFor="image-upload"
                                                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer inline-block font-medium"
                                            >
                                                Choose Images
                                            </label>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                            Upload clear photos of your item to attract more bidders
                                            <br />
                                            You can select multiple images at once
                                            </p>
                                        </div>
                                        )}
                                    </div>
                                    
                                    <div className="mt-3 space-y-1">
                                        <p className="text-sm text-gray-500">
                                        • Supported formats: JPG, PNG, GIF
                                        </p>
                                        <p className="text-sm text-gray-500">
                                        • Max file size per image: 5MB
                                        </p>
                                        <p className="text-sm text-gray-500">
                                        • You can add as many images as you want
                                        </p>
                                        <p className="text-sm text-gray-500">
                                        • Click "Add More Images" to upload additional photos
                                        </p>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right column - Details and actions */}
                        <div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={editedProduct.description || ""}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                                    placeholder="Enter product description..."
                                />
                            </div>

                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-800 mb-3">Pricing Details</h3>
                                <div className="space-y-3">
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Buy Price ($)
                                        </label>
                                        <input
                                            type="number"
                                            value={editedProduct.Buy_Price}
                                            onChange={(e) => handleInputChange('Buy_Price', parseFloat(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            End Time
                                        </label>
                                        <input
                                            type="number"
                                            value={editedProduct.ends}
                                            onChange={(e) => handleInputChange('ends', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-800 mb-2">Read-Only Info</h3>
                                <div className="space-y-1 text-sm bg-gray-50 p-3 rounded-md">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Item ID:</span>
                                        <span className="font-medium">#{editedProduct.id.toString().padStart(6, '0')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Number of bids:</span>
                                        <span className="font-medium">{editedProduct.Number_of_Bids}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Current Price:</span>
                                        <span className="font-medium text-green-600">${editedProduct.currently}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="space-y-3">
                                <button 
                                    onClick={handleSave}
                                    className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium"
                                >
                                    Save Changes
                                </button>
                                <button 
                                    onClick={handleCancel}
                                    className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


function DeleteModal({ product, isOpen, onDelete, onClose } : DeleteAuctionModalProps) {
    if (!isOpen || !product) return null;

    const handleDeleteProduct = () =>{
        onDelete(product);
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}> 
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    {/* Header with close button */}
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold text-gray-800 pr-4">{product.name}</h2>

                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        >
                            x
                        </button>
                    </div>

                    <div className="grid md:grid-cols-1 gap-6">
                        {/* Left column - Image and basic info */}
                            <div className="text-8xl text-center mb-4 bg-gray-50 py-8 rounded-lg">
                                {product.image}
                            </div>

                            <div className="space-y-2 font-bold">
                                Do you want to Delete Permantly this item?
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleDeleteProduct}
                                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                                >
                                    Yes, I want to delete this Item
                                </button>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function AuctionPage({ isAdmin, onLogout } : { isAdmin : boolean; onLogout: () => void;}){
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [products, setProducts] = useState<Product[]>([]);

    const [unread, setUnread] = useState(0);


    const refreshData = async () => {
        try {
            const res = await fetch_with_auth('/my_items/');
            const data = res.data;
            setProducts(data);
        } catch (error) {
            console.log("Error while refreshing data: ", error);
        }
    };


    useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
        const fetch_unread = async () => {
            try {
                const res = await fetch_with_auth.get('/unread_messages/');
                const data = res.data
                
                setUnread(data.unread_count);

            } catch (error) {
                console.log("Error while fetching products: ", error);
            }
            
        }

        const fetch_products = async () => {
            try {
                const res = await fetch_with_auth.get('/my_items/');
                const data = res.data;
                setProducts(data);
            } catch (error) {
                console.log("Error while fetching products: ", error);
            }
        }

        fetch_products();
        fetch_unread();
        interval = setInterval(fetch_unread, 5000);
        return () => clearInterval(interval);
    }, []);

    const nav = useNavigate();

    const navigateEbay = () => {
        nav('/ebay')
    };

    const navigateChat = () => {
        nav('/chatIn')
        nav('/chatIn')
    };

    const navigateMakeAuction = () => {
        nav('/makeAuction')
    };

    const navigateUserlist = () => {
        nav('/admin')
    };



    const naviageteMyBids = () => {
        nav('/mybids')
    };

    const naviageteItemBids = (product: Product) => {
        nav('/itembids/' + product.id.toString())
    };
 
    const handleStartAcution = async (product: Product) => {
        product.isActive = 1;
        await fetch_with_auth.post('start_auction/', {
            'id': product.id
        })
        refreshData();
    };



    const handleSearch = () => {
        console.log("Searching for:", searchQuery);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter"){
            e.preventDefault();
            handleSearch();
        }
    };



    {/* Edit Modal */}
    const handleOpenEditModal = (product: Product) => {
        setEditingProduct(product);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditingProduct(null);
        setIsEditModalOpen(false);
    };

const handleSaveEditModal = async (editedProduct: EditProduct) => {
  const formData = new FormData();

  // Required fields (always convert to string safely)
  formData.append("id", String(editedProduct.id ?? ""));
  formData.append("name", editedProduct.name ?? "");
  formData.append("description", editedProduct.description ?? "");
  formData.append("currently", String(editedProduct.currently ?? ""));
  formData.append("buy_price", String(editedProduct.Buy_Price ?? ""));
  formData.append("first_bid", String(editedProduct.First_Bid ?? ""));
  formData.append("number_of_bids", String(editedProduct.Number_of_Bids ?? ""));
  formData.append("started", editedProduct.started ?? "");
  formData.append("ends", String(editedProduct.ends ?? ""));

  // Categories
  editedProduct.categories?.forEach((cat) => {
    formData.append("categories", cat ?? "");
  });

  // Images
  editedProduct.images?.forEach((file) => {
    if (file) {
      formData.append("images", file);
    }
  });

  try {
    const res = await fetch_with_auth.post("edit_item/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const data = res.data;
    setUnread(data.unread_count);
  } catch (error) {
    console.error("Error while editing products:", error);
  }

  refreshData();
  handleCloseEditModal();
};



    {/* Delete Modal */}
    const handleOpenDeleteModal = (product: Product) => {
        setDeletingProduct(product)
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setDeletingProduct(null)
        setIsDeleteModalOpen(false);
    };

    const handleDeleteProduct = async (product: Product) => {
        // Backend
        // post delete Item
        await fetch_with_auth.post('delete_item/', 
            {
                item_id: product.id
            }
        );
        
        refreshData();
        handleCloseDeleteModal();
    };

    

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };



    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center">
                            <div className="text-3xl font-bold text-blue-600 mr-8">eBuy myAuction Page</div>
                        </div>

                        {/* Sell Button & Search Bar */}
                        <div className="flex-1 max-w-2xl mx-4 flex gap-4">

                            {/* Search Bar */}
                            <div className="flex flex-1">
                                <input 
                                type="text" 
                                placeholder="Search for anything"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyPress}
                                />

                                <button
                                    onClick={handleSearch}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
                                >
                                    Search
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Message Button */}
                            <button
                                onClick={navigateChat}
                                className="relative bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Msgs
                                {(<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                                    {unread}
                                </span>)}
                            </button>

                            {/* userlist Button */}
                            {isAdmin && (<button
                                onClick={navigateUserlist}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Userlist
                            </button>)}

                            {/* Sell Button */}
                            <button
                                onClick={navigateEbay}
                                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                Ebay
                            </button>
                            
                            {/* Logout Button */}
                            <button
                                onClick={onLogout}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Main Content - Product Grid */}
                <div className="flex-1 space-x-2">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-gray-800">My Auctions</h2>
                        <div className="text-sm text-gray-600">
                            {products.length} results
                        </div>
                    </div>
                    <button
                        onClick={navigateMakeAuction}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Add Auction
                    </button>
                    <button
                        onClick={naviageteMyBids}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                        My Bids
                    </button>



                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 p-4 cursor-pointer transform hover:-translate-y-1 space-y-3"
                                onClick={() => handleProductClick(product)}
                            >
                                <div className="text-6xl text-center mb-3">
                                    {product.image}
                                </div>
                                <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                                <div className="text-xl font-bold text-green-600 mb-2">
                                    Current best bid: {product.currently}
                                </div>
                                
                                <div className="text-sm text-gray-600 mb-3">
                                    Number of bids: {product.Number_of_Bids}
                                </div>

                                {product.First_Bid && (<div className="text-sm text-gray-600 mb-3">
                                    First pirce: {product.First_Bid}
                                </div>)}
                                
                                {product.Buy_Price && (<div className="text-sm text-gray-600 mb-3">
                                    Buy Pirce: {product.Buy_Price}
                                </div>)}

                                <div className="text-sm text-gray-600 mb-3">
                                    Time left: {product.time_left}
                                </div>

                                <button
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!product.isActive){
                                            handleStartAcution(product);
                                        }else{
                                            naviageteItemBids(product);
                                        }
                                    }}
                                >
                                    
                                    {!product.isActive 
                                        ? 'Start Auction'
                                        : `View Bids (${product.Number_of_Bids})`
                                        }
                                </button>
                                {(!product.Number_of_Bids) && (
                                <button
                                    className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenEditModal(product);
                                    }}
                                >
                                    Edit Acution
                                </button>
                                )}
                                {(!product.Number_of_Bids) && (
                                <button
                                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors text-sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenDeleteModal(product);
                                        console.log("Buy it now clicked for:", product.name);
                                    }}
                                >
                                    Delete
                                </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal */}
            <ItemModal
                product={selectedProduct}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
            <EditAuctionModal
                product={editingProduct}
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                onSave={handleSaveEditModal}
            />
            <DeleteModal
                product={deletingProduct}
                isOpen={isDeleteModalOpen}
                onDelete={handleDeleteProduct}
                onClose={handleCloseDeleteModal}
            />

        </div>
    );

}

