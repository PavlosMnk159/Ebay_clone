import { useState, useEffect } from "react";
// import axios from "axios";
import fetch_with_auth from "../../Authentication/axios";
import { useNavigate } from "react-router";

interface SellerData {
  id: number;
  buyer_name: string;
  buyer_email: string;
  avatar: string;
  created_at: string;
  unread: number;
}

interface MailContact {
    id: number;
    name: string;
    email: string;
    time: string;
    avatar: string;
    unread: number;
}

interface Message {
    conversation: number;
    id: number;
    message: string;
    receiver: string;
    sender: string;
    timestamp: string;
}


function transformToMailContact(data: SellerData): MailContact {
  return {
    id: data.id,
    name: data.buyer_name,
    email: data.buyer_email,
    time: new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    avatar: data.buyer_name.charAt(0),
    unread: data.unread,
  };
}

export function ChatInPage({ isAdmin, onLogout }: { isAdmin : boolean; onLogout: () => void; }) {

    const [mailContacts, setMailContacts] = useState<MailContact[]>([]);
    const [countRequests, setCountRequests] = useState(0);
    // const [unread, setUnread] = useState(0);

    // fetch buers conversation
const [mailThreads, setMailThreads] = useState<Record<number, Array<{ 
    id: number;
    subject: string;
    content: string;
    isUser: boolean;
    sender: string;
    senderEmail: string;
    recipient: string;
    recipientEmail: string;
    timestamp: string;
    avatar: string;
    isRead: boolean;
}>>>({});
    
    const [composeContent, setComposeContent] = useState("");
    const [activeThread, setActiveThread] = useState(6);
    const [showCompose, setShowCompose] = useState(false);
    const [messages, setMessage] = useState<Message[]>([]);

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

    const navigateUserlist = () => {
        nav('/admin');
    }

    // Function to switch between mail threads
    const switchThread = (threadName: number) => {
        setActiveThread(threadName);
        setShowCompose(false);
        // Initialize empty thread if it doesn't exist
        if (!mailThreads[threadName]) {
            setMailThreads(prev => ({
                ...prev,
                [threadName]: []
            }));
        }
    };

    // fetch conversations and first messages
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        const checkMail = async () => {
            try  {
                const res = await fetch_with_auth.get("/get_in_conversations/");
                const data: SellerData[] = await res.data;

                const transformed = data.map(transformToMailContact);
                setMailContacts(transformed);


                // Fetch messages for this conversation
                const messagesRes = await fetch_with_auth.get(`/get_conversation_messages/?conversation_id=${activeThread}`);
                const messages = await messagesRes.data;
                setMessage(messages)

                

            } catch (e) {
                console.log("error while checking for new mail:", e);
            }
        }

        checkMail();
        interval = setInterval(checkMail, 5000);
        return () => clearInterval(interval);
    }, [activeThread]);

    useEffect(() => {
        // Cleanup fnction to properly destroy existing map
        const get_users = async() => {
        try  {
            const count_result = await fetch_with_auth.get("/request_count/");
            setCountRequests(count_result.data.unapproved_users);
            
        } catch (e) {
                console.log("Could not fetch user list:", e);
        }
        }

        get_users();

    }, []);
    
    //     useEffect(() => {
    //     let interval: ReturnType<typeof setInterval>;
    //     const fetch_unread = async () => {
    //         try {
    //             const res = await fetch_with_auth.get('/unread_messages/');
    //             const data = res.data
                
    //             setUnread(data.unread_count);
    //             console.log("this is the unreads");
    //             console.log(data.unread_count);

    //         } catch (error) {
    //             console.log("Error while fetching products: ", error);
    //         }
            
    //     }

    //     fetch_unread();
    //     interval = setInterval(fetch_unread, 5000);
    //     return () => clearInterval(interval);
    // }, []);

    const handleReplay  = async (data : MailContact[]) => {
        setShowCompose(false);
        const contact = mailContacts.find(c => c.id === activeThread);

        const receiver = data[0]?.name;
        const conversation_id = contact?.id;
        const send_data = {
            'receiver': receiver,
            'message': composeContent,
            'conversation_id': conversation_id,
        }

        try {
            await fetch_with_auth.post('send_message/', send_data);
            setComposeContent(''); // clear compose box
        } catch (e) {
            console.error("Error sending message:", e);
        }
    };

    const handleDeleteContact = async (contact : MailContact) => {

        const data = {
            "conversation_id": contact.id
        }

        try {
            await fetch_with_auth.post('delete_conversation/', data);
        } catch (e) {
            console.error("Error while deleting message:", e);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 p-4">
            <div className="bg-white rounded-xl shadow-lg flex-1 flex flex-col max-w-7xl mx-auto w-full overflow-hidden min-h-0">
                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-bold text-xl flex items-center justify-between rounded-t-xl">
                    <div className="flex items-center">
                        <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        eBuy Mail - Inbox
                    </div>

                    <div className="flex space-x-3">
                        <button 
                            onClick={navigateEbay}
                            className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors duration-200"
                        >
                            Ebay
                        </button>
                        {isAdmin && (
                            <button
                            onClick={navigateUserlist}
                            className="relative bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                            >
                            UserList
                            {countRequests && (
                                <span
                                className="absolute -top-2 -right-2 bg-red-500 text-white font-bold rounded-full flex items-center justify-center text-xs"
                                style={{
                                    width: `${Math.max(24, countRequests.toString().length * 12)}px`,
                                    height: "24px",
                                    minWidth: "24px",
                                }}
                                >
                                {countRequests}
                                </span>
                            )}
                            </button>
                        )}
                        <button 
                            onClick={navigateBids}
                            className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors duration-200"
                        >
                            My Auctions
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
                    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
                        <div className="p-4 bg-white border-b space-y-2">
                            
                            <button 
                                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors text-sm"
                                onClick={navigateChatOut}
                            >
                                Sent Mail
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto">
                            <div className="p-3 text-sm font-semibold text-gray-600 bg-gray-100">CONTACTS</div>
                            {mailContacts.map((contact) => (
                                <div
                                    key={contact.id}
                                    className={`p-4 border-b cursor-pointer hover:bg-white transition-all ${
                                        activeThread === contact.id ? 'bg-white border-l-4 border-l-indigo-600 shadow-sm' : ''
                                    }`}
                                    onClick={() => switchThread(contact.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <h4 className="font-medium text-gray-800 truncate">{contact.name}</h4>
                                            </div>
                                            <p className="text-xs text-gray-500 truncate mb-1">{contact.email}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteContact( contact)}
                                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                                        >
                                            Delete
                                        </button>
                                        {contact.unread > 0 && (
                                            <div className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                                {contact.unread}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Mail Area */}
                    <div className="flex-1 flex flex-col min-h-0">
                        {showCompose ? (
                            // Compose Mail View
                            <div className="flex-1 flex flex-col">
                                {/* Header  */}
                                <div className="p-4 bg-white border-b flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-800 flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                        Compose New Mail
                                    </h3>
                                    <button
                                        onClick={() => setShowCompose(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                {/* Mail Body  */}

                                <div className="flex-1 p-6 overflow-auto bg-gray-50">

                                    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">To:</label>
                                            <input
                                                type="text"
                                                value={`<${mailContacts.find(c => c.id === activeThread)?.email}>`}
                                                readOnly
                                                className="w-full border border-gray-200 rounded-md px-3 py-2 bg-gray-50 text-gray-600"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Message:</label>
                                            <textarea
                                                value={composeContent}
                                                onChange={(e) => setComposeContent(e.target.value)}
                                                placeholder="Write your message..."
                                                rows={2}
                                                className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                            />
                                        </div>

                                        <div>
                                            <button
                                                onClick={() => handleReplay( mailContacts)}
                                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                                            >
                                                Send
                                            </button>
                                        </div>
                                        
                                    </div>
                                </div>

                            </div>
                        ) : (
                            // Mail Thread View
                            <>
                                <div className="p-4 bg-white border-b flex items-center gap-3">
                                    <div className="text-2xl">
                                        {mailContacts.find(c => c.id === activeThread)?.avatar || "📧"}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            {mailContacts.find(c => c.id === activeThread)?.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Conversastion */}
                                <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                                    {mailContacts.length === 0 && (
                                        <div className="text-gray-500 text-center mt-8 space-y-4">
                                            <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-lg">No mail conversation</p>
                                        </div>
                                    )}
                                    
                                   <div className="bg-white rounded-b-lg shadow-sm">
                                    {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`border-b border-gray-200 hover:bg-gray-50 transition-colors`}
                                    >
                                        {/* Email Header Row */}
                                        <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-start gap-4 flex-1">

                                            {/* Sender Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                <span className="font-semibold text-gray-900">
                                                    {message.sender}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    to {message.receiver}
                                                </span>
                                                </div>
                                                
                                                {/* Subject Line */}
                                                <h3 className="font-medium text-gray-900 mb-2 leading-snug">
                                                {message.message}
                                                </h3>
                                                
                                                {/* Timestamp and Actions */}
                                                <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">
                                                    {message.timestamp}
                                                </span>
                                                
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                        
                                        </div>
                                    </div>
                                    ))}
                                   


                                </div>

                                </div>
                                
                                {/* Reply button */}
                                <div className="p-4 bg-white border-t">
                                    <button
                                        onClick={() => setShowCompose(true)}
                                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                        </svg>
                                        Reply to {mailContacts.find(c => c.id === activeThread)?.name}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}