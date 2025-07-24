// No topo do arquivo, informa ao Next.js que este é um componente interativo do lado do cliente
'use client';

import React from 'react';
import Image from 'next/image';

type ProfilePageProps = {
  activePage: string;
};

const ProfilePage: React.FC<ProfilePageProps> = ({ activePage }) => {
  return (
    <div id="profile-page" className={`page bg-white p-6 overflow-y-auto ${activePage === 'profile-page' ? 'block' : 'hidden'}`}>
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <Image src="https://placehold.co/128x128/e0e7ff/4338ca?text=AC" width={128} height={128} className="w-32 h-32 rounded-full mx-auto ring-4 ring-indigo-300" alt="Foto do Candidato" />
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
  );
};

export default ProfilePage;
