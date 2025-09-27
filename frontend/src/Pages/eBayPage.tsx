import fetch_with_auth from "@/Authentication/axios";
import fetch_with_auth from "@/Authentication/axios";
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
    First_Bid: number;
    Number_of_Bids: number;
    Bids: Bid[] | null;
    started: number;
    ends: number;
    seller: {
        sellerId: string,
        rating: string
    };
    description: string;
    images: string[]; // Changed from image to images array
    imageType: string;
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
    location?: string;
}



  const handleDownload = (data: any, format: string) => {
    //backend
    //εδω αντι για data θα υπαρχει το product
    //και θα κανεις fetch το product με βαση το format
    // αν εινα xml ή αν ειναι json


    let content;
    let mimeType;
    let fileExtension;

    
    // Handle different formats
    switch (format.toLowerCase()) {
      case 'json':
        //backend
        // fetch data.json
        content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
        mimeType = 'application/json';
        fileExtension = '.json';
        break;
      case 'xml':
        //backend
        // fetch data.xml
        content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
        mimeType = 'application/xml';
        fileExtension = '.xml';
        break;
      case 'txt':
        //backend
        // fetch data.txt
        content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
        mimeType = 'text/plain';
        fileExtension = '.txt';
        break;
      default:
        //backend
        // fetch data
        content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
        mimeType = 'text/plain';
        fileExtension = '.txt';
    }
    
    // Ensure filename has correct extension
    const finalFilename = 'download'.includes('.') ? 'download' : 'download' + fileExtension;
    
    // Create blob and download
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = finalFilename;
    document.body.appendChild(a); // Append to body for better browser compatibility
    a.click();
    document.body.removeChild(a); // Clean up
    URL.revokeObjectURL(url);
  };



// async function geocodeWithAPI(address: string): Promise<{ lat: number; lng: number } | null> {
//   try {
//     const encodedAddress = encodeURIComponent(address);
//     const response = await fetch(
//       `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`
//     );
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
    
//     const data = await response.json();
    
//     if (data && data.length > 0) {
//       return {
//         lat: parseFloat(data[0].lat),
//         lng: parseFloat(data[0].lon)
//       };
//     }
    
//     return null; // No results found
//   } catch (error) {
//     console.error('Geocoding error:', error);
//     return null;
//   }
// }


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



interface BidOfferModalProps {
    product: Product | null;
    amount: string;
    isOpen: boolean;
    onClose: () => void;
    onDataChange?: () => Promise<void>; // Add this
    onDataChange?: () => Promise<void>; // Add this
}

function BidExtraModal({ product, amount, isOpen, onClose, onDataChange }: BidOfferModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
function BidExtraModal({ product, amount, isOpen, onClose, onDataChange }: BidOfferModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !product) return null;
    if (!isOpen || !product) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Handle offer submission logic
            console.log('Processing offer for:', product.name);
            
            // API call for making offer
            const request_data = {
                item_id: product.id,
                amount: amount
            };
            
            try {
                const res = await fetch_with_auth.post('make-offer', request_data);
                console.log(res.data);
                alert('Offer submitted successfully!');
                
                // Refresh data after successful operation
                if (onDataChange) {
                    await onDataChange();
                }
            } catch (e: any) {
                console.log("Could not submit offer", e.message);
                alert('Failed to submit offer. Please try again.');
            }
            
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Handle offer submission logic
            console.log('Processing offer for:', product.name);
            
            // API call for making offer
            const request_data = {
                item_id: product.id,
                amount: amount
            };
            
            try {
                const res = await fetch_with_auth.post('make-offer', request_data);
                console.log(res.data);
                alert('Offer submitted successfully!');
                
                // Refresh data after successful operation
                if (onDataChange) {
                    await onDataChange();
                }
            } catch (e: any) {
                console.log("Could not submit offer", e.message);
                alert('Failed to submit offer. Please try again.');
            }
            
            onClose();
        } finally {
            setIsSubmitting(false);
            setIsSubmitting(false);
        }
    };

    const modalTitle = 'Confirm Offer';
    const buttonText = 'Confirm Offer';
    const buttonColor = 'bg-orange-500 hover:bg-orange-600';
    const modalTitle = 'Confirm Offer';
    const buttonText = 'Confirm Offer';
    const buttonColor = 'bg-orange-500 hover:bg-orange-600';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg max-w-md w-full mx-4" 
            onClick={(e) => e.stopPropagation()}>
            <div className="bg-white rounded-lg max-w-md w-full mx-4" 
            onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">{modalTitle}</h3>
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">{modalTitle}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                        >
                            ×
                        </button>
                    </div>

                    {/* Product Info */}
                    <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-3xl mr-3">{product.images[0]}</div>
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-800 text-sm">{product.name}</h4>
                            <p className="text-sm text-gray-600">Seller: {product.seller.sellerId}</p>
                            <p className="text-lg font-bold text-green-600">{product.Buy_Price}</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        {(
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Offer Amount: {amount}
                                </label>
                                
                                <p className="text-xs text-gray-500 mt-1 font-bold">
                                    Please keep in mind, once confirmed you cannot change an offer
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                    The seller can accept or decline your offer
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
                                disabled={isSubmitting}
                                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${buttonColor} disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isSubmitting ? 'Processing...' : buttonText}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            

        </div>

        
    );
}


