import React from 'react'
import { FaUserCircle } from "react-icons/fa";

const Comment = ({ comment }) => {
    return (
        <div className='my-2 w-full'>
            <div className='flex items-start gap-3'>
              
                <div className=''>
                    {comment?.author?.profilePicture ? (
                        <img
                            src={comment.author.profilePicture}
                            alt="profile"
                            className='w-7 h-7 rounded-full object-cover'
                        />
                    ) : (
                        <FaUserCircle size={15} className="text-gray-400" />
                    )}
                </div>

               
                <div className='flex-1'>
                    <p className='text-sm sm:text-base leading-snug break-words'>
                        <span className='font-semibold'>{comment?.author?.username}</span>
                        <span className='font-normal pl-2'>{comment?.text}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Comment;
