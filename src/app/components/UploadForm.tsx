'use client';

import { useState } from 'react';
import { db } from '../../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function UploadForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const [category, setCategory] = useState('Note');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveLink || !title || !category) {
      toast.error('Please provide a title, category, and a link.');
      return;
    }
    setSubmitting(true);
    const toastId = toast.loading('Saving content...');

    try {
      await addDoc(collection(db, 'content'), {
        title,
        description,
        driveLink,
        category,
        createdAt: serverTimestamp(),
      });

      toast.success('Content saved successfully!', { id: toastId });
      setTitle('');
      setDescription('');
      setDriveLink('');
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content.', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center font-heading">Add New Notes or Videos</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-400 mb-2" htmlFor="title">Title*</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 py-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-400 mb-2" htmlFor="category">Category*</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="Note">Note</option>
            <option value="Recorded Session">Recorded Session</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-400 mb-2" htmlFor="description">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-400 mb-2" htmlFor="drive-link">Google Drive Link*</label>
          <input type="url" id="drive-link" value={driveLink} onChange={(e) => setDriveLink(e.target.value)} placeholder="https://drive.google.com/..." required className="w-full px-3 py-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>
        
        <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-500 transition-colors">
          {submitting ? 'Saving...' : 'Save Content'}
        </button>
      </form>
    </div>
  );
}