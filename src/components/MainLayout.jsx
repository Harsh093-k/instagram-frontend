

import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';
import { Home, PlusCircle, MessageSquare, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import CreatePost from './CreatePost';
import useMediaQuery from '@/hooks/useMediaQuery';
import SuggestedUsers from './SuggestedUsers';
import { LogOut } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { setAuthUser } from '@/redux/authSlice';
import { setPosts, setSelectedPost } from '@/redux/postSlice';

const MainLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSuggested, setShowSuggested] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const isMobile = useMediaQuery('(max-width: 768px)');

  const logoutHandler = async () => {
    try {
      const res = await axios.get(
        'https://instagram-backend-my27.onrender.com/api/v1/user/logout',
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");

        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };





  // ---------- LAYOUT ---------- //
  if (isMobile) {
    return (
      <div className="flex min-h-screen">

        <div className="hidden md:block">
          <LeftSidebar />
        </div>


        <div className="flex-1 flex justify-center mr-10 sm:px-4 md:px-8 overflow-y-auto max-h-screen pb-16 lg:max-w-full">
          <div className="w-full max-w-2xl">
            <Outlet />
          </div>
        </div>


        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden flex justify-around items-center h-14 shadow-sm">
          <button onClick={() => navigate('/')} className="flex flex-col items-center text-sm">
            <Home className="h-5 w-5" />
            <span>Home</span>
          </button>

          <button onClick={() => setOpen(true)} className="flex flex-col items-center text-sm">
            <PlusCircle className="h-5 w-5" />
            <span>Create</span>
          </button>

          <button onClick={() => navigate('/chat')} className="flex flex-col items-center text-sm">
            <MessageSquare className="h-5 w-5" />
            <span>Message</span>
          </button>


          <button onClick={() => navigate(`/profile/${user?._id}`)} className="flex flex-col items-center text-sm">
            <User className="h-5 w-5" />
            <span>Profile</span>
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="flex flex-col items-center text-sm relative">
            <div className="text-xl font-bold">⋮</div>
            <span>Menu</span>

            {menuOpen && (
              <div className="absolute bottom-10 bg-white border rounded shadow-md w-32 right-0 z-50">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setShowSuggested(true);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Suggested
                </button>
                <button
                  onClick={logoutHandler}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </button>



        </div>


        <CreatePost open={open} setOpen={setOpen} />
        {showSuggested && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96 max-h-[80vh] overflow-auto relative">
              <button
                onClick={() => setShowSuggested(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
              >
                &times;
              </button>
              <h2 className="text-lg font-semibold mb-4">Suggested Users</h2>
              <SuggestedUsers />
            </div>
          </div>
        )}

      </div>
    );
  }

  // ---------- DESKTOP LAYOUT ---------- //
  return (
    <div>
      <LeftSidebar />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;

