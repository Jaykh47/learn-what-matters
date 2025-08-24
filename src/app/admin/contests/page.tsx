'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../../../lib/firebase';
import { collection, getDocs, query, orderBy, doc, deleteDoc, DocumentData } from 'firebase/firestore';

export default function ManageContestsPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [contests, setContests] = useState<DocumentData[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  // Page protection
  useEffect(() => {
    if (!loading && (!user || userProfile?.role !== 'author')) {
      router.push('/');
    }
  }, [user, userProfile, loading, router]);

  // Fetch all existing contests
  useEffect(() => {
    const fetchContests = async () => {
      try {
        const q = query(collection(db, 'contests'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        setContests(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching contests: ", error);
      } finally {
        setIsFetching(false);
      }
    };
    if (user) {
      fetchContests();
    }
  }, [user]);

  // Function to handle deleting a contest
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this contest?')) {
      try {
        await deleteDoc(doc(db, 'contests', id));
        setContests(contests.filter(contest => contest.id !== id));
      } catch (error) {
        console.error("Error deleting contest: ", error);
        alert("Failed to delete contest. Please try again.");
      }
    }
  };

  if (loading || isFetching) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white p-4 pt-12">
      <div className="w-full max-w-4xl text-center">
        <Link href="/admin" className="text-blue-400 hover:underline mb-8 inline-block">
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold">Manage Contests</h1>
        <p className="mt-2 text-gray-400 mb-8">Create new contests or delete existing ones.</p>

        <Link href="/admin/create-contest" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md transition duration-300 text-lg">
          + Create New Contest
        </Link>

        {/* List of Existing Contests */}
        <div className="mt-12 text-left">
          <h2 className="text-2xl font-semibold mb-4">Existing Contests</h2>
          <div className="space-y-4">
            {contests.length > 0 ? (
              contests.map((contest) => (
                <div key={contest.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                  <p className="font-bold">{contest.title}</p>
                  <button
                    onClick={() => handleDelete(contest.id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-md text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No contests have been created yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}