'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

type Job = {
    id: number;
    companyLogo: string;
    jobTitle: string;
    companyName: string;
    skills: string[];
    description: string;
};

const jobData: Job[] = [
    { id: 1, companyLogo: '/nuvemco.png', jobTitle: 'Engenheiro de Software Sênior', companyName: 'NuvemCo Solutions', skills: ['Go', 'Kubernetes', 'AWS', 'Microserviços'], description: 'Lidere o desenvolvimento de nossa plataforma de nuvem de última geração.' },
    { id: 2, companyLogo: '/inovatech.png', jobTitle: 'Designer de Produto (UI/UX)', companyName: 'InovaTech Labs', skills: ['Figma', 'User Research', 'Prototipagem'], description: 'Crie experiências de usuário incríveis e intuitivas para nossos apps.' },
    { id: 3, companyLogo: '/datamind.png', jobTitle: 'Cientista de Dados Pleno', companyName: 'DataMind AI', skills: ['Python', 'TensorFlow', 'SQL'], description: 'Desenvolva modelos preditivos e análises complexas.' },
    { id: 4, companyLogo: '/conecta.png', jobTitle: 'Gerente de Marketing Digital', companyName: 'Conecta Mídia', skills: ['SEO', 'Google Ads', 'Inbound'], description: 'Planeje e execute campanhas de marketing digital de alto impacto.' }
];