// interface MessageModalProps {
//     recipient: {
//         sellerID: string;
//         rating: string;
//         product: {
//             itemID: number;
//             image: string;
//             name: string;
//             Buy_Price: number;
//         }
//     };

//     isOpen: boolean;
//     onClose: () => void;
//     onSendMessage: (message: string) => void;
// }

// function MessageModal({ recipient, isOpen, onClose, onSendMessage }: MessageModalProps) {
//     const [message, setMessage] = useState('');
//     const [isLoading, setIsLoading] = useState(false);

//     if (!isOpen || !recipient) return null;

//     const handleSendMessage = async () => {
//         if (!message.trim()) return;
        
//         setIsLoading(true);
//         try {
//             await onSendMessage(message);
//             setMessage('');
//             onClose();
//         } catch (error) {
//             console.error('Failed to send message:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleKeyPress = (e: React.KeyboardEvent) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             handleSendMessage();
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
//             <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
//                 <div className="p-6">
//                     {/* Header with close button */}
//                     <div className="flex justify-between items-start mb-4">
//                         <h2 className="text-2xl font-bold text-gray-800 pr-2">Send Message</h2>
//                         <button
//                             onClick={onClose}
//                             className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
//                         >
//                             ×
//                         </button>
//                     </div>

//                     <div className="space-y-2">
//                         {/* Recipient Information */}
//                         <div className="bg-gray-50 p-2 rounded-lg">
//                             <h3 className="font-semibold text-gray-800 mb-2">Message To:</h3>
//                             <div className="flex items-center space-x-3">
//                                 <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
//                                     <span className="text-blue-600 font-bold text-lg">
//                                         {recipient.sellerID.charAt(0).toUpperCase()}
//                                     </span>
//                                 </div>
//                                 <div>
//                                     <div className="font-medium text-gray-800">{recipient.sellerID}</div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Product Reference (if applicable) */}
//                         {recipient.product && (
//                             <div className="bg-blue-50 p-2 rounded-lg">
//                                 <h3 className="font-semibold text-gray-800 mb-2">About Item:</h3>
//                                 <div className="flex items-center space-x-3">
//                                     <div className="text-3xl">{recipient.product.image}</div>
//                                     <div>
//                                         <div className="font-medium text-gray-800">{recipient.product.name}</div>
//                                         <div className="text-sm text-gray-600">#{recipient.product.Buy_Price}</div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Message Input */}
//                         <div>
//                             <label htmlFor="message" className="block font-semibold text-gray-800 mb-2">
//                                 Your Message:
//                             </label>
//                             <textarea
//                                 id="message"
//                                 value={message}
//                                 onChange={(e) => setMessage(e.target.value)}
//                                 onKeyPress={handleKeyPress}
//                                 placeholder="Type your message here..."
//                                 rows={6}
//                                 className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
//                                 disabled={isLoading}
//                             />
//                             <div className="text-xs text-gray-500 mt-1">
//                                 Press Enter to send, Shift+Enter for new line
//                             </div>
//                         </div>

