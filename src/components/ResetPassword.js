import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { auth } from '../Firebase';

function ResetPassword() {
    const [isEmailEmpty, setIsEmailEmpty] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();

    const onResetPwd = (e) => {
        e.preventDefault();

        if (!userEmail) {
            setIsEmailEmpty(true);
            return;
        }

        sendPasswordResetEmail(auth, userEmail)
            .then(() => {
                // Password reset email sent!
                console.log('pwd reset sucess')
                toast.success('Password reset email sent!', {theme: 'colored'});
                setTimeout(() => {navigate('/login')}, 3000);
            })
            .catch((error) => {
                const errorCode = error.code;
                if(errorCode == 'auth/user-not-found') {
                    toast.error('User not found', {theme: 'colored'})
                }
                console.log(errorCode)
                // ..
            });

    }
    // console.log(userEmail);

    return (
        <section className="reset-pwd">
            <ToastContainer />
            <div className="ml-28 py-6 mx-auto">
                <img src="https://brand.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Logo.svg.original.svg" alt="" className='h-[2.2rem]' />
            </div>
            <div className='flex justify-center items-center min-h-[25rem]'>
                <div className=''>
                    <div className="bg-white rounded-md px-5 py-4 min-w-[24rem] max-w-sm mx-auto">
                        <form onSubmit={onResetPwd}>
                            <h1 className='text-2xl mb-1 font-semibold'>Forgot Password?</h1>
                            <p className='text-sm mb-4'>Enter your email below..</p>
                            <label htmlFor="email" className='space-y-1 block mb-5'>
                                {/* <p className='text-gray-500 text-sm'>Email</p> */}
                                <input
                                    type="email"
                                    id='email'
                                    name='email'
                                    placeholder='Email'
                                    onChange={(e) => {
                                        setIsEmailEmpty(false);
                                        setUserEmail(e.target.value);
                                    }}
                                    className={`border ${isEmailEmpty ? 'border-red-600' : 'border-slate-500'} w-full rounded-md py-1 px-2`}
                                />
                                {isEmailEmpty && <p className='text-red-600 text-xs'>Email address is required</p>}
                            </label>
                            <button
                                type='submit'
                                className='mb-3 w-full bg-blue-600 hover:bg-blue-800 rounded-full py-3 text-white font-semibold'
                            >Reset Password</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ResetPassword