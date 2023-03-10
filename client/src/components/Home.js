import React, { useEffect, useState } from 'react'
import Header from './partials/Header';
import Feed from './partials/Feed';
import Sidebar from './partials/Sidebar';
import Widgets from './partials/Widgets';

function Home() {

    return (
        <>
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