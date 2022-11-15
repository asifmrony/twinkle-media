import React from 'react';
import Feed from './components/Feed';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Widgets from './components/Widgets';

function App() {
  return (
    <div className="App bg-[#F3F2EF] h-screen">
      {/* Header */}
      <Header />

      {/* Main Section */}
      <main className='container'>
        <section className='grid grid-cols-12 gap-x-4'>
          {/* sidebar */}
          <Sidebar />
          {/* Feed */}
          <Feed />
          {/* Widgets */}
          <Widgets />
        </section>
      </main>
    </div>
  );
}

export default App;
