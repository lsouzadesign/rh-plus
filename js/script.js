document.addEventListener('DOMContentLoaded', function() {
    // --- STATE MANAGEMENT ---
    let userType = ''; // 'candidate' or 'company'
    let currentUser = {};
    let cardsData = [];
    let currentCardIndex = 0;

    // --- DOM ELEMENTS ---
    const views = {
        welcome: document.getElementById('welcome-page'),
        login: document.getElementById('login-page'),
        app: document.getElementById('app'),
    };
    const loginSubtitle = document.getElementById('login-subtitle');
    const loginForm = document.getElementById('login-form');
    const mainContent = document.getElementById('main-content');
    const bottomNav = document.getElementById('bottom-nav');
    const matchOverlay = document.getElementById('match-overlay');

    // --- MOCK DATA ---
    const jobCardsData = [
        { id: 1, company: 'NuvemCo', title: 'Engenheiro de Software Sênior', description: 'Lidere o desenvolvimento de nossa plataforma de nuvem de última geração.', skills: ['Go', 'Kubernetes', 'AWS', 'Microserviços'], logo: 'https://placehold.co/96x96/6d28d9/ffffff?text=NuvemCo' },
        { id: 2, company: 'InovaTech', title: 'Designer de Produto Pleno', description: 'Crie experiências incríveis para milhões de usuários em nossos aplicativos.', skills: ['Figma', 'UX Research', 'Design System'], logo: 'https://placehold.co/96x96/1d4ed8/ffffff?text=Inova' },
        { id: 3, company: 'DataSys', title: 'Cientista de Dados', description: 'Trabalhe com grandes volumes de dados para extrair insights valiosos.', skills: ['Python', 'SQL', 'Machine Learning'], logo: 'https://placehold.co/96x96/059669/ffffff?text=Data' },
    ];
    const candidateCardsData = [
        { id: 101, name: 'Ana Silva', title: 'Desenvolvedora Frontend', bio: 'Apaixonada por criar interfaces reativas e acessíveis com React e Vue.', skills: ['React', 'TypeScript', 'Next.js', 'CSS-in-JS'], photo: 'https://placehold.co/96x96/f472b6/ffffff?text=A' },
        { id: 102, name: 'Bruno Costa', title: 'Engenheiro de DevOps', bio: 'Especialista em automação de infraestrutura e CI/CD na nuvem AWS.', skills: ['AWS', 'Terraform', 'Docker', 'CI/CD'], photo: 'https://placehold.co/96x96/fb923c/ffffff?text=B' },
        { id: 103, name: 'Carla Dias', title: 'Gerente de Projetos Ágeis', bio: 'Liderando equipes para entregar produtos de alto impacto com Scrum e Kanban.', skills: ['Scrum', 'Jira', 'Gestão de Pessoas'], photo: 'https://placehold.co/96x96/60a5fa/ffffff?text=C' },
    ];
    const users = {
        candidate: { name: 'Carlos', photo: 'https://placehold.co/96x96/e2e8f0/475569?text=C' },
        company: { name: 'NuvemCo', photo: 'https://placehold.co/96x96/6d28d9/ffffff?text=NuvemCo' }
    };

    // --- INITIALIZATION ---
    document.querySelectorAll('.welcome-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            userType = e.target.dataset.usertype;
            loginSubtitle.textContent = userType === 'company' ? 'Acesse para encontrar talentos.' : 'Acesse para encontrar sua próxima vaga.';
            switchView('login');
        });
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        currentUser = users[userType];
        cardsData = userType === 'candidate' ? [...jobCardsData] : [...candidateCardsData];
        setupAppUI();
        switchView('app');
    });

    // --- UI & NAVIGATION ---
    function setupAppUI() {
        mainContent.innerHTML = `
            <div id="swipe-view" class="view active h-full flex-col">
                <div class="p-4 border-b bg-white flex-shrink-0">
                    <h1 class="text-xl font-bold text-center text-blue-600">RH+</h1>
                </div>
                <div class="flex-1 flex flex-col items-center justify-center p-4 overflow-hidden">
                    <div id="card-stack" class="relative w-full max-w-md h-full flex-1"></div>
                </div>
                <div class="flex-shrink-0 flex justify-center items-center gap-6 py-4">
                    <button class="swipe-action-btn bg-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg" data-action="reject"><i data-lucide="x" class="w-10 h-10 text-red-500"></i></button>
                    <button class="swipe-action-btn bg-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg" data-action="like"><i data-lucide="check" class="w-10 h-10 text-green-500"></i></button>
                </div>
            </div>
            <div id="connections-view" class="view hidden h-full flex-col items-center justify-center text-center p-8">
                <div class="grid grid-cols-2 gap-4 blur-md">
                    <div class="w-32 h-40 bg-slate-200 rounded-lg"></div>
                    <div class="w-32 h-40 bg-slate-200 rounded-lg"></div>
                    <div class="w-32 h-40 bg-slate-200 rounded-lg"></div>
                    <div class="w-32 h-40 bg-slate-200 rounded-lg"></div>
                </div>
                <h2 class="text-2xl font-bold text-slate-800 mt-8">Quer ver quem quer se conectar com você?</h2>
                <p class="text-slate-600 mb-8">Assine o Plus para desbloquear suas conexões.</p>
                <button class="bg-yellow-400 text-slate-800 font-bold py-3 px-8 rounded-lg">Assine o Plus</button>
            </div>
            <div id="chat-view" class="view hidden h-full flex-col">
                <div class="p-4 border-b bg-white flex-shrink-0">
                    <h1 class="text-xl font-bold text-center text-blue-600">Chat</h1>
                </div>
                <div class="flex-1 overflow-y-auto p-4 space-y-4">
                    <div class="flex items-start gap-3">
                        <img src="https://placehold.co/40x40/6d28d9/ffffff?text=NuvemCo" class="w-10 h-10 rounded-full">
                        <div class="bg-slate-200 p-3 rounded-lg max-w-xs">
                            <p class="text-sm">Olá! Vimos seu perfil e gostamos muito. Gostaria de conversar?</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-3 justify-end">
                        <div class="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
                            <p class="text-sm">Olá! Claro, tenho interesse em saber mais sobre a vaga.</p>
                        </div>
                        <img src="https://placehold.co/40x40/e2e8f0/475569?text=C" class="w-10 h-10 rounded-full">
                    </div>
                </div>
                <div class="p-4 bg-white border-t flex items-center gap-2">
                    <input type="text" placeholder="Digite sua mensagem..." class="flex-1 px-4 py-2 bg-slate-100 border border-slate-200 rounded-full focus:ring-blue-500 focus:border-blue-500">
                    <button class="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center"><i data-lucide="send"></i></button>
                </div>
            </div>
            <div id="profile-view" class="view hidden h-full flex-col">
                <div class="p-4 border-b bg-white flex-shrink-0">
                    <h1 class="text-xl font-bold text-center text-blue-600">Perfil</h1>
                </div>
                <div class="flex-1 overflow-y-auto p-4">
                    <div id="profile-content"></div>
                </div>
            </div>
        `;
        bottomNav.innerHTML = `
            <button class="nav-link text-blue-600 py-3 flex flex-col items-center gap-1" data-view="swipe-view"><i data-lucide="layout-grid"></i><span class="text-xs font-medium">Buscar</span></button>
            <button class="nav-link text-slate-500 py-3 flex flex-col items-center gap-1" data-view="connections-view"><i data-lucide="handshake"></i><span class="text-xs font-medium">Conexões</span></button>
            <button class="nav-link text-slate-500 py-3 flex flex-col items-center gap-1" data-view="chat-view"><i data-lucide="message-square"></i><span class="text-xs font-medium">Chat</span></button>
            <button class="nav-link text-slate-500 py-3 flex flex-col items-center gap-1" data-view="profile-view"><i data-lucide="user"></i><span class="text-xs font-medium">Perfil</span></button>
        `;
        lucide.createIcons();
        document.querySelectorAll('.swipe-action-btn').forEach(button => {
            button.addEventListener('click', (e) => handleSwipeAction(e.currentTarget.dataset.action));
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const viewName = e.currentTarget.dataset.view;
                if (viewName) {
                    document.querySelectorAll('.main-content .view').forEach(v => v.classList.remove('active'));
                    document.getElementById(viewName).classList.add('active');
                    document.querySelectorAll('.nav-link').forEach(l => {
                        l.classList.add('text-slate-500');
                        l.classList.remove('text-blue-600');
                    });
                    e.currentTarget.classList.remove('text-slate-500');
                    e.currentTarget.classList.add('text-blue-600');

                    if (viewName === 'profile-view') {
                        renderProfile();
                    }
                }
            });
        });

        const chatInput = document.querySelector('#chat-view input');
        const sendButton = document.querySelector('#chat-view button');
        const chatMessages = document.querySelector('#chat-view .overflow-y-auto');

        const sendMessage = () => {
            const messageText = chatInput.value.trim();
            if (messageText) {
                const messageElement = document.createElement('div');
                messageElement.className = 'flex items-start gap-3 justify-end';
                messageElement.innerHTML = `
                    <div class="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
                        <p class="text-sm">${messageText}</p>
                    </div>
                    <img src="${currentUser.photo}" class="w-10 h-10 rounded-full">
                `;
                chatMessages.appendChild(messageElement);
                chatInput.value = '';
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        };

        sendButton.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        loadCards();
    }

    function switchView(viewName) {
        Object.values(views).forEach(v => v.classList.remove('active'));
        views[viewName].classList.add('active');
    }

    function renderProfile() {
        const profileContent = document.getElementById('profile-content');
        if (!profileContent) return;

        const isCandidate = userType === 'candidate';
        const profileData = isCandidate ? {
            name: 'Carlos Machado',
            title: 'Desenvolvedor Full-Stack Pleno',
            photo: 'https://placehold.co/96x96/e2e8f0/475569?text=C',
            bio: 'Desenvolvedor com 5 anos de experiência em tecnologias web modernas, buscando desafios em uma empresa inovadora.',
            experiences: [
                { role: 'Dev. Pleno', company: 'TechSolutions', period: '2021 - Atualmente' },
                { role: 'Dev. Júnior', company: 'WebInova', period: '2019 - 2021' },
            ],
            education: 'Análise e Desenvolvimento de Sistemas - Universidade XYZ (2018)',
            skills: ['React', 'Node.js', 'Python', 'SQL', 'Docker']
        } : {
            name: 'NuvemCo',
            sector: 'Tecnologia / SaaS',
            photo: 'https://placehold.co/96x96/6d28d9/ffffff?text=NuvemCo',
            about: 'A NuvemCo é líder em soluções de cloud computing, ajudando empresas a escalar seus negócios com segurança e eficiência.',
            openings: [
                'Engenheiro de Software Sênior', 'Gerente de Produto', 'Analista de Segurança'
            ],
            culture: ['Inovação', 'Trabalho em Equipe', 'Flexibilidade', 'Crescimento']
        };

        if (isCandidate) {
            profileContent.innerHTML = `
                <div class="bg-white p-6 rounded-2xl shadow-lg">
                    <div class="flex items-center gap-4 mb-6">
                        <img src="${profileData.photo}" class="w-24 h-24 rounded-full">
                        <div>
                            <h2 class="text-2xl font-bold">${profileData.name}</h2>
                            <p class="text-slate-600">${profileData.title}</p>
                        </div>
                    </div>
                    <div>
                        <h3 class="font-semibold text-lg mb-2">Sobre</h3>
                        <p class="text-slate-600 mb-4">${profileData.bio}</p>
                        <h3 class="font-semibold text-lg mb-2">Experiência</h3>
                        <ul class="list-disc list-inside text-slate-600 space-y-1 mb-4">
                            ${profileData.experiences.map(exp => `<li><strong>${exp.role}</strong> na ${exp.company} (${exp.period})</li>`).join('')}
                        </ul>
                        <h3 class="font-semibold text-lg mb-2">Formação</h3>
                        <p class="text-slate-600 mb-4">${profileData.education}</p>
                        <h3 class="font-semibold text-lg mb-2">Competências</h3>
                        <div class="flex flex-wrap gap-2">
                            ${profileData.skills.map(s => `<span class="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">${s}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
        } else {
            profileContent.innerHTML = `
                <div class="bg-white p-6 rounded-2xl shadow-lg">
                    <div class="flex items-center gap-4 mb-6">
                        <img src="${profileData.photo}" class="w-24 h-24 rounded-lg">
                        <div>
                            <h2 class="text-2xl font-bold">${profileData.name}</h2>
                            <p class="text-slate-600">${profileData.sector}</p>
                        </div>
                    </div>
                    <div>
                        <h3 class="font-semibold text-lg mb-2">Sobre a Empresa</h3>
                        <p class="text-slate-600 mb-4">${profileData.about}</p>
                        <h3 class="font-semibold text-lg mb-2">Vagas em Aberto</h3>
                        <ul class="list-disc list-inside text-slate-600 space-y-1 mb-4">
                            ${profileData.openings.map(v => `<li>${v}</li>`).join('')}
                        </ul>
                        <h3 class="font-semibold text-lg mb-2">Nossa Cultura</h3>
                        <div class="flex flex-wrap gap-2">
                            ${profileData.culture.map(c => `<span class="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">${c}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // --- CARD SWIPE LOGIC ---
    let activeCard = null, startX = 0, currentX = 0, isDragging = false;

    function createCardElement(data) {
        const isJob = 'company' in data;
        const headerBg = isJob ? 'from-purple-600 to-indigo-600' : 'from-pink-500 to-orange-500';
        const skillsHTML = data.skills.map(skill => `<span class="bg-slate-200 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full">${skill}</span>`).join('');
        return `
            <div class="card absolute w-full h-full cursor-grab active:cursor-grabbing" data-id="${data.id}">
                <div class="w-full h-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
                    <div class="bg-gradient-to-br ${headerBg} text-white flex-shrink-0 h-3/5 flex flex-col justify-end p-6">
                        <p class="font-extrabold text-4xl leading-tight">${isJob ? data.company : data.name}</p>
                        <p class="text-2xl opacity-90">${data.title}</p>
                    </div>
                    <div class="p-6 flex-grow h-2/5 overflow-y-auto">
                        <h3 class="font-semibold mb-2">${isJob ? 'Competências da Vaga' : 'Principais Competências'}</h3>
                        <div class="flex flex-wrap gap-2 mb-4">${skillsHTML}</div>
                        <p class="text-slate-600 text-sm">${isJob ? data.description : data.bio}</p>
                    </div>
                </div>
            </div>`;
    }

    function loadCards() {
        const cardStack = document.getElementById('card-stack');
        if (!cardStack) return;
        currentCardIndex = 0;
        cardStack.innerHTML = cardsData.map(createCardElement).reverse().join('');

        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mousedown', (e) => onDragStart(e));
            card.addEventListener('touchstart', (e) => onDragStart(e), { passive: true });
        });
    }

    function onDragStart(e) {
        if (currentCardIndex >= cardsData.length || isDragging) return;
        activeCard = document.querySelector('.card:last-child');
        if (!activeCard) return;

        startX = e.pageX || e.touches[0].pageX;
        isDragging = true;
        activeCard.classList.remove('releasing');
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('touchmove', onDragMove, { passive: true });
        document.addEventListener('mouseup', onDragEnd);
        document.addEventListener('touchend', onDragEnd);
    }

    function onDragMove(e) {
        if (!isDragging || !activeCard) return;
        currentX = (e.pageX || e.touches[0].pageX) - startX;
        activeCard.style.transform = `translateX(${currentX}px) rotate(${currentX * 0.1}deg)`;
    }

    function onDragEnd() {
        if (!isDragging || !activeCard) return;
        isDragging = false;
        const decisionThreshold = window.innerWidth / 4;

        if (Math.abs(currentX) > decisionThreshold) {
            handleSwipeAction(currentX > 0 ? 'like' : 'reject', true);
        } else {
            activeCard.classList.add('releasing');
            activeCard.style.transform = '';
        }

        document.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('touchmove', onDragMove);
        document.removeEventListener('mouseup', onDragEnd);
        document.removeEventListener('touchend', onDragEnd);
        currentX = 0;
    }

    function handleSwipeAction(action, fromDrag = false) {
        if (currentCardIndex >= cardsData.length) return;
        const cardToRemove = document.querySelector('.card:last-child');
        if (!cardToRemove) return;

        cardToRemove.style.pointerEvents = 'none';
        cardToRemove.classList.add('releasing');

        if (fromDrag) {
            const finalX = (action === 'like' ? 1 : -1) * (window.innerWidth / 2 + cardToRemove.clientWidth);
            cardToRemove.style.transform = `translateX(${finalX}px) rotate(${currentX * 0.1}deg)`;
        } else {
            const rotation = action === 'like' ? 15 : -15;
            cardToRemove.style.transform = `translateX(${action === 'like' ? '150%' : '-150%'}) rotate(${rotation}deg)`;
        }

        setTimeout(() => {
            cardToRemove.remove();
        }, 400);

        const swipedItem = cardsData[currentCardIndex];
        // *** FIX: Every 'like' is now a match ***
        if (action === 'like') {
            setTimeout(() => showMatch(currentUser, swipedItem), 400);
        }

        currentCardIndex++;
        if (currentCardIndex >= cardsData.length) {
            setTimeout(() => {
                const cardStack = document.getElementById('card-stack');
                if (cardStack) {
                   cardStack.innerHTML = '<p class="text-center text-slate-500 p-8">Não há mais perfis por hoje. Volte amanhã!</p>';
                }
            }, 500);
        }
    }

    // --- MATCH LOGIC ---
    function showMatch(user1, user2) {
        const isJob = 'company' in user2;
        document.getElementById('match-name').textContent = isJob ? user2.company : user2.name;
        document.getElementById('match-img-1').src = user1.photo;
        document.getElementById('match-img-2').src = isJob ? user2.logo : user2.photo;
        matchOverlay.classList.remove('hidden');
        matchOverlay.classList.add('flex');
        lucide.createIcons();
    }

    document.getElementById('keep-swiping-btn').addEventListener('click', () => {
        matchOverlay.classList.add('hidden');
        matchOverlay.classList.remove('flex');
    });
    document.getElementById('go-to-chat-btn').addEventListener('click', () => {
        alert("Funcionalidade de Chat a ser implementada nas próximas versões.");
        matchOverlay.classList.add('hidden');
        matchOverlay.classList.remove('flex');
    });
});
