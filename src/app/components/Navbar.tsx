'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { auth } from '../../../lib/firebase';
import { signOut } from 'firebase/auth';
import { FaBars, FaTimes } from 'react-icons/fa'; // Icons for the menu button

export default function Navbar() {
  const { user, userProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false); // State to manage mobile menu visibility

  const handleLogout = async () => {
    await signOut(auth);
    setIsOpen(false); // Close menu on logout
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand Logo and Name */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-10 h-10">
            <Image
              src="/logo.png"
              alt="Learn What Matters Logo"
              width={40}
              height={40}
            />
          </div>
          {/* Text is hidden on small screens, visible from 'sm' breakpoint up */}
          <span className="hidden sm:block text-xl font-bold text-blue-400 hover:text-blue-300 transition-colors">
            Learn What Matters
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
          {user && <Link href="/courses" className="hover:text-gray-300 transition-colors">Courses</Link>}
          {user && <Link href="/content" className="hover:text-gray-300 transition-colors">Materials</Link>}
          {user && <Link href="/contests" className="hover:text-gray-300 transition-colors">Contests</Link>}
          <Link href="/contact" className="hover:text-gray-300 transition-colors">Get in Touch</Link>
          {userProfile?.role === 'author' && <Link href="/admin" className="hover:text-gray-300 transition-colors">Admin</Link>}
          
          <span className="text-sm text-gray-500">|</span>

          {user ? (
            <>
              <span className="text-sm text-gray-400 hidden lg:inline">Welcome, {userProfile?.name || user.email}</span>
              <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-semibold transition-colors">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md text-sm font-semibold transition-colors">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button (Hamburger Icon) */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden mt-4 bg-gray-700 rounded-lg p-4">
          <div className="flex flex-col space-y-4 text-center">
            <Link href="/" onClick={closeMenu} className="hover:text-gray-300">Home</Link>
            {user && <Link href="/courses" onClick={closeMenu} className="hover:text-gray-300">Courses</Link>}
            {user && <Link href="/content" onClick={closeMenu} className="hover:text-gray-300">Materials</Link>}
            {user && <Link href="/contests" onClick={closeMenu} className="hover:text-gray-300">Contests</Link>}
            <Link href="/contact" onClick={closeMenu} className="hover:text-gray-300">Get in Touch</Link>
            {userProfile?.role === 'author' && <Link href="/admin" onClick={closeMenu} className="hover:text-gray-300">Admin</Link>}
            
            <hr className="border-gray-600"/>

            {user ? (
              <>
                <span className="text-sm text-gray-400">Welcome, {userProfile?.name || user.email}</span>
                <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 w-full py-2 rounded-md text-sm font-semibold">
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" onClick={closeMenu} className="bg-blue-600 hover:bg-blue-500 w-full py-2 rounded-md text-sm font-semibold">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}