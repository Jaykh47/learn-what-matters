'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import UploadForm from '../../components/UploadForm';
import AdminContentList from '../../components/AdminContentList';

export default function ManageContentPage() {
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
      <div className="w-full max-w-4xl text-center">
        <Link href="/admin" className="text-blue-400 hover:underline mb-8 inline-block">
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold">Manage Notes & Videos</h1>
        <p className="mt-2 text-gray-400">Add new content or delete existing entries.</p>
      </div>
      
      <UploadForm />
      <AdminContentList />
    </div>
  );
}