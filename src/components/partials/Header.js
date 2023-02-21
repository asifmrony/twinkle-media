import React, { useState } from 'react';
import { BsLinkedin, BsBriefcaseFill } from 'react-icons/bs';
import { BiSearchAlt2, BiChevronDown } from 'react-icons/bi';
import { FaHome } from 'react-icons/fa';
import { IoIosNotifications, IoIosPeople } from 'react-icons/io';
import { RiMessage2Fill } from 'react-icons/ri';
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react';
import HeaderOptions from './HeaderOptions';
import { logout, selectUser } from '../../features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../../Firebase';
import { signOut } from 'firebase/auth';


const Header = () => {
    const [isMenuActive, setIsMenuActive] = useState('Home');
    const dispatch = useDispatch();
    const user = useSelector(selectUser);

    const navLinks = [
        { label: 'Home', icon: FaHome, href: '/' },
        { label: 'My Network', icon: IoIosPeople, href: 'network' },
        { label: 'Messaging', icon: RiMessage2Fill, href: 'chat' },
    ]

    const profileDropdownLinks = [
        { href: '/settings-privacy', label: 'Settings & Privacy' },
        { href: '/help', label: 'Help' },
        { href: '/language', label: 'Language' },
    ]

    const notifications = [
        {
            id: 1,
            poster_image: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
            poster_name: 'Khalek Rari',
            interaction: 'liked',
            post_type: 'post',
            post_link: '#'
        },
        {
            id: 2,
            poster_image: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
            poster_name: 'Sattar Khan',
            interaction: 'commented',
            post_type: 'photo',
            post_link: '#'
        }
    ]

    const logoutHandle = (e) => {
        e.preventDefault();
        console.log("Entered");
        dispatch(logout());
        signOut(auth);
    }

    return (
        <>
            {/* Main Header Component */}
            <header className='header bg-white sticky top-0 z-50'>
                <div className="container flex justify-between items-center">
                    <div className="header__left flex gap-x-2 items-center">
                        <a href="/" className='block'>
                            <BsLinkedin className='h-[34px] w-[34px] bg-white text-blue-700' />
                        </a>
                        <div className="header__search relative">
                            <BiSearchAlt2 className='absolute top-2.5 left-2.5' />
                            <input
                                type="text"
                                name="hsearch"
                                id="hsearch"
                                className=' bg-[#EEF3F8] rounded-md pl-8 pr-2 py-[0.4rem] w-[280px]'
                                placeholder='Search'
                            />
                        </div>
                    </div>
                    <div className="header__right">
                        <ul className="flex items-center">
                            {/* <li className='nav__link'>
                                <a href="#" className='flex flex-col items-center px-3 py-1'>
                                    <FaHome className='h-6 w-6' />
                                    <span className=''>Home</span>
                                </a>
                            </li> */}
                            {navLinks.map(link => (
                                <HeaderOptions
                                    key={link.label}
                                    isMenuActive={isMenuActive}
                                    setIsMenuActive={setIsMenuActive}
                                    Icon={link.icon}
                                    label={link.label}
                                    href={link.href}
                                />
                            ))}
                            <li className='nav__link'>
                                <Menu as="div" className="relative inline-block text-left">
                                    <div>
                                        <Menu.Button className='flex flex-col items-center py-1'>
                                            <div className='flex flex-col items-center px-3 py-[0.45rem]'>
                                                <IoIosNotifications className='h-5 w-5' />
                                                <span className=''>Notifications</span>
                                            </div>
                                        </Menu.Button>
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute -right-9 mt-2 w-[350px] h-[100px] overflow-y-auto origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <div className="px-1 py-1">
                                                {notifications.map(noti => (
                                                    <Menu.Item key={noti.id}>
                                                        {({ active }) => (
                                                            <a href={noti.post_link}
                                                                className={`${active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                                                    } group flex w-full items-center rounded-md px-2 py-1 text-sm`}
                                                            >
                                                                <div className="flex gap-x-2 items-center">
                                                                    <img src={noti.poster_image} alt="" className='h-[2.5rem] w-[2.5rem] rounded-full object-contain' />
                                                                    <h2><span className='font-semibold mr-1'>{noti.poster_name}</span>{noti.interaction} on your {noti.post_type} ohter things does also</h2>
                                                                </div>
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                                ))}
                                            </div>

                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </li>
                            <li className='nav__link'>
                                <Menu as="div" className="relative inline-block text-left">
                                    <div>
                                        <Menu.Button className='flex flex-col items-center px-3 py-1'>
                                            <img src={user?.photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} alt="" className='h-6 w-6 object-contain rounded-full' />
                                            <div className='flex items-center'>
                                                <span className=''>Me</span>
                                                <BiChevronDown className='h-5 w-5' />
                                            </div>
                                        </Menu.Button>
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 mt-2 w-[288px] origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <div className="px-1 py-1 ">
                                                <a href="#">
                                                    <div className="flex items-center gap-x-2">
                                                        <div>
                                                            <img src={user?.photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} alt="" className='h-[3.5rem] w-[3.5rem] rounded-full object-contain' />
                                                        </div>
                                                        <div>
                                                            <h2 className='font-semibold'>{user?.displayName}</h2>
                                                            <p className='text-[14px]'>Merchandiser at Richcotton Ltd.</p>
                                                        </div>
                                                    </div>
                                                </a>
                                                <a href="#" className='text-sm mt-1 block py-[0.2rem] text-center w-full rounded-full text-violet-900 border border-violet-500 font-medium'>View Profile</a>
                                            </div>
                                            <div className="px-1 py-1">
                                                <h2 className='font-semibold px-2 pb-1 text-black'>Account</h2>
                                                {profileDropdownLinks.map(link => (
                                                    <Menu.Item key={link.label}>
                                                        {({ active }) => (
                                                            <a href={link.href}
                                                                className={`${active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                                                    } group flex w-full items-center rounded-md px-2 py-1 text-sm`}
                                                            >
                                                                {link.label}
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                                ))}
                                            </div>
                                            <div className="px-1 py-1">
                                                <h2 className='font-semibold px-2 pb-1 text-black'>Manage</h2>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <a href='#'
                                                            className={`${active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                                                } group flex w-full items-center rounded-md px-2 py-1 text-sm`}
                                                        >
                                                            Posts & Activity
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                            </div>
                                            <div className="px-1 py-1">
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button
                                                            onClick={logoutHandle}
                                                            className={`${active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                                                } group flex w-full items-center rounded-md px-2 py-1 text-sm`}
                                                        >
                                                            Sign Out
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            </div>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header;