//                         {/* Action Buttons */}
//                         <div className="flex space-x-3">
//                             <button
//                                 onClick={handleSendMessage}
//                                 disabled={!message.trim() || isLoading}
//                                 className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
//                             >
//                                 {isLoading ? 'Sending...' : 'Send Message'}
//                             </button>
//                             <button
//                                 onClick={onClose}
//                                 className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
//                                 disabled={isLoading}
//                             >
//                                 Cancel
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


interface PurchaseModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    mode: 'buy' | 'offer';
    onDataChange?: () => Promise<void>; // Add this
}

function PurchaseModal({ product, isOpen, onClose, mode, onDataChange }: PurchaseModalProps) {
    const [offerAmount, setOfferAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOffer, setIsOffer] = useState(false);
    
    if (!isOpen || !product) return null;

    const closeExtraBidModal = () => {
        setIsOffer(false);
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (mode === 'buy') {
                // Handle Buy It Now logic
                console.log('Processing purchase for:', product.name);
                
                const request_data = {
                    item_id: product.id,
                };
                
                try {
                    const res = await fetch_with_auth.post('buy', request_data);
                    console.log(res.data);
                    alert('Purchase initiated! You will be redirected to payment.');
                    
                    // Refresh data after successful purchase
                    if (onDataChange) {
                        await onDataChange();
                    }
                } catch (e: any) {
                    console.log("Could not buy that item", e.message);
                    alert('Purchase failed. Please try again.');
                }
            } else {
                // Handle Make Offer logic
                setIsOffer(true);

                console.log('Making offer:', offerAmount, 'for:', product.name);
                // Note: The actual API call will happen in BidExtraModal
            }
            
            if (mode === 'buy') {
                onClose();
            }
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
                        <div className="text-3xl mr-3">{product.images[0]}</div>
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
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || (mode === 'offer' && !offerAmount.trim())}
                                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${buttonColor} disabled:opacity-50 disabled:cursor-not-allowed`}
                                type="submit"
                                disabled={isSubmitting || (mode === 'offer' && !offerAmount.trim())}
                                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${buttonColor} disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isSubmitting ? 'Processing...' : buttonText}
                                {isSubmitting ? 'Processing...' : buttonText}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {/* Offer confirmation */}
            <BidExtraModal
                product={product}
                amount={offerAmount}
                isOpen={isOffer}
                onClose={closeExtraBidModal}
                onDataChange={onDataChange} // Pass it down
            />

        </div>

        
    );
}



interface ItemModalProps {
    isAdmin: boolean;
    isGuest: boolean;
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onDataChange?: () => Promise<void>; // Add this
}

function ItemModal({ isAdmin, isGuest, product, isOpen, onClose, onDataChange }: ItemModalProps) {
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [purchaseMode, setPurchaseMode] = useState<'buy' | 'offer'>('buy');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0); 

    if (!isOpen || !product) return null;

    // Check if product has the images property, if not, handle gracefully
    const productImages = product.images || [product.images[0] || 'P']; // Fallback

    const openPurchaseModal = (mode: 'buy' | 'offer') => {
        setPurchaseMode(mode);
        setIsPurchaseModalOpen(true);
    };
    
    const closePurchaseModal = () => {
        setIsPurchaseModalOpen(false);
        onClose();
    };

    const jsonData = [
        { id: 1, name: "Item 1", category: "electronics" },
        { id: 2, name: "Item 2", category: "books" },
        { id: 3, name: "Item 3", category: "clothing" }
    ];
    
    const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
<items>
  <item id="1">
    <name>Item 1</name>
    <category>electronics</category>
  </item>
  <item id="2">
    <name>Item 2</name>
    <category>books</category>
  </item>
  <item id="3">
    <name>Item 3</name>
    <category>clothing</category>
  </item>
</items>`;


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
                                    {product.imageType === 'photo' ? (
                                        <>
                                        <img 
                                            src={product.images[selectedImageIndex]} 
                                            alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                // If image fails to load, show letter fallback
                                                const container = e.currentTarget.parentElement;
                                                if (container) {
                                                    container.innerHTML = `
                                                        <div class="w-full h-48 flex items-center justify-center text-4xl font-bold text-gray-600 bg-gradient-to-br from-blue-100 to-purple-100">
                                                            ${product.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    `;
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
                                    ) : null}
                                    <div 
                                        className={`w-full h-full flex items-center justify-center text-8xl font-bold text-gray-600 bg-gradient-to-br from-blue-100 to-purple-100 ${
                                        product.imageType === 'letter' ? 'flex' : 'hidden'
                                        }`}
                                        style={product.imageType === 'photo' ? { display: 'none' } : {}}
                                    >
                                        {product.images[selectedImageIndex]}
                                    </div>
                                    </div>

                                <div className="space-y-2">
                                    <div className="text-2xl font-bold text-green-600">Buy It Now for: {product.Buy_Price}</div>
                                    <div className="text-2xl font-bold text-green-600">Current best bid: {product.currently}</div>
                                    <div className="text-sm text-gray-600">Seller: <span className="font-medium text-blue-600">{product.seller.sellerId}</span>
                                        <span className="text-green-600 ml-2">({product.seller.rating} positive)</span>
                                    </div>
                                    <div className="text-sm text-gray-600">Location: <span className="font-medium">{product.city}</span></div>
                                    <div className="text-sm text-gray-600">Coordinates: <span className="font-medium">{product.location.lat}, {product.location.lng}</span></div>
                                </div>

                                {/* Map section */}
                                {product.location && product.location.lat !== 0 && product.location.lng !== 0 && (
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
                                            <span className="font-medium">{product.category}</span>
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

                                {/* Action buttons */}
                                <div className="space-y-3">
                                    {!isGuest && (
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
                                    )}
                                    
                                    {!isGuest && (
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
                                    )}
                                    
                                    {isAdmin && (
                                        <>
                                            <button 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleDownload(xmlData, 'xml');
                                                }}
                                                className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium"
                                            >
                                                Download XML
                                            </button>
                                            <button 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleDownload(jsonData, 'json');
                                                }}
                                                className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium"
                                            >
                                                Download JSON
                                            </button>
                                        </>
                                    )}
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
                onDataChange={onDataChange}
            />
        </>
    );
}

