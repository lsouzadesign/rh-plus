// No topo do arquivo, informa ao Next.js que este é um componente interativo do lado do cliente
'use client';

import React from 'react';

type FooterProps = {
  activePage: string;
  setActivePage: (page: string) => void;
};

const Footer: React.FC<FooterProps> = ({ activePage, setActivePage }) => {
  return (
    <footer className="w-full bg-white border-t border-gray-200 grid grid-cols-3 items-center flex-shrink-0">
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
  );
};

export default Footer;
