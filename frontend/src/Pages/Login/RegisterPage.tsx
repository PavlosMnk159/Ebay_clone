import { useState } from "react";
import { RegisterFormData } from "../../types/auth_types";
import { useNavigate } from "react-router";

export function RegisterPage({ 

  onRegister, 

}: { 

  onRegister: (data: RegisterFormData) => void;

}) 

{
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setusername] = useState("");
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

  
  const nav = useNavigate();

  const navigate= ()=>{
    nav('/login')
  }
  
  const handleSubmit = async () => {
    if (!firstName.trim() || !lastName.trim() || !username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim() || !address.trim() || !phone.trim() || !house_number.trim() || !city.trim() || !country.trim() || !region.trim() || !AFM.trim() || !postal_code.trim()) {
      alert("You left some gap empty")
      return;
    } 
    
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (password.length < 3) {
      alert("Password number must be at least 3 characters long");
      return;
    }


    setIsLoading(true);
    

    const userData = {username, password, email, country, region, city, postal_code, address, house_number, phone, AFM}



    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      onRegister(userData); 
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
          <h1 className="text-2xl font-bold">TOTTALLY NOT eBay</h1>
          <p className="text-blue-100 mt-2">Create your account</p>
        </div>

        {/* Registration Form */}
        <div className="p-8">
          <div className="space-y-4">

            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => { setusername(e.target.value)}}
                className={'w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 border-gray-200 focus:ring-blue-500'}
                placeholder="Create a sername"
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
                <label htmlFor="addressNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  AddressNumber
                </label>
                <input
                  id="addressNumber"
                  type="text"
                  value={house_number}
                  onChange={(e) => setAddressNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your addressNumber"
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
              disabled={isLoading || !firstName.trim() || !lastName.trim() || !username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim() || !address.trim() || !phone.trim() || !house_number.trim() || !city.trim() || !country.trim() || !region.trim() || !AFM.trim() || !postal_code.trim() }
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
                onClick={navigate}
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


