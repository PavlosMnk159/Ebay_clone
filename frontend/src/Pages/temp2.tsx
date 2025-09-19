// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router";

// export function ChatPage({ onLogout }: { onLogout: () => void; }) {

//     const conversations = [
//         { id: 1, name: "TechBooks", lastMessage: "How about EUR 42?", time: "10:37 AM", avatar: "💻", unread: 0 },
//         { id: 2, name: "BookStore123", lastMessage: "Thanks for your interest!", time: "Yesterday", avatar: "📚", unread: 2 },
//         { id: 3, name: "VintageFinds", lastMessage: "The recipe book is yours!", time: "2 days ago", avatar: "🍳", unread: 0 },
//     ];

//     const [messages, setMessages] = useState<Array<{ 
//         text: string; 
//         isUser: boolean; 
//         id: number; 
//         sender: string; 
//         time: string; 
//         avatar : string;
//     }>>([]);
    
//     const [inputText, setInputText] = useState("");
//     const [isLoading, setIsLoading] = useState(false);
//     const [activeChat, setActiveChat] = useState("TechBooks");
//     const [appReady, setAppReady] = useState(false);

//     const nav = useNavigate();
//     // Navigation function for browse page
//     const navigateBrowse = () => {
//       nav('/ebay')
//     }
  
//     // Navigation function for sell page
//     const navigateSell = () => {
//       nav('/sell')
//     }
//     // Effect hook to poll backend status on component mount
//     useEffect(() => {
//       let interval: ReturnType<typeof setInterval>;
      
//       // Function to check if backend is ready
//       const checkStatus = async () => {
//         try {
//           // Make request to backend status endpoint
//           const res = await fetch("http://localhost:8000/status/");
//           const data = await res.json();
          
//           // If backend reports ready, stop polling
//           if (data.ready) {
//             setAppReady(true);
//             if (interval) clearInterval(interval);
//           }
//         } catch (e) {
//           // Ignore errors and continue polling
//         }
//       };
      
//       // Initial status check
//       checkStatus();
      
//       // Poll every 1.5 seconds
//       interval = setInterval(checkStatus, 1500);
      
//       // Cleanup interval on unmount
//       return () => clearInterval(interval);
//     }, []); // Empty dependency array - run once on mount

    
//     // Function to send message to backend
//     const sendMessage = async () => {
//       // Don't send empty messages
//       if (!inputText.trim()) return;
      
//       // Add user message to chat immediately
//     //   const userMessage = ;
//       setMessages(prev => [...prev, {         
//                 isUser: true,
//                 id: messages.length + 1,
//                 text: inputText,
//                 sender: "me",
//                 time: new Date().toLocaleString(),
//                 avatar: "🙋‍♂️"
//             }]);
      
//       // Clear input and show loading state
//       setInputText("");
//       setIsLoading(true);
      
//       try {
//         // Make API call to backend chat endpoint
//         const response = await fetch("http://localhost:8000/chat/", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ message: inputText }),
//         });
        
//         // Check if request was successful
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         // Parse response JSON
//         const data = await response.json();
        
//         // Add bot response to chat
//         setMessages(prev => {
//           const newMessages = [...prev, {         
//                 isUser: false,
//                 id: messages.length + 1,
//                 text: data.response,
//                 sender: "Other",
//                 time: new Date().toLocaleString(),
//                 avatar: "🙋‍♂️"
//             }];
//           return newMessages;
//         });
//       } catch (error) {
//         // Handle errors by showing error message in chat
//         console.error("Error sending message:", error);
//         setMessages(prev => [...prev, 
//             {         
//                 isUser: false,
//                 id: messages.length + 1,
//                 text: "Sorry, there was an error processing your request",
//                 sender: "Bot",
//                 time: new Date().toLocaleString(),
//                 avatar: "🙋‍♂️"
//             }]);
//       } finally {
//         // Always hide loading state
//         setIsLoading(false);
//       }
//     };
  
//     const handleKeyPress = (e: React.KeyboardEvent) => {
//         if (e.key === "Enter" && !e.shiftKey) {
//             e.preventDefault();
//             sendMessage();
//         }
//     };

//     // Loading screen while backend initializes
//     if (!appReady) {
//       return (
//         <div className="flex items-center justify-center h-screen bg-gray-100">
//           <div className="flex flex-col items-center">
//             <div className="flex space-x-2 mb-4">
//               <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
//               <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
//               <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
//             </div>
//             <div className="text-blue-700 font-semibold text-lg">Loading application...</div>
//           </div>
//         </div>
//       );
//     }

