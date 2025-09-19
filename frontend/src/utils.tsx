import { useState } from "react";
import { LoginFormData, RegisterFormData } from "./types/auth_types";
import { useNavigate } from "react-router";

export function LoginPage({ 
  
  onLogin

  }: { 

  onLogin: (data: LoginFormData) => void;
  onNavigateToRegister: () => void;
  
}) 

{
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const nav = useNavigate();
  
  const navigate= ()=>{
      nav('/register')
  }
  
  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) return;
    
    setIsLoading(true);

    const loginData = {username, password};
    
    // Simulate loading 
    setTimeout(() => {
      setIsLoading(false);
      onLogin(loginData); // Just pass true to login regardless of credentials
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center">
          <div className="flex justify-center mb-4">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold">INSERT APP NAME HERE</h1>
          <p className="text-blue-100 mt-2">Sign in to access APP</p>
        </div>

        {/* Login Form */}
        <div className="p-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading || !username.trim() || !password.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="flex space-x-1 mr-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          {/* Additional Links */}
          <div className="mt-6 text-center space-y-2">
            <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">
              Forgot your password?
            </a>
            <div className="text-gray-500 text-sm">
              Don't have an account? 
              <button 
                onClick={navigate}
                className="text-blue-600 hover:text-blue-800 ml-1 bg-transparent border-none cursor-pointer"
              >
                Sign up here
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




export function RegisterPage({ 

  onRegister, 
  onNavigateToLogin 

}: { 

  onRegister: (data: RegisterFormData) => void;
  onNavigateToLogin: () => void;

}) 

{
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setTelephone] = useState("");
  const [house_number, setAddressNumber] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [AFM, setAFM] = useState("");
  const [postal_code, setRegionNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');
  const [usernameError] = useState('');

  const handleSubmit = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !username.trim() || !password.trim() || !confirmPassword.trim() || !address.trim() || !phone.trim() || !house_number.trim() || !city.trim() || !country.trim() || !region.trim() || !AFM.trim() || !postal_code.trim())  return;
    
    {/* Alerts help to fill the neccesary gaps */}

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (password.length < 3) {
      alert("Password number must be at least 3 characters long");
      return;
    }

    // if (email.exists){
    //   alert("username already used");
    //   return;
    // }
    

    setIsLoading(true);

    const registerData = {username, password, email, country, region, city, postal_code, address, house_number, phone, AFM}
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      onRegister(registerData); // Just pass true to register regardless of credentials
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center">
          <div className="flex justify-center mb-4">
            {/* <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
            </svg> */}
          </div>
          <h1 className="text-2xl font-bold">INSERT APP NAME HERE</h1>
          <p className="text-blue-100 mt-2">Create your account</p>
        </div>

        {/* Registration Form */}
        <div className="p-8">
          <div className="space-y-4">

            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="email"
                type="text"
                value={username}
                onChange={(e) => { setUserName(e.target.value)}}
                className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  usernameError
                    ? 'border-red-500 focus:ring-red-500 placeholder-red-400' 
                    : 'border-gray-200 focus:ring-blue-500'
                }`}
                placeholder="Create a sername"
              />
              {usernameError && (
                <p className="text-red-500 text-xs mt-1">{usernameError}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); 
                                   e.target.value.length < 3 ? setPasswordError("Passwords too small, at least 3 characters")
                                                               : setPasswordError(""); }}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                  passwordError
                    ? 'border-red-500 focus:ring-red-500 placeholder-red-400' 
                    : 'border-gray-200 focus:ring-blue-500'
                }`}
                placeholder="Create a password"
              />
              {passwordError && (
                <p className="text-red-500 text-xs mt-1">{passwordError}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); 
                                   password !== e.target.value ? setPasswordConfirmError("Passwords not matching")
                                                               : setPasswordConfirmError(""); }}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                  passwordConfirmError 
                    ? 'border-red-500 focus:ring-red-500 placeholder-red-400' 
                    : 'border-gray-200 focus:ring-blue-500'
                }`}
                placeholder="Confirm your password"
              />
              {passwordConfirmError && (
                <p className="text-red-500 text-xs mt-1">{passwordConfirmError}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="First name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="AFM" className="block text-sm font-medium text-gray-700 mb-2">
                  ΑΦΜ
                </label>
                <input
                  id="AFM"
                  type="text"
                  value={AFM}
                  onChange={(e) => setAFM(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your ΑΦΜ"
                />
              </div>
              <div>
                <label htmlFor="Telephone Number" className="block text-sm font-medium text-gray-700 mb-2">
                  Telephone
                </label>
                <input
                  id="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Number"
                />
              </div>
            </div>

            {/* todo, here can put scroll wheel for city  */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Χωρα
                </label>
                <input
                  id="country"
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your country"
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  ΠΟΛΗ
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your city"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  ΟΔΟΣ
                </label>
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your address"
                />
              </div>
              <div>
                <label htmlFor="house_number" className="block text-sm font-medium text-gray-700 mb-2">
                  AddressNumber
                </label>
                <input
                  id="house_number"
                  type="text"
                  value={house_number}
                  onChange={(e) => setAddressNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your house_number"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                  Περιοχη
                </label>
                <input
                  id="region"
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your region"
                />
              </div>
              <div>
                <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-2">
                  Τ.Κ.
                </label>
                <input
                  id="postal_code"
                  type="text"
                  value={postal_code}
                  onChange={(e) => setRegionNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your postal_code"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading || !firstName.trim() || !lastName.trim() || !email.trim() || !username.trim() || !password.trim() || !confirmPassword.trim() || !address.trim() || !phone.trim() || !house_number.trim() || !city.trim() || !country.trim() || !region.trim() || !AFM.trim() || !postal_code.trim() }
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="flex space-x-1 mr-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                  Creating Account...
                </>
                
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          {/* Additional Links */}
          <div className="mt-6 text-center space-y-2">
            <div className="text-gray-500 text-sm">
              Already have an account? 
              <button 
                onClick={onNavigateToLogin}
                className="text-blue-600 hover:text-blue-800 ml-1 bg-transparent border-none cursor-pointer"
              >
                Sign in here
              </button>
            </div>
            <div className="text-xs text-gray-400 text-center mt-4">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



export function ChatPage({ onLogout, onSellClick }: { onLogout: () => void; onSellClick: () => void; }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedFormat, setSelectedFormat] = useState("all");

  // Sample product data
  const products = [
    {
      id: 1,
      title: "The Great Gatsby - Classic Literature",
      price: "EUR 15.99",
      image: "📚",
      condition: "New",
      seller: "BookStore123",
      rating: "98.5%"
    },
    {
      id: 2,
      title: "JavaScript: The Definitive Guide",
      price: "EUR 45.50",
      image: "💻",
      condition: "Used - Good",
      seller: "TechBooks",
      rating: "99.1%"
    },
    {
      id: 3,
      title: "Vintage Recipe Collection",
      price: "EUR 8.75",
      image: "🍳",
      condition: "Used - Very Good",
      seller: "VintageFinds",
      rating: "97.8%"
    },
    {
      id: 4,
      title: "Art History Textbook",
      price: "EUR 32.00",
      image: "🎨",
      condition: "New",
      seller: "EduBooks",
      rating: "98.9%"
    },
    {
      id: 5,
      title: "Mystery Novel Bundle (3 books)",
      price: "EUR 22.99",
      image: "🔍",
      condition: "Used - Good",
      seller: "MysteryReader",
      rating: "96.7%"
    },
    {
      id: 6,
      title: "Photography Guide - Digital Edition",
      price: "EUR 28.50",
      image: "📷",
      condition: "New",
      seller: "PhotoPro",
      rating: "99.5%"
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

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
    // Implement search logic here
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-3xl font-bold text-blue-600 mr-8">eBay</div>
            </div>
            
            {/* Sell Button & Search Bar */}
            <div className="flex-1 max-w-2xl mx-4 flex gap-4">
              {/* Sell Button */}
              <button
                onClick={onSellClick}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap"
              >
                Sell
              </button>
              
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
                <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer">
                  <div className="text-6xl text-center mb-3">{product.image}</div>
                  
                  <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">
                    {product.title}
                  </h3>
                  
                  <div className="text-xl font-bold text-green-600 mb-2">
                    {product.price}
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-1">
                    Condition: {product.condition}
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    Seller: {product.seller} ({product.rating} positive)
                  </div>
                  
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm">
                    Buy It Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}