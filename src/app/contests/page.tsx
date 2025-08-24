'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '../../../lib/firebase';
import { collection, getDocs, query, orderBy, DocumentData } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ContestsListPage() {
  // Use user and the top-level loading state from useAuth
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [contests, setContests] = useState<DocumentData[]>([]);

  // Page protection
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // CORRECTED useEffect for fetching data
  useEffect(() => {
    // We only run this effect if the initial auth check is done AND we have a user
    if (!authLoading && user) {
      const fetchContests = async () => {
        try {
          const q = query(collection(db, 'contests'), orderBy('createdAt', 'desc'));
          const querySnapshot = await getDocs(q);
          setContests(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
          console.error("Error fetching contests: ", error);
        }
      };
      fetchContests();
    }
  }, [user, authLoading]); // Effect depends on the auth state

  // CORRECTED rendering logic
  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }
  
  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Redirecting to login...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Coding Contests</h1>
        <div className="space-y-4">
          {contests.length > 0 ? (
            contests.map((contest) => (
              <Link
                key={contest.id}
                href={`/contests/${contest.id}`}
                className="block bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <h2 className="text-2xl font-bold text-blue-400">{contest.title}</h2>
                <p className="text-gray-400 mt-2 line-clamp-2">{contest.problemStatement}</p>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-400">No contests are available at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}