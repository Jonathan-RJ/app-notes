// components/SkeletonNote.tsx
import React from 'react';

const SkeletonNote: React.FC = () => {
  return (
    <div className="w-2/4 mx-auto bg-gray-200 rounded-lg shadow-md animate-pulse">
      <div className="w-2/4 h-6 mb-4 bg-gray-300 rounded"></div>
      <div className="w-2/4 h-4 bg-gray-300 rounded"></div>
    </div>
  );
};

export default SkeletonNote;
