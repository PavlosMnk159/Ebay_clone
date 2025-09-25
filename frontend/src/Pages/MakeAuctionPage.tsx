import fetch_with_auth from "@/Authentication/axios";
import { useState } from "react";
import { useNavigate } from "react-router";

export function MakeAuction({ onLogout }: { onLogout: () => void; }) {


    const nav = useNavigate();
  
    const navigateEbay= ()=>{
      nav('/ebay')
    }
  
  
    const navigateChat= ()=>{
      nav('/chatIn')
    }

    const navigateMyAuctions= ()=>{
      nav('/myAuction')
    }

  // Selling page state
  const [sellingData, setSellingData] = useState({
    name: "",
    categories: [] as string[],
    currently: "",
    buy_price: "",
    ends: "",
    description: "",
    image: null as File | null,
    location: ""
  });

  // Backend
  // fetch categories

  const categories = [
    "Books & Magazines",
    "Textbooks",
    "Fiction",
    "Non-Fiction",
    "Children's Books",
    "Comics & Graphic Novels",
    "Electronics",
    "Fashion",
    "Home & Garden",
    "Sports & Outdoors",
    "Toys & Games",
    "Collectibles"
  ];

  const handleSellingDataChange = (field: string, value: string | string[] | boolean | File | null) => {
    setSellingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleSellingDataChange('image', file);
  };

  const handleStartAuction = async () => {
    console.log("Starting auction with data:", sellingData);
    alert("Auction started successfully! Your item is now live.");

    // Backend
    // here post new Auction
    // εδω ειναι .json τα στοιχεια 
    //κανεις και fetch νομιζω για τα υπολοιπα στοιχεια    
    try {

      const res = await fetch_with_auth.post('/create_item/', sellingData);
      
      if (res.status != 201) {
        console.log("Could not create item: ", res.data);
      } else {

        // Reset form after successful submission
        setSellingData({
          name: "",
          categories: [],
          currently: "",
          buy_price: "",
          ends: "",
          description: "",
          image: null,
          location: ""
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
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Msgs
                {/* backend. fetch minimata
                                 {users.length > 0 && ( 
                                // <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                                    {/* {users.length}
                                </span> 
                                // )} */}
              </button>
              
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
                onChange={(e) => handleSellingDataChange('name', e.target.value)}
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
                {categories.map((cat, index) => (
                  <label key={index} className="flex items-center mb-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                      type="checkbox"
                      value={cat}
                      checked={sellingData.categories.includes(cat)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleSellingDataChange('categories', [...sellingData.categories, cat]);
                        } else {
                          handleSellingDataChange('categories', sellingData.categories.filter(c => c !== cat));
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
                Choose the category that best describes your item
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Item Image (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                {sellingData.image ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <img
                        src={URL.createObjectURL(sellingData.image)}
                        alt="Preview"
                        className="max-w-xs max-h-48 rounded-lg shadow-md"
                      />
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      📷 {sellingData.image.name}
                    </p>
                    <div className="flex gap-3 justify-center">
                      <label
                        htmlFor="image-upload"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                      >
                        Change Image
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          handleSellingDataChange('image', null);
                          const fileInput = document.getElementById('image-upload') as HTMLInputElement;
                          if (fileInput) fileInput.value = '';
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Remove Image
                      </button>
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
                        Choose Image
                      </label>
                    </div>
                    <p className="text-sm text-gray-500">
                      Upload a clear photo of your item to attract more bidders
                    </p>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Supported formats: JPG, PNG, GIF. Max file size: 5MB
              </p>
            </div>

            {/* Details */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                End time *
              </label>
              <input
                type="text"
                placeholder="Enter a finisehd date"
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                value={sellingData.ends}
                onChange={(e) => handleSellingDataChange('ends', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Description
              </label>
              <input
                type="text"
                placeholder="Enter a descriptive name for your item"
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
                Itme's Location *
              </label>
              <input
                type="text"
                placeholder="Enter the location of the item"
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                value={sellingData.location}
                onChange={(e) => handleSellingDataChange('location', e.target.value)}
              />
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
              

              {/* Target Price with Toggle */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Buy It Now Price (EUR)
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">Enable Buy It Now:</span>
                    <button
                      onClick={() => handleSellingDataChange('buy_price', !sellingData.buy_price)}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        sellingData.buy_price ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-lg ${
                          sellingData.buy_price ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                
                <div className="relative">
                  <span className={`absolute left-3 top-4 text-lg ${
                    !sellingData.buy_price ? 'text-gray-400' : 'text-gray-500'
                  }`}>€</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    disabled={!sellingData.buy_price}
                    className={`w-full pl-8 p-4 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg ${
                      !sellingData.buy_price 
                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-400' 
                        : 'bg-white border-gray-300'
                    }`}
                    value={sellingData.buy_price}
                    onChange={(e) => handleSellingDataChange('buy_price', e.target.value)}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {sellingData.buy_price 
                    ? "Buyers can purchase immediately at this price, ending the auction"
                    : "Toggle on to allow instant purchases at a fixed price"
                  }
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
                  <p><strong>Starting Bid:</strong> €{sellingData.currently}</p>
                  {sellingData.buy_price && sellingData.buy_price && (
                    <p><strong>Buy It Now:</strong> €{sellingData.buy_price}</p>
                  )}
                  <p><strong>Reserve Price:</strong> €{sellingData.currently}</p>
                  {sellingData.image && (
                    <p><strong>Image:</strong> ✅ Uploaded ({sellingData.image.name})</p>
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
                {isFormValid ? '🔨 Start Auction Now' : '📝 Complete Required Fields'}
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