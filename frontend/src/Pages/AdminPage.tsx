import { useState } from "react";
import { useNavigate } from "react-router";

interface User {
  id: number;
  username: string;
  forname: string;
  lastname: string;
  image: string;
  email: string;
  rating: string;
  number: string;
  afm: string;
  country: string;
  city: string;
  region: string;
  street: string;
  streetNumber: string;
}

interface ItemModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

function ItemModal({ user, isOpen, onClose } : ItemModalProps) {
  if (!isOpen ||!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          {/* Header with close button */}
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800 pr-4">{user.username}</h2>
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
                {user.image}
              </div>
              
              <div className="space-y-2">
                <div className="text-3xl font-bold text-green-600">{user.forname} {user.lastname}</div>
                <div className="text-sm text-gray-600">Email: <span className="font-medium">{user.email}</span></div>
                <div className="text-sm text-gray-600">Rating: <span className="text-green-600 ml-2">({user.rating})</span>
                </div>
              </div>
            </div>

            {/* Right column - Details and actions */}
            <div>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Profile Details</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profile ID:</span>
                    <span className="font-medium">#{user.id.toString().padStart(6, '0')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number:</span>
                    <span className="font-medium">{user.number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">AFM:</span>
                    <span className="font-medium">{user.afm}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Country:</span>
                    <span className="font-medium">{user.country}, {user.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Street:</span>
                    <span className="font-medium">{user.region} {user.street} {user.streetNumber}</span>
                  </div>
                </div>
              </div>

              

              {/* Action buttons */}
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Message User
                </button>
                <button className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors font-medium">
                  Delete user
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



export function AdminPage({ onLogout } : { onLogout: () => void;}) {
  // const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nav = useNavigate();

  const navigate = () => {
    nav('/requests')
  };

  const navigateChat = () => {
        nav('/chat')
    };

  // const handleSearch = () => {
  //   console.log("Searching for:", searchQuery);
  // };

  // const handleKeyPress = (e: React.KeyboardEvent) => {
  //   if (e.key === "Enter"){
  //     e.preventDefault();
  //     handleSearch();
  //   }
  // };

  const handleProductClick = (user: User) => {
    setSelectedProduct(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  
  const users = [
    {
      id: 1,
      username: "Username",
      forname: "Name",
      lastname: "Lastname",
      image: "📚",
      email: "xxxxxxxx@gmail.com",
      rating: "98.5%",
      number: "69xxxxxxxx",
      afm: "afm here",
      country: "Greeece",
      city: "Athens",
      region: "Region here",
      street: "Street here",
      streetNumber: "xx"
   },
    {
      id: 2,
      username: "Username",
      forname: "Name",
      lastname: "Lastname",
      image: "📚",
      email: "xxxxxxxx@gmail.com",
      rating: "98.5%",
      number: "69xxxxxxxx",
      afm: "afm here",
      country: "Greeece",
      city: "Athens",
      region: "Region here",
      street: "Street here",
      streetNumber: "xx"
   }
  ];



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-3xl font-bold text-blue-600 mr-8">eBuy Admin userList Page</div>
            </div>
            
            <div className="flex items-center gap-4"> 
              {/* Requests Button */}
              <button
                  onClick={navigateChat}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                  Msgs
              </button>
              <button
                onClick={navigate}
                className="relative bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Requests
                {users.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                    {users.length}
                  </span>
                )}
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
          {/* Main Content - Product Grid */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-800">Users</h2>
              <div className="text-sm text-gray-600">
                {users.length} results
              </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <div 
                  key={user.id} 
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 p-4 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => handleProductClick(user)}
                >
                  <div className="text-6xl text-center mb-3">
                    {user.image}
                  </div>
                  <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">{user.username}</h3>
                  <div className="text-xl font-bold text-green-600 mb-2">
                    {user.forname} {user.lastname}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    Email: {user.email}
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    Rating: ({user.rating})
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ItemModal 
        user={selectedProduct} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );

}

