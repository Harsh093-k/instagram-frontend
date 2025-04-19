import React from 'react'
import { FaUserCircle } from "react-icons/fa";
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import useGetAllMessage from '@/hooks/useGetAllMessage'
import useGetRTM from '@/hooks/useGetRTM'
import toast from 'react-hot-toast';
import { setMessages } from '@/redux/chatSlice';
import axios from 'axios';
import { Trash2 } from 'lucide-react'

const Messages = ({ selectedUser }) => {
    const dispatch = useDispatch();
    useGetRTM();
    useGetAllMessage();
    const { messages } = useSelector(store => store.chat);
    const { user } = useSelector(store => store.auth);

    const deleteMessageHandler = async (messageId) => {
        try {
          const res = await axios.delete(
            `https://instagram-backend-my27.onrender.com/api/v1/message/delete/${messageId}`,
            { withCredentials: true }
          );
      
          if (res.data.success) {
            
            dispatch(setMessages(messages.filter((msg) => msg._id !== messageId)));
            toast.success('Message deleted successfully!');
          } else {
            toast.error('Failed to delete message.');
          }
        } catch (error) {
          toast.error('Error deleting message.');
        }
      };
      
    return (
        
        
        <div className='overflow-y-auto flex-1 p-4'>
        
          <div className='flex justify-center mb-6'>
            <div className='flex flex-col items-center justify-center'>
              <div>
                {selectedUser?.profilePicture ? (
                  <img className='h-20 w-20 rounded-full' src={selectedUser?.profilePicture} alt="profile_picture" />
                ) : (
                  <FaUserCircle size={60} />
                )}
              </div>
              <span className='mt-2 font-medium'>{selectedUser?.username}</span>
              <Link to={`/profile/${selectedUser?._id}`}>
                <Button className="h-8 mt-2" variant="secondary">View Profile</Button>
              </Link>
            </div>
          </div>
        
          {/* Messages Section */}
          <div className='flex flex-col gap-3'>
            {messages && messages.map((msg) => (
              <div key={msg._id} className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}>
                <div className='flex items-center'>
                  <div className={`p-2 rounded-lg max-w-xs break-words ${msg.senderId === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                    {msg.message}
                  </div>
                  {msg.senderId === user?._id && (
                    <button
                      onClick={() => deleteMessageHandler(msg._id)}
                      className='ml-2 text-red-500 hover:text-red-700'
                      title="Delete message"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
    )
}

export default Messages

