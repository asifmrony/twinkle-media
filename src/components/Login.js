import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { auth } from './Firebase'
import { login } from '../features/userSlice'

function Login() {
    const [inRegister, setInRegister] = useState(false);
    const [userData, setUserData] = useState({})
    const dispatch = useDispatch();

    //Register Handler
    const onRegister = (e) => {
        e.preventDefault();
        if(!userData.fullName) {
            alert('Please set a Full Name');
        } if(!userData.email) {
            alert('Please enter an email');
        }
        if(!userData.password) {
            alert('Please set your password');
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
            })
            .catch((error) => {
                console.log(error); 
            });
    }
    //Sign In handler
    const onSignIn = (e) => {
        e.preventDefault();
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
        })
    }

    return (
        <section className="login">
            <div className="ml-28 py-6 mx-auto">
                <img src="https://brand.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Logo.svg.original.svg" alt="" className='h-[2.2rem]' />
            </div>
            <div className='flex justify-center'>
                <div>
                    <h1 className='text-3xl mb-4'>Make the most of your professional life</h1>
                    <div className="bg-white rounded-md px-5 py-4 max-w-sm mx-auto">
                        <form>
                            {inRegister
                                ? <>
                                    <label htmlFor="fullName" className='space-y-1 block mb-2'>
                                        <p className='text-gray-500 text-sm'>Full Name</p>
                                        <input
                                            type="text"
                                            name='fullName'
                                            id='fullName'
                                            className='border border-slate-500 w-full rounded-md p-1'
                                            onChange={(e) => setUserData({ ...userData, [e.target.name]: e.target.value })}
                                        />
                                    </label>
                                    <label htmlFor="profilePic" className='space-y-1 block mb-2'>
                                        <p className='text-gray-500 text-sm'>Profile Pic URL (Optional)</p>
                                        <input
                                            type="text"
                                            id='profilePic'
                                            name='profilePic'
                                            className='border border-slate-500 w-full rounded-md p-1'
                                            onChange={(e) => setUserData({ ...userData, [e.target.name]: e.target.value })}
                                        />
                                    </label>
                                </> : ""
                            }
                            <label htmlFor="email" className='space-y-1 block mb-2'>
                                <p className='text-gray-500 text-sm'>Email</p>
                                <input
                                    type="email"
                                    id='email'
                                    name='email'
                                    onChange={(e) => setUserData({ ...userData, [e.target.name]: e.target.value })}
                                    className='border border-slate-500 w-full rounded-md p-1' />
                            </label>
                            <label htmlFor="pwd" className='space-y-1 block mb-3'>
                                <p className='text-gray-500 text-sm'>Password</p>
                                <input
                                    type="text"
                                    id='pwd'
                                    name='password'
                                    className='border border-slate-500 w-full rounded-md p-1'
                                    onChange={(e) => setUserData({ ...userData, [e.target.name]: e.target.value })}
                                />
                            </label>
                            <p className='text-center text-xs mb-3'>By clicking Agree & Join, you agree to the LinkedIn User Agreement, Privacy Policy, and Cookie Policy.</p>
                            {inRegister
                                ? <button
                                    type='button' 
                                    onClick={onRegister}
                                    className='mb-3 w-full bg-blue-600 hover:bg-blue-800 rounded-full py-3 text-white font-semibold'
                                >Agree & Join</button>
                                : <button
                                    type='button'
                                    onClick={onSignIn}
                                    className='mb-3 w-full bg-blue-600 hover:bg-blue-800 rounded-full py-3 text-white font-semibold'
                                >Sign In</button>}
                        </form>
                    </div>
                    {inRegister
                        ? ""
                        : <p className='text-sm max-w-sm mx-auto text-center mt-4'>Not a Member? <span className='text-blue-600 font-semibold cursor-pointer' onClick={() => setInRegister(true)}>Register Now</span></p>
                    }
                </div>
            </div>
        </section>
    )
}

export default Login