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

type MatchModalProps = {
  matchedJob: Job | null;
  setMatchedJob: (job: Job | null) => void;
};

const MatchModal: React.FC<MatchModalProps> = ({ matchedJob, setMatchedJob }) => {
  if (!matchedJob) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="text-center text-white match-animation">
        <h1 className="text-5xl font-extrabold" style={{ background: 'linear-gradient(to right, #6ee7b7, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>É um Match!</h1>
        <p className="mt-2">Você e a <span className="font-bold">{matchedJob.companyName}</span> têm interesse mútuo!</p>
        <div className="mt-8 flex justify-center items-center gap-4">
          <img src="https://placehold.co/128x128/e0e7ff/4338ca?text=AC" className="w-24 h-24 rounded-full ring-4 ring-white" alt="Foto do Candidato" />
          <img src={matchedJob.companyLogo.replace('400x300', '128x128')} className="w-24 h-24 rounded-full ring-4 ring-white" alt="Logo da Empresa" />
        </div>
        <button onClick={() => setMatchedJob(null)} className="mt-8 w-full max-w-xs mx-auto py-3 bg-white text-indigo-600 font-bold rounded-full shadow-lg">Continuar Buscando</button>
      </div>
    </div>
  );
};

export default MatchModal;
