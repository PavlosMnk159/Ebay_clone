import { fetch_get } from "@/config/url";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
declare global {
  interface Window {
    L: any;
  }
}

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

interface Filters {
    category?: string;
    min?: string;
    max?: string;
    query?: string;
}


// Simple Map component using Leaflet
function SimpleMap({ lat = 40.7128, lng = -74.0060 }) {
 const mapRef = useRef(null);
  const mapInstanceRef = useRef<any>(null); // Store map instance for cleanup

  useEffect(() => {
    // Cleanup function to properly destroy existing map
    const cleanup = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };

    const initializeMap = () => {
      if (!mapRef.current) return;

      // Clean up any existing map first
      cleanup();

      // Create the map using Leaflet's L object
      const map = window.L.map(mapRef.current).setView([lat, lng], 10);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
      window.L.marker([lat, lng]).addTo(map);
      
      // Store reference for cleanup
      mapInstanceRef.current = map;
    };

    if (mapRef.current && !window.L) {
      // Load Leaflet CSS and JS only if not already loaded
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
      document.head.appendChild(css);

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else if (window.L && mapRef.current) {
      // Leaflet already loaded, create map immediately
      initializeMap();
    }

    // Cleanup function returned by useEffect
    return cleanup;
  }, [lat, lng]);

  return <div ref={mapRef} className="h-48 w-full rounded-lg border" />;
}


interface MessageModalProps {
    recipient: {
        sellerID: string;
        rating: string;
        product: {
            itemID: number;
            image: string;
            name: string;
            Buy_Price: number;
        }
    };

    isOpen: boolean;
    onClose: () => void;
    onSendMessage: (message: string) => void;
}

