// No topo do arquivo, informa ao Next.js que este é um componente interativo do lado do cliente
'use client';

import React, { useRef, useEffect } from 'react';
import JobCard from './JobCard';

// Tipos de dados para segurança com TypeScript
type Job = {
  id: number;
  companyLogo: string;
  jobTitle: string;
  companyName: string;
  skills: string[];
  description: string;
};

// Propriedades do componente SwipePage
type SwipePageProps = {
  jobs: Job[];
  activePage: string;
  handleSwipe: (direction: 'left' | 'right') => void;
  dragState: React.MutableRefObject<{ isDragging: boolean; startX: number; currentX: number; }>;
  deckRef: React.RefObject<HTMLDivElement>;
};

// Componente para a página de swipe
const SwipePage: React.FC<SwipePageProps> = ({ jobs, activePage, handleSwipe, dragState, deckRef }) => {
  const activeCardRef = useRef<HTMLDivElement | null>(null);

  // Efeito para adicionar e remover listeners de eventos de arrastar
  useEffect(() => {
    const deckNode = deckRef.current;
    if (!deckNode || jobs.length === 0) return;

    activeCardRef.current = deckNode.lastElementChild as HTMLDivElement;
    const cardNode = activeCardRef.current;
    if (!cardNode) return;

    // Função para iniciar o arrastar
    const dragStart = (e: MouseEvent | TouchEvent) => {
      dragState.current.isDragging = true;
      cardNode.style.transition = 'none'; // Remove transição durante o arrastar
      dragState.current.startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    };

    // Função para mover o card
    const dragging = (e: MouseEvent | TouchEvent) => {
      if (!dragState.current.isDragging) return;
      e.preventDefault();
      dragState.current.currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const diffX = dragState.current.currentX - dragState.current.startX;
      const rotate = diffX * 0.05;
      cardNode.style.transform = `translate(${diffX}px) rotate(${rotate}deg)`;
    };

    // Função para finalizar o arrastar
    const dragEnd = () => {
      if (!dragState.current.isDragging) return;
      dragState.current.isDragging = false;

      const diffX = dragState.current.currentX - dragState.current.startX;
      if (Math.abs(diffX) > 100) {
        handleSwipe(diffX > 0 ? 'right' : 'left');
      } else {
        cardNode.style.transition = 'transform 0.3s ease-out';
        cardNode.style.transform = '';
      }
    };

    cardNode.addEventListener('mousedown', dragStart);
    cardNode.addEventListener('touchstart', dragStart, { passive: true });

    document.addEventListener('mousemove', dragging);
    document.addEventListener('touchmove', dragging, { passive: false });

    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);

    // Limpa os listeners ao desmontar o componente
    return () => {
      cardNode.removeEventListener('mousedown', dragStart);
      cardNode.removeEventListener('touchstart', dragStart);
      document.removeEventListener('mousemove', dragging);
      document.removeEventListener('touchmove', dragging);
      document.removeEventListener('mouseup', dragEnd);
      document.removeEventListener('touchend', dragEnd);
    };
  }, [jobs, dragState, handleSwipe, deckRef]);

  return (
    <div id="swipe-page" className={`page flex-col ${activePage === 'swipe-page' ? 'flex' : 'hidden'}`}>
      {/* Cabeçalho */}
      <div className="p-4 text-center flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-800">Encontre sua Vaga</h1>
      </div>

      {/* Deck de Vagas */}
      <div ref={deckRef} className="relative flex-grow w-full max-w-sm mx-auto p-4">
        {jobs.map((job, index) => (
          <JobCard
            key={job.id}
            job={job}
            style={{
              zIndex: jobs.length - index,
              transform: `scale(${1 - (index * 0.04)}) translateY(${index * -16}px)`,
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
            }}
          />
        )).reverse()}
        {/* Mensagem de "sem vagas" */}
        <div className={`absolute inset-0 flex items-center justify-center text-center p-8 text-gray-500 ${jobs.length > 0 ? 'hidden' : ''}`}>
          <p className="text-lg">Você viu todas as vagas por enquanto!</p>
        </div>
      </div>

      {/* Botões de Ação */}
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
