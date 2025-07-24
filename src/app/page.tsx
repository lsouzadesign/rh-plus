// No topo do arquivo, informa ao Next.js que este é um componente interativo do lado do cliente
'use client';

import { useState, useRef } from 'react';
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
  { id: 1, companyLogo: 'https://placehold.co/400x300/7c3aed/ffffff?text=NuvemCo', jobTitle: 'Engenheiro de Software Sênior', companyName: 'NuvemCo Solutions', skills: ['Go', 'Kubernetes', 'AWS', 'Microserviços'], description: 'Lidere o desenvolvimento de nossa plataforma de nuvem de última geração.' },
  { id: 2, companyLogo: 'https://placehold.co/400x300/16a34a/ffffff?text=InovaTech', jobTitle: 'Designer de Produto (UI/UX)', companyName: 'InovaTech Labs', skills: ['Figma', 'User Research', 'Prototipagem'], description: 'Crie experiências de usuário incríveis e intuitivas para nossos apps.' },
  { id: 3, companyLogo: 'https://placehold.co/400x300/db2777/ffffff?text=DataMind', jobTitle: 'Cientista de Dados Pleno', companyName: 'DataMind AI', skills: ['Python', 'TensorFlow', 'SQL'], description: 'Desenvolva modelos preditivos e análises complexas.' },
  { id: 4, companyLogo: 'https://placehold.co/400x300/f97316/ffffff?text=Conecta', jobTitle: 'Gerente de Marketing Digital', companyName: 'Conecta Mídia', skills: ['SEO', 'Google Ads', 'Inbound'], description: 'Planeje e execute campanhas de marketing digital de alto impacto.' }
];

export default function HomePage() {
  // Estado para gerenciar a página ativa (swipe, profile, chat)
  const [activePage, setActivePage] = useState('swipe-page');
  // Estado para os dados dos cards
  const [jobs, setJobs] = useState<Job[]>(initialJobData);
  // Estado para a tela de match
  const [matchedJob, setMatchedJob] = useState<Job | null>(null);

  // Refs para a lógica de arrastar (substitui getElementById)
  const deckRef = useRef<HTMLDivElement>(null!);
  const dragState = useRef<{
    isDragging: boolean;
    startX: number;
    currentX: number;
  }>({
    isDragging: false,
    startX: 0,
    currentX: 0,
  });

  // Função para remover um card da pilha
  const removeTopCard = () => {
    setJobs((prevJobs) => prevJobs.slice(1));
  };

  // Lógica do swipe
  const handleSwipe = (direction: 'left' | 'right') => {
    if (jobs.length === 0) return;

    const topCard = deckRef.current?.lastElementChild as HTMLDivElement;
    if (!topCard) return;

    const endX = direction === 'right' ? window.innerWidth : -window.innerWidth;
    topCard.style.transition = 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out';
    topCard.style.transform = `translate(${endX}px, -50px) rotate(${direction === 'right' ? 15 : -15}deg)`;
    topCard.style.opacity = '0';

    if (direction === 'right' && Math.random() > 0.5) {
      setTimeout(() => setMatchedJob(jobs[0]), 300);
    }

    setTimeout(() => {
      removeTopCard();
    }, 500);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <main className="w-full flex-grow relative overflow-hidden">
        <SwipePage
          jobs={jobs}
          activePage={activePage}
          handleSwipe={handleSwipe}
          dragState={dragState}
          deckRef={deckRef}
        />
        <ProfilePage activePage={activePage} />
        <ChatPage activePage={activePage} />
      </main>
      <Footer activePage={activePage} setActivePage={setActivePage} />
      <MatchModal matchedJob={matchedJob} setMatchedJob={setMatchedJob} />
    </div>
  );
}
