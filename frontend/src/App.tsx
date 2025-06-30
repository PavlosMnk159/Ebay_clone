import { useState } from "react";

import { LoginPage } from './utils.tsx';
import { RegisterPage } from './utils.tsx';
import { ChatPage } from './ChatPage.tsx';





function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [showRegisterSuccess, setShowRegisterSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showChat, setShowChat] = useState(false); 
  
  const handleLogin = (success: boolean) => {
    if (success) {
      setIsLoggedIn(true);
      console.log("User logged in successfully!");
    }
  };

  const handleRegister = (success: boolean) => {
    if (success) {
      setCurrentPage("login");
      setShowRegisterSuccess(true); 
      console.log("User registered successfully! Please sign in.");
    }
  };



  // registration success message
  if (showRegisterSuccess) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
            <p className="text-gray-600 mb-6">Your account has been created successfully. You can now sign in with your credentials.</p>
            <p className="text-gray-600 mb-6">TODO "2. Θ επιτυχισ ειςαγωγι των ςτοιχείων που απαιτοφνται κα οδθγεί 
              τον καινοφργιο χριςτθ ςε ςελίδα που κα τον ενθμερϊνει ότι εκκρεμεί θ ζγκριςθ τθσ
              αίτθςθσ εγγραφισ του ςτθν εφαρμογι από τον διαχειριςτι."</p>
            <button 
              onClick={() => {
                setShowRegisterSuccess(false);
                setCurrentPage("login");
              }}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  }



  // chat MBW
  if (isLoggedIn && showChat) {
    return <ChatPage onLogout={() => { 
      setIsLoggedIn(false); 
      setShowChat(false); 
    }} />;
  }  


  // after login success
  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-4">Welcome to INSERT APP NAME HERE</h1>
          <p className="text-gray-600 text-center">You are now logged in.</p>
          {/* Show chat */}
          <button 
          onClick={() => {setShowChat(true)}}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 mb-2">
          Start Chat
          </button>
          {/* logout */}
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }
    



  // login <--> register , links
  return currentPage === "login" ? (
    <LoginPage 
      onLogin={handleLogin}
      onNavigateToRegister={() => setCurrentPage("register")}
    />
  ) : (
    <RegisterPage 
      onRegister={handleRegister}
      onNavigateToLogin={() => setCurrentPage("login")}
    />

    
  );
}




export default App;