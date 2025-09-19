import { useState } from "react";


interface Product {
    id: number;
    title: string;
    price: string;
    image: string;
    condition: string;
    seller: string;
    rating: string;
    format: string;
    description: string;
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
                        <h2 className="text-2xl font-bold text-gray-800 pr-4">
                            {product.title}
                        </h2>

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
                                <div className="text-3xl font-bold text-green-600">{product.price}</div>
                                <div className="text-sm text-gray-600">Condition: <span className="font-medium">{product.condition}</span></div>
                                <div className="text-sm text-gray-600">Seller: <span className="font-medium text-blue-600">{product.seller}</span>
                                    <span className="text-green-600 ml-2">({product.rating} positive)</span>
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
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Format:</span>
                                        <span className="font-medium">{product.format || "Physical Book"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping:</span>
                                        <span className="font-medium text-green-600">Free shipping</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-800 mb-2">Seller Information</h3>
                                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-gray-600">Feedback Score:</span>
                                        <span className="font-medium text-green-600">{product.rating}</span>
                                    </div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-gray-600">Items Sold:</span>
                                        <span className="font-medium">1,247</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Member Since:</span>
                                        <span className="font-medium">2019</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="space-y-3">
                                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                    Buy It Now
                                </button>
                                <button className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                                    Add to Kart
                                </button>
                                <button className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium">
                                    Make Offer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



export function BadeBayPage({ onLogout } : { onLogout: () => void;}){
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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


const products = [
    {
      id: 1,
      title: "The Great Gatsby - Classic Literature",
      price: "EUR 15.99",
      image: "📚",
      condition: "New",
      seller: "BookStore123",
      rating: "98.5%",
      format: "Hardcover",
      description: "A timeless classic of American literature. This beautiful hardcover edition features the original cover design and includes an introduction by a renowned literary scholar."
    },
    {
      id: 2,
      title: "JavaScript: The Definitive Guide",
      price: "EUR 45.50",
      image: "💻",
      condition: "Used - Good",
      seller: "TechBooks",
      rating: "99.1%",
      format: "Paperback",
      description: "The comprehensive guide to JavaScript programming. Covers ES6+ features, modern development practices, and includes practical examples for web developers."
    },
    {
      id: 3,
      title: "Vintage Recipe Collection",
      price: "EUR 8.75",
      image: "🍳",
      condition: "Used - Very Good",
      seller: "VintageFinds",
      rating: "97.8%",
      format: "Hardcover",
      description: "A charming collection of traditional recipes passed down through generations. Features beautiful vintage illustrations and time-tested cooking techniques."
    },
    {
      id: 4,
      title: "Art History Textbook",
      price: "EUR 32.00",
      image: "🎨",
      condition: "New",
      seller: "EduBooks",
      rating: "98.9%",
      format: "Paperback",
      description: "Comprehensive art history textbook covering major movements from ancient times to contemporary art. Includes high-quality color reproductions and critical analysis."
    },
    {
      id: 5,
      title: "Mystery Novel Bundle (3 books)",
      price: "EUR 22.99",
      image: "🔍",
      condition: "Used - Good",
      seller: "MysteryReader",
      rating: "96.7%",
      format: "Paperback Bundle",
      description: "Three thrilling mystery novels from acclaimed authors. Perfect for fans of detective fiction and psychological thrillers. Hours of suspenseful reading ahead."
    },
    {
      id: 6,
      title: "Photography Guide - Digital Edition",
      price: "EUR 28.50",
      image: "📷",
      condition: "New",
      seller: "PhotoPro",
      rating: "99.5%",
      format: "Paperback",
      description: "Master digital photography with this comprehensive guide. Covers camera settings, composition techniques, post-processing, and includes practical exercises."
    }
  ];

  const categories = [
    "All Categories",
    "Books & Magazines",
    "Textbooks",
    "Fiction",
    "Non-Fiction",
    "Children's Books",
    "Comics & Graphic Novels"
  ];

  const formats = [
    "All Formats",
    "Hardcover",
    "Paperback",
    "Digital/eBook",
    "Audiobook"
  ];

  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-3xl font-bold text-blue-600 mr-8">eBuy Guest Page</div>
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
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
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
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                />
                <span className="self-center text-gray-500">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-20 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                />
              </div>
            </div>


            {/* Format Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-2">Format</h4>
              <div className="space-y-2">
                {formats.map((format, index) => (
                  <label key={index} className="flex items-center">
                    <input
                      type="radio"
                      name="format"
                      value={format.toLowerCase().replace(/\s+/g, '-')}
                      checked={selectedFormat === format.toLowerCase().replace(/\s+/g, '-')}
                      onChange={(e) => setSelectedFormat(e.target.value)}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{format}</span>
                  </label>
                ))}
              </div>
            </div>


            {/* Apply Filters Button */}
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
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
                  onClick={() => handleProductClick(product)}
                >
                  <div className="text-6xl text-center mb-3">
                    {product.image}
                  </div>
                  <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">{product.title}</h3>
                  <div className="text-xl font-bold text-green-600 mb-2">
                    {product.price}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    Condition: {product.condition}
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    Seller: {product.seller} ({product.rating} positive)
                  </div>

                  
                  <button
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
                      onClick={(e) => {
                          e.stopPropagation();
                          console.log("Buy it now clicked for:", product.title);
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
        </div>
    );

}