function MessageModal({ recipient, isOpen, onClose, onSendMessage }: MessageModalProps) {
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen || !recipient) return null;

    const handleSendMessage = async () => {
        if (!message.trim()) return;
        
        setIsLoading(true);
        try {
            await onSendMessage(message);
            setMessage('');
            onClose();
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    {/* Header with close button */}
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold text-gray-800 pr-2">Send Message</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        >
                            ×
                        </button>
                    </div>

                    <div className="space-y-2">
                        {/* Recipient Information */}
                        <div className="bg-gray-50 p-2 rounded-lg">
                            <h3 className="font-semibold text-gray-800 mb-2">Message To:</h3>
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-bold text-lg">
                                        {recipient.sellerID.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <div className="font-medium text-gray-800">{recipient.sellerID}</div>
                                </div>
                            </div>
                        </div>

                        {/* Product Reference (if applicable) */}
                        {recipient.product && (
                            <div className="bg-blue-50 p-2 rounded-lg">
                                <h3 className="font-semibold text-gray-800 mb-2">About Item:</h3>
                                <div className="flex items-center space-x-3">
                                    <div className="text-3xl">{recipient.product.image}</div>
                                    <div>
                                        <div className="font-medium text-gray-800">{recipient.product.name}</div>
                                        <div className="text-sm text-gray-600">#{recipient.product.Buy_Price}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Message Input */}
                        <div>
                            <label htmlFor="message" className="block font-semibold text-gray-800 mb-2">
                                Your Message:
                            </label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message here..."
                                rows={6}
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                                disabled={isLoading}
                            />
                            <div className="text-xs text-gray-500 mt-1">
                                Press Enter to send, Shift+Enter for new line
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                            <button
                                onClick={handleSendMessage}
                                disabled={!message.trim() || isLoading}
                                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                                {isLoading ? 'Sending...' : 'Send Message'}
                            </button>
                            <button
                                onClick={onClose}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                disabled={isLoading}
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


interface PurchaseModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    mode: 'buy' | 'offer'; // Determines if it's Buy Now or Make Offer
}

function PurchaseModal({ product, isOpen, onClose, mode }: PurchaseModalProps) {
    const [offerAmount, setOfferAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

    if (!isOpen || !product) return null;


    const openMessageModal = () => {
        setIsMessageModalOpen(true);
    };

    const handleSendMessage = async (message: string) => {
    // Your message sending logic here
    console.log('Sending message:', message);
    // API call to send message would go here
    // await sendMessageAPI(product.seller.id, message, product.id);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (mode === 'buy') {
                // Handle Buy It Now logic
                openMessageModal();

                console.log('Processing purchase for:', product.name);
                // API call: await purchaseItem(product.id);
                alert('Purchase initiated! You will be redirected to payment. bought here');
            } else {
                // Handle Make Offer logic
                console.log('Making offer:', offerAmount, 'for:', product.name);
                // API call: await makeOffer(product.id, offerAmount);
                alert(`Offer of ${offerAmount} sent to seller! bid here`);
            }
            
            onClose();
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const modalTitle = mode === 'buy' ? 'Confirm Purchase' : 'Make an Offer';
    const buttonText = mode === 'buy' ? 'Confirm Purchase' : 'Send Offer';
    const buttonColor = mode === 'buy' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-500 hover:bg-orange-600';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg max-w-md w-full mx-4" 
            onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">{modalTitle}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                        >
                            ×
                        </button>
                    </div>

                    {/* Product Info */}
                    <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-3xl mr-3">{product.image}</div>
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-800 text-sm">{product.name}</h4>
                            <p className="text-sm text-gray-600">Seller: {product.seller.sellerId}</p>
                            <p className="text-lg font-bold text-green-600">{product.Buy_Price}</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        {mode === 'offer' && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Offer Amount
                                </label>
                                <input
                                    type="text"
                                    value={offerAmount}
                                    onChange={(e) => setOfferAmount(e.target.value)}
                                    placeholder="Enter your offer (e.g., $50)"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    The seller can accept or decline your offer
                                </p>
                            </div>
                        )}

                        {mode === 'buy' && (
                            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-gray-700">
                                    You are about to purchase this item for <strong>{product.Buy_Price}</strong>. 
                                    You will be redirected to complete payment.
                                </p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || (mode === 'offer' && !offerAmount.trim())}
                                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${buttonColor} disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isSubmitting ? 'Processing...' : buttonText}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {/* Message Modal - opens when Message button is clicked */}
            <MessageModal
                recipient={{
                    sellerID: product.seller.sellerId,
                    rating: product.seller.rating,
                    product: {
                        itemID: product.id,
                        image: product.image,
                        name: product.name,
                        Buy_Price: product.Buy_Price
                    }
                }}
                isOpen={isMessageModalOpen}
                onClose={() => setIsMessageModalOpen(false)}
                onSendMessage={handleSendMessage}
            />

        </div>

        
    );
}


interface ItemModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}


function ItemModal({ product, isOpen, onClose }: ItemModalProps) {
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [purchaseMode, setPurchaseMode] = useState<'buy' | 'offer'>('buy');
    
    if (!isOpen || !product) return null;


    const openPurchaseModal = (mode: 'buy' | 'offer') => {
        setPurchaseMode(mode);
        setIsPurchaseModalOpen(true);
    };
    
    const closePurchaseModal = () => {
        setIsPurchaseModalOpen(false);
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
                                <div className="text-8xl text-center mb-4 bg-gray-50 py-8 rounded-lg">
                                    {product.image}
                                </div>

                                <div className="space-y-2">
                                    <div className="text-2xl font-bold text-green-600">Buy It Now for:{product.Buy_Price}</div>
                                    <div className="text-2xl font-bold text-green-600">Current best bid: {product.currently}</div>
                                    <div className="text-sm text-gray-600">Seller: <span className="font-medium text-blue-600">{product.seller.sellerId}</span>
                                        <span className="text-green-600 ml-2">({product.seller.rating} positive)</span>
                                    </div>
                                    <div className="text-sm text-gray-600">Location: <span className="font-medium">{product.city}</span></div>
                                    <div className="text-sm text-gray-600">Location: <span className="font-medium">{product.location.lat} {product.location.lng}</span></div>
                                </div>

                                {/* Map section */}
                                {product.location && (
                                    <div className="mt-4">
                                        <h4 className="font-medium text-gray-800 mb-2">Seller Location</h4>
                                        <SimpleMap 
                                            lat={product.location.lat} 
                                            lng={product.location.lng}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Approximate location for privacy
                                        </p>
                                    </div>
                                )}
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
                                            <span className="text-gray-600">Feedback Score:</span>
                                            <span className="font-medium text-green-600">{product.seller.rating}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="space-y-3">
                                    <button 
                                        onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        openPurchaseModal('buy');
                                    }}
                                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    >
                                        Buy It Now
                                    </button>
                                    
                                    <button 
                                        onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        openPurchaseModal('offer');
                                    }}
                                        className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                                    >
                                        Make Offer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            


            {/* Purchase Modal */}
            <PurchaseModal
                product={product}
                isOpen={isPurchaseModalOpen}
                onClose={closePurchaseModal}
                mode={purchaseMode}
            />
        </>
    );
}



