// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { FaUserCircle } from "react-icons/fa";
// import { setSelectedUser } from '@/redux/authSlice';
// import { Input } from './ui/input';
// import { Button } from './ui/button';
// import { MessageCircleCode } from 'lucide-react';
// import Messages from './Messages';
// import axios from 'axios';
// import { setMessages } from '@/redux/chatSlice';
// import Toaster from 'react-hot-toast';

// const ChatPage = () => {
//     const [textMessage, setTextMessage] = useState("");
//     const { user, followingUser = [],suggestedUser, selectedUser } = useSelector(store => store.auth);
//     const { onlineUsers, messages } = useSelector(store => store.chat);
//     const dispatch = useDispatch();

//     const sendMessageHandler = async (receiverId) => {
//         try {
//             const res = await axios.post(`https://instagram-backend-my27.onrender.com/api/v1/message/send/${receiverId}`, { textMessage }, {
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 withCredentials: true
//             });
//             if (res.data.success) {
//                 dispatch(setMessages([...messages, res.data.newMessage]));
//                 setTextMessage("");
//             }
//         } catch (error) {
//             Toaster.log(error);
//         }
//     }

//     useEffect(() => {
//         return () => {
//             console.log("followingUser", followingUser);
//             dispatch(setSelectedUser(null));
//         }
//     }, []);

//     return (
//         <div className='flex ml-[16%] h-screen'>
//             <section className='w-full md:w-1/4 my-8'>
//                 <h1 className='font-bold mb-4 px-3 text-xl'>{user?.username}</h1>
//                 <hr className='mb-4 border-gray-300' />
//                 <div className='overflow-y-auto h-[80vh]'>
//                     {
//                         followingUser?.map((suggestedUser) => {
//                             const isOnline = onlineUsers.includes(suggestedUser?._id);
//                             return (
//                                 <div onClick={() => dispatch(setSelectedUser(suggestedUser))} className='flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer'>
//                                     <div>
//                                         {suggestedUser?.profilePicture ? (
//                                             <img className='h-10 w-10 items-center rounded-full' src={suggestedUser?.profilePicture} alt="profile_picture" />
//                                         ) : (
//                                             <FaUserCircle size={35} />
//                                         )}

//                                     </div>
//                                     <div className='flex flex-col'>
//                                         <span className='font-medium'>{suggestedUser?.username}</span>
//                                         <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-red-600'} `}>{isOnline ? 'online' : 'offline'}</span>
//                                     </div>
//                                 </div>
//                             )
//                         })
//                     }
//                 </div>

//             </section>
//             {
//                 selectedUser ? (
//                     <section className='flex-1 border-l border-l-gray-300 flex flex-col h-full'>
//                         <div className='flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10'>
//                             <div>
//                                 {suggestedUser?.profilePicture ? (
//                                     <img className='h-10 w-10 items-center rounded-full' src={suggestedUser?.profilePicture} alt="profile_picture" />
//                                 ) : (
//                                     <FaUserCircle size={35} />
//                                 )}

//                             </div>
//                             <div className='flex flex-col'>
//                                 <span>{selectedUser?.username}</span>
//                             </div>
//                         </div>
//                         <Messages selectedUser={selectedUser} />
//                         <div className='flex items-center p-4 border-t border-t-gray-300'>
//                             <Input value={textMessage} onChange={(e) => setTextMessage(e.target.value)} type="text" className='flex-1 mr-2 focus-visible:ring-transparent' placeholder="Messages..." />
//                             <Button onClick={() => sendMessageHandler(selectedUser?._id)}>Send</Button>
//                         </div>
//                     </section>
//                 ) : (
//                     <div className='flex flex-col items-center justify-center mx-auto'>
//                         <MessageCircleCode className='w-32 h-32 my-4' />
//                         <h1 className='font-medium'>Your messages</h1>
//                         <span>Send a message to start a chat.</span>
//                     </div>
//                 )
//             }
//         </div>
//     )
// }

