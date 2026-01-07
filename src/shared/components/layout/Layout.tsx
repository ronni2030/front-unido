import React from 'react';
import { Navbar } from './Navbar';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-app-dark text-white max-w-[412px] mx-auto relative pb-24 shadow-2xl border-x border-white/5 ring-1 ring-black/5 overflow-hidden">
      <main className="flex-1 w-full relative h-full">
        {children}
      </main>
      <Navbar />
    </div>
  );
};

