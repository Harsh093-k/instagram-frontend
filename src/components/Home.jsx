import React,{useEffect, useState} from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import useGetAllPost from '@/hooks/useGetAllPost'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'
import ScrollablePersonList from './followedUser'
import axios from "axios";
import Toaster from "react-hot-toast"
import { useDispatch ,useSelector } from 'react-redux'
import { setFollowingUser } from "@/redux/authSlice";

const Home = () => {
    const dispatch = useDispatch();
    const { followingUser } = useSelector((store) => store.auth);

    useGetAllPost();
    useGetSuggestedUsers();
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axios.get("https://instagram-backend-my27.onrender.com/api/v1/user/following/data", { withCredentials: true });

                if (res.data.success) { 

                    dispatch(setFollowingUser(res.data.following)); 
                } else {
                    Toaster.log("Failed to fetch following user data");
                }
            } catch (error) {
                Toaster.log("followingUser data fetching error", error);
            }
        };

        fetchUserProfile();
    }, [dispatch]);

    console.log("followingUser:", followingUser);
  
    return (
        <div className='flex'>
            <div className='flex-auto'>
              
                
                <ScrollablePersonList persons={followingUser ?? []}/>
                <Feed />
                <Outlet />
            </div>
         
            <RightSidebar />
        </div>
    )
}

export default Home