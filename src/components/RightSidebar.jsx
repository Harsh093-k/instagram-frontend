import React from 'react'

import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';
import { FaUserCircle } from "react-icons/fa";

const RightSidebar = () => {
  const { user } = useSelector(store => store.auth);
  return (
    <div className='w-fit my-10 pr-32'>
      <div className='flex items-center gap-2'>
        <Link to={`/profile/${user?._id}`}>
          <div>
            {user?.profilePicture ? (
              <img className='h-10 w-10 items-center rounded-full' src={user.profilePicture} alt="profile_picture" />
            ) : (
              <FaUserCircle size={100} />
            )}
            
          </div>

        </Link>
        <div>
          <h1 className='font-semibold text-sm'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
          <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here...'}</span>
        </div>
      </div>
      <SuggestedUsers />
    </div>
  )
}

export default RightSidebar