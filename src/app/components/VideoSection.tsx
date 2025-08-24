'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function VideoSection() {
  const { user } = useAuth();

  return (
    <div className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center">
        
        {/* Video Player in a Frame */}
        <div className="w-full max-w-4xl mx-auto mb-16">
          <div className="aspect-video overflow-hidden rounded-xl shadow-2xl border border-gray-700">
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/hero-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        
        {/* Text and Button Content Below the Video */}
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Start Your Journey
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl">
            Access high-quality notes, recorded sessions, and challenge yourself with our coding contests.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {user ? (
              <Link
                href="/content"
                className="rounded-md bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-lg hover:bg-blue-500 transition-colors"
              >
                Go to Your Content
              </Link>
            ) : (
              <Link
                href="/signup"
                className="rounded-md bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-lg hover:bg-blue-500 transition-colors"
              >
                Start Learning for Free
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}