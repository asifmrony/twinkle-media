import React from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

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
          {/* Widgets */}
        </section>
      </main>
    </div>
  );
}

export default App;
