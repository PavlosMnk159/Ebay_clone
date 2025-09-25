import { LoginFormData } from "@/types/auth_types";
import { useState } from "react";
import { useNavigate } from "react-router";


export function LoginPage({ 
  
  onLogin,
  onAdmin
  }: { 

  onLogin: (data: LoginFormData) => void;
  onAdmin: (data: LoginFormData) => void;
}) 

{
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const nav = useNavigate();

  const navigate= ()=>{
      nav('/register')
  }
  const navigatetGuest= ()=>{
      nav('/badebay')
  }


  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) return;
    
    setIsLoading(true);

    const loginData = {username, password};

    // Simulate loading 
    setTimeout(() => {
        setIsLoading(false);
        onLogin(loginData); // Just pass true to login regardless of credentials
        onAdmin(loginData);
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


            <button
              onClick={navigatetGuest}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
            "Sign In as Guest"

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

