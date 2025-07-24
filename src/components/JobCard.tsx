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
  console.log('Job recebido no JobCard:', job);
  if (!job) {
    return <div className="swipe-card" style={style}><h1>Job data is missing!</h1></div>;
  }
  return (
    <div
      className="swipe-card"
      style={style}
    >
      <h1>{job.jobTitle}</h1>
    </div>
  );
};

export default JobCard;
