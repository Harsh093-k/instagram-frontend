import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment'
import axios from 'axios'
import Toaster from 'react-hot-toast'
import { setPosts } from '@/redux/postSlice'
import { FaUserCircle } from 'react-icons/fa';
import { MdDeleteForever } from "react-icons/md";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector(store => store.post);
  const [comment, setComment] = useState([]);
  const dispatch = useDispatch();
  const [imageError, setImageError] = useState(false);

  const profilePicture = selectedPost?.author?.profilePicture;

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const commentdelete = async (commentId) => {
    const postId = selectedPost._id;
    try {
      const res = await axios.delete("https://instagram-backend-my27.onrender.com/api/v1/post/comment/delete", {
        data: { postId, commentId },
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      Toaster.success(res.data.message);
      const updatedComments = comment.filter(c => c._id !== commentId);
      setComment(updatedComments);

      const updatedPostData = posts.map(p =>
        p._id === selectedPost._id ? { ...p, comments: updatedComments } : p
      );
      dispatch(setPosts(updatedPostData));
    } catch (error) {
      Toaster.error("You are not the owner of this comment.");
    }
  };

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(`https://instagram-backend-my27.onrender.com/api/v1/post/${selectedPost?._id}/comment`, {
        text
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map(p =>
          p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        Toaster.success(res.data.message);
        setText("");
      }
    } catch (error) {
      Toaster.error("Failed to send comment.");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)} className="max-w-5xl p-0 flex flex-col">
        <div className='flex flex-col md:flex-row flex-1'>
          <div className='w-full md:w-1/2'>
            {selectedPost?.type === "reel" ? (
              <video
                className="rounded-sm my-2 w-full aspect-square object-cover"
                src={selectedPost?.post.url}
                controls
                autoPlay={false}
                loop={false}
                disablePictureInPicture
                controlsList="nodownload noremoteplayback"
                onContextMenu={(e) => e.preventDefault()}
              />
            ) : (
              <img
                className="rounded-sm my-2 w-full aspect-square object-cover"
                src={selectedPost?.post.url}
                alt="post_img"
              />
            )}
          </div>

          <div className='w-full md:w-1/2 flex flex-col justify-between'>
            <div className='flex items-center justify-between p-4'>
            <div className='flex gap-3 items-center'>
      {profilePicture && !imageError ? (
        <Link>
          <img
            className='h-20 w-20 rounded-full object-cover'
            src={profilePicture}
            alt="profile_picture"
            onError={() => setImageError(true)}
          />
        </Link>
      ) : (
        <FaUserCircle size={60} />
      )}

      <Link className='font-semibold text-xs'>
        {selectedPost?.author?.username}
      </Link>
    </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className='cursor-pointer' />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className='cursor-pointer w-full text-[#ED4956] font-bold'>
                    Unfollow
                  </div>
                  <div className='cursor-pointer w-full'>
                    Add to favorites
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <hr />

            <div className='flex-1 overflow-y-auto max-h-96 p-4'>
              {comment.map((comment) => (
                <div key={comment._id} className="flex justify-between items-center">
                  <Comment comment={comment} />
                  <MdDeleteForever size={30} className="cursor-pointer hover:text-red-700" onClick={() => commentdelete(comment._id)} />
                </div>
              ))}
            </div>

            <div className='p-4'>
              <div className='flex items-center gap-2'>
                <input
                  type="text"
                  value={text}
                  onChange={changeEventHandler}
                  placeholder='Add a comment...'
                  className='w-full outline-none border text-sm border-gray-300 p-2 rounded'
                />
                <Button disabled={!text.trim()} onClick={sendMessageHandler} variant="outline">Send</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
