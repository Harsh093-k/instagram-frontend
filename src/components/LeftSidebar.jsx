import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { FaUserCircle } from "react-icons/fa";
import  Toaster  from 'react-hot-toast'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import CreatePost from './CreatePost'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'

const LeftSidebar = () => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const { likeNotification } = useSelector(store => store.realTimeNotification);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);


    const logoutHandler = async () => {
        try {
            const res = await axios.get('https://instagram-backend-my27.onrender.com/api/v1/user/logout', { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]));
                navigate("/login");
                Toaster.success(res.data.message);
            }
        } catch (error) {
            Toaster.error(error.response.data.message);
        }
    }

    const sidebarHandler = (textType) => {
        if (textType === 'Logout') {
            logoutHandler();
        } else if (textType === "Create") {
            setOpen(true);
        } else if (textType === "Profile") {
            navigate(`/profile/${user?._id}`);
        } else if (textType === "Home") {
            navigate("/");
        } else if (textType === 'Messages') {
            navigate("/chat");
        }
    }

    const sidebarItems = [
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Search" },
        { icon: <TrendingUp />, text: "Explore" },
        { icon: <MessageCircle />, text: "Messages" },
        { icon: <Heart />, text: "Notifications" },
        { icon: <PlusSquare />, text: "Create" },
        {
            icon: (
                <div >
                {user?.profilePicture ? (
                  <img className='h-8 w-8 items-center rounded-full' src={user?.profilePicture} alt="profile_picture" />
                ) : (
                  <FaUserCircle size={35} />
                )}
  
              </div>
            ),
            text: "Profile"
        },
        { icon: <LogOut />, text: "Logout" },
    ]
    return (
        <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>
            <div className='flex flex-col'>
                {/* <img className='  mt-0 h-20 w-24 text-lg bg-pink-700 font-bold text-xl' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyh8nVZfZMblN1b-RU-Rszv5UZsfvPbfncLQ&s"/> */}
                <div><h1 className='text-center from-stone-950 text font-bold  italic text-3xl'>Instagram</h1></div>
                <div>
                    {
                        sidebarItems.map((item, index) => {
                            return (
                                <div onClick={() => sidebarHandler(item.text)} key={index} className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'>
                                    {item.icon}
                                    <span>{item.text}</span>
                                    {
                                        item.text === "Notifications" && likeNotification.length > 0 && (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button size='icon' className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6">{likeNotification.length}</Button>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <div>
                                                        {
                                                            likeNotification.length === 0 ? (<p>No new notification</p>) : (
                                                                likeNotification.map((notification) => {
                                                                    return (
                                                                        <div key={notification.userId} className='flex items-center gap-2 my-2'>
                                                                            <div >
                                                                                         {userProfile?.profilePicture ? (
                                                                                           <img className='h-32 w-32 items-center rounded-full' src={userProfile?.profilePicture} alt="profile_picture" />
                                                                                         ) : (
                                                                                           <FaUserCircle size={35} />
                                                                                         )}
                                                                           
                                                                                       </div>
                                                                            <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span> liked your post</p>
                                                                        </div>
                                                                    )
                                                                })
                                                            )
                                                        }
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        )
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <CreatePost open={open} setOpen={setOpen} />

        </div>
    )
}

export default LeftSidebar