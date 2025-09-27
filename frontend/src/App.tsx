import { useEffect, useState,  } from "react";
import { useNavigate , BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'


import { loginUser } from "./Authentication/auth.ts";
import { registerUser } from "./Authentication/auth.ts";

import { LoginFormData, RegisterFormData } from "./types/auth_types";

  
import { LoginPage } from './Pages/LoginPage.tsx';
import { RegisterPage } from './Pages/RegisterPage.tsx';
import { WaitingPage } from './Pages/WaitingPage.tsx';

import { EBayPage } from './Pages/eBayPage.tsx';
import { MakeAuction } from './Pages/MakeAuctionPage.tsx';
import { AuctionPage } from './Pages/myAuctionPage.tsx';
import { ItemBidPage } from './Pages/ItemBidPage.tsx'
import { BidPage } from './Pages/myBidPage.tsx'


import { AdminPage } from './Pages/AdminPage.tsx';
import { RequestPage } from './Pages/RequestsPage.tsx';

// this is a comment

import { ChatOutPage } from './Pages/ChatOutPage.tsx';
import { ChatInPage } from "./Pages/ChatInPage.tsx";

function MainApp() {
  const [showRegisterSuccess, setShowRegisterSuccess] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [currPage, setCurrPage] = useState<string | null>("/login");
  const [appReady, setAppReady] = useState(false);
  
  // const [hasMessages, setHasMessages] = useState(false)
  const location = useLocation();
  const navigate = useNavigate(); // Now inside Router context

  const navigateToEbay = () => {
    navigate('/ebay');
    localStorage.setItem('currentPage', '/ebay'); 
  }

  const navigateToMyAuctions = () => {
    navigate('/myAuction');
    localStorage.setItem('currentPage', '/myAuction'); 
  }

  const navigateToChat = () => {
    navigate('/chatIn');
    localStorage.setItem('currentPage', '/chatIn'); 
  }

  const navigateToUserlist = () => {
    navigate('/admin');
    localStorage.setItem('currentPage', '/admin'); 
  }

  


  
  const restoreAuthState = () => {
    try {
      const token = localStorage.getItem('access_token');
      const adminStatus = localStorage.getItem('is_admin'); // Store admin status
      const userLoggedIn = localStorage.getItem('is_logged_in'); // Store login status
      const userGuest = localStorage.getItem('is_guest'); // Store login status
      const currPage = localStorage.getItem('currentPage'); // Store page status
      
      console.log('Restoring auth state:', { token, adminStatus, userLoggedIn, userGuest, currPage});
      //token && 
      if (userLoggedIn === 'true') {
        setCurrPage(currPage);

        setIsLoggedIn(true);
        if (adminStatus === 'true') {
          setIsAdmin(true);
        }
      } else if (userGuest === 'true'){
        setIsGuest(true);
      }

    } catch (error) {
      console.error('Error restoring auth state:', error);
      // Clear potentially corrupted data
      localStorage.removeItem('access_token');
      localStorage.removeItem('is_admin');
      localStorage.removeItem('is_logged_in');
      localStorage.removeItem('is_guest');
      localStorage.removeItem('currentPage');

    }
  };
  
  const clearAuthState = () => {
    setIsGuest(false);
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrPage(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('is_admin');
    localStorage.removeItem('is_logged_in');
    localStorage.removeItem('is_guest');
    localStorage.removeItem('currentPage');
  };

 useEffect(() => {
    restoreAuthState();
  }, []);
 

  const handleLogin = async (data: LoginFormData) => {
    const response = await loginUser(data);
    setIsLoggedIn(true);
    setIsAdmin(true);
    localStorage.setItem('is_admin', 'true');
    localStorage.setItem('is_logged_in', 'true');

    localStorage.setItem('currPage', '/homepage');

    // setIsGuest(true);
    // localStorage.setItem('is_guest', 'true');

    if (response.success) {
        // set logged

        // if Admin 
        //   give admin privlege also
        //   console.log("Admin logged in successfully!");
        //   console.log(data.username);
    } else {
      alert("Login failed, please try again.");
    }
    
  }

  const handleGuest = () => {
    setIsGuest(true);
    setIsLoggedIn(true);
    localStorage.setItem('is_guest', 'true');
    localStorage.setItem('is_logged_in', 'true');

    navigateToEbay();
  }

  const handleRegister = async (data: RegisterFormData) => {
    // backend
    // einai auto sosto post?
    const response = await registerUser(data);
    if (response.success) {
      setIsRegister(true);
      navigate('/waiting');
    } else {
      alert("Registration failed");
    }
  };

  const handleLogout = () => {
    clearAuthState();

    navigate('/login');

  };

  // Registration success message
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
                navigate('/login');
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

  //Routes


    useEffect(() => {
      // Reset and show loading animation whenever route changes
      setAppReady(false);
      
      const timer = setTimeout(() => {
        setAppReady(true);
      }, 200);
      
      return () => clearTimeout(timer);
    }, [location.pathname]); // Runs whenever the route changes

  // Loading screen
  if (!appReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="flex space-x-2 mb-4">
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
          </div>
          <div className="text-blue-700 font-semibold text-lg">Loading application...</div>
        </div>
      </div>
    );
  }


  return (
    <Routes>


      {/*login*/}
      <Route path='/login' element={
        (!isLoggedIn) ? (
          <LoginPage 
          onLogin={handleLogin} 
          onGuest={handleGuest}
          />
        ) : currPage && currPage !== '/login' ?(
          <Navigate to={currPage} replace />
        ) : isGuest? (
          <Navigate to='/ebay' replace />
        ) : (
          <Navigate to='/homepage' replace />
        )

      } />

      {/*admin*/}
      <Route path='/admin' element={
        isAdmin ?
          <AdminPage onLogout={handleLogout} /> 
          :
          <Navigate to="/login" replace />
      } />


      {/*register*/}
      <Route path='/register' element={<RegisterPage onRegister={handleRegister} />} />

      {/* HomePage */}
      <Route path='/homepage' element={
        isLoggedIn ? (
          <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h1 className="text-2xl font-bold text-center mb-4">Welcome to eBuy</h1>
              <p className="text-gray-600 text-center mb-6">You are now logged in.</p>
             
              <button
                onClick={navigateToEbay} 
                className="w-full bg-blue-500 text-white py-2 px-2 rounded-lg hover:bg-blue-600 mb-2">

                Start Browsing
              </button>
             
              <button
                onClick={navigateToMyAuctions} 
                className="w-full bg-orange-500 text-white py-2 px-2 rounded-lg hover:bg-orange-600 mb-2">

                Start Auctioning
              </button>
             
              <button
                onClick={navigateToChat} 
                className="w-full bg-green-500 text-white py-2 px-2 rounded-lg hover:bg-green-600 mb-2">

                Start Chatting
              </button>

              {isAdmin && (<button
                onClick={navigateToUserlist} 
                className="w-full bg-blue-500 text-white py-2 px-2 rounded-lg hover:bg-blue-600 mb-2">

                See List of Users
              </button>)}

              <button
                onClick={handleLogout}
                className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">

                Logout
              </button>
            </div>
          </div>
        ) : (
          <Navigate to="/login" replace />
        )
      } />

      {/*ebay*/}
      <Route path='/ebay' element={
        isLoggedIn ? (
          <EBayPage
            isAdmin={isAdmin}
            isGuest={isGuest}
            onLogout={handleLogout}
          />
        ) : (
          <Navigate to="/login" replace />
        )
      } />

      {/*myAuction*/}
      <Route path='/myAuction' element={
        isLoggedIn ? (
          <AuctionPage 
            isAdmin={isAdmin}
            onLogout={handleLogout} />
        ) : (
          <Navigate to="/login" replace />
        )
      } />

      {/*my bids */}
      <Route path='/mybids' element={
        isLoggedIn ? (
          <BidPage 
            isAdmin={isAdmin}
            onLogout={handleLogout} />
        ) : (
          <Navigate to="/login" replace />
        )
      } />

      {/*Item bidds */}
      <Route path='/itembids/:productId' element={
        isLoggedIn ? (
          <ItemBidPage 
            isAdmin={isAdmin}
            onLogout={handleLogout} />
        ) : (
          <Navigate to="/login" replace />
        )
      } />

      {/*makeAuction*/}
      <Route path='/makeAuction' element={
        isLoggedIn ? (
          <MakeAuction 
          isAdmin={isAdmin}
          onLogout={handleLogout} />
        ) : (
          <Navigate to="/login" replace />
        )
      } />

      {/*Inchat*/}
      <Route path='/chatIn' element={
        isLoggedIn ? (
          <ChatInPage 
            isAdmin={isAdmin}
            onLogout={handleLogout} 
          />
        ) : (
          <Navigate to="/login" replace />
        )
      } />

      {/*Outchat*/}
      <Route path='/chatOut' element={
        isLoggedIn ? (
          <ChatOutPage 
            isAdmin={isAdmin}
            onLogout={handleLogout} />
        ) : (
          <Navigate to="/login" replace />
        )
      } />


      {/*admin requests*/}
      <Route path='/requests' element={
        isAdmin ?
          <RequestPage onLogout={handleLogout} /> 
          :
          <Navigate to="/login" replace />

      } />

      {/*admin requests*/}
      <Route path='/waiting' element={
        isRegister ?
          <WaitingPage onLogout={handleLogout} /> 
          :
          <Navigate to="/login" replace />

      } />

    <Route path="*" element={  <Navigate to='/login' replace />} />


    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}

export default App;