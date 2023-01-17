import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { auth } from '../Firebase'
import { login } from '../features/userSlice'
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    const [userData, setUserData] = useState({})
    const [isEmailEmpty, setIsEmailEmpty] = useState(false);
    const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //Sign In handler
    const onSignIn = (e) => {
        e.preventDefault();
        if (!userData?.email) {
            setIsEmailEmpty(true);
            return;
        }
        if (!userData?.password) {
            setIsPasswordEmpty(true);
            return;
        }
        signInWithEmailAndPassword(auth, userData.email, userData.password)
            .then((userInfo) => {
                //Signed In
                //Send user to redux store
                dispatch(login({
                    email: userInfo.user.email,
                    uid: userInfo.user.uid,
                    displayName: userInfo.user.displayName,
                    photoURL: userInfo.user.photoURL
                }))
                toast.success('Login successful', {theme: 'colored'});
                setTimeout(() => {navigate('/')}, 1000);
               
            }).catch(err => {
                if(err.code == 'auth/user-not-found') {
                    toast.error('User not found', {theme: 'colored'})
                } else if (err.code == 'auth/wrong-password') {
                    toast.error('Wrong Password', {theme: 'colored'})
                }
                else {
                    toast.error(err.code, {theme: 'colored'})
                }
            });
    }

    return (
        <section className="login">
            <ToastContainer />
            <div className="ml-28 py-6 mx-auto">
                <img src="https://brand.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Logo.svg.original.svg" alt="" className='h-[2.2rem]' />
            </div>
            <div className='flex justify-center'>
                <div>
                    <div className="bg-white rounded-md px-5 py-4 max-w-sm mx-auto">
                        <form onSubmit={onSignIn}>
                            <h1 className='text-3xl mb-1 font-semibold'>Sign in</h1>
                            <p className='text-sm mb-4'>Stay updated on your professional world</p>
                            <label htmlFor="email" className='space-y-1 block mb-2'>
                                <p className='text-gray-500 text-sm'>Email</p>
                                <input
                                    type="email"
                                    id='email'
                                    name='email'
                                    onChange={(e) => {
                                        setIsEmailEmpty(false);
                                        setUserData({ ...userData, [e.target.name]: e.target.value })
                                    }}
                                    className={`border ${isEmailEmpty ? 'border-red-600' : 'border-slate-500'} w-full rounded-md py-1 px-2`}
                                />
                                {isEmailEmpty && <p className='text-red-600 text-xs'>Email address is required</p>}
                            </label>
                            <label htmlFor="pwd" className='space-y-1 block mb-3'>
                                <p className='text-gray-500 text-sm'>Password</p>
                                <input
                                    type="text"
                                    id='pwd'
                                    name='password'
                                    className={`border ${isPasswordEmpty ? 'border-red-600' : 'border-slate-500'} w-full rounded-md py-1 px-2`}
                                    onChange={(e) => {
                                        setIsPasswordEmpty(false);
                                        setUserData({ ...userData, [e.target.name]: e.target.value })
                                    }}
                                />
                                {isPasswordEmpty && <p className='text-red-600 text-xs'>Password is required</p>}
                                <p className='text-end mr-1'>
                                    <Link to='/reset-password' className='text-blue-600 text-sm'>
                                        forgot password?
                                    </Link>
                                </p>
                            </label>
                            <p className='text-center text-xs mb-3'>By clicking Agree & Join, you agree to the LinkedIn User Agreement, Privacy Policy, and Cookie Policy.</p>
                            <button
                                type='submit'
                                className='mb-3 w-full bg-blue-600 hover:bg-blue-800 rounded-full py-3 text-white font-semibold'
                            >Sign In</button>
                        </form>
                    </div>
                    <p className='text-sm max-w-sm mx-auto text-center mt-4'>Not a Member? <span className='text-blue-700 font-semibold cursor-pointer' onClick={() => navigate('/signup')}>Register Now</span></p>
                </div>
            </div>
        </section>
    )
}

export default Login