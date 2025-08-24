'use client';

import { useState, useEffect } from 'react';
import { db } from '../../../lib/firebase';
import { collection, getDocs, query, orderBy, DocumentData } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ContentCard = ({ item }: { item: DocumentData }) => (
  <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col justify-between transform hover:-translate-y-1 transition-transform duration-300">
    <div>
      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
      <p className="text-gray-400 mb-4">{item.description}</p>
    </div>
    <a href={item.driveLink} target="_blank" rel="noopener noreferrer" className={`mt-4 inline-block text-white text-center font-bold py-2 px-4 rounded-md transition duration-300 ${item.category === 'Note' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
      {item.category === 'Note' ? 'View Notes' : 'Watch Session'}
    </a>
  </div>
);

const SkeletonCard = () => (
  <div className="bg-gray-800 rounded-lg p-6">
    <Skeleton height={28} width="80%" />
    <Skeleton count={2} className="mt-2" />
    <Skeleton height={40} className="mt-4" />
  </div>
);

export default function ContentPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [allContent, setAllContent] = useState<DocumentData[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    if (!authLoading && user) {
      const fetchContent = async () => {
        try {
          const q = query(collection(db, 'content'), orderBy('createdAt', 'desc'));
          const querySnapshot = await getDocs(q);
          setAllContent(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } finally {
          setIsFetching(false);
        }
      };
      fetchContent();
    }
  }, [user, authLoading, router]);

  const recordedSessions = allContent.filter(item => item.category === 'Recorded Session');
  const notes = allContent.filter(item => item.category === 'Note');

  if (authLoading || isFetching) {
    return (
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-12 text-center"><Skeleton width={300} /></h1>
          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6"><Skeleton width={250} /></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SkeletonCard /><SkeletonCard /><SkeletonCard />
            </div>
          </section>
          <section>
            <h2 className="text-3xl font-semibold mb-6"><Skeleton width={150} /></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SkeletonCard /><SkeletonCard /><SkeletonCard />
            </div>
          </section>
        </div>
      </SkeletonTheme>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-12 text-center">Course Content</h1>
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 border-b-2 border-blue-500 pb-2">Recorded Sessions</h2>
        {recordedSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recordedSessions.map((item) => <ContentCard key={item.id} item={item} />)}
          </div>
        ) : <p className="text-gray-400">No recorded sessions have been added yet.</p>}
      </section>
      <section>
        <h2 className="text-3xl font-semibold mb-6 border-b-2 border-purple-500 pb-2">Notes</h2>
        {notes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((item) => <ContentCard key={item.id} item={item} />)}
          </div>
        ) : <p className="text-gray-400">No notes have been added yet.</p>}
      </section>
    </div>
  );
}