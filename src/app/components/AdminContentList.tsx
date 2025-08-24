'use client';

import { useState, useEffect } from 'react';
import { db } from '../../../lib/firebase';
import { collection, getDocs, query, orderBy, doc, deleteDoc, DocumentData } from 'firebase/firestore';
import toast from 'react-hot-toast';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function AdminContentList() {
  const [content, setContent] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const q = query(collection(db, 'content'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        setContent(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        toast.error('Failed to fetch content.');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const toastId = toast.loading('Deleting item...');
      try {
        await deleteDoc(doc(db, 'content', id));
        setContent(content.filter(item => item.id !== id));
        toast.success('Item deleted successfully!', { id: toastId });
      } catch (error) {
        toast.error('Failed to delete item.', { id: toastId });
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mt-12">
      <h2 className="text-3xl font-bold mb-6 text-center font-heading">Manage Existing Content</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div className="space-y-4">
        {loading ? (
          <SkeletonTheme baseColor="#202020" highlightColor="#444">
            <Skeleton count={3} height={72} className="mb-4" />
          </SkeletonTheme>
        ) : content.length > 0 ? (
          content.map((item) => (
            <div key={item.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-bold text-lg">{item.title}</p>
                <p className="text-sm text-gray-400">{item.category}</p>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No content has been added yet.</p>
        )}
      </div>
    </div>
  );
}