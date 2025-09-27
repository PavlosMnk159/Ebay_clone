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
    /* 
    H temp einai temporary mexri na balw to backend
    8a prepei na fenrei apo ola ta items me (item.bidder.UserID == MyID) to amount */
    temp: number; 
}




interface ItemModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
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
                                <div className="text-3xl font-bold text-green-600">{product.Buy_Price}</div>
                                <div className="text-sm text-gray-600">Seller: <span className="font-medium text-blue-600">{product.seller.sellerId}</span>
                                    <span className="text-green-600 ml-2">({product.seller.rating} positive)</span>
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
                                        <span className="text-gray-600">Category:</span>
                                        <span className="font-medium">Books & Magazines</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-800 mb-2">Seller Information</h3>
                                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-gray-600">Rating Score:</span>
                                        <span className="font-medium text-green-600">{product.seller.rating}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export function BidPage({ isAdmin, onLogout } : { isAdmin : boolean; onLogout: () => void;}){
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const nav = useNavigate();

    const navigateBids = () => {
        nav('/myAuction')
    };

    const navigateChat = () => {
        nav('/chatIn')
    };

    const navigateUserlist = () => {
        nav('/admin')
    };
    
    const navigateEbay = () => {
        nav('/ebay')
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

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    // backend
    // fetct ta products pou exoyn kai emena san bidder

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
    isActive: 1,
    temp: 10
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
    temp: 10,
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
    temp: 10,
    isActive: 0

    }
    
  ];



  // backend
  // fetch unread 
  const unread = 3;


    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center">
                            <div className="text-3xl font-bold text-blue-600 mr-8">eBuy myOwnBiddngs Page</div>
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
                                {unread && (<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
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
                <div className="flex gap-6">
                    {/* Main Content - Product Grid */}
                    <div className="flex-1 space-x-2">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-gray-800">My Biddings</h2>
                        <div className="text-sm text-gray-600">
                            {products.length} results
                        </div>
                    </div>
                    <button
                        onClick={navigateBids}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                        My Auctions
                    </button>
                    


                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 p-4 cursor-pointer transform hover:-translate-y-1"
                                    onClick={() => handleProductClick(product)}
                                >
                                    <div className="text-6xl text-center mb-3">
                                        {product.image}
                                    </div>
                                    <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                                    <div className="text-xl font-bold text-green-600 mb-2">
                                        Current Price: {product.currently}
                                        <span className="text-xl font-bold text-blue-600 mb-2 ml-4">
                                        My bid: {product.temp}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600 mb-3">
                                        Seller: {product.seller.sellerId} ({product.seller.rating} positive)
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <ItemModal
                product={selectedProduct}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );

}

