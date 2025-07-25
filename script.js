document.addEventListener('DOMContentLoaded', function () {
    // --- STATE MANAGEMENT ---
    let userType = ''; // 'candidate' or 'company'
    let currentUser = {};
    let cardsData = [];
    let currentCardIndex = 0;

    // --- DOM ELEMENTS ---
    const initialScreens = document.getElementById('initial-screens');
    const appContainer = document.getElementById('app-container');
    const views = {
        welcome: document.getElementById('welcome-page'),
        login: document.getElementById('login-page'),
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
            switchScreen('login');
        });
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        currentUser = users[userType];
        cardsData = userType === 'candidate' ? [...jobCardsData] : [...candidateCardsData];
        setupAppUI();
        initialScreens.classList.add('hidden');
        appContainer.classList.remove('hidden');
    });

    function switchScreen(screenName) {
        Object.values(views).forEach(v => v.classList.remove('active'));
        if(views[screenName]) {
            views[screenName].classList.add('active');
        }
    }

    // --- UI & NAVIGATION ---
    function setupAppUI() {
        mainContent.innerHTML = `
            <div id="swipe-view" class="view active h-full flex-col">
                <div class="flex-1 flex flex-col items-center justify-center p-4 overflow-hidden">
                    <div id="card-stack" class="relative w-full max-w-md h-full flex-1"></div>
                </div>
                <div class="flex-shrink-0 flex justify-center items-center gap-6 py-4">
                    <button class="swipe-action-btn bg-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg" data-action="reject"><i data-lucide="x" class="w-10 h-10 text-red-500"></i></button>
                    <button class="swipe-action-btn bg-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg" data-action="like"><i data-lucide="check" class="w-10 h-10 text-green-500"></i></button>
                </div>
            </div>
            <div id="chat-view" class="view hidden h-full flex-col bg-slate-50">
                <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-4">
                    <p class="text-center text-slate-500 pt-8">Envie uma mensagem para iniciar a conversa.</p>
                </div>
                <div class="p-4 bg-white border-t">
                    <form id="chat-form" class="flex items-center gap-2">
                        <input type="text" id="chat-input" placeholder="Digite sua mensagem..." class="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-full" autocomplete="off">
                        <button type="submit" class="bg-blue-600 text-white rounded-full p-3 flex-shrink-0"><i data-lucide="send" class="w-5 h-5"></i></button>
                    </form>
                </div>
            </div>
            <div id="profile-view" class="view hidden h-full flex-col">
               <div class="flex-1 overflow-y-auto p-6">
                    <div class="text-center">
                        <img src="${currentUser.photo}" class="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-200">
                        <h2 class="text-2xl font-bold">${currentUser.name}</h2>
                        <p class="text-slate-600">${userType === 'candidate' ? 'Candidato' : 'Empresa'}</p>
                    </div>
                    <div class="mt-8">
                       <button class="w-full text-left p-4 bg-white rounded-lg shadow-sm mb-2">Editar Perfil</button>
                       <button class="w-full text-left p-4 bg-white rounded-lg shadow-sm mb-2">Configurações</button>
                       <button class="w-full text-left p-4 bg-white rounded-lg shadow-sm text-red-500">Sair</button>
                    </div>
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
                switchMainView(viewName);
                document.querySelectorAll('.nav-link').forEach(nav => nav.classList.add('text-slate-500'));
                e.currentTarget.classList.remove('text-slate-500');
                e.currentTarget.classList.add('text-blue-600');
            });
        });

        loadCards();

        const chatForm = document.getElementById('chat-form');
        const chatInput = document.getElementById('chat-input');
        const chatMessages = document.getElementById('chat-messages');
        if (chatForm) {
            chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const messageText = chatInput.value.trim();
                if (messageText === '') return;
                if (chatMessages.querySelector('p')) chatMessages.innerHTML = '';
                addChatMessage(messageText, 'sent', chatMessages);
                chatInput.value = '';
                chatMessages.scrollTop = chatMessages.scrollHeight;
                setTimeout(() => {
                    const replyText = getSimulatedReply();
                    addChatMessage(replyText, 'received', chatMessages);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1000 + Math.random() * 500);
            });
        }
    }

    function switchMainView(viewId) {
        document.querySelectorAll('#main-content .view').forEach(view => view.classList.remove('active'));
        const viewToShow = document.getElementById(viewId);
        if (viewToShow) viewToShow.classList.add('active');
    }

    // --- CARD SWIPE LOGIC ---
    // ... (toda a lógica de arrastar e soltar do cartão permanece a mesma)

    // --- MATCH LOGIC ---
    // ... (toda a lógica de correspondência permanece a mesma)

    let messageCounter = 0;
    function getSimulatedReply() {
        const replies = ["Olá!", "Que legal!", "Entendi.", "Perfeito!", "Obrigado!"];
        const reply = replies[messageCounter % replies.length];
        messageCounter++;
        return reply;
    }

    function addChatMessage(text, type, container) {
        const messageElement = document.createElement('div');
        const bubbleClasses = type === 'sent' ? 'bg-blue-600 text-white self-end' : 'bg-white text-slate-800 self-start';
        messageElement.className = `flex w-full ${type === 'sent' ? 'justify-end' : 'justify-start'}`;
        messageElement.innerHTML = `<div class="max-w-xs md:max-w-md p-3 rounded-2xl shadow-sm ${bubbleClasses}">${text}</div>`;
        container.appendChild(messageElement);
    }
});
