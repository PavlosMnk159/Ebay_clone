import { useState } from "react";
import { useNavigate } from "react-router";


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
    category: string;
    currently: number;
    Buy_Price: number;
    First_Bid:number;
    Number_of_Bids: number;
    Bids: Bid[] | null;
    started: number;
    ends: number;
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
    isActive: number;

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
    onSave: (updatedProduct: Product) => void;
}


function ItemModal({ product, isOpen, onClose } : ItemModalProps) {
    if (!isOpen || !product) return null;

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

                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Left column - Image and basic info */}
                        <div>
                            <div className="text-8xl text-center mb-4 bg-gray-50 py-8 rounded-lg">
                                {product.image}
                            </div>

                            <div className="space-y-2">
                                <div className="text-3xl font-bold text-green-600">Current best bid: {product.currently}</div>
                                <div className="text-sm text-gray-600">Seller: <span className="font-medium text-blue-600">{product.seller.sellerId}</span>
                                    <span className="text-green-600 ml-2">({product.seller.rating} positive)</span>
                                </div>
                                <div className="flex justify-between">
                                        <span className="text-gray-600">Category:</span>
                                        <span className="font-medium">{product.category}</span>
                                </div>
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
                                        <span className="text-gray-600">Number of bids:</span>
                                        <span className="font-medium">{product.Number_of_Bids}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">First bid:</span>
                                        <span className="font-medium">{product.First_Bid}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Buy price:</span>
                                        <span className="font-medium">{product.Buy_Price}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Started on:</span>
                                        <span className="font-medium">{product.started}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Ends on:</span>
                                        <span className="font-medium">{product.ends}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Time left:</span>
                                        <span className="font-medium">{product.ends - product.started}</span>
                                    </div>

                                </div>
                            </div>


                            {/* Action buttons 
                            bale edw buttons an 8es
                            otan ebala ola katastrafikan*/}
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function EditAuctionModal ({ product, isOpen, onClose, onSave } : EditAuctionModalProps) {
    const [editedProduct, setEditedProduct] = useState<Product | null>(null);

    if (isOpen && product && !editedProduct) {
        setEditedProduct({ ...product });
    }

    // Reset when modal closes
    if (!isOpen && editedProduct) {
        setEditedProduct(null);
    }
    if (!isOpen || !product|| !editedProduct) return null;

    const handleInputChange = (field: keyof Product, value: string | number) => {
        setEditedProduct(prev => prev ? { ...prev, [field]: value } : null);
    };

    const handleSave = () => {
        if (editedProduct) {
            onSave(editedProduct);
            setEditedProduct(null);
        }
    };

    const handleCancel = () => {
        setEditedProduct(null);
        onClose();
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
                            <div className="text-8xl text-center mb-4 bg-gray-50 py-8 rounded-lg">
                                {editedProduct.image}
                            </div>

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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <input
                                        type="text"
                                        value={editedProduct.category}
                                        onChange={(e) => handleInputChange('category', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Image (Emoji)
                                    </label>
                                    <input
                                        type="text"
                                        value={editedProduct.image}
                                        onChange={(e) => handleInputChange('image', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="📚"
                                    />
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
                                            First Bid ($)
                                        </label>
                                        <input
                                            type="number"
                                            value={editedProduct.First_Bid}
                                            onChange={(e) => handleInputChange('First_Bid', parseFloat(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>
                                    
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


function DeleteModal({ product, isOpen, onClose } : ItemModalProps) {
    if (!isOpen || !product) return null;

    const handleDeleteProduct = () =>{
        //somtething something
        onClose();
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

export function AuctionPage({ onLogout } : { onLogout: () => void;}){
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const nav = useNavigate();

    const navigateEbay = () => {
        nav('/ebay')
    };

    const navigateChat = () => {
        nav('/chat')
    };

    const navigateMakeAuction = () => {
        nav('/makeAuction')
    };

    const naviageteMyBids = () => {
        nav('/mybids')
    };

    const naviageteItemBids = (product: Product) => {
        nav('/itembids/' + product.id.toString())
    };
 
    const handleActivation = (product: Product) => {
        product.isActive = 1;
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

    const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingProduct(null);
    };

    const handleDeleteProduct = (product: Product) => {
    setDeletingProduct(product);
    setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingProduct(null);
    };


    

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

   

  const products = [
    {
    id: 1,
    name: "The Great Gatsby - Classic Literature",
    category: "Books",
    currently: 12,
    Buy_Price: 15,
    First_Bid: 10,
    Number_of_Bids: 3,
    Bids: null,
    started: 19092025,
    ends: 20092025,
    seller: {
        sellerId: "BookStore123",
        rating: "98.5%",
    },
    description: "A timeless classic of American literature. This beautiful hardcover edition features the original cover design and includes an introduction by a renowned literary scholar.",
    image: "📚",
    location: {
        lat: 40.7128,
        lng: -74.0060,
    },
    city: "New York, NY",
    isActive: 1
    },  {
    id: 2,
    name: "Active",
    category: "Books",
    currently: 10,
    Buy_Price: 15,
    First_Bid: 10,
    Number_of_Bids: 0,
    Bids: null,
    started: 19092025,
    ends: 20092025,
    seller: {
        sellerId: "BookStore123",
        rating: "98.5%",
    },
    description: "Something something",
    image: "📚",
    location: {
        lat: 40.7128,
        lng: -74.0060,
    },
    city: "New York, NY",
    isActive: 1

    }, {
    id: 3,
    name: "Not Active",
    category: "Books",
    currently: 10,
    Buy_Price: 15,
    First_Bid: 10,
    Number_of_Bids: 0,
    Bids: null,
    started: 19092025,
    ends: 20092025,
    seller: {
        sellerId: "BookStore123",
        rating: "98.5%",
    },
    description: "Something something",
    image: "📚",
    location: {
        lat: 40.7128,
        lng: -74.0060,
    },
    city: "New York, NY",
    isActive: 0

    }
    
  ];


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
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Msgs
                            </button>

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

                                <div className="text-sm text-gray-600 mb-3">
                                    First pirce: {product.First_Bid}
                                </div>
                                
                                <div className="text-sm text-gray-600 mb-3">
                                    Buy Pirce: {product.Buy_Price}
                                </div>

                                <div className="text-sm text-gray-600 mb-3">
                                    Time left: {product.ends - product.started}
                                </div>

                                <button
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!product.isActive){
                                            handleActivation(product);
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
                                        handleEditProduct(product);
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
                                        handleDeleteProduct(product);
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
                onSave={(updatedProduct) => {
                    // Update your products array here
                    console.log("Updated product:", updatedProduct);
                    handleCloseEditModal();
                    }}
            />
            <DeleteModal
                product={deletingProduct}
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
            />

        </div>
    );

}

