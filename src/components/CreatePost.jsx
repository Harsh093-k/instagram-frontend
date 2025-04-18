
import React, { useRef, useState } from 'react';
import axios from 'axios';
import  Toaster  from 'react-hot-toast';
import { FiX, FiImage, FiVideo } from 'react-icons/fi';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';

const CreatePost = ({ open, setOpen }) => {
  const [formData, setFormData] = useState({ caption: '', file: null, type: 'post' });
  const [mediaPreview, setMediaPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileType = file.type.startsWith('video') ? 'reel' : 'image';
    setFormData({ ...formData, file, type: fileType });
    
    const reader = new FileReader();
    reader.onloadend = () => setMediaPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeMedia = () => {
    setFormData({ ...formData, file: null });
    setMediaPreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.caption.trim() || !formData.file) {
      Toaster.error('Caption and media are required!');
      return;
    }
  
   
    const fileType = formData.file.type.startsWith('video') ? 'reel' : 'image';
    const uploadData = new FormData();
    uploadData.append('caption', formData.caption);
    uploadData.append('file', formData.file);
  
    try {
      setLoading(true);
      
      const res = await axios.post(
        `https://instagram-backend-my27.onrender.com/api/v1/post/addpost?type=${fileType}`,
        uploadData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );
  
      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        Toaster.success('Post created successfully!');
        setOpen(false);
        setFormData({ caption: "", file: null, type: "" });
       removeMedia();
      }
    } catch (error) {
      Toaster.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Create New Post</h2>
        <form onSubmit={handleSubmit} className="w-full">
          <textarea
            name="caption"
            rows="3"
            className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="What's on your mind?"
            value={formData.caption}
            onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
          />

          {mediaPreview && (
            <div className="relative my-4">
              {formData.type === 'reel' ? (
                <video src={mediaPreview} controls className="w-full h-64 bg-black rounded-lg" />
              ) : (
                <img src={mediaPreview} alt="Preview" className="w-full h-64 object-contain bg-gray-200 rounded-lg" />
              )}
              <button type="button" onClick={removeMedia} className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100">
                <FiX className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          )}

          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {formData.type === 'reel' ? <FiVideo className="w-10 h-10 mb-3 text-gray-400" /> : <FiImage className="w-10 h-10 mb-3 text-gray-400" />}
              <p className="mb-2 text-sm text-gray-500">Upload {formData.type === 'reel' ? 'a video' : 'an image'}</p>
            </div>
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept={formData.type === 'reel' ? 'video/*' : 'image/*'} required />
          </label>

          <div className="flex justify-center mt-4">
            <Button type="submit" disabled={loading || !formData.file} className="px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              {loading ? 'Posting...' : 'Create Post'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
