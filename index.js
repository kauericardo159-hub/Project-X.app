/* ==========================================================================
      PROJECT-X | INDEX SYSTEM (BOAS-VINDAS & LISTA DE USUÁRIOS)
========================================================================== */

const IndexSystem = {
    init: function() {
        this.injectCSS();
        this.renderHome();
    },

    // ==================================================
    // CSS DO SISTEMA DE VISITANTE E BOAS-VINDAS
    // ==================================================
    injectCSS: function() {
        const style = document.createElement('style');
        style.innerHTML = `
            /* Welcome Card para Visitantes */
            .welcome-card {
                background: linear-gradient(135px, #111 0%, #1a1a1a 100%);
                border: 1px solid rgba(255, 107, 0, 0.3);
                border-radius: 20px;
                padding: 30px;
                margin: 20px;
                text-align: center;
                animation: slideIn 0.6s ease-out;
            }
            .welcome-card h2 { color: #fff; margin-bottom: 10px; font-weight: 900; }
            .welcome-card h2 b { color: #ff6b00; }
            .welcome-card p { color: #888; font-size: 0.9rem; margin-bottom: 25px; line-height: 1.4; }
            .btn-login-index {
                background: #ff6b00; color: #000; padding: 15px; border-radius: 12px;
                text-decoration: none; font-weight: 800; font-size: 0.9rem; transition: 0.3s;
                display: block; box-shadow: 0 4px 15px rgba(255, 107, 0, 0.2);
            }

            /* ==================================================
               CSS DA LISTA DE USUÁRIOS REAIS
            ================================================== */
            .users-section { padding: 15px 0; background: #050505; border-bottom: 1px solid #222; margin-bottom: 10px; }
            .users-list-label { font-size: 0.65rem; color: #ff6b00; font-weight: 800; margin-left: 20px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
            
            .users-scroll { 
                display: flex; gap: 15px; overflow-x: auto; padding: 0 20px; 
                scrollbar-width: none; -ms-overflow-style: none;
            }
            .users-scroll::-webkit-scrollbar { display: none; }

            .user-item { display: flex; flex-direction: column; align-items: center; min-width: 70px; cursor: pointer; }
            .user-photo-wrap { position: relative; width: 60px; height: 60px; border-radius: 50%; padding: 2px; border: 2px solid #ff6b00; margin-bottom: 5px; }
            .user-photo-wrap img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; background: #222; }
            
            /* Stats Indicator na lista */
            .user-status-dot { position: absolute; bottom: 2px; right: 2px; width: 14px; height: 14px; border-radius: 50%; border: 3px solid #050505; background: #00ff00; }
            .user-name-label { color: #fff; font-size: 0.65rem; font-weight: 600; width: 70px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

            /* ==================================================
               CSS DO MINI-CARD (USUÁRIO ATUAL)
            ================================================== */
            .self-card {
                background: #111; border: 1px solid #333; margin: 15px 20px; border-radius: 15px;
                padding: 12px; display: flex; align-items: center; gap: 15px;
            }
            .self-avatar { width: 50px; height: 50px; border-radius: 50%; border: 2px solid #ff6b00; object-fit: cover; }
            .self-info { flex: 1; }
            .self-id { font-size: 0.55rem; color: #ff6b00; font-weight: 800; opacity: 0.7; }
            .self-name { color: #fff; font-size: 0.85rem; font-weight: 800; display: block; }
            .self-stats { font-size: 0.6rem; color: #00ff00; font-weight: 700; display: flex; align-items: center; gap: 4px; }

            @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        `;
        document.head.appendChild(style);
    },

    // ==================================================
    // LÓGICA DE RENDERIZAÇÃO
    // ==================================================
    renderHome: function() {
        const user = NexusStorage.getActiveUser();
        const allUsers = NexusStorage.getAllUsers(); // Puxa todas as contas criadas
        const mainContent = document.querySelector('main');
        
        if (!user) {
            // TELA PARA VISITANTE
            mainContent.innerHTML = `
                <div class="welcome-card">
                    <h2>Bem-vindo ao PROJ<b>ECT-X</b></h2>
                    <p>Você está acessando como visitante. Entre na sua conta para interagir com a comunidade.</p>
                    <a href="login.html" class="btn-login-index">ENTRAR OU CRIAR CONTA</a>
                </div>
            `;
            return;
        }

        // TELA PARA USUÁRIO LOGADO
        const profile = NexusStorage.loadProfile();
        
        // 1. Inicia o HTML da Home
        let homeHTML = `
            <div class="self-card">
                <img src="${profile.avatar}" class="self-avatar" onerror="this.src='user-photo.jpg'">
                <div class="self-info">
                    <span class="self-id">UID: ${profile.uid || 'NX-001'}</span>
                    <span class="self-name">${profile.name}</span>
                    <div class="self-stats">
                         <img src="status-online.png" style="width: 8px;"> ONLINE
                    </div>
                </div>
            </div>

            <div class="users-section">
                <div class="users-list-label">Comunidade Project-X</div>
                <div class="users-scroll" id="usersListScroll">
                    ${this.generateUsersList(allUsers)}
                </div>
            </div>

            <div id="global-feed" style="padding: 20px; color: #444; text-align: center; font-size: 0.8rem;">
                <p>Nenhuma postagem nova por enquanto...</p>
            </div>
        `;

        mainContent.innerHTML = homeHTML;
    },

    // ==================================================
    // LISTA DE USUÁRIOS REAIS (APENAS CRIADOS NO SISTEMA)
    // ==================================================
    generateUsersList: function(users) {
        if (!users || users.length === 0) return '<p style="color:#444; font-size:0.6rem; padding-left:20px;">Nenhum usuário ativo.</p>';

        return users.map(u => `
            <div class="user-item" onclick="window.location.href='perfil.html?u=${u.nick}'">
                <div class="user-photo-wrap">
                    <img src="${u.avatar || 'user-photo.jpg'}" alt="${u.name}">
                    <div class="user-status-dot"></div>
                </div>
                <span class="user-name-label">${u.name}</span>
            </div>
        `).join('');
    }
};

document.addEventListener('DOMContentLoaded', () => IndexSystem.init());
