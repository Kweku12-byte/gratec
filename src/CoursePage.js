// This is the new, protected page for your course content.

import React from 'react';
import { BookOpen, Film } from 'lucide-react';

const CoursePage = ({ user }) => {
  // IMPORTANT: Replace these with your actual Unlisted YouTube video embed links
  const foundationCourseUrl = "https://youtu.be/eBGC9kcRyKU?si=G9C6aXg7tyvm-0KO"; // Example placeholder
  const proToolkitCourseUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ"; // Example placeholder

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tighter">Welcome, {user.email}!</h1>
        <p className="mt-2 text-lg text-gray-600">You're in. Let's start building your future.</p>
        
        <div className="mt-12 space-y-12">
          {/* Video 1: The Foundation */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-8 h-8 text-yellow-500"/>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">Part 1: The Foundation (8 Hours)</h2>
            </div>
            <div className="aspect-video bg-black rounded-2xl shadow-lg overflow-hidden">
              <iframe
                className="w-full h-full"
                src={foundationCourseUrl}
                title="GRATEC - The Foundation Course"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Video 2: The Pro Toolkit */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Film className="w-8 h-8 text-yellow-500"/>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">Part 2: The Pro Toolkit (2 Hours)</h2>
            </div>
            <div className="aspect-video bg-black rounded-2xl shadow-lg overflow-hidden">
              <iframe
                className="w-full h-full"
                src={proToolkitCourseUrl}
                title="GRATEC - The Pro Toolkit Course"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
