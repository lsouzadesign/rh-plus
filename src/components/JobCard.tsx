// No topo do arquivo, informa ao Next.js que este é um componente interativo do lado do cliente
'use client';

import React from 'react';

type Job = {
  id: number;
  companyLogo: string;
  jobTitle: string;
  companyName: string;
  skills: string[];
  description: string;
};

type JobCardProps = {
  job: Job;
  style?: React.CSSProperties;
};

const JobCard: React.FC<JobCardProps> = ({ job, style }) => {
  return (
    <div
      className="swipe-card absolute w-[90%] h-[85%] rounded-2xl overflow-hidden shadow-lg flex flex-col"
      style={style}
    >
      <div className="relative h-3/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={job.companyLogo} alt={job.companyName} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6">
          <h2 className="text-3xl font-bold text-white leading-tight">{job.jobTitle}</h2>
          <p className="text-lg text-gray-200">{job.companyName}</p>
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-gray-800 mb-2 text-md">Competências:</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {job.skills.map(skill => (
              <span key={skill} className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{job.description}</p>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
