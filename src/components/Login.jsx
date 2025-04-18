import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios';

import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import Toaster from 'react-hot-toast';

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const signupHandler = async (e) => {
        e.preventDefault();
        console.log(input);
        try {
            setLoading(true);
            const res = await axios.post("https://instagram-backend-my27.onrender.com/api/v1/user/login", input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                
            });

            if (res.data.success) {
                console.log("login data:-",res.data);
                dispatch(setAuthUser(res.data.user));
                navigate("/");
                Toaster.success(res.data.message);
                setInput({
                    email: "",
                    password: ""
                });
            }
        } catch (error) {
            console.log(error);
            Toaster.error(error.response.data.message || "Invalid Email and password!");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [])
    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8'>
                <div className='my-4'>
                <h1 className='text-center from-stone-950  font-bold  italic text-3xl'>Instagram</h1>
                    <p className='text-sm text-center mt-3 font-bold '>Log In</p>
                </div>
                <div>
                    <span className='font-medium'>Email</span>
                    <Input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>
                <div>
                    <div className="font-medium flex justify-between items-center">
                        <span>Password</span>
                        <Link to="/forgot-password" className="text-blue-500 hover:underline text-sm">
                            Forgot Password?
                        </Link>
                    </div>
                    <Input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2 w-full"
                    />
                </div>

                {
                    loading ? (
                        <Button>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please wait
                        </Button>
                    ) : (
                        <Button type='submit'>Login</Button>
                    )
                }

                <span className='text-center'>Dosent have an account? <Link to="/signup" className='text-blue-600'>Signup</Link></span>
            </form>
        </div>
    )
}

export default Login