export default function HomePage() {
    const [currentJobs, setCurrentJobs] = useState<Job[]>(jobData);
    const [activePage, setActivePage] = useState('swipe-page');
    const [matchedJob, setMatchedJob] = useState<Job | null>(null);

    const deckRef = useRef<HTMLDivElement>(null);
    const activeCardRef = useRef<HTMLDivElement | null>(null);
    const startX = useRef(0);
    const startY = useRef(0);
    const currentX = useRef(0);
    const currentY = useRef(0);
    const isDragging = useRef(false);

    const updateActiveCard = () => {
        if (deckRef.current && deckRef.current.children.length > 0) {
            activeCardRef.current = deckRef.current.children[deckRef.current.children.length - 1] as HTMLDivElement;
            activeCardRef.current.addEventListener('mousedown', dragStart as EventListener);
            activeCardRef.current.addEventListener('touchstart', dragStart as EventListener, { passive: false });
        } else {
            activeCardRef.current = null;
            const endMessage = document.getElementById('end-of-deck-message');
            if(endMessage) endMessage.classList.remove('hidden');
            const actionButtons = document.getElementById('action-buttons');
            if(actionButtons) actionButtons.classList.add('hidden');
        }
    };

    const createCards = () => {
        if (!deckRef.current) return;
        deckRef.current.innerHTML = '';
        currentJobs.forEach((job, index) => {
            const card = document.createElement('div');
            card.className = 'swipe-card';
            card.dataset.jobId = job.id.toString();
            card.style.zIndex = (currentJobs.length - index).toString();
            card.style.transform = `scale(${1 - (index * 0.03)}) translateY(${index * -12}px)`;
            card.innerHTML = `
                <div class="relative h-3/5">
                    <img src="${job.companyLogo}" class="absolute inset-0 w-full h-full object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 p-6">
                        <h2 class="text-2xl font-bold text-white">${job.jobTitle}</h2>
                        <p class="text-md text-gray-200">${job.companyName}</p>
                    </div>
                    <div class="choice-indicator like">INTERESSE</div>
                    <div class="choice-indicator nope">PASSAR</div>
                </div>
                <div class="p-6 flex-grow flex flex-col">
                    <div class="mb-4">
                        <h3 class="font-semibold text-gray-700 mb-2">Competências:</h3>
                        <div class="flex flex-wrap gap-2">${job.skills.map(skill => `<span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">${skill}</span>`).join('')}</div>
                    </div>
                    <p class="text-gray-600 text-sm flex-grow">${job.description}</p>
                </div>`;
            if (deckRef.current) {
                deckRef.current.prepend(card);
            }
        });
        updateActiveCard();
    };

    const dragStart = (e: MouseEvent | TouchEvent) => {
        if (!activeCardRef.current) return;
        isDragging.current = true;
        activeCardRef.current.classList.add('dragging');
        startX.current = 'pageX' in e ? e.pageX : e.touches[0].pageX;
        startY.current = 'pageY' in e ? e.pageY : e.touches[0].pageY;
        currentX.current = startX.current;
        currentY.current = startY.current;
    };

    const dragging = (e: MouseEvent | TouchEvent) => {
        if (!isDragging.current || !activeCardRef.current) return;
        e.preventDefault();
        currentX.current = 'pageX' in e ? e.pageX : e.touches[0].pageX;
        currentY.current = 'pageY' in e ? e.pageY : e.touches[0].pageY;
        const diffX = currentX.current - startX.current;
        const diffY = currentY.current - startY.current;
        const rotate = diffX * 0.05;
        activeCardRef.current.style.transform = `translate(${diffX}px, ${diffY}px) rotate(${rotate}deg)`;
        updateChoiceIndicator(diffX);
    };

    const dragEnd = () => {
        if (!isDragging.current || !activeCardRef.current) return;
        isDragging.current = false;
        activeCardRef.current.classList.remove('dragging');
        const diffX = currentX.current - startX.current;
        const decisionThreshold = 100;
        if (Math.abs(diffX) > decisionThreshold) {
            swipeCard(diffX > 0 ? 1 : -1);
        } else {
            activeCardRef.current.style.transform = '';
            updateChoiceIndicator(0);
        }
    };

    const updateChoiceIndicator = (diffX: number) => {
        if (!activeCardRef.current) return;
        const likeIndicator = activeCardRef.current.querySelector('.like') as HTMLDivElement;
        const nopeIndicator = activeCardRef.current.querySelector('.nope') as HTMLDivElement;
        const opacity = Math.min(Math.abs(diffX) / 100, 1);
        if (diffX > 0) {
            likeIndicator.style.opacity = opacity.toString();
            nopeIndicator.style.opacity = '0';
        } else if (diffX < 0) {
            nopeIndicator.style.opacity = opacity.toString();
            likeIndicator.style.opacity = '0';
        } else {
            likeIndicator.style.opacity = '0';
            nopeIndicator.style.opacity = '0';
        }
    };

    const swipeCard = (direction: number) => {
        if (!activeCardRef.current) return;
        const jobId = activeCardRef.current.dataset.jobId;
        activeCardRef.current.removeEventListener('mousedown', dragStart as EventListener);
        activeCardRef.current.removeEventListener('touchstart', dragStart as EventListener);
        const endX = direction * window.innerWidth;
        activeCardRef.current.style.transition = 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out';
        activeCardRef.current.style.transform = `translate(${endX}px, -50px) rotate(${direction * 30}deg)`;
        activeCardRef.current.style.opacity = '0';

        if (direction === 1 && Math.random() > 0.5) {
            const job = jobData.find(j => j.id.toString() === jobId);
            if (job) {
                setTimeout(() => setMatchedJob(job), 300);
            }
        }

        setTimeout(() => {
            if (deckRef.current && activeCardRef.current) {
                deckRef.current.removeChild(activeCardRef.current);
                setCurrentJobs(prev => prev.slice(1));
                updateActiveCard();
            }
        }, 500);
    };

    useEffect(() => {
        if(deckRef.current) {
            createCards();
        }

        document.addEventListener('mousemove', dragging);
        document.addEventListener('touchmove', dragging, { passive: false });
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('touchend', dragEnd);

        return () => {
            document.removeEventListener('mousemove', dragging);
            document.removeEventListener('touchmove', dragging);
            document.removeEventListener('mouseup', dragEnd);
            document.removeEventListener('touchend', dragEnd);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentJobs]);


    return (
        <div className="flex flex-col h-screen">
            <main className="w-full">
                <div id="swipe-page" className={`page flex flex-col ${activePage === 'swipe-page' ? '' : 'hidden'}`}>
                    <div className="p-4 text-center flex-shrink-0">
                        <h1 className="text-xl font-bold text-gray-800">Encontre sua Vaga</h1>
                    </div>
                    <div id="swipe-deck" ref={deckRef} className="relative flex-grow flex items-center justify-center p-4">
                    </div>
                    <div id="action-buttons" className="flex items-center justify-evenly p-4 flex-shrink-0">
                        <button id="nope-btn" onClick={() => swipeCard(-1)} className="p-4 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <button id="like-btn" onClick={() => swipeCard(1)} className="p-5 bg-white rounded-full shadow-lg hover:bg-green-50 transition-colors transform scale-110">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                    <div id="end-of-deck-message" className="absolute inset-0 flex items-center justify-center text-center p-8 text-gray-500 hidden">
                        <p>Você viu todas as vagas por enquanto!</p>
                    </div>
                </div>

                <div id="profile-page" className={`page bg-white p-6 overflow-y-auto ${activePage === 'profile-page' ? '' : 'hidden'}`}>
                    <div className="max-w-md mx-auto">
                        <div className="text-center">
                            <Image src="/avatar.jpg" width={128} height={128} className="w-32 h-32 rounded-full mx-auto ring-4 ring-indigo-300" alt="Foto do Candidato" />
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
                                <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">Next.js</span>
                                <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">SQL</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="chat-page" className={`page bg-white p-6 overflow-y-auto ${activePage === 'chat-page' ? '' : 'hidden'}`}>
                    <div className="max-w-md mx-auto">
                        <h1 className="text-2xl font-bold text-gray-800">Matches</h1>
                        <p className="mt-4 text-gray-600">Suas conversas com as empresas aparecerão aqui.</p>
                        <div className="mt-6 flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            <Image src="/nuvemco.png" width={48} height={48} className="w-12 h-12 rounded-full" alt="Logo NuvemCo" />
                            <div>
                                <h3 className="font-semibold text-gray-800">NuvemCo Solutions</h3>
                                <p className="text-sm text-green-600">Vocês deram match!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="w-full bg-white border-t border-gray-200 grid grid-cols-3 items-center">
                <button data-page="profile-page" onClick={() => setActivePage('profile-page')} className={`nav-btn p-4 flex justify-center ${activePage === 'profile-page' ? 'text-indigo-600' : 'text-gray-400'} hover:text-indigo-600`}>
                    <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                </button>
                <button data-page="swipe-page" onClick={() => setActivePage('swipe-page')} className={`nav-btn p-4 flex justify-center ${activePage === 'swipe-page' ? 'text-indigo-600' : 'text-gray-400'} hover:text-indigo-600`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                </button>
                <button data-page="chat-page" onClick={() => setActivePage('chat-page')} className={`nav-btn p-4 flex justify-center ${activePage === 'chat-page' ? 'text-indigo-600' : 'text-gray-400'} hover:text-indigo-600`}>
                    <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM5 7a1 1 0 000 2h8a1 1 0 100-2H5z" /></svg>
                </button>
            </footer>

            {matchedJob && (
                <div id="match-celebration" className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div id="match-content" className="text-center text-white match-animation">
                        <h1 className="text-5xl font-extrabold" style={{background: 'linear-gradient(to right, #6ee7b7, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>É um Match!</h1>
                        <p className="mt-2">Você e a <span id="match-company-name" className="font-bold">{matchedJob.companyName}</span> têm interesse mútuo!</p>
                        <div className="mt-8 flex justify-center items-center gap-4">
                            <Image src="/avatar.jpg" width={128} height={128} className="w-24 h-24 rounded-full ring-4 ring-white" alt="Foto do Candidato" />
                            <Image id="match-company-logo" src={matchedJob.companyLogo} width={128} height={128} className="w-24 h-24 rounded-full ring-4 ring-white" alt="Logo da Empresa" />
                        </div>
                        <button id="close-match-btn" onClick={() => setMatchedJob(null)} className="mt-8 w-full max-w-xs mx-auto py-3 bg-white text-indigo-600 font-bold rounded-full shadow-lg">Continuar Buscando</button>
                    </div>
                </div>
            )}
        </div>
    );
}
