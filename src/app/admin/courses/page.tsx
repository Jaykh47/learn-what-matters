'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../../../lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, doc, deleteDoc, serverTimestamp, DocumentData } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function ManageCoursesPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  
  // Form State - Changed to use googleFormLink instead of thumbnail
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [googleFormLink, setGoogleFormLink] = useState('');

  // Display State
  const [courses, setCourses] = useState<DocumentData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Page Protection
  useEffect(() => {
    if (!loading && (!user || userProfile?.role !== 'author')) {
      router.push('/');
    }
  }, [user, userProfile, loading, router]);

  // Fetch Courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        setCourses(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } finally {
        setIsFetching(false);
      }
    };
    if (user) {
      fetchCourses();
    }
  }, [user]);

  // Add a new course - Simplified to remove image upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !googleFormLink) {
      return toast.error('Title and Google Form link are required.');
    }
    setIsSubmitting(true);
    const toastId = toast.loading('Creating course...');

    try {
      // Save course details to Firestore
      const newCourseRef = await addDoc(collection(db, 'courses'), {
        title,
        description,
        googleFormLink, // Save the form link
        createdAt: serverTimestamp(),
      });
      
      setCourses([{ id: newCourseRef.id, title, description, googleFormLink }, ...courses]);
      setTitle('');
      setDescription('');
      setGoogleFormLink('');
      
      toast.success('Course created successfully!', { id: toastId });
    } catch (error) {
      toast.error('Failed to create course.', { id: toastId });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a course
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteDoc(doc(db, 'courses', id));
        setCourses(courses.filter(course => course.id !== id));
        toast.success('Course deleted.');
      } catch (error) {
        toast.error('Failed to delete course.');
      }
    }
  };

  if (loading || isFetching) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white p-4 pt-12">
      <div className="w-full max-w-4xl">
        <Link href="/admin" className="text-blue-400 hover:underline mb-8 inline-block">&larr; Back to Dashboard</Link>
        <div className="text-center">
            <h1 className="text-4xl font-bold font-heading">Manage Courses</h1>
            <p className="mt-2 text-gray-400">Add, view, or remove courses from the platform.</p>
        </div>
        
        {/* Add Course Form - Updated */}
        <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg w-full mt-8">
            <h2 className="text-2xl font-bold mb-6 font-heading">Add New Course</h2>
            <div className="space-y-4">
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Course Title*" required className="w-full px-3 py-2 bg-gray-700 rounded-md" />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Course Description" rows={3} className="w-full px-3 py-2 bg-gray-700 rounded-md" />
                <input type="url" value={googleFormLink} onChange={(e) => setGoogleFormLink(e.target.value)} placeholder="Google Form Enrollment Link*" required className="w-full px-3 py-2 bg-gray-700 rounded-md" />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded-md disabled:bg-gray-500">{isSubmitting ? 'Creating...' : 'Create Course'}</button>
        </form>

        {/* Existing Courses List - Updated */}
        <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6 text-center font-heading">Existing Courses</h2>
            <div className="space-y-4">
                {courses.length > 0 ? courses.map(course => (
                    <div key={course.id} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
                        <div>
                            <h3 className="font-bold">{course.title}</h3>
                            <p className="text-sm text-gray-400">{course.googleFormLink.substring(0, 50)}...</p>
                        </div>
                        <button onClick={() => handleDelete(course.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-md text-sm">Delete</button>
                    </div>
                )) : <p className="text-gray-500 text-center">No courses have been added yet.</p>}
            </div>
        </div>
      </div>
    </div>
  );
}