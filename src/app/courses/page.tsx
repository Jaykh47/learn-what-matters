'use client';

import { useState, useEffect } from 'react';
import { db } from '../../../lib/firebase';
import { collection, getDocs, query, orderBy, DocumentData } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CourseCard = ({ course }: { course: DocumentData }) => (
  <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col justify-between">
    <div>
      <h2 className="text-xl font-bold font-heading">{course.title}</h2>
      <p className="text-gray-400 mt-2 text-sm">{course.description}</p>
    </div>
    <a 
      href={course.googleFormLink} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="mt-6 inline-block w-full text-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
    >
      Enroll Now
    </a>
  </div>
);

const SkeletonCard = () => (
    <div className="bg-gray-800 rounded-lg p-6">
        <Skeleton height={28} width="80%" />
        <Skeleton count={2} className="mt-2" />
        <Skeleton height={40} className="mt-6" />
    </div>
);

export default function CoursesPage() {
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<DocumentData[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      const fetchCourses = async () => {
        try {
          const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
          const querySnapshot = await getDocs(q);
          setCourses(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } finally {
          setIsFetching(false);
        }
      };
      fetchCourses();
    } else if (!authLoading && !user) {
      // If user is not logged in, no need to fetch, just stop loading.
      // A redirect could be added here if this page should be protected.
      setIsFetching(false);
    }
  }, [user, authLoading]);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center font-heading">Our Courses</h1>
      
      {(authLoading || isFetching) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map(course => <CourseCard key={course.id} course={course} />)}
        </div>
      ) : (
        <p className="text-center text-gray-400">No courses are available yet.</p>
      )}
    </div>
  );
}