import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { login } from '../features/userSlice';
import { auth } from '../Firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({})
    const [isNameEmpty, setIsNameEmpty] = useState(false);
    const [isEmailEmpty, setIsEmailEmpty] = useState(false);
    const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
    const dispatch = useDispatch();

    //Register Handler
    const onRegister = (e) => {
        e.preventDefault();
        if (!userData.fullName) {
            setIsNameEmpty(true);
            return;
        } if (!userData.email) {
            setIsEmailEmpty(true);
            return;
        }
        if (!userData.password) {
            setIsPasswordEmpty(true);
            return;
        }
        createUserWithEmailAndPassword(auth, userData.email, userData.password)
            .then((userInfo) => {
                // Signed in 
                updateProfile(auth.currentUser, {
                    displayName: userData.fullName,
                    photoURL: userData.profilePic
                })
                //Send user to redux store
                dispatch(login({
                    email: userInfo.user.email,
                    uid: userInfo.user.uid,
                    displayName: userData.fullName,
                    photoURL: userData.profilePic
                }))
                toast.success('Account Created', {theme: 'colored'});
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            })
            .catch((error) => {
                console.log(error);
                if (error.code == 'auth/email-already-in-use') {
                    toast.error('Already an user with this email.', { theme: 'colored' })
                } else if (error.code == 'auth/weak-password') {
                    toast.error('The Password is too weak.', { theme: 'colored' })
                }
            });
    }

    return (
        <section className="signup">
            <ToastContainer />
            <div className="ml-28 py-6 mx-auto">
                <img src="https://brand.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Logo.svg.original.svg" alt="" className='h-[2.2rem]' />
            </div>
            <div className='flex justify-center'>
                <div>
                    <h1 className='text-3xl mb-4'>Make the most of your professional life</h1>
                    <div className="bg-white rounded-md px-5 py-4 max-w-sm mx-auto">
                        <form onSubmit={onRegister}>
                            <>
                                <label htmlFor="fullName" className='space-y-1 block mb-2'>
                                    <p className='text-gray-500 text-sm'>Full Name</p>
                                    <input
                                        type="text"
                                        name='fullName'
                                        id='fullName'
                                        className='border border-slate-500 w-full rounded-md py-1 px-2'
                                        onChange={(e) => {
                                            setUserData({ ...userData, [e.target.name]: e.target.value });
                                            setIsNameEmpty(false);
                                        }} 
                                    />
                                    {isNameEmpty && <p className='text-red-600 text-xs'>Enter your Name</p>}
                                </label>
                                <label htmlFor="profilePic" className='space-y-1 block mb-2'>
                                    <p className='text-gray-500 text-sm'>Profile Pic URL (Optional)</p>
                                    <input
                                        type="text"
                                        id='profilePic'
                                        name='profilePic'
                                        className='border border-slate-500 w-full rounded-md py-1 px-2'
                                        onChange={(e) => setUserData({ ...userData, [e.target.name]: e.target.value })}
                                    />
                                </label>
                                <label htmlFor="email" className='space-y-1 block mb-2'>
                                    <p className='text-gray-500 text-sm'>Email</p>
                                    <input
                                        type="email"
                                        id='email'
                                        name='email'
                                        onChange={(e) => {
                                            setUserData({ ...userData, [e.target.name]: e.target.value });
                                            setIsEmailEmpty(false)
                                        }}
                                        className={`border w-full rounded-md py-1 px-2 ${isEmailEmpty ? 'border-red-600': 'border-slate-500'}`} />
                                    {isEmailEmpty && <p className='text-red-600 text-xs'>Enter you email</p>}
                                    
                                </label>
                                <label htmlFor="pwd" className='space-y-1 block mb-3'>
                                    <p className='text-gray-500 text-sm'>Password</p>
                                    <input
                                        type="text"
                                        id='pwd'
                                        name='password'
                                        className={`border w-full rounded-md py-1 px-2 ${isPasswordEmpty ? 'border-red-600': 'border-slate-500'}`}
                                        onChange={(e) => {
                                            setUserData({ ...userData, [e.target.name]: e.target.value });
                                            setIsPasswordEmpty(false);
                                        }}
                                    />
                                    {isPasswordEmpty && <p className='text-red-600 text-xs'>Set a password</p>}
                                </label>
                                <p className='text-center text-xs mb-3'>By clicking Agree & Join, you agree to the LinkedIn User Agreement, Privacy Policy, and Cookie Policy.</p>
                                <button
                                    type='submit'
                                    className='mb-3 w-full bg-blue-600 hover:bg-blue-800 rounded-full py-3 text-white font-semibold'
                                >Agree & Join</button>

                            </>
                        </form>
                    </div>

                    <p className='text-sm max-w-sm mx-auto text-center mt-4'>Already a Member? <span className='text-blue-600 font-semibold cursor-pointer' onClick={() => navigate('/login')}>Sign In</span></p>

                </div>
            </div>
        </section>
    )
}

export default Signup