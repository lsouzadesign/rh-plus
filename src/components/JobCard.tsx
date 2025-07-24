// No topo do arquivo, informa ao Next.js que este é um componente interativo do lado do cliente
'use client';

import React from 'react';
import Image from 'next/image';

// Tipos de dados para segurança com TypeScript
type Job = {
  id: number;
  companyLogo: string;
  jobTitle: string;
  companyName: string;
  skills: string[];
  description: string;
};

// Propriedades do componente JobCard
type JobCardProps = {
  job: Job;
  style: React.CSSProperties; // Estilos para animação
};

// Componente para exibir um único card de vaga
const JobCard: React.FC<JobCardProps> = ({ job, style }) => {
  return (
    <div
      className="absolute top-0 left-0 w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden transform transition-transform duration-300 ease-in-out"
      style={style}
    >
      {/* Imagem e Título */}
      <div className="relative h-3/5">
        <Image
          src={job.companyLogo}
          alt={`${job.companyName} logo`}
          width={400}
          height={300}
          className="absolute inset-0 w-full h-full object-cover"
          priority // Prioriza o carregamento da imagem visível
        />
        {/* Gradiente para legibilidade do texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        {/* Informações da Vaga */}
        <div className="absolute bottom-0 left-0 p-6">
          <h2 className="text-3xl font-bold text-white leading-tight">{job.jobTitle}</h2>
          <p className="text-lg text-gray-200">{job.companyName}</p>
        </div>
      </div>

      {/* Detalhes da Vaga */}
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
