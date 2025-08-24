'use client';

import { useState, useEffect } from 'react';
import { db } from '../../../../lib/firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp, DocumentData } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const languages: { [key: number]: string } = {
  50: 'C (GCC 9.2.0)',
  54: 'C++ (GCC 9.2.0)',
  62: 'Java (OpenJDK 13.0.1)',
  63: 'JavaScript (Node.js 12.14.0)',
  71: 'Python (3.8.1)',
};

export default function ContestPage({ params }: { params: { contestId: string } }) {
  const { user, loading: authLoading } = useAuth(); 
  const router = useRouter();
  const { contestId } = params;

  const [contest, setContest] = useState<DocumentData | null>(null);
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState('');
  const [submissionDetails, setSubmissionDetails] = useState('');

  useEffect(() => {
    // We only run this effect if auth check is done, we have a user, AND we have a contestId
    if (!authLoading && user && contestId) { // ADDED contestId CHECK HERE
      const fetchContest = async () => {
        try {
          const docRef = doc(db, 'contests', contestId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setContest(docSnap.data());
          } else {
            setContest(null); 
          }
        } catch (error) {
          console.error("Error fetching contest:", error);
          setContest(null);
        }
      };
      fetchContest();
    }
  }, [user, authLoading, contestId]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const runSingleTestCase = async (testCase: { input: string, output: string }) => {
    // This function remains the same
    const options = {
      method: 'POST',
      url: 'https://judge0-ce.p.rapidapi.com/submissions',
      params: { base64_encoded: 'true', fields: '*' },
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
        'X-RapidAPI-Host': process.env.NEXT_PUBLIC_RAPIDAPI_HOST,
      },
      data: {
        language_id: contest?.languageId,
        source_code: btoa(code),
        stdin: btoa(testCase.input),
      },
    };

    const submissionResponse = await axios.request(options);
    const token = submissionResponse.data.token;

    while (true) {
      const resultResponse = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=true&fields=*`, {
        headers: {
          'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
          'X-RapidAPI-Host': process.env.NEXT_PUBLIC_RAPIDAPI_HOST,
        }
      });
      const status = resultResponse.data.status.id;
      if (status > 2) return resultResponse.data;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const handleSubmit = async () => {
    // This function remains the same
    if (!code || !contest) return;

    setSubmitting(true);
    setResult('Running Test Cases...');
    setSubmissionDetails('');

    for (let i = 0; i < contest.testCases.length; i++) {
      setResult(`Running on Test Case #${i + 1}...`);
      const testCase = contest.testCases[i];
      const submissionResult = await runSingleTestCase(testCase);

      if (submissionResult.status.id === 6) {
        setResult('Compilation Error ❌');
        setSubmissionDetails(atob(submissionResult.compile_output || ''));
        setSubmitting(false);
        return;
      }
      
      const actualOutput = submissionResult.stdout ? atob(submissionResult.stdout).trim() : "";
      if (actualOutput !== testCase.output.trim()) {
        setResult(`Wrong Answer on Test Case #${i + 1} ❌`);
        const details = `Input:\n${testCase.input}\n\nExpected Output:\n${testCase.output}\n\nYour Output:\n${actualOutput || '(No output)'}`;
        setSubmissionDetails(details);
        setSubmitting(false);
        return;
      }
    }
    
    setResult('All Test Cases Passed! ✅');
    setSubmissionDetails('Congratulations! Your solution is correct.');

    try {
      await addDoc(collection(db, 'submissions'), {
        contestId: contestId,
        userId: user?.uid,
        userEmail: user?.email,
        languageId: contest.languageId,
        code: code,
        submittedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Failed to save submission:", error);
    }
    
    setSubmitting(false);
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }
  
  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Redirecting to login...</div>;
  }

  // The rendering logic remains the same
  if (!contest) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Contest not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h1 className="text-3xl font-bold mb-2">{contest.title}</h1>
          <p className="text-sm text-blue-400 mb-4">Language: {languages[contest.languageId] || 'Unknown'}</p>
          <div className="prose prose-invert max-w-none"><p>{contest.problemStatement}</p></div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg flex flex-col">
          <h2 className="text-2xl font-bold mb-4">Your Solution</h2>
          <textarea value={code} onChange={(e) => setCode(e.target.value)} className="w-full flex-grow bg-gray-900 rounded-md p-4 font-mono text-sm" placeholder="Write your code here..." />
          <button onClick={handleSubmit} disabled={submitting} className="mt-4 bg-green-600 hover:bg-green-700 font-bold py-2 px-4 rounded-md disabled:bg-gray-500">
            {submitting ? 'Running...' : 'Submit Code'}
          </button>
          
          {result && (
            <div className="mt-4 p-4 rounded-md bg-gray-700">
              <p className="font-mono text-center font-bold text-lg mb-4">{result}</p>
              {submissionDetails && <pre className="bg-black text-white p-2 rounded-md text-xs whitespace-pre-wrap">{submissionDetails}</pre>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}