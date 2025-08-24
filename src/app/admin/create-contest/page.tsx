'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const languages = [
  { id: 50, name: 'C (GCC 9.2.0)' },
  { id: 54, name: 'C++ (GCC 9.2.0)' },
  { id: 62, name: 'Java (OpenJDK 13.0.1)' },
  { id: 63, name: 'JavaScript (Node.js 12.14.0)' },
  { id: 71, name: 'Python (3.8.1)' },
];

export default function CreateContestPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [testCases, setTestCases] = useState('');
  const [languageId, setLanguageId] = useState(languages[0].id);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading && (!user || userProfile?.role !== 'author')) {
      router.push('/');
    }
  }, [user, userProfile, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('Creating contest...');

    try {
      await addDoc(collection(db, 'contests'), {
        title,
        problemStatement,
        languageId,
        testCases: JSON.parse(testCases),
        createdAt: serverTimestamp(),
        authorId: user?.uid,
      });
      setMessage('Contest created successfully!');
      setTitle('');
      setProblemStatement('');
      setTestCases('');
    } catch (error) {
      setMessage('Failed to create contest. Please check if your Test Cases are valid JSON.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !userProfile || userProfile.role !== 'author') {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white p-4 pt-12">
        <div className="w-full max-w-2xl text-center">
            <Link href="/admin/contests" className="text-blue-400 hover:underline mb-8 inline-block">
                &larr; Back to Contest Management
            </Link>
            <h1 className="text-4xl font-bold">Create a New Coding Contest</h1>
        </div>
      
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl mt-8">
        <div className="mb-4">
          <label className="block text-gray-400 mb-2" htmlFor="title">Contest Title*</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 py-2 bg-gray-700 rounded-md" />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-400 mb-2" htmlFor="language">Language*</label>
          <select id="language" value={languageId} onChange={(e) => setLanguageId(Number(e.target.value))} className="w-full px-3 py-2 bg-gray-700 rounded-md">
            {languages.map(lang => <option key={lang.id} value={lang.id}>{lang.name}</option>)}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-400 mb-2" htmlFor="problem">Problem Statement*</label>
          <textarea id="problem" value={problemStatement} onChange={(e) => setProblemStatement(e.target.value)} rows={8} required className="w-full px-3 py-2 bg-gray-700 rounded-md" />
        </div>
        <div className="mb-6">
          <label className="block text-gray-400 mb-2" htmlFor="test-cases">Test Cases (JSON format)*</label>
          <textarea
            id="test-cases"
            value={testCases}
            onChange={(e) => setTestCases(e.target.value)}
            rows={8}
            required
            className="w-full px-3 py-2 bg-gray-700 rounded-md font-mono"
            placeholder={'[\n  {"input": "5", "output": "10"},\n  {"input": "-5", "output": "-10"}\n]'}
          />
          <p className="text-xs text-gray-500 mt-1">Provide an array of objects, each with an "input" and "output" key.</p>
        </div>
        <button type="submit" disabled={submitting} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-500">
          {submitting ? 'Creating...' : 'Create Contest'}
        </button>
        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </form>
    </div>
  );
}