// export default ChatPage

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaUserCircle } from "react-icons/fa";
import { setSelectedUser } from '@/redux/authSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircleCode } from 'lucide-react';
import Messages from './Messages';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';
import toast from 'react-hot-toast';
import { useMediaQuery } from 'react-responsive';

const ChatPage = () => {
    const [textMessage, setTextMessage] = useState("");
    const { user, followingUser = [], selectedUser } = useSelector(store => store.auth);
    const { onlineUsers, messages } = useSelector(store => store.chat);
    const dispatch = useDispatch();

    const isMobile = useMediaQuery({ maxWidth: 768 });

    const sendMessageHandler = async (receiverId) => {
        try {
            const res = await axios.post(
                `https://instagram-backend-my27.onrender.com/api/v1/message/send/${receiverId}`,
                { textMessage },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                dispatch(setMessages([...messages, res.data.newMessage]));
                setTextMessage("");
            }
        } catch (error) {
            toast.error("Failed to send message");
        }
    };

    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null));
        };
    }, [dispatch]);

    const renderUserList = () => (
        <section className='w-full md:w-1/4 my-8 px-2'>
            <h1 className='font-bold mb-4 px-3 text-xl'>{user?.username}</h1>
            <hr className='mb-4 border-gray-300' />
            <div className='overflow-y-auto h-[80vh]'>
                {followingUser.map((suggestedUser) => {
                    const isOnline = onlineUsers.includes(suggestedUser?._id);
                    return (
                        <div
                            key={suggestedUser?._id}
                            onClick={() => dispatch(setSelectedUser(suggestedUser))}
                            className='flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer'
                        >
                            <div>
                                {suggestedUser?.profilePicture ? (
                                    <img className='h-10 w-10 rounded-full' src={suggestedUser.profilePicture} alt='profile' />
                                ) : (
                                    <FaUserCircle size={35} />
                                )}
                            </div>
                            <div className='flex flex-col'>
                                <span className='font-medium'>{suggestedUser.username}</span>
                                <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                                    {isOnline ? 'online' : 'offline'}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );

    
    const renderChatPanel = () => (
            <section className='flex-1 border-l border-gray-300 flex flex-col h-screen md:h-full'>
                {/* Header */}
                <div className='flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10'>
                    <div>
                        {selectedUser?.profilePicture ? (
                            <img className='h-10 w-10 rounded-full' src={selectedUser.profilePicture} alt='profile' />
                        ) : (
                            <FaUserCircle size={35} />
                        )}
                    </div>
                    <div className='flex flex-col'>
                        <span>{selectedUser?.username}</span>
                    </div>
                </div>

                {/* Messages Area */}
                <div className='flex-1 overflow-y-auto'>
                    <Messages selectedUser={selectedUser} />
                </div>

                {/* Message Input */}
                <div className='flex items-center p-4 border-t border-gray-300 bg-black mb-14  md:static fixed bottom-0 left-0 right-0 z-50'>
                    <Input
                        value={textMessage}
                        onChange={(e) => setTextMessage(e.target.value)}
                        type="text"
                        className='flex-1 mr-2 focus-visible:ring-transparent'
                        placeholder="Messages..."
                    />
                    <Button onClick={() => sendMessageHandler(selectedUser?._id)}>Send</Button>
                </div>
            </section>
        );
      


return (
    <div className='flex flex-col md:flex-row md:ml-[16%] h-screen w-full'>

        {(!isMobile || !selectedUser) && renderUserList()}


        {selectedUser ? (
            renderChatPanel()
        ) : (
            !isMobile && (
                <div className='flex flex-col items-center justify-center flex-1'>
                    <MessageCircleCode className='w-32 h-32 my-4' />
                    <h1 className='font-medium '>Your messages</h1>
                    <span>Send a message to start a chat.</span>
                </div>
            )
        )}
    </div>
);
};

export default ChatPage;
