'use client';

import React from 'react';
import JobCard from './JobCard';

type Job = {
  id: number;
  companyLogo: string;
  jobTitle: string;
  companyName: string;
  skills: string[];
  description: string;
};

type SwipePageProps = {
  jobs: Job[];
  activePage: string;
  handleSwipe: (direction: 'left' | 'right') => void;
};

const SwipePage: React.FC<SwipePageProps> = ({ jobs, activePage, handleSwipe }) => {
  return (
    <div id="swipe-page" className={`page flex-col ${activePage === 'swipe-page' ? 'flex' : 'hidden'}`}>
      <div className="p-4 text-center flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-800">Encontre sua Vaga</h1>
      </div>
      <div className="relative flex-grow w-full max-w-sm mx-auto p-4 flex items-center justify-center">
        {jobs.length > 0 ? (
          jobs.map((job, index) => (
            <JobCard
              key={job.id}
              job={job}
              style={{
                zIndex: jobs.length - index,
                transform: `scale(${1 - (index * 0.04)}) translateY(${index * -16}px)`,
                transition: 'transform 0.3s ease-out',
              }}
              onSwipe={(direction) => handleSwipe(direction === 1 ? 'right' : 'left')}
            />
          )).reverse()
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-center p-8 text-gray-500">
            <p className="text-lg">Você viu todas as vagas por enquanto!</p>
          </div>
        )}
      </div>
      <div className={`flex items-center justify-evenly p-4 flex-shrink-0 ${jobs.length === 0 ? 'hidden' : ''}`}>
        <button onClick={() => handleSwipe('left')} className="p-4 bg-white rounded-full shadow-xl hover:bg-red-100 transition-all duration-200 transform hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <button onClick={() => handleSwipe('right')} className="p-6 bg-white rounded-full shadow-xl hover:bg-green-100 transition-all duration-200 transform hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
        </button>
      </div>
    </div>
  );
};

export default SwipePage;
