import { useState, useEffect } from "react";
// import axios from "axios";
import fetch_with_auth from "../Authentication/axios";
import { useNavigate } from "react-router";

export function ChatInPage({ isAdmin, onLogout }: { isAdmin : boolean; onLogout: () => void; }) {

    const mailContacts = [
        { id: 1, name: "TechBooks", email: "techbooks@ebuy.com", lastSubject: "Programming Book Inquiry", time: "10:37 AM", avatar: "💻", unread: 0 },
        { id: 2, name: "BookStore123", email: "bookstore123@ebuy.com", lastSubject: "Fiction Novel Selection", time: "Yesterday", avatar: "📚", unread: 2 },
        { id: 3, name: "VintageFinds", email: "vintage@ebuy.com", lastSubject: "Recipe Book Purchase", time: "2 days ago", avatar: "🍳", unread: 0 },
    ];

    const [mailThreads, setMailThreads] = useState<Record<string, Array<{ 
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
    }>>>({
        "TechBooks": [
            {
                id: 1,
                subject: "Programming Book Inquiry",
                content: "Dear TechBooks,\n\nI hope this email finds you well. I'm interested in your programming book collection and would like to know more about the available titles.\n\nI'm particularly looking for books on JavaScript and React development. Could you please provide me with information about what you have in stock?\n\nThank you for your time.\n\nBest regards,\nCustomer",
                isUser: true,
                sender: "Customer",
                senderEmail: "customer@ebuy.com",
                recipient: "TechBooks",
                recipientEmail: "techbooks@ebuy.com",
                timestamp: "Today 10:30 AM",
                avatar: "🙋‍♂️",
                isRead: true
            },
            {
                id: 2,
                subject: "Re: Programming Book Inquiry",
                content: "Dear Customer,\n\nThank you for your inquiry regarding our programming book collection. I'm delighted to help you find the perfect books for your learning journey.\n\nWe currently have an excellent selection of JavaScript and React books, including:\n- 'You Don't Know JS' complete series\n- 'React in Action' by Mark Thomas\n- 'JavaScript: The Definitive Guide' 7th Edition\n\nFor the complete bundle, I can offer these books at EUR 42, which is a great value considering their original retail prices.\n\nWould you be interested in this package? I can also provide individual pricing if you prefer specific titles.\n\nBest regards,\nTechBooks Team",
                isUser: false,
                sender: "TechBooks",
                senderEmail: "techbooks@ebuy.com",
                recipient: "Customer",
                recipientEmail: "customer@ebuy.com",
                timestamp: "Today 10:37 AM",
                avatar: "💻",
                isRead: true
            }
        ],
        "BookStore123": [
            {
                id: 1,
                subject: "Fiction Novel Selection",
                content: "Hello BookStore123,\n\nI'm writing to inquire about your fiction novel collection. I'm an avid reader looking to expand my personal library with some quality fiction works.\n\nCould you please let me know what genres and titles you currently have available? I'm particularly interested in contemporary fiction, mystery, and science fiction.\n\nI look forward to hearing from you.\n\nWarm regards,\nBook Lover",
                isUser: true,
                sender: "Customer",
                senderEmail: "customer@ebuy.com",
                recipient: "BookStore123",
                recipientEmail: "bookstore123@ebuy.com",
                timestamp: "Yesterday 2:15 PM",
                avatar: "🙋‍♂️",
                isRead: true
            },
            {
                id: 2,
                subject: "Re: Fiction Novel Selection",
                content: "Dear Book Lover,\n\nThank you for reaching out to us! We're thrilled to hear from a fellow book enthusiast.\n\nWe have an extensive collection of fiction novels spanning multiple genres. Here's what we currently have in stock:\n\n📚 Contemporary Fiction:\n- Recent bestsellers and award winners\n- Literary fiction from established authors\n\n🔍 Mystery & Thriller:\n- Classic detective novels\n- Modern psychological thrillers\n\n🚀 Science Fiction:\n- Space operas and dystopian futures\n- Hard science fiction collections\n\nWe'd be happy to provide a detailed catalog with pricing. What specific authors or series are you most interested in?\n\nBest wishes,\nBookStore123 Team",
                isUser: false,
                sender: "BookStore123",
                senderEmail: "bookstore123@ebuy.com",
                recipient: "Customer",
                recipientEmail: "customer@ebuy.com",
                timestamp: "Yesterday 2:20 PM",
                avatar: "📚",
                isRead: false
            }
        ],
        "VintageFinds": [
            {
                id: 1,
                subject: "Vintage Recipe Book Inquiry",
                content: "Dear VintageFinds,\n\nI came across your listing for a vintage recipe book and I'm very interested in purchasing it. Could you please provide more details about the book?\n\nSpecifically, I'd like to know:\n- The publication year\n- The condition of the book\n- Whether all pages are intact\n- The asking price\n\nI collect vintage cookbooks and this would be a wonderful addition to my collection.\n\nThank you,\nVintage Collector",
                isUser: true,
                sender: "Customer",
                senderEmail: "customer@ebuy.com",
                recipient: "VintageFinds",
                recipientEmail: "vintage@ebuy.com",
                timestamp: "2 days ago 11:00 AM",
                avatar: "🙋‍♂️",
                isRead: true
            },
            {
                id: 2,
                subject: "Re: Vintage Recipe Book Inquiry",
                content: "Dear Vintage Collector,\n\nThank you for your interest in our vintage recipe book! I'm pleased to provide you with the details:\n\n📖 Publication: 1950s edition\n📋 Condition: Excellent - well-preserved with minimal wear\n📄 Pages: All original pages intact, no tears or missing sections\n💰 Price: EUR 25 (firm price)\n\nThis cookbook features authentic recipes from the post-war era and includes beautiful illustrations. It's been carefully stored and would indeed make a fantastic addition to any vintage cookbook collection.\n\nThe book includes sections on:\n- Traditional family meals\n- Holiday specialties\n- Preservation techniques\n- Baking fundamentals\n\nWould you like to proceed with the purchase?\n\nBest regards,\nVintageFinds",
                isUser: false,
                sender: "VintageFinds",
                senderEmail: "vintage@ebuy.com",
                recipient: "Customer",
                recipientEmail: "customer@ebuy.com",
                timestamp: "2 days ago 11:15 AM",
                avatar: "🍳",
                isRead: true
            },
            {
                id: 3,
                subject: "Re: Vintage Recipe Book Inquiry - Purchase Confirmation",
                content: "Dear VintageFinds,\n\nThank you for the detailed information about the recipe book. It sounds perfect for my collection and I would like to purchase it.\n\nPlease send me the payment details and shipping information. I'm ready to proceed with the EUR 25 payment.\n\nLooking forward to adding this treasure to my collection!\n\nBest regards,\nVintage Collector",
                isUser: true,
                sender: "Customer",
                senderEmail: "customer@ebuy.com",
                recipient: "VintageFinds",
                recipientEmail: "vintage@ebuy.com",
                timestamp: "2 days ago 11:20 AM",
                avatar: "🙋‍♂️",
                isRead: true
            },
            {
                id: 4,
                subject: "Re: Recipe Book Purchase - Payment Details & Confirmation",
                content: "Dear Vintage Collector,\n\nWonderful news! The vintage recipe book is officially yours! 🎉\n\nHere are the payment details:\n💳 PayPal: payments@vintagefinds.com\n🏦 Bank Transfer: IBAN DE89 3704 0044 0532 0130 00\n📧 Reference: VRB-2025-001\n\nShipping Information:\n📦 Standard shipping: EUR 5 (3-5 business days)\n🚚 Express shipping: EUR 10 (1-2 business days)\n\nOnce payment is confirmed, I'll carefully package the book and send you tracking information.\n\nThank you for choosing VintageFinds! I'm sure you'll treasure this beautiful cookbook.\n\nWarm regards,\nVintageFinds Team",
                isUser: false,
                sender: "VintageFinds",
                senderEmail: "vintage@ebuy.com",
                recipient: "Customer",
                recipientEmail: "customer@ebuy.com",
                timestamp: "2 days ago 11:25 AM",
                avatar: "🍳",
                isRead: true
            }
        ]
    });
    
    const [composeContent, setComposeContent] = useState("");
    const [composeSubject, setComposeSubject] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [activeThread, setActiveThread] = useState("TechBooks");
    const [showCompose, setShowCompose] = useState(false);

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

    // Get current mail thread for the active contact
    const currentThread = mailThreads[activeThread] || [];

    // Function to switch between mail threads
    const switchThread = (threadName: string) => {
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


    // Check for new mail
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        const checkMail = async () => {
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
                console.log("error while checking for new mail:", e);
            }
        }

        checkMail();
        interval = setInterval(checkMail, 5000);
        return () => clearInterval(interval);
    }, []);

    // Function to send mail
    const sendMail = async () => {
        if (!composeContent.trim() || !composeSubject.trim()) return;
        
        const nextId = (mailThreads[activeThread]?.length || 0) + 1;
        const contact = mailContacts.find(c => c.name === activeThread);
        
        const userMail = {         
            id: nextId,
            subject: composeSubject,
            content: composeContent,
            isUser: true,
            sender: "Customer",
            senderEmail: "customer@ebuy.com",
            recipient: activeThread,
            recipientEmail: contact?.email || "",
            timestamp: new Date().toLocaleString(),
            avatar: "🙋‍♂️",
            isRead: true
        };

        setMailThreads(prev => ({
            ...prev,
            [activeThread]: [...(prev[activeThread] || []), userMail]
        }));
        
        setComposeContent("");
        setComposeSubject("");
        setShowCompose(false);
        setIsLoading(true);
        
        try {
            const response = await fetch_with_auth.post("/chat/", {
                message: `Subject: ${composeSubject}\n\n${composeContent}`
            });
            const data = response.data;
            
            const replyMail = {         
                id: nextId + 1,
                subject: `Re: ${composeSubject}`,
                content: data.response,
                isUser: false,
                sender: activeThread,
                senderEmail: contact?.email || "",
                recipient: "Customer",
                recipientEmail: "customer@ebuy.com",
                timestamp: new Date().toLocaleString(),
                avatar: contact?.avatar || "📧",
                isRead: false
            };

            setMailThreads(prev => ({
                ...prev,
                [activeThread]: [...prev[activeThread], replyMail]
            }));
            
        } catch (error) {
            console.error("Error sending mail:", error);
            const errorMail = {         
                id: nextId + 1,
                subject: "Mail Delivery Error",
                content: "Sorry, there was an error sending your mail. Please try again later.",
                isUser: false,
                sender: "System",
                senderEmail: "system@ebuy.com",
                recipient: "Customer",
                recipientEmail: "customer@ebuy.com",
                timestamp: new Date().toLocaleString(),
                avatar: "⚠️",
                isRead: false
            };

            setMailThreads(prev => ({
                ...prev,
                [activeThread]: [...prev[activeThread], errorMail]
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
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                            >
                                UserList
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
                                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors text-sm flex items-center justify-center"
                                onClick={() => setShowCompose(true)}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Compose Mail
                            </button>
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
                                        activeThread === contact.name ? 'bg-white border-l-4 border-l-indigo-600 shadow-sm' : ''
                                    }`}
                                    onClick={() => switchThread(contact.name)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">{contact.avatar}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <h4 className="font-medium text-gray-800 truncate">{contact.name}</h4>
                                            </div>
                                            <p className="text-xs text-gray-500 truncate mb-1">{contact.email}</p>
                                        </div>
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
                                                value={`${activeThread} <${mailContacts.find(c => c.name === activeThread)?.email}>`}
                                                readOnly
                                                className="w-full border border-gray-200 rounded-md px-3 py-2 bg-gray-50 text-gray-600"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject:</label>
                                            <input
                                                type="text"
                                                value={composeSubject}
                                                onChange={(e) => setComposeSubject(e.target.value)}
                                                placeholder="Enter subject..."
                                                className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                                        
                                        <div className="flex gap-2 pt-4">
                                            <button
                                                onClick={sendMail}
                                                disabled={isLoading || !composeContent.trim() || !composeSubject.trim()}
                                                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                                {isLoading ? 'Sending...' : 'Send Mail'}
                                            </button>
                                            <button
                                                onClick={() => setShowCompose(false)}
                                                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
                                            >
                                                Cancel
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
                                        {mailContacts.find(c => c.name === activeThread)?.avatar || "📧"}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{activeThread}</h3>
                                        <p className="text-sm text-gray-500">
                                            {mailContacts.find(c => c.name === activeThread)?.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Conversastion */}
                                <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                                    {currentThread.length === 0 && (
                                        <div className="text-gray-500 text-center mt-8 space-y-4">
                                            <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-lg">No mail conversation with {activeThread}</p>
                                            <button
                                                onClick={() => setShowCompose(true)}
                                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                                            >
                                                Start New Conversation
                                            </button>
                                        </div>
                                    )}
                                    
                                    <div className="space-y-4">
                                        {currentThread.map((mail) => (
                                            <div key={mail.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                                                <div className="p-4 border-b bg-gray-50">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-3">
                                                            <div className="text-lg">{mail.avatar}</div>
                                                            <div>
                                                                <div className="font-semibold text-gray-800">
                                                                    {mail.sender} {mail.isUser ? '(You)' : ''}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {mail.senderEmail} → {mail.recipientEmail}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-sm text-gray-500">{mail.timestamp}</div>
                                                            {!mail.isRead && !mail.isUser && (
                                                                <div className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded-full mt-1">
                                                                    Unread
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <h3 className="font-semibold text-gray-800">{mail.subject}</h3>
                                                </div>
                                                <div className="p-4">
                                                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                                                        {mail.content}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {isLoading && (
                                        <div className="mt-4 bg-white rounded-lg shadow-sm border p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex space-x-2">
                                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                                                </div>
                                                <span className="text-gray-600">Processing your mail...</span>
                                            </div>
                                        </div>
                                    )}
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
                                        Reply to {activeThread}
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