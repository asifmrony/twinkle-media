import React, { useEffect, useState } from 'react'
import Header from './partials/Header';
import Feed from './partials/Feed';
import Sidebar from './partials/Sidebar';
import Widgets from './partials/Widgets';
import { SocketContextProvider } from '../contexts/socketContext';
import { useSelector } from 'react-redux';
import { selectSocket, selectUser } from '../features/userSlice';

function Home() {
    const currentUser = useSelector(selectUser);
    const socket = useSelector(selectSocket);

    useEffect(() => {
        socket?.emit("newUser", currentUser.displayName)
    }, [socket, currentUser.displayName])

    return (
        <>
            {/* Header */}
            <Header />

            {/* Main Section */}
            <main className='container'>
                <section className='grid grid-cols-12 gap-x-4 mt-5'>
                    {/* sidebar */}
                    <Sidebar />
                    {/* Feed */}
                    <Feed />
                    {/* Widgets */}
                    <Widgets />
                </section>
            </main>
        </>
    )
}

export default Home