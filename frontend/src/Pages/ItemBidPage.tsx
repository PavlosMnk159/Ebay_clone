import fetch_with_auth from "@/Authentication/axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";


interface Bid {
    bidder_username: string;
    amount: number;
    time: number; //time the bid was made
    
}


export function ItemBidPage({ isAdmin, onLogout } : { isAdmin : boolean; onLogout: () => void;}){

    const { productId } = useParams<{ productId: string }>();
    const [searchQuery, setSearchQuery] = useState("");
    const [unread, setUnread] = useState(0);
    const [biddings, setBiddings] = useState<Bid[]>([])

    const nav = useNavigate();

    const navigateMyAuction = () => {
        nav('/myAuction')
    };   

    const navigateMyBids = () => {
        nav('/mybids')
    };

    const navigateEbay = () => {
        nav('/ebay')
    };

    const navigateChat = () => {
        nav('/chatIn')
    };

    const navigateUserlist = () => {
        nav('/admin')
    };


    const handleSearch = () => {
        console.log("Searching for:", searchQuery);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter"){
            e.preventDefault();
            handleSearch();
        }
    };


   

    


    
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        const fetch_unread = async () => {
            try {
                const res = await fetch_with_auth.get('/unread_messages/');
                const data = res.data
                
                setUnread(data.unread_count);
                console.log("this is the unreads");
                console.log(data.unread_count);

            } catch (error) {
                console.log("Error while fetching products: ", error);
            }
            
        }

        const fetch_item_bids = async () => {
            try {
                const res = await fetch_with_auth.get(`item_bids/?item_id=${productId}`);
                const data = res.data;
                setBiddings(data);
            } catch (error) {
                console.log("Error while fetching bids", error)
            }
        }

        fetch_unread();
        fetch_item_bids();
        interval = setInterval(fetch_unread, 5000);
        return () => clearInterval(interval);
    }, []);


    
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center">
                            <div className="text-3xl font-bold text-blue-600 mr-8">eBuy myBidding Page</div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-4">

                            <button
                                onClick={navigateChat}
                                className="relative bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Msgs
                                {unread && (<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                                    {unread}
                                </span>)}
                            </button>

                            {/* userlist Button */}
                            {isAdmin && (<button
                                onClick={navigateUserlist}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Userlist
                            </button>)}

                            {/* Sell Button */}
                            <button
                                onClick={navigateEbay}
                                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                Ebay
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
                {/* Main Content - Product Grid */}
                <div className="flex-1 space-x-2">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-gray-800">My Auctions</h2>
                        <div className="text-sm text-gray-600">
                            {biddings.length} results for Product#{productId}
                        </div>
                    </div>
                    <button
                        onClick={navigateMyAuction}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                        My Auctions
                    </button>
                    <button
                        onClick={navigateMyBids}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                        My Bids
                    </button>



                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {biddings
                        .sort((a,b) => b.amount - a.amount)
                        .map((bid) => (
                            <div
                                key={bid.bidder_username}
                                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 p-4 cursor-pointer transform hover:-translate-y-1 space-y-3"
                            >
                                
                                <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">{bid.bidder_username}</h3>
                                <div className="text-xl font-bold text-green-600 mb-2">
                                    Amount of bid: {bid.amount}
                                </div>
                                
                                <div className="text-sm text-gray-600 mb-3">
                                    Time of bid: {bid.time}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                </div>
            </div>
        </div>
    );

}

