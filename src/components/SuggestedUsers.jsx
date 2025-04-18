import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import axios from 'axios';
import { removesuggestedUsers,setSuggestedUsers } from '@/redux/authSlice';
import  Toaster  from 'react-hot-toast';
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers';

const SuggestedUsers = () => {
    const { suggestedUsers } = useSelector(store => store.auth);
    const dispatch=useDispatch()
    
    const follow = async (userId) => {
        try {
            const response = await axios.post(
                `https://instagram-backend-my27.onrender.com/api/v1/user/followorunfollow/${userId}`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

        

            if (response.data.message === "followed successfully") {
                dispatch(removesuggestedUsers(userId)); 

                
                setTimeout(async () => {
                    try {
                        const res = await axios.get('https://instagram-backend-my27.onrender.com/api/v1/user/suggested', { withCredentials: true });
                        console.log(res.data);
                        if (res.data.success) { 
                            dispatch(setSuggestedUsers(res.data.users));
                        }
                    } catch (error) {
                        Toaster.log(error);
                    }
                }, 100); 
            }
        } catch (error) {
            Toaster.error(error.response?.data?.message || "Something went wrong!");
        }
    };
    return (
      
       
            <div className='my-10'>
                <div className='flex items-center justify-between text-sm'>
                    <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
                    <span className='font-medium cursor-pointer'>See All</span>
                </div>
        
                {suggestedUsers.length === 0 ? (
                    <p className='text-gray-500 text-sm mt-4'>No suggestions available.</p>
                ) : (
                    suggestedUsers.map((user) => (
                        <div key={user._id} className='flex items-center justify-between my-5'>
                            <div className='flex items-center gap-2'>
                                <Link to={`/profile/${user?._id}`}>
                                    <div>
                                        {user?.profilePicture ? (
                                            <img className='h-10 w-10 rounded-full' src={user.profilePicture} alt="profile_picture" />
                                        ) : (
                                            <FaUserCircle size={35} />
                                        )}
                                    </div>
                                </Link>
                                <div>
                                    <h1 className='font-semibold text-sm'>
                                        <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                                    </h1>
                                    <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here...'}</span>
                                </div>
                            </div>
                            <span
                                className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]'
                                onClick={() => follow(user._id)}
                            >
                                Follow
                            </span>
                        </div>
                    ))
                )}
            </div>
       
        
    )
}

export default SuggestedUsers