import React, { useState } from 'react';
import { BsLinkedin, BsBriefcaseFill } from 'react-icons/bs';
import { BiSearchAlt2, BiChevronDown } from 'react-icons/bi';
import { FaHome } from 'react-icons/fa';
import { IoIosNotifications, IoIosPeople } from 'react-icons/io';
import { RiMessage2Fill } from 'react-icons/ri';
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react';
import HeaderOptions from './HeaderOptions';

const Header = () => {
    const [isMenuActive, setIsMenuActive] = useState('Home')

    const navLinks = [
        {label: 'Home', icon: FaHome},
        {label: 'My Network', icon: IoIosPeople},
        {label: 'Jobs', icon: BsBriefcaseFill},
        {label: 'Messaging', icon: RiMessage2Fill},
        {label: 'Notifications', icon: IoIosNotifications},
    ]

    const profileDropdownLinks = [
        {href:'/settings-privacy', label: 'Settings & Privacy'},
        {href:'/help', label: 'Help'},
        {href:'/language', label: 'Language'},
    ]

    return (
        <>
            {/* Main Header Component */}
            <header className='header bg-white sticky top-0 z-50'>
                <div className="container flex justify-between items-center">
                    <div className="header__left flex gap-x-2 items-center">
                        <a href="#" className='block'>
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
                                    isMenuActive={isMenuActive} 
                                    setIsMenuActive={setIsMenuActive}
                                    Icon={link.icon}
                                    label={link.label}
                                />
                            ))}
                            <li className='nav__link'>
                                <Menu as="div" className="relative inline-block text-left">
                                    <div>
                                        <Menu.Button className='flex flex-col items-center px-3 py-1'>
                                            <img src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50" alt="" className='h-6 w-6 object-contain rounded-full' />
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
                                                            <img src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50" alt="" className='h-[3.5rem] w-[3.5rem] rounded-full object-contain' />
                                                        </div>
                                                        <div>
                                                            <h2 className='font-semibold'>Ashik Mahmud Rasel</h2>
                                                            <p className='text-[14px]'>Merchandiser at Richcotton Ltd.</p>
                                                        </div>
                                                    </div>
                                                </a>
                                                <a href="#" className='text-sm mt-1 block py-[0.2rem] text-center w-full rounded-full text-violet-900 border border-violet-500 font-medium'>View Profile</a>
                                            </div>
                                            <div className="px-1 py-1">
                                                <h2 className='font-semibold px-2 pb-1 text-black'>Account</h2>
                                                {profileDropdownLinks.map(link => (
                                                    <Menu.Item>
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
                                                        <a href='#'
                                                            className={`${active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                                                } group flex w-full items-center rounded-md px-2 py-1 text-sm`}
                                                        >
                                                            Sign Out
                                                        </a>
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