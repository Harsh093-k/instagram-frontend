import React, { useState } from 'react'
import { FaUserCircle } from "react-icons/fa";
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState('posts');

  const { userProfile, user } = useSelector(store => store.auth);

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = false;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  }

  const displayedPost = activeTab === 'posts'
    ? userProfile?.posts
    : activeTab === 'saved'
      ? userProfile?.bookmarks
      : activeTab === 'reels'
        ? userProfile?.posts?.filter((post) => post.type === 'reel')
        : activeTab === 'images'
          ? userProfile?.posts?.filter((post) => post.type === 'image') : [];


  return (
    <div className='flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
  <div className='flex flex-col gap-10 py-8'>
    
    {/* Profile Header */}
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-center'>
      {/* Profile Picture */}
      <section className='flex justify-center md:justify-end'>
        <div>
          {userProfile?.profilePicture ? (
            <img className='h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36 rounded-full object-cover' src={userProfile.profilePicture} alt="profile_picture" />
          ) : (
            <FaUserCircle size={125} />
          )}
        </div>
      </section>

      <section>
  <div className='flex flex-col gap-4'>

  
    <div className='flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2 items-center'>
      <div className='text-xl font-semibold items-center'>{userProfile?.username}</div>
      <div className='flex flex-wrap gap-2'>
        {isLoggedInUserProfile ? (
          <>
            <Link to="/account/edit"><Button variant='secondary' className='h-8'>Edit profile</Button></Link>
            <Button variant='secondary' className='h-8'>View archive</Button>
            <Button variant='secondary' className='h-8'>Ad tools</Button>
          </>
        ) : (
          isFollowing ? (
            <>
              <Button variant='secondary' className='h-8'>Unfollow</Button>
              <Button variant='secondary' className='h-8'>Message</Button>
            </>
          ) : (
            <Button className='bg-[#0095F6] hover:bg-[#3192d2] h-8'>Follow</Button>
          )
        )}
      </div>
    </div>

    {/* Followers / Following / Posts */}
    <div className='flex gap-6 text-sm'>
      <p><span className='font-semibold'>{userProfile?.posts.length}</span> posts</p>
      <p><span className='font-semibold'>{userProfile?.followers.length}</span> followers</p>
      <p><span className='font-semibold'>{userProfile?.following.length}</span> following</p>
    </div>

    {/* Bio and Tag */}
    <div className='flex flex-col gap-1 text-sm'>
      <span className='font-semibold'>{userProfile?.bio || 'bio here...'}</span>
      <Badge className='w-fit' variant='secondary'>
        <AtSign />
        <span className='pl-1'>{userProfile?.username}</span>
      </Badge>
    </div>
  </div>
</section>

    </div>

    {/* Tabs */}
    <div className='border-t border-t-gray-200'>
      <div className='flex flex-wrap justify-center gap-6 text-sm py-3'>
        {['posts', 'saved', 'reels', 'images'].map((tab) => (
          <span
            key={tab}
            className={`cursor-pointer ${activeTab === tab ? 'font-bold border-b-2 border-black' : ''}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab.toUpperCase()}
          </span>
        ))}
        <span className='cursor-pointer'>TAGS</span>
      </div>

      {/* Post Grid */}
      <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
        {displayedPost?.map((post) => (
          <div key={post?._id} className='relative group cursor-pointer'>
            {post.type === "reel" ? (
              <video
                className="rounded-sm w-full aspect-square object-cover"
                src={post.post.url}
                controls
                disablePictureInPicture
                controlsList="nodownload noremoteplayback"
                onContextMenu={(e) => e.preventDefault()}
              />
            ) : (
              <img
                className="rounded-sm w-full aspect-square object-cover"
                src={post.post.url}
                alt="post_img"
              />
            )}
            <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
              <div className='flex items-center text-white space-x-4'>
                <button className='flex items-center gap-2 hover:text-gray-300'>
                  <Heart />
                  <span>{post?.likes.length}</span>
                </button>
                <button className='flex items-center gap-2 hover:text-gray-300'>
                  <MessageCircle />
                  <span>{post?.comments.length}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

  )
}

export default Profile