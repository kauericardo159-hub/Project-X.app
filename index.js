/* ==========================================================================
      PROJECT-X | INDEX SYSTEM V8.0 (PREMIUM UI + DYNAMIC STATS)
      Novidades: CSS Completo (Guest/Home), Integração com Stats Auto System
========================================================================== */

const IndexSystem = {
    state: {
        currentUser: null,
        allUsers: []
    },

    init: async function() {
        if (typeof NexusStorage !== 'undefined' && NexusStorage.init) {
            await NexusStorage.init();
        }
        
        this.state.currentUser = NexusStorage.loadProfile();
        this.state.allUsers = NexusStorage.getAllUsers();
        
        this.injectCSS();
        this.renderHome();
    },

    // ==================================================
    // 1. INTEGRAÇÃO COM STATS-AUTO-SYSTEM
    // ==================================================
    getUserStatus: function(nick) {
        const cleanNick = nick.replace('@', '');
        
        // 1. Tenta usar a função global do stats-auto-system.js, se existir
        if (typeof StatsSystem !== 'undefined' && StatsSystem.getUserStatus) {
            return StatsSystem.getUserStatus(cleanNick);
        }
        
        // 2. Fallback: Procura diretamente no localStorage (onde o sistema geralmente salva)
        const savedStatus = localStorage.getItem(`nexus_status_${cleanNick}`);
        return savedStatus ? savedStatus : 'offline'; // Se não achar nada, está offline
    },

    getStatusIcon: function(status) {
        status = status.toLowerCase();
        if (status === 'online') return 'status-online.png';
        if (status === 'ausente') return 'status-ausente.png';
        return 'status-offline.png'; // Padrão para offline ou desconhecido
    },

    // ==================================================
    // 2. CSS COMPLETO (INCLUINDO GUEST VIEW)
    // ==================================================
    injectCSS: function() {
        // Evita duplicar a tag <style> se a função rodar duas vezes
        if (document.getElementById('index-premium-styles')) return;

        const style = document.createElement('style');
        style.id = 'index-premium-styles';
        style.innerHTML = `
            :root { --nx-orange: #ff6b00; --nx-dark: #050505; --nx-card: #111; }

            /* --- GUEST VIEW (VISITANTES) --- */
            .welcome-card {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                margin: 40px 20px;
                padding: 40px 20px;
                background: rgba(15, 15, 15, 0.8);
                border: 1px solid rgba(255, 107, 0, 0.2);
                border-radius: 25px;
                backdrop-filter: blur(10px);
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            }

            .welcome-card h2 {
                color: #fff;
                font-size: 2.2rem;
                font-weight: 300;
                letter-spacing: 2px;
                margin-bottom: 10px;
            }
            .welcome-card h2 b { color: var(--nx-orange); font-weight: 900; }
            .welcome-card p { color: #888; font-size: 0.9rem; margin-bottom: 30px; }

            .btn-login-index {
                background: var(--nx-orange);
                color: #000;
                padding: 15px 35px;
                border-radius: 15px;
                font-weight: 900;
                text-decoration: none;
                text-transform: uppercase;
                letter-spacing: 1px;
                transition: transform 0.2s;
            }
            .btn-login-index:active { transform: scale(0.95); }

            /* --- CARD DO USUÁRIO PRINCIPAL --- */
            .quick-profile-card {
                position: relative;
                margin: 20px;
                border-radius: 25px;
                overflow: hidden;
                border: 1px solid rgba(255, 107, 0, 0.3);
                background: #000;
                box-shadow: 0 15px 35px rgba(0,0,0,0.6);
                cursor: pointer;
                transition: transform 0.3s ease;
            }
            .quick-profile-card:active { transform: scale(0.98); }

            .card-banner-bg {
                position: absolute;
                top: 0; left: 0; width: 100%; height: 100%;
                object-fit: cover;
                opacity: 0.3;
                filter: blur(3px);
                z-index: 0;
            }

            .card-content {
                position: relative;
                z-index: 1;
                padding: 25px 20px;
                display: flex;
                align-items: center;
                gap: 18px;
                background: linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.1));
            }

            .quick-avatar {
                width: 65px; height: 65px;
                border-radius: 50%;
                border: 3px solid var(--nx-orange);
                object-fit: cover;
                box-shadow: 0 0 20px rgba(255, 107, 0, 0.2);
            }

            .quick-info { display: flex; flex-direction: column; gap: 5px; }

            .quick-info .quick-name {
                color: #fff; font-size: 1.15rem; font-weight: 900;
                text-shadow: 0 2px 4px rgba(0,0,0,0.8);
            }

            .quick-status-row {
                display: flex; align-items: center; gap: 6px;
                background: rgba(0,0,0,0.6);
                padding: 5px 12px;
                border-radius: 20px;
                width: fit-content;
                border: 1px solid rgba(255,255,255,0.05);
            }

            .status-icon-small { width: 10px; height: 10px; object-fit: contain; }
            .status-text { color: #ccc; font-size: 0.65rem; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; }

            /* --- LISTA DA COMUNIDADE (SCROLL) --- */
            .community-box { padding: 10px 0 25px 0; border-bottom: 1px solid rgba(255,255,255,0.03); margin-bottom: 20px; }
            .section-title {
                font-size: 0.7rem; color: var(--nx-orange);
                font-weight: 900; margin: 0 0 15px 20px;
                text-transform: uppercase; letter-spacing: 2px;
                opacity: 0.9;
            }

            .users-scroll { 
                display: flex; gap: 18px; overflow-x: auto; 
                padding: 0 20px; scrollbar-width: none;
            }
            .users-scroll::-webkit-scrollbar { display: none; }

            .u-item { 
                display: flex; flex-direction: column; align-items: center; 
                min-width: 70px; text-decoration: none; cursor: pointer;
            }

            .u-photo-container {
                position: relative;
                width: 65px; height: 65px;
                border-radius: 50%;
                padding: 3px;
                background: linear-gradient(45deg, #222, #444);
                margin-bottom: 8px;
                border: 1px solid rgba(255,255,255,0.1);
                transition: transform 0.2s;
            }
            .u-item:active .u-photo-container { transform: scale(0.92); }
            .u-item.is-me .u-photo-container { background: var(--nx-orange); }

            .u-photo-container img.user-img {
                width: 100%; height: 100%;
                border-radius: 50%;
                object-fit: cover;
                background: #111;
                border: 2px solid #000;
            }

            .u-info-bottom {
                display: flex; align-items: center; gap: 5px;
                max-width: 80px;
                background: rgba(0,0,0,0.4);
                padding: 3px 8px;
                border-radius: 10px;
            }

            .u-name {
                color: #ddd; font-size: 0.7rem; font-weight: 700;
                white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            }
            .u-item.is-me .u-name { color: var(--nx-orange); }

            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        `;
        document.head.appendChild(style);
    },

    // ==================================================
    // 3. RENDERIZAÇÃO DA PÁGINA
    // ==================================================
    renderHome: function() {
        const userActive = NexusStorage.getActiveUser();
        const mainContent = document.querySelector('main');
        
        if (!mainContent) return;

        if (!userActive) {
            this.renderGuestView(mainContent);
            return;
        }

        const profile = this.state.currentUser;
        const myStatus = this.getUserStatus(profile.nick);
        const myStatusIcon = this.getStatusIcon(myStatus);
        
        mainContent.innerHTML = `
            <div class="quick-profile-card" onclick="window.location.href='perfil.html'">
                <img src="${profile.banner}" class="card-banner-bg" onerror="this.src='banner.jpg'">
                <div class="card-content">
                    <img src="${profile.avatar}" class="quick-avatar" onerror="this.src='user-photo.jpg'">
                    <div class="quick-info">
                        <span class="quick-name">${profile.name}</span>
                        <div class="quick-status-row">
                             <img src="${myStatusIcon}" class="status-icon-small">
                             <span class="status-text">${myStatus} • ${profile.uid}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="community-box">
                <div class="section-title">Membros da Rede</div>
                <div class="users-scroll">
                    ${this.generateCommunityHTML()}
                </div>
            </div>

            <div id="global-feed"></div>
        `;
    },

    renderGuestView: function(container) {
        container.innerHTML = `
            <div class="welcome-card" style="animation: fadeIn 0.8s ease;">
                <h2>PROJ<b>ECT-X</b></h2>
                <p>O Nexus aguarda sua conexão.</p>
                <a href="login.html" class="btn-login-index">CONECTAR AGORA</a>
            </div>
        `;
    },

    // ==================================================
    // 4. GERADOR DA COMUNIDADE (EU + OUTROS COM STATS)
    // ==================================================
    generateCommunityHTML: function() {
        const me = this.state.currentUser;
        const others = this.state.allUsers.filter(u => u.nick.replace('@','') !== me.nick.replace('@',''));
        
        const myStatus = this.getUserStatus(me.nick);
        const myStatusIcon = this.getStatusIcon(myStatus);

        let listHTML = `
            <div class="u-item is-me" onclick="window.location.href='perfil.html'">
                <div class="u-photo-container">
                    <img src="${me.avatar}" class="user-img" onerror="this.src='user-photo.jpg'">
                </div>
                <div class="u-info-bottom">
                    <span class="u-name">Você</span>
                    <img src="${myStatusIcon}" class="status-icon-small">
                </div>
            </div>
        `;

        if (others.length > 0) {
            listHTML += others.map(u => {
                const cleanNick = u.nick.replace('@', '');
                
                // Busca o status dinâmico deste usuário específico
                const userStatus = this.getUserStatus(cleanNick);
                const statusIcon = this.getStatusIcon(userStatus);

                return `
                    <div class="u-item" onclick="window.location.href='preview-perfil.html?u=${cleanNick}'">
                        <div class="u-photo-container">
                            <img src="${u.avatar}" class="user-img" onerror="this.src='user-photo.jpg'">
                        </div>
                        <div class="u-info-bottom">
                            <span class="u-name">${u.name.split(' ')[0]}</span>
                            <img src="${statusIcon}" class="status-icon-small" title="${userStatus}">
                        </div>
                    </div>
                `;
            }).join('');
        }

        return listHTML;
    }
};

document.addEventListener('DOMContentLoaded', () => IndexSystem.init());
