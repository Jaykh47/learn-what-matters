'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { TypeAnimation } from 'react-type-animation'; // Import the animation component

export default function HeroSection() {
  const { user, userProfile } = useAuth();

  return (
    <div className="h-screen flex flex-col justify-center items-center text-center -mt-20">
      {user && userProfile ? (
        // --- Logged-in View ---
        // We combine a static h1 with an animated span for the name
        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl">
          Welcome,{' '}
          <TypeAnimation
            key={userProfile.name} // Re-triggers animation on user change
            sequence={[userProfile.name]}
            wrapper="span" // Use a span to keep it inline
            speed={50}
            className="text-orange-500" // Apply the orange color here
            cursor={true}
          />
        </h1>
      ) : (
        // --- Logged-out View ---
        // This remains the same as before
        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl">Welcome to{' '}
        <TypeAnimation
          sequence={['Learn What Matters']}
          wrapper="span"
          speed={50}
          className="text-5xl font-bold tracking-tight text-blue-700 sm:text-7xl"
          cursor={true}
        />
        </h1>
      )}
      
      <p className="mt-6 text-lg leading-8 text-gray-300">
        Your journey to focused learning begins here.
      </p>
      
      <div className="absolute bottom-10 animate-bounce">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
      </div>
    </div>
  );
}