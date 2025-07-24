// No topo do arquivo, informa ao Next.js que este é um componente interativo do lado do cliente
'use client';

import { useState } from 'react';
import SwipePage from '../components/SwipePage';
import ProfilePage from '../components/ProfilePage';
import ChatPage from '../components/ChatPage';
import Footer from '../components/Footer';
import MatchModal from '../components/MatchModal';

// Tipos de dados para segurança com TypeScript
type Job = {
  id: number;
  companyLogo: string;
  jobTitle: string;
  companyName: string;
  skills: string[];
  description: string;
};

// Dados mock (simulando uma API)
const initialJobData: Job[] = [
    { id: 1, companyLogo: '/nuvemco.png', jobTitle: 'Engenheiro de Software Sênior', companyName: 'NuvemCo Solutions', skills: ['Go', 'Kubernetes', 'AWS', 'Microserviços'], description: 'Lidere o desenvolvimento de nossa plataforma de nuvem de última geração.' },
    { id: 2, companyLogo: '/inovatech.png', jobTitle: 'Designer de Produto (UI/UX)', companyName: 'InovaTech Labs', skills: ['Figma', 'User Research', 'Prototipagem'], description: 'Crie experiências de usuário incríveis e intuitivas para nossos apps.' },
    { id: 3, companyLogo: '/datamind.png', jobTitle: 'Cientista de Dados Pleno', companyName: 'DataMind AI', skills: ['Python', 'TensorFlow', 'SQL'], description: 'Desenvolva modelos preditivos e análises complexas.' },
    { id: 4, companyLogo: '/conecta.png', jobTitle: 'Gerente de Marketing Digital', companyName: 'Conecta Mídia', skills: ['SEO', 'Google Ads', 'Inbound'], description: 'Planeje e execute campanhas de marketing digital de alto impacto.' }
];

export default function HomePage() {
  const [activePage, setActivePage] = useState('swipe-page');
  const [jobs, setJobs] = useState<Job[]>(initialJobData);
  const [matchedJob, setMatchedJob] = useState<Job | null>(null);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (jobs.length === 0) return;

    if (direction === 'right' && Math.random() > 0.5) {
      setMatchedJob(jobs[0]);
    }

    setJobs((prevJobs) => prevJobs.slice(1));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <main className="w-full flex-grow relative overflow-hidden">
        <SwipePage
          jobs={jobs}
          activePage={activePage}
          handleSwipe={handleSwipe}
        />
        <ProfilePage activePage={activePage} />
        <ChatPage activePage={activePage} />
      </main>
      <Footer activePage={activePage} setActivePage={setActivePage} />
      <MatchModal matchedJob={matchedJob} setMatchedJob={setMatchedJob} />
    </div>
  );
}
