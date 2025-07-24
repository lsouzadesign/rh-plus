'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import JobCard from '../components/JobCard';

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
    const [jobs, setJobs] = useState(jobData);
    const [activePage, setActivePage] = useState('swipe-page');
    const [matchedJob, setMatchedJob] = useState<Job | null>(null);

    const swipe = (direction: number) => {
        if (direction === 1 && Math.random() > 0.5) {
            setMatchedJob(jobs[0]);
        }
        setJobs(jobs.slice(1));
    };

    return (
        <>
            <main className="w-full flex-grow relative">
                <div id="swipe-page" className={`page flex flex-col h-full ${activePage === 'swipe-page' ? 'flex' : 'hidden'}`}>
                    <div className="p-4 text-center flex-shrink-0">
                        <h1 className="text-xl font-bold text-gray-800">Encontre sua Vaga</h1>
                    </div>
                    <div id="swipe-deck" className="relative flex-grow flex items-center justify-center p-4">
                        {jobs.length > 0 ? (
                            jobs.map((job, index) => (
                                <JobCard
                                    key={job.id}
                                    job={job}
                                    style={{
                                        zIndex: jobs.length - index,
                                        transform: `scale(${1 - (index * 0.04)}) translateY(${index * -16}px)`,
                                        transition: 'transform 0.3s ease-out',
                                    }}
                                    onSwipe={swipe}
                                />
                            )).reverse()
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-center p-8 text-gray-500">
                                <p>Você viu todas as vagas por enquanto!</p>
                            </div>
                        )}
                    </div>
                    <div className={`flex items-center justify-evenly p-4 flex-shrink-0 ${jobs.length === 0 ? 'hidden' : ''}`}>
                        <button onClick={() => swipe(-1)} className="p-4 bg-white rounded-full shadow-xl hover:bg-red-100 transition-all duration-200 transform hover:scale-110">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <button onClick={() => swipe(1)} className="p-6 bg-white rounded-full shadow-xl hover:bg-green-100 transition-all duration-200 transform hover:scale-110">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                </div>

                <div id="profile-page" className={`page bg-white p-6 overflow-y-auto ${activePage === 'profile-page' ? 'hidden' : 'flex'}`}>
                    {/* Profile page content */}
                </div>

                <div id="chat-page" className={`page bg-white p-6 overflow-y-auto ${activePage === 'chat-page' ? 'hidden' : 'flex'}`}>
                    {/* Chat page content */}
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
        </>
    );
}
