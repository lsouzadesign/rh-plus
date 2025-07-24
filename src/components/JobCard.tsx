// No topo do arquivo, informa ao Next.js que este é um componente interativo do lado do cliente
'use client';

import React from 'react';
import Image from 'next/image';

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
  style: React.CSSProperties;
};

const JobCard: React.FC<JobCardProps> = ({ job, style }) => {
  return (
    <div
      className="swipe-card"
      style={style}
    >
      {/* Conteúdo do Card */}
      <div className="relative h-3/5">
        <Image src={job.companyLogo} width={400} height={300} className="absolute inset-0 w-full h-full object-cover" alt={job.companyName} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6">
          <h2 className="text-2xl font-bold text-white">{job.jobTitle}</h2>
          <p className="text-md text-gray-200">{job.companyName}</p>
        </div>
        <div className="choice-indicator like">INTERESSE</div>
        <div className="choice-indicator nope">PASSAR</div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">Competências:</h3>
          <div className="flex flex-wrap gap-2">
            {job.skills.map(skill => (
              <span key={skill} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">{skill}</span>
            ))}
          </div>
        </div>
        <p className="text-gray-600 text-sm flex-grow">{job.description}</p>
      </div>
    </div>
  );
};

export default JobCard;
