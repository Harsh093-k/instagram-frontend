import React, { useEffect, useState } from 'react';
import Feed from './Feed';
import { Outlet } from 'react-router-dom';
import RightSidebar from './RightSidebar';
import useGetAllPost from '@/hooks/useGetAllPost';
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers';
import ScrollablePersonList from './followedUser';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setFollowingUser } from '@/redux/authSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { followingUser } = useSelector((store) => store.auth);

  useGetAllPost();
  useGetSuggestedUsers();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(
          'https://instagram-backend-my27.onrender.com/api/v1/user/following/data',
          { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(setFollowingUser(res.data.following));
        } else {
          toast.error('Failed to fetch following user data');
        }
      } catch (error) {
        toast.error('Following user data fetching error');
      }
    };

    fetchUserProfile();
  }, [dispatch]);

  return (
    <div className='flex flex-col lg:flex-row w-full min-h-screen bg-gray-50'>
   
      <div className='flex flex-col items-center justify-center w-full lg:flex-1 overflow-hidden'>
        <div className='w-full overflow-x-auto  sm:w-screen  overflow-hidden'>
          <ScrollablePersonList persons={followingUser ?? []} />
        </div>
        <Feed />
        <Outlet />
      </div>

      
      <div className='hidden lg:block lg:w-[300px] border-l border-gray-200'>
        <RightSidebar />
      </div>
    </div>
  );
};

export default Home;