export function EBayPage({ onLogout } : { onLogout: () => void;}){
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [purchaseProduct, setPurchaseProduct] = useState<Product | null>(null);
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [purchaseMode, setPurchaseMode] = useState<'buy' | 'offer'>('buy');

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<String[]>([]);
    const [filters, setFilters] = useState<Filters>({});



    const openPurchaseModal = (product : Product, mode: 'buy' | 'offer') => {
        setPurchaseProduct(product)
        setPurchaseMode(mode);
        setIsPurchaseModalOpen(true);
    };
    
    const closePurchaseModal = () => {
        setIsPurchaseModalOpen(false);
        setPurchaseProduct(null);
    };


    useEffect(() => {
        const fetch_products = async () => {
            try {
                const data = await fetch_get('/items/');
                setProducts(data);
            } catch (error) {
                console.log("Error while fetching products: ", error);
            }
        }

        const fetch_categories = async () => {
            try {
                const data = await fetch_get('/categories');
                setCategories(data);
                console.log(data);
            } catch (error) {
                console.log("Error while fetching categories: ", error);
            }
        }

        fetch_products();
        fetch_categories();
    }, []);

    const nav = useNavigate();

    const navigateMyAuction = () => {
        nav('/myAuction')
    };

    const navigateChat = () => {
        nav('/chatIn')
    };

    const applyFilters = async () => {
        try {
            console.log("applying filters");
            // get only the filter values that have a value
            const entries = Object.entries(filters).filter(
                ([_, value]) => value != null && value.trim() !== ''
            );
            
            const queryString = new URLSearchParams(entries as [string, string][]).toString();
            const endpoint = queryString ? `/items/?${queryString}` : `/items/`;
            const data = await fetch_get(endpoint)
            setProducts(data);
        } catch (error) {
            console.log("Error while applying filters: ", error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter"){
            e.preventDefault();
            // applyFilters();
        }
    };

    const handleProductClick = (product: Product) => {
        if(purchaseProduct != product){
            setSelectedProduct(product);
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };


//   const products = [
//     {
//     id: 1,
//     name: "The Great Gatsby - Classic Literature",
//     category: "Books",
//     currently: 12,
//     Buy_Price: 16,
//     First_Bid: 12,
//     Number_of_Bids: 2,
//     Bids: null,
//     started: 19092025,
//     ends: 19092025,
//     seller: {
//         sellerId: "BookStore123",
//         rating: "98.5%",
//     },
//     description: "Something something",
//     image: "📚",
//     location: {
//         lat: 40.7128,
//         lng: -74.0060,
//     },
//     city: "New York, NY",
//     isActive: 1

//     }
   
//   ];



    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center">
                            <div className="text-3xl font-bold text-blue-600 mr-8">eBuy Auction Page</div>
                        </div>

                        {/* Sell Button & Search Bar */}
                        <div className="flex-1 max-w-2xl mx-4 flex gap-4">

                            {/* Search Bar */}
                            <div className="flex flex-1">
                                <input 
                                type="text" 
                                placeholder="Search for anything"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={filters.query}
                                onChange={(e) => setFilters({...filters, query: e.target.value})}
                                onKeyDown={handleKeyPress}
                                />

                                <button
                                    // onClick={applyFilters}
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
                                onClick={navigateMyAuction}
                                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                Bids
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
                    {/* Left Sidebar - Filters */}
                    <div className="w-64 bg-white rounded-lg shadow-sm p-6 h-fit">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Filters</h3>

                        {/* Category Filter */}
                        <div className="mb-6">
                            <h4 className="font-medium text-gray-700 mb-2">Category</h4>
                            <select 
                                value={filters.category}
                                onChange={(e) => setFilters({...filters, category: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {categories.map((category, index) => (
                                    <option key={index} value={category.toLowerCase().replace(/\s+/g, '-')}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Price Range Filter */}
                        <div className="mb-4">
                            <h4 className="font-medium text-gray-700 mb-2">Price Range</h4>
                            <div className="flex gap-2">
                                <input 
                                    type="number"
                                    placeholder="Min"
                                    className="w-20 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={filters.min}
                                    onChange={(e) => setFilters({...filters, min: e.target.value})} 
                                />
                                <span className="self-center text-gray-500">to</span>
                                <input 
                                    type="number"
                                    placeholder="Max"
                                    className="w-20 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={filters.max}
                                    onChange={(e) => setFilters({...filters, max: e.target.value})} 
                                />
                            </div>
                        </div>



                        {/* Apply Filters Button */}
                        <button onClick={applyFilters} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                            Apply Filters
                        </button>
                    </div>

                    {/* Main Content - Product Grid */}
                    <div className="flex-1">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-2xl font-semibold text-gray-800">Books & Magazines</h2>
                            <div className="text-sm text-gray-600">
                                {products.length} results
                            </div>
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 p-4 cursor-pointer transform hover:-translate-y-1"
                                    onClick={(e) => {
                                        // Only open modal if we're clicking on the card itself, not a child element
                                        const target = e.target as HTMLElement;
                                        const isButton = target.tagName === 'BUTTON' || target.closest('button');
                                        
                                        if (!isButton) {
                                            handleProductClick(product);
                                        }
                                    }}
                                >
                                    <div className="text-6xl text-center mb-3">
                                        {product.image}
                                    </div>
                                    <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                                    <div className="text-xl font-bold text-green-600 mb-2">
                                        Buy it now for: {product.Buy_Price}
                                    </div>
                                    <div className="text-xl font-bold text-green-600 mb-2">
                                       Current best Bid: {product.currently}
                                    </div>
                                    <div className="text-sm text-gray-600 mb-3">
                                        Seller: {product.seller.sellerId} ({product.seller.rating} positive)
                                    </div>


                                    <button
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
                                        onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        openPurchaseModal(product, 'buy')
                                    }}
                                    >
                                        Buy It Now
                                    </button>
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

            {/* Purchase Modal */}
            <PurchaseModal
                product={purchaseProduct}
                isOpen={isPurchaseModalOpen}
                onClose={closePurchaseModal}
                mode={purchaseMode}
            />

        </div>
    );

}