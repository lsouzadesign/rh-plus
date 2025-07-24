// No topo do arquivo, informa ao Next.js que este é um componente interativo do lado do cliente
'use client';

import React from 'react';
import Image from 'next/image';

type ChatPageProps = {
  activePage: string;
};

const ChatPage: React.FC<ChatPageProps> = ({ activePage }) => {
  return (
    <div id="chat-page" className={`page bg-white p-6 overflow-y-auto ${activePage === 'chat-page' ? 'block' : 'hidden'}`}>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-800">Matches</h1>
        <p className="mt-4 text-gray-600">Suas conversas com as empresas aparecerão aqui.</p>
        <div className="mt-6 flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
          <Image src="https://placehold.co/48x48/7c3aed/ffffff?text=N" width={48} height={48} className="w-12 h-12 rounded-full" alt="Logo NuvemCo" />
          <div>
            <h3 className="font-semibold text-gray-800">NuvemCo Solutions</h3>
            <p className="text-sm text-green-600">Vocês deram match!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
