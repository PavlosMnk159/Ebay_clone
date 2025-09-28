import fetch_with_auth from "@/Authentication/axios";
import { fetch_get } from "@/config/url";
import { useState, useEffect } from "react";
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


async function geocodeWithAPI(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    
    return null; // No results found
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

export function MakeAuction({ isAdmin, onLogout }: { isAdmin : boolean; onLogout: () => void; }) {


    const nav = useNavigate();
  
    const navigateEbay= () => {
      nav('/ebay')
    }
  
    const navigateChat= () => {
      nav('/chatIn')
    }

    const navigateMyAuctions= () => {
      nav('/myAuction')
    }

    const navigateUserlist = () => {
      nav('/admin');
    };


  // Selling page state
  const [sellingData, setSellingData] = useState({
    name: "",
    categories: "",
    currently: 0,
    Buy_Price: 0 ,
    First_Bid: 0,
    Number_of_Bids: 0,
    Bids: [] as Bid[],
    ends: 0,
    seller: {
        sellerId: "",
        rating: ""
    },
    description: "",
    images: [] as File[], 
    lat: 0,
    lng: 0,
    location: "",
    country: "",
    isActive: false

  });

  // Backend
  // fetch categories

  const [categories, setCategories] = useState<string[]>([]);
  const [unread, setUnread] = useState(0);

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

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const fetch_unread = async () => {
        try {
            const res = await fetch_with_auth.get('/unread_messages/');
            const data = res.data
            
            setUnread(data.unread_count);
            console.log("this is the unreads");
            console.log(data.unread_count);

        } catch (error) {
            console.log("Error while fetching products: ", error);
        }
        
    }

    fetch_unread();
    interval = setInterval(fetch_unread, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSellingDataChange = (field: string, value: number | string | string[] | File[] | null) => {
    setSellingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    // Add new files to existing images instead of replacing them
    handleSellingDataChange('images', [...sellingData.images, ...files]);
  };

  const removeImage = (indexToRemove: number) => {
    const updatedImages = sellingData.images.filter((_, index) => index !== indexToRemove);
    handleSellingDataChange('images', updatedImages);
  };

  const clearAllImages = () => {
    handleSellingDataChange('images', []);
    // Reset file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };


  const handleLocationSearch = async (searchLocation : string) => {
    if (!searchLocation.trim()) return;
    
    try {
        const coords = await geocodeWithAPI(searchLocation);
        if (coords) {
            // setMapCoords(coords);
            alert('Found location');
          } else {
            alert('Location not found, will put coordinates: (0,0) ');
            // alert(searchLocation);
          }
          return coords;
    } catch (error) {
        console.error('Geocoding failed:', error);
        alert('Failed to find location');
    }
  };



  const handleStartAuction = async () => {
    console.log("Starting auction with data:", sellingData);
    // alert("Auction has been created. You can make it live in your Autions List");

    handleLocationSearch(sellingData.location + ', ' + sellingData.country);

    try {

      const res = await fetch_with_auth.post('/create_item/', sellingData);
      
      if (res.status != 201) {
        console.log("Could not create item: ", res.data);
      } else {

        // Reset form after successful submission
        setSellingData({
          name: "",
          categories: "",
          currently: 0,
          Buy_Price: 0,
          First_Bid: 0,
          Number_of_Bids: 0,
          Bids: [] as Bid[],
          ends: 0,
          seller: {
              sellerId: "",
              rating: ""
          },
          description: "",
          images: [] as File[], 
          lat: 0,
          lng: 0,
          location: "",
          country: "",
          isActive: false

              });
      }

    } catch(e: any) {
      if (e.response) {
        console.log("error while creating item:", e.response.data);
      } else {
        console.log("error while creating item");
      }
    }

    // Reset file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    
  };

  const isFormValid = sellingData.name && 
                     sellingData.categories && 
                     sellingData.currently &&
                     sellingData.ends;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-3xl font-bold text-blue-600 mr-8">eBuy makeAuction Page</div>
            </div>
            
            {/* Navigation */}
            <div className="flex items-center gap-4">

              <button
                  onClick={navigateChat}
                  className="relative bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                  Msgs
                  {(<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                      {unread}
                  </span>)}
              </button>
              
              {isAdmin && (<button
                  onClick={navigateUserlist}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                  Userlist
              </button>)}

              <button
                onClick={navigateEbay}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Ebay
              </button>

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
        <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">Create your Auction</h2>
        </div>
        <div className="flex-1">
          <button
              onClick={navigateMyAuctions}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
              My Auctions
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Your Own Auction</h1>
            <p className="text-gray-600">Fill in the details below to start selling your item</p>
          </div>

          <div className="space-y-8">
            {/* Item Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Item Name *
              </label>
              <input
                type="text"
                placeholder="Enter a descriptive name for your item"
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                value={sellingData.name}
                onChange={(e) => {handleSellingDataChange('name', e.target.value)}}
              />
              <p className="text-sm text-gray-500 mt-2">
                Be specific and descriptive - buyers search by item names
              </p>
            </div>

            {/* Categories */}
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
                        type="checkbox"
                        value={cat}
                        checked={sellingData.categories.includes(cat)}
                        onChange={() => {
                          // Only allow one selection
                          if (!sellingData.categories.includes(cat)) {
                            handleSellingDataChange('categories', [cat]);
                          } else {
                            handleSellingDataChange('categories', []);
                          }
                        }}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-lg">{cat}</span>
                    </label>
                  ))}
              </div>
            </div>
              <p className="text-sm text-gray-500 mt-2">
                • Choose the category that best describes your item
              </p>
              <p className="text-sm text-gray-500">
                • YOu can also not choose a category if it feels restrictive
              </p>
            </div>

            {/* Enhanced Image Upload Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Item Images (Optional) - {sellingData.images.length} uploaded
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
                
                {sellingData.images.length > 0 ? (
                  <div className="space-y-4">
                    {/* Image Grid Display */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {sellingData.images.map((file, index) => (
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
                        ✅ {sellingData.images.length} image{sellingData.images.length !== 1 ? 's' : ''} uploaded
                        {sellingData.images.length > 0 && (
                          <span className="ml-2">
                            ({(sellingData.images.reduce((total, file) => total + file.size, 0) / 1024 / 1024).toFixed(1)} MB total)
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

            {/* Details */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                End time *
              </label>
              <input
                type="text"
                placeholder="Enter a finished date"
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                value={sellingData.ends}
                onChange={(e) => handleSellingDataChange('ends', e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-2">
                It should be YYYY-MM-DD
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Description
              </label>
              <textarea
                placeholder="Enter a detailed description of your item"
                rows={4}
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                value={sellingData.description}
                onChange={(e) => handleSellingDataChange('description', e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-2">
                Be specific and descriptive
              </p>
            </div>


            {/* Details */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Item's Location *
              </label>
              <input
                type="text"
                placeholder="Enter the location of the item"
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                value={sellingData.country}
                onChange={(e) => {handleSellingDataChange('country', e.target.value);
                }}
              />
              <p className="text-sm text-gray-500 mt-2">
                  Input: City, Country      (example:  Athens, Greece)  
                </p>
            </div>

            {/* Pricing Section */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">💰 Pricing Information</h3>
              
              {/* Current Best Price */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Starting Bid Price (EUR) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-4 text-gray-500 text-lg">€</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    className="w-full pl-8 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    value={sellingData.currently}
                    onChange={(e) => handleSellingDataChange('currently', e.target.value)}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  The initial price where bidding will start
                </p>
              </div>
              

              {/* Current Best Price */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Buy Now Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-4 text-gray-500 text-lg">€</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    className="w-full pl-8 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    value={sellingData.Buy_Price}
                    onChange={(e) => handleSellingDataChange('Buy_Price', e.target.value)}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  This price will end the auction automatically!
                </p>
              </div>

              
            </div>
            {/* Form Summary */}
            {isFormValid && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">✅ Auction Summary</h4>
                <div className="text-sm text-green-700 space-y-1">
                  <p><strong>Item:</strong> {sellingData.name}</p>
                  <p><strong>Category:</strong> {sellingData.categories}</p>
                  {/* <p><strong>Category:</strong> {sellingData.categories.join(', ')}</p> */}
                  {sellingData.Buy_Price > 0 && (
                    <p><strong>Buy It Now:</strong> €{sellingData.Buy_Price}</p>
                  )}
                  <p><strong>Starting Price:</strong> €{sellingData.currently}</p>
                  <p><strong>Location:</strong> {sellingData.location}, {sellingData.country}</p>
                  {sellingData.images && sellingData.images.length > 0 && (
                    <p><strong>Images:</strong> ✅ {sellingData.images.length} uploaded</p>
                  )}
                </div>
              </div>
            )}

            {/* Start Auction Button */}
            <div className="pt-6 border-t">
              <button
                onClick={handleStartAuction}
                disabled={!isFormValid}
                className={`w-full py-5 px-6 rounded-lg text-xl font-bold transition-all duration-200 ${
                  isFormValid
                    ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isFormValid ? '🔨 Complete Auction Now' : '📝 Complete Required Fields'}
              </button>
              
              {!isFormValid && (
                <p className="text-sm text-red-500 text-center mt-3">
                  Please fill in all required fields (*) to start your auction
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}