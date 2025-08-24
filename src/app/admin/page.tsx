'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboardPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  // Page protection logic
  useEffect(() => {
    if (!loading && (!user || userProfile?.role !== 'author')) {
      router.push('/');
    }
  }, [user, userProfile, loading, router]);

  if (loading || !userProfile || userProfile?.role !== 'author') {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white p-4 pt-12">
      <div className="text-center w-full max-w-4xl">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-gray-400 mb-12">Welcome, {userProfile.name || user?.email}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Option 1: Manage Courses */}
          <Link href="/admin/courses" className="bg-gray-800 p-8 rounded-lg hover:bg-gray-700 transition-colors flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-yellow-400">Manage Courses</h2>
            <p className="mt-2 text-gray-400">Add or remove course categories.</p>
          </Link>
          {/* Option 2: Manage Content */}
          <Link href="/admin/content" className="bg-gray-800 p-8 rounded-lg hover:bg-gray-700 transition-colors flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-blue-400">Manage Notes & Videos</h2>
            <p className="mt-2 text-gray-400">Upload, view, and delete educational content.</p>
          </Link>

          {/* Option 3: Manage Contests */}
          <Link href="/admin/contests" className="bg-gray-800 p-8 rounded-lg hover:bg-gray-700 transition-colors flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-green-400">Manage Contests</h2>
            <p className="mt-2 text-gray-400">Create new coding contests and view submissions.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}