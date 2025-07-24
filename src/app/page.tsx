// No topo do arquivo, informa ao Next.js que este é um componente interativo do lado do cliente
'use client';

import { useState, useEffect, useRef } from 'react';

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
  const deckRef = useRef<HTMLDivElement>(null);
  const activeCardRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    currentX: 0,
  }).current;

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

  // Tradução da lógica de arrastar para React
  useEffect(() => {
    const deckNode = deckRef.current;
    if (!deckNode || jobs.length === 0) return;

    activeCardRef.current = deckNode.lastElementChild as HTMLDivElement;
    const cardNode = activeCardRef.current;
    if (!cardNode) return;

    const dragStart = (e: MouseEvent | TouchEvent) => {
      dragState.isDragging = true;
      cardNode.classList.add('dragging');
      dragState.startX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    };

    const dragging = (e: MouseEvent | TouchEvent) => {
      if (!dragState.isDragging) return;
      e.preventDefault();
      dragState.currentX = 'touches' in e ? e.touches[0].pageX : e.pageX;
      const diffX = dragState.currentX - dragState.startX;
      const rotate = diffX * 0.05;
      cardNode.style.transform = `translate(${diffX}px) rotate(${rotate}deg)`;
    };

    const dragEnd = () => {
      if (!dragState.isDragging) return;
      dragState.isDragging = false;
      cardNode.classList.remove('dragging');

      const diffX = dragState.currentX - dragState.startX;
      if (Math.abs(diffX) > 100) {
        handleSwipe(diffX > 0 ? 'right' : 'left');
      } else {
        cardNode.style.transform = '';
      }
    };

    cardNode.addEventListener('mousedown', dragStart);
    cardNode.addEventListener('touchstart', dragStart, { passive: true });
    document.addEventListener('mousemove', dragging);
    document.addEventListener('touchmove', dragging, { passive: false });
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);

    return () => {
      cardNode.removeEventListener('mousedown', dragStart);
      cardNode.removeEventListener('touchstart', dragStart);
      document.removeEventListener('mousemove', dragging);
      document.removeEventListener('touchmove', dragging);
      document.removeEventListener('mouseup', dragEnd);
      document.removeEventListener('touchend', dragEnd);
    };
  }, [jobs, dragState]); // Roda o efeito sempre que a lista de jobs mudar

  return (
    <div className="flex flex-col h-screen bg-white">
      <main className="w-full flex-grow relative overflow-hidden">
        {/* PÁGINA DE SWIPE */}
        <div id="swipe-page" className={`page flex-col ${activePage === 'swipe-page' ? 'flex' : 'hidden'}`}>
          <div className="p-4 text-center flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-800">Encontre sua Vaga</h1>
          </div>
          <div ref={deckRef} className="relative flex-grow flex items-center justify-center p-4">
            {jobs.length > 0 ? (
              jobs.map((job, index) => (
                <div
                  key={job.id}
                  className="swipe-card"
                  style={{
                    zIndex: jobs.length - index,
                    transform: `scale(${1 - (index * 0.03)}) translateY(${index * -12}px)`
                  }}
                >
                  {/* Conteúdo do Card */}
                  <div className="relative h-3/5">
                    <img src={job.companyLogo} className="absolute inset-0 w-full h-full object-cover" alt={job.companyName} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6">
                      <h2 className="text-2xl font-bold text-white">{job.jobTitle}</h2>
                      <p className="text-md text-gray-200">{job.companyName}</p>
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-700 mb-2">Competências:</h3>
                      <div className="flex flex-wrap gap-2">{job.skills.map(skill => `<span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">${skill}</span>`).join('')}</div>
                    </div>
                    <p className="text-gray-600 text-sm flex-grow">{job.description}</p>
                  </div>
                </div>
              )).reverse() // .reverse() para empilhar corretamente no DOM
            ) : (
              <div className="text-center p-8 text-gray-500">
                <p>Você viu todas as vagas por enquanto!</p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-evenly p-4 flex-shrink-0">
            <button onClick={() => handleSwipe('left')} className="p-4 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <button onClick={() => handleSwipe('right')} className="p-5 bg-white rounded-full shadow-lg hover:bg-green-50 transition-colors transform scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
            </button>
          </div>
        </div>

        {/* PÁGINA DE PERFIL */}
        <div id="profile-page" className={`page bg-white p-6 overflow-y-auto ${activePage === 'profile-page' ? 'block' : 'hidden'}`}>
          {/* ... (Cole aqui o HTML da página de perfil) ... */}
          <div className="max-w-md mx-auto">
            <div className="text-center">
              <img src="https://placehold.co/128x128/e0e7ff/4338ca?text=AC" className="w-32 h-32 rounded-full mx-auto ring-4 ring-indigo-300" alt="Foto do Candidato" />
              <h2 className="mt-4 text-2xl font-bold text-gray-800">Ana C.</h2>
              <p className="text-md text-gray-600">Desenvolvedora Full-Stack</p>
              <button className="mt-4 w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700">Editar Perfil</button>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900">Sobre</h3>
              <p className="mt-2 text-gray-700">Apaixonada por criar soluções escaláveis e experiências de usuário fluidas. Buscando uma equipe inovadora para construir produtos incríveis.</p>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900">Minhas Competências</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">React</span>
                <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">Node.js</span>
                <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">TypeScript</span>
              </div>
            </div>
          </div>
        </div>

        {/* PÁGINA DE CHAT */}
        <div id="chat-page" className={`page bg-white p-6 overflow-y-auto ${activePage === 'chat-page' ? 'block' : 'hidden'}`}>
          {/* ... (Cole aqui o HTML da página de chat) ... */}
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-gray-800">Matches</h1>
            <p className="mt-4 text-gray-600">Suas conversas com as empresas aparecerão aqui.</p>
            <div className="mt-6 flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <img src="https://placehold.co/48x48/7c3aed/ffffff?text=N" className="w-12 h-12 rounded-full" alt="Logo NuvemCo" />
              <div>
                <h3 className="font-semibold text-gray-800">NuvemCo Solutions</h3>
                <p className="text-sm text-green-600">Vocês deram match!</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full bg-white border-t border-gray-200 grid grid-cols-3 items-center flex-shrink-0">
        {/* ... (Cole aqui os botões do footer) ... */}
        <button onClick={() => setActivePage('profile-page')} className={`p-4 flex justify-center ${activePage === 'profile-page' ? 'text-indigo-600' : 'text-gray-400'}`}>
          <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
        </button>
        <button onClick={() => setActivePage('swipe-page')} className={`p-4 flex justify-center ${activePage === 'swipe-page' ? 'text-indigo-600' : 'text-gray-400'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>
        </button>
        <button onClick={() => setActivePage('chat-page')} className={`p-4 flex justify-center ${activePage === 'chat-page' ? 'text-indigo-600' : 'text-gray-400'}`}>
          <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM5 7a1 1 0 000 2h8a1 1 0 100-2H5z" /></svg>
        </button>
      </footer>

      {/* TELA DE MATCH */}
      {matchedJob && (
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
      )}
    </div>
  );
}