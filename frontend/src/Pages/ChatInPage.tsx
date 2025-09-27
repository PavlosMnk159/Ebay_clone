import { useState, useEffect } from "react";
import axios from "axios";
import fetch_with_auth from "../Authentication/axios";
import { useNavigate } from "react-router";

export function ChatInPage({ onLogout }: { onLogout: () => void; }) {


    const conversations = [
        { id: 1, name: "TechBooks", lastMessage: "How about EUR 42?", time: "10:37 AM", avatar: "💻", unread: 0 },
        { id: 2, name: "BookStore123", lastMessage: "Thanks for your interest!", time: "Yesterday", avatar: "📚", unread: 2 },
        { id: 3, name: "VintageFinds", lastMessage: "The recipe book is yours!", time: "2 days ago", avatar: "🍳", unread: 0 },
    ];

    const [conversationMessages, setConversationMessages] = useState<Record<string, Array<{ 
        text: string; 
        isUser: boolean; 
        id: number; 
        sender: string; 
        time: string; 
        avatar: string;
    }>>>({
        "TechBooks": [
            {
                text: "Hi! I'm interested in your programming book collection.",
                isUser: true,
                id: 1,
                sender: "me",
                time: "10:30 AM",
                avatar: "🙋‍♂️"
            },
            {
                text: "Great! I have several excellent programming books. Which topics interest you most?",
                isUser: false,
                id: 2,
                sender: "TechBooks",
                time: "10:32 AM",
                avatar: "💻"
            },
            {
                text: "I'm looking for JavaScript and React books mainly.",
                isUser: true,
                id: 3,
                sender: "me",
                time: "10:35 AM",
                avatar: "🙋‍♂️"
            },
            {
                text: "Perfect! I have 'You Don't Know JS' series and 'React in Action'. How about EUR 42?",
                isUser: false,
                id: 4,
                sender: "TechBooks",
                time: "10:37 AM",
                avatar: "💻"
            }
        ],
        "BookStore123": [
            {
                text: "Hello! Do you have any fiction novels available?",
                isUser: true,
                id: 1,
                sender: "me",
                time: "Yesterday 2:15 PM",
                avatar: "🙋‍♂️"
            },
            {
                text: "Thanks for your interest! Yes, we have a great selection of fiction. What genres do you prefer?",
                isUser: false,
                id: 2,
                sender: "BookStore123",
                time: "Yesterday 2:20 PM",
                avatar: "📚"
            }
        ],
        "VintageFinds": [
            {
                text: "Is the vintage recipe book still available?",
                isUser: true,
                id: 1,
                sender: "me",
                time: "2 days ago 11:00 AM",
                avatar: "🙋‍♂️"
            },
            {
                text: "Yes it is! It's from the 1950s and in excellent condition.",
                isUser: false,
                id: 2,
                sender: "VintageFinds",
                time: "2 days ago 11:15 AM",
                avatar: "🍳"
            },
            {
                text: "Perfect! I'll take it. What's the price?",
                isUser: true,
                id: 3,
                sender: "me",
                time: "2 days ago 11:20 AM",
                avatar: "🙋‍♂️"
            },
            {
                text: "The recipe book is yours! It's EUR 25. I'll send you payment details.",
                isUser: false,
                id: 4,
                sender: "VintageFinds",
                time: "2 days ago 11:25 AM",
                avatar: "🍳"
            }
        ]
    });


    
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [activeChat, setActiveChat] = useState("TechBooks");

    const nav = useNavigate();
    
    // Navigation functions
    const navigateEbay = () => {
        nav('/ebay')
    }
    
    const navigateBids = () => {
        nav('/myAuction')
    }

    const navigateChatOut = () => {
        nav('/chatOut')
    }

    // Get current messages for the active chat
    const currentMessages = conversationMessages[activeChat] || [];

    // Function to switch between conversations
    const switchConversation = (conversationName: string) => {
        setActiveChat(conversationName);
        // Initialize empty message array if conversation doesn't exist
        if (!conversationMessages[conversationName]) {
            setConversationMessages(prev => ({
                ...prev,
                [conversationName]: []
            }));
        }
    };

    useEffect(() => {
        const get_initial_data = async () => {
            const convo_res = await fetch_with_auth.get('/get_conversations/');
            const data = convo_res.data;
            console.log("conversations");
            console.log(data);
        }

        get_initial_data();
    }, []);

    // Check if there are any messages
    useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const checkMessages = async () => {
      try  {
        const res = await fetch_with_auth.get("/check_messages/");
        const data = await res.data;
        console.log(data);
        if (data.has_messages) {
          const mes = await fetch_with_auth("/get_messages/");
          const message_data = await mes.data;
          console.log(message_data);
        }

      } catch (e) {
        console.log("error while checking for new messages:", e);
      }
    }

    checkMessages();
    interval = setInterval(checkMessages, 5000);
    return () => clearInterval(interval);
  }, []);

    // Function to send message to backend
    const sendMessage = async () => {
        // Don't send empty messages
        if (!inputText.trim()) return;
        
        // Get next message ID for this conversation
        const nextId = (conversationMessages[activeChat]?.length || 0) + 1;
        
        // Add user message to the current conversation
        const userMessage = {         
            isUser: true,
            id: nextId,
            text: inputText,
            sender: "me",
            time: new Date().toLocaleString(),
            avatar: "🙋‍♂️"
        };

        setConversationMessages(prev => ({
            ...prev,
            [activeChat]: [...(prev[activeChat] || []), userMessage]
        }));
        
        setInputText("");
        setIsLoading(true);
        
        try {
            const response = await fetch_with_auth.post("/chat/", {
        message: inputText
      });
      const data = response.data;
      
            
            // Add bot response to the current conversation
            const botMessage = {         
                isUser: false,
                id: nextId + 1,
                text: data.response,
                sender: activeChat,
                time: new Date().toLocaleString(),
                avatar: conversations.find(c => c.name === activeChat)?.avatar || "🤖"
            };

            setConversationMessages(prev => ({
                ...prev,
                [activeChat]: [...prev[activeChat], botMessage]
            }));
            
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                console.log("HTTP error", error.response.status, error.response.data);
                } else {
                console.log("Did not receive response");
                }
            }
            console.error("Error sending message:", error);
            const errorMessage = {         
                isUser: false,
                id: nextId + 1,
                text: "Sorry, there was an error processing your request",
                sender: "System",
                time: new Date().toLocaleString(),
                avatar: "⚠️"
            };

            setConversationMessages(prev => ({
                ...prev,
                [activeChat]: [...prev[activeChat], errorMessage]
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <div className="bg-white rounded-xl shadow-lg flex-1 flex flex-col max-w-7xl mx-auto w-full overflow-hidden min-h-0">
                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-xl flex items-center justify-between rounded-t-xl">
                    <div className="flex items-center">
                        <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012 2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        eBuy Incoming Messages
                    </div>

                    <div className="flex space-x-3">
                        <button 
                            onClick={navigateEbay}
                            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-200"
                        >
                            Ebay
                        </button>
                        <button 
                            onClick={navigateBids}
                            className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors duration-200"
                        >
                            Bids
                        </button>
                        <button 
                            onClick={onLogout}
                            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="flex flex-1 min-h-0">
                    {/* Left Sidebar */}
                    <div className="w-80 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 flex flex-col">
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b space-y-2">
                            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
                                onClick={navigateChatOut}
                            >
                                Outgoing
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {conversations.map((chat) => (
                                <div
                                    key={chat.id}
                                    className={`p-4 border-b cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all ${
                                        activeChat === chat.name ? 'bg-gradient-to-r from-blue-100 to-indigo-100 border-l-4 border-l-blue-600' : ''
                                    }`}
                                    onClick={() => switchConversation(chat.name)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">{chat.avatar}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <h4 className="font-medium text-gray-800 truncate">{chat.name}</h4>
                                                <span className="text-xs text-gray-500">{chat.time}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 truncate">
                                                {/* Show the last message from this conversation */}
                                                {conversationMessages[chat.name]?.length > 0 
                                                    ? conversationMessages[chat.name][conversationMessages[chat.name].length - 1].text
                                                    : chat.lastMessage
                                                }
                                            </p>
                                        </div>
                                        {chat.unread > 0 && (
                                            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center shadow-sm">
                                                {chat.unread}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Chat Area */}
                    <div className="flex-1 flex flex-col min-h-0">
                        {/* Chat Header */}
                        <div className="p-2 bg-gradient-to-r from-gray-50 to-blue-50 border-b flex items-center gap-1">
                            <div className="text-2xl">
                                {conversations.find(c => c.name === activeChat)?.avatar || "💬"}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">{activeChat}</h3>
                                <p className="text-sm text-green-600">● Online</p>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
                            {currentMessages.length === 0 && (
                                <div className="text-gray-500 text-center mt-8 space-y-4">
                                    <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <p className="text-lg">Start a conversation with {activeChat}</p>
                                </div>
                            )}
                            
                            <div className="space-y-6">
                                {currentMessages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                                            message.isUser 
                                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none" 
                                                : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                                        }`}>
                                            {message.text}
                                            <p className={`text-xs mt-1 ${
                                                message.isUser ? 'text-blue-100' : 'text-gray-500'
                                            }`}>
                                                {message.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {isLoading && (
                                <div className="flex justify-start mt-6">
                                    <div className="bg-white text-gray-800 p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
                                        <div className="flex space-x-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-gradient-to-r from-white to-gray-50 border-t border-gray-100">
                            <div className="flex gap-2">
                                <textarea
                                    className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder={`Type a message to ${activeChat}...`}
                                    rows={1}
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                />
                                <button
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={sendMessage}
                                    disabled={isLoading || !inputText.trim()}
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}