export function EBayPage({isAdmin, isGuest, onLogout } : {isAdmin : boolean; isGuest : boolean; onLogout: () => void;}){


    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [purchaseProduct, setPurchaseProduct] = useState<Product | null>(null);
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [purchaseMode, setPurchaseMode] = useState<'buy' | 'offer'>('buy');

    const [purchaseProduct, setPurchaseProduct] = useState<Product | null>(null);
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [purchaseMode, setPurchaseMode] = useState<'buy' | 'offer'>('buy');

    // const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<String[]>([]);
    const [filters, setFilters] = useState<Filters>({});


    // const [LocationLat, setLocationLat] = useState(0);



    const openPurchaseModal = (product: Product, mode: 'buy' | 'offer') => {
        setPurchaseProduct(product);
        setPurchaseMode(mode);
        setIsPurchaseModalOpen(true);
    };
    
    const closePurchaseModal = () => {
        setIsPurchaseModalOpen(false);
        setIsModalOpen(false);
        setPurchaseProduct(null);
        refreshData();

    };

    const refreshData = async () => {
        try {
            const data = await fetch_get('/items/');
            // setProducts(data);
            alert(data);
        } catch (error) {
            console.log("Error while refreshing data: ", error);
        }
    };

    useEffect(() => {
        const fetch_products = async () => {
            try {
                const data = await fetch_get('/items/');
                // setProducts(data);
                alert(data);    

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
        nav('/myAuction');
    };

    const navigateUserlist = () => {
        nav('/admin');
    };

 

    const navigateChat = () => {
        nav('/chatIn')
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
            // setProducts(data);
            alert(data);

        } catch (error) {
            console.log("Error while applying filters: ", error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter"){
            e.preventDefault();
            // applyFilters();
            // applyFilters();
        }
    };

    const handleProductClick = (product: Product) => {
        if (purchaseProduct != product) {
            setSelectedProduct(product);
            setIsModalOpen(true);
        }
        if (purchaseProduct != product) {
            setSelectedProduct(product);
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
        refreshData();
        refreshData();
    };

// Updated products array with multiple images
const products = [
  {
    id: 1,
    name: "The Great Gatsby - Classic Literature",
    category: "Books",
    currently: 12,
    Buy_Price: 16,
    First_Bid: 12,
    Number_of_Bids: 2,
    Bids: null,
    started: 19092025,
    ends: 19092025,
    seller: {
      sellerId: "BookStore123",
      rating: "98.5%",
    },
    description: "Something something",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300"
    ],
    imageType: "photo",
    location: { lat: 0, lng: 0 },
    city: "New York, NY",
    isActive: 1
  },
  {
    id: 2,
    name: "iPhone 14 Pro - 256GB Space Black",
    category: "Electronics",
    currently: 850,
    Buy_Price: 999,
    First_Bid: 700,
    Number_of_Bids: 8,
    Bids: null,
    started: 18092025,
    ends: 25092025,
    seller: {
      sellerId: "TechDeals99",
      rating: "99.2%",
    },
    description: "Excellent condition, original box included",
    images: ["I"], // Single letter
    imageType: "letter",
    location: { lat: 34.0522, lng: -118.2437 },
    city: "Los Angeles, CA",
    isActive: 1
  },
  {
    id: 3,
    name: "Vintage Rolex Submariner Watch",
    category: "Jewelry",
    currently: 4500,
    Buy_Price: 6200,
    First_Bid: 3800,
    Number_of_Bids: 15,
    Bids: null,
    started: 15092025,
    ends: 22092025,
    seller: {
      sellerId: "LuxuryTimepieces",
      rating: "97.8%",
    },
    description: "1985 model, serviced and authenticated",
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300",
      "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=300"
    ],
    imageType: "photo",
    location: { lat: 41.8781, lng: -87.6298 },
    city: "Chicago, IL",
    isActive: 1
  },
  {
    id: 4,
    name: "Abstract Oil Painting - Original Art",
    category: "Art",
    currently: 320,
    Buy_Price: 450,
    First_Bid: 250,
    Number_of_Bids: 6,
    Bids: null,
    started: 17092025,
    ends: 24092025,
    seller: {
      sellerId: "ArtisticVisions",
      rating: "96.4%",
    },
    description: "24x36 canvas, signed by artist",
    images: ["https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300"],
    imageType: "photo",
    location: { lat: 39.7392, lng: -104.9903 },
    city: "Denver, CO",
    isActive: 1
  },
  {
    id: 5,
    name: "Nike Air Jordan 1 Retro High OG",
    category: "Fashion",
    currently: 180,
    Buy_Price: 0,
    First_Bid: 150,
    Number_of_Bids: 4,
    Bids: null,
    started: 16092025,
    ends: 23092025,
    seller: {
      sellerId: "SneakerHead42",
      rating: "94.7%",
    },
    description: "Size 10.5, worn twice, excellent condition",
    images: [
      "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=300",
      "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=400&h=300",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300"
    ],
    imageType: "photo",
    location: { lat: 25.7617, lng: -80.1918 },
    city: "Miami, FL",
    isActive: 1
  },
  {
    id: 6,
    name: "Fender Stratocaster Electric Guitar",
    category: "Musical Instruments",
    currently: 720,
    Buy_Price: 950,
    First_Bid: 600,
    Number_of_Bids: 11,
    Bids: null,
    started: 14092025,
    ends: 21092025,
    seller: {
      sellerId: "MusicMaker88",
      rating: "98.9%",
    },
    description: "Sunburst finish, includes hard case",
    images: ["https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=400&h=300"],
    imageType: "photo",
    location: { lat: 36.1627, lng: -86.7816 },
    city: "Nashville, TN",
    isActive: 1
  },
  {
    id: 7,
    name: "Canon EOS R5 Mirrorless Camera",
    category: "Electronics",
    currently: 2800,
    Buy_Price: 3200,
    First_Bid: 2500,
    Number_of_Bids: 9,
    Bids: null,
    started: 13092025,
    ends: 20092025,
    seller: {
      sellerId: "PhotoPro2024",
      rating: "99.6%",
    },
    description: "Body only, low shutter count",
    images: ["C"], // Single letter
    imageType: "letter",
    location: { lat: 47.6062, lng: -122.3321 },
    city: "Seattle, WA",
    isActive: 1
  }
  // ... add more products as needed
];


    {/* Products page numbers */}
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Calculate pagination
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = products.slice(startIndex, endIndex);

    // Generate page numbers array
    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
        }
        return pages;
    };

    const goToPage = (page : number) => {
        setCurrentPage(page);
    };

    const goToPrevious = () => {
        if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
        }
    };

    const goToNext = () => {
        if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
        }
    };


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
                                    // onClick={applyFilters}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
                                >
                                    Search
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Message Button */}
                            {!isGuest && (<button
                                onClick={navigateChat}
                                className="relative bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Msgs
                                {unread && (<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                                    {unread}
                                </span>)}
                            </button>)}

                            {/* Admin Button */}
                            {isAdmin && (<button
                                onClick={navigateUserlist}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Userlist
                            </button>)}

                            {/* Sell Button */}
                            {!isGuest && (<button
                                onClick={navigateMyAuction}
                                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                Bids
                            </button>)}

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
                        
                        {/* Location filter */}
                        <div className="mb-6">
                            <h4 className="font-medium text-gray-700 mb-2">Location</h4>
                            <input 
                                type="string"
                                placeholder="Location"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                //backend
                                //locations shit
                            />
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
                            {currentItems.map((product) => (
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
                                        {/* Image display - shows first image or letter */}
                                        <div className="h-32 w-full mb-3 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden relative">
                                        {product.imageType === 'photo' ? (
                                            <>
                                            <img 
                                                src={product.images[0]} 
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                                    if (nextElement) {
                                                        nextElement.style.display = 'flex';
                                                    }
                                                }}
                                            />
                                            {/* Multiple images indicator */}
                                            {product.images.length > 1 && (
                                                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                                                +{product.images.length - 1}
                                                </div>
                                            )}
                                            </>
                                        ) : null}
                                        <div 
                                            className={`w-full h-full flex items-center justify-center text-4xl font-bold text-gray-600 bg-gradient-to-br from-blue-100 to-purple-100 ${
                                            product.imageType === 'letter' ? 'flex' : 'hidden'
                                            }`}
                                            style={product.imageType === 'photo' ? { display: 'none' } : {}}
                                        >
                                            {product.images[0]}
                                        </div>
                                    </div>
                                    <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                                    {product.Buy_Price > 0 && (<div className="text-xl font-bold text-green-600 mb-2">
                                        Buy it now for: {product.Buy_Price}
                                    </div>)}
                                    <div className="text-xl font-bold text-green-600 mb-2">
                                       Current best Bid: {product.currently}
                                    </div>
                                    <div className="text-sm text-gray-600 mb-3">
                                        Seller: {product.seller.sellerId} ({product.seller.rating} positive)
                                    </div>
                                    
                                    {!isGuest && (<button
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
                                        onClick={async (e) => {
                                            e.preventDefault();
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            openPurchaseModal(product, 'buy');
                                            openPurchaseModal(product, 'buy');
                                        }}
                                    >
                                        Buy It Now
                                    </button>)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col items-center space-y-4">
                {/* Page Info */}
                <div className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, products.length)} of {products.length} items
                </div>
                
                {/* Pagination Controls */}
                <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                    onClick={goToPrevious}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    Previous
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((page) => (
                    <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                        page === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                    >
                    {page}
                    </button>
                ))}

                {/* Next Button */}
                <button
                    onClick={goToNext}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === totalPages
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    Next
                </button>
                </div>
            </div>

            {/* Modal with refresh callback */}
            <ItemModal
                isAdmin={isAdmin}
                isGuest={isGuest}
                product={selectedProduct}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onDataChange={refreshData} // Pass the refresh function
            />

            {/* Purchase Modal with refresh callback */}
            <PurchaseModal
                product={purchaseProduct}
                isOpen={isPurchaseModalOpen}
                onClose={closePurchaseModal}
                mode={purchaseMode}
                onDataChange={refreshData} // Pass the refresh function
                onDataChange={refreshData} // Pass the refresh function
            />

            {/* Purchase Modal with refresh callback */}
            <PurchaseModal
                product={purchaseProduct}
                isOpen={isPurchaseModalOpen}
                onClose={closePurchaseModal}
                mode={purchaseMode}
                onDataChange={refreshData} // Pass the refresh function
            />


        </div>
    );

}