//     return (
//         <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
//             <div className="bg-white rounded-xl shadow-lg flex-1 flex flex-col max-w-7xl mx-auto w-full overflow-hidden min-h-0">
//                 {/* Header */}
//                 <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-xl flex items-center justify-between rounded-t-xl">
//                     <div className="flex items-center">
//                         <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012 2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
//                         </svg>
//                         eBuy Messages
//                     </div>

//                     <div className="flex space-x-3">
//                         <button 
//                             onClick={navigateBrowse}
//                             className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-200"
//                         >
//                             Browse
//                         </button>
//                         <button 
//                             onClick={navigateSell}
//                             className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors duration-200"
//                         >
//                             Sell
//                         </button>
//                         <button 
//                             onClick={onLogout}
//                             className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200"
//                         >
//                             Logout
//                         </button>
//                     </div>
//                 </div>

//                 <div className="flex flex-1 min-h-0">
//                     {/* Left Sidebar */}
//                     <div className="w-80 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 flex flex-col">
//                         <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
//                             <h3 className="text-lg font-semibold text-gray-800">Conversations</h3>
//                         </div>
//                         <div className="flex-1 overflow-y-auto">
//                             {conversations.map((chat) => (
//                                 <div
//                                     key={chat.id}
//                                     className={`p-4 border-b cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all ${
//                                         activeChat === chat.name ? 'bg-gradient-to-r from-blue-100 to-indigo-100 border-l-4 border-l-blue-600' : ''
//                                     }`}
//                                     onClick={() => setActiveChat(chat.name)}
//                                 >
//                                     <div className="flex items-center gap-3">
//                                         <div className="text-2xl">{chat.avatar}</div>
//                                         <div className="flex-1 min-w-0">
//                                             <div className="flex justify-between items-center mb-1">
//                                                 <h4 className="font-medium text-gray-800 truncate">{chat.name}</h4>
//                                                 <span className="text-xs text-gray-500">{chat.time}</span>
//                                             </div>
//                                             <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
//                                         </div>
//                                         {chat.unread > 0 && (
//                                             <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center shadow-sm">
//                                                 {chat.unread}
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Main Chat Area */}
//                     <div className="flex-1 flex flex-col min-h-0">
//                         {/* Chat Header */}
//                         <div className="p-2 bg-gradient-to-r from-gray-50 to-blue-50 border-b flex items-center gap-1">
//                             <div className="text-2xl">💻</div>
//                             <div>
//                                 <h3 className="font-semibold text-gray-800">{activeChat}</h3>
//                                 <p className="text-sm text-green-600">● Online</p>
//                             </div>
//                         </div>

//                         {/* Messages Area */}
//                         <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
//                             {messages.length === 0 && (
//                                 <div className="text-gray-500 text-center mt-8 space-y-4">
//                                     <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                                     </svg>
//                                     <p className="text-lg">Start a conversation</p>
//                                 </div>
//                             )}
                            
//                             <div className="space-y-6">
//                                 {messages.map((message) => (
//                                     <div
//                                         key={message.id}
//                                         className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
//                                     >
//                                         <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
//                                             message.isUser 
//                                                 ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none" 
//                                                 : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
//                                         }`}>
//                                             {message.text}
//                                             <p className={`text-xs mt-1 ${
//                                                 message.isUser ? 'text-blue-100' : 'text-gray-500'
//                                             }`}>
//                                                 {message.time}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>

//                             {isLoading && (
//                                 <div className="flex justify-start mt-6">
//                                     <div className="bg-white text-gray-800 p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
//                                         <div className="flex space-x-2">
//                                             <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
//                                             <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
//                                             <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Input Area */}
//                         <div className="p-6 bg-gradient-to-r from-white to-gray-50 border-t border-gray-100">
//                             <div className="flex gap-2">
//                                 <textarea
//                                     className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//                                     placeholder={`Type a message to ${activeChat}...`}
//                                     rows={1}
//                                     value={inputText}
//                                     onChange={(e) => setInputText(e.target.value)}
//                                     onKeyDown={handleKeyPress}
//                                 />
//                                 <button
//                                     className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                                     onClick={sendMessage}
//                                     disabled={isLoading || !inputText.trim()}
//                                 >
//                                     Send
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }