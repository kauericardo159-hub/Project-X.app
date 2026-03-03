/* ==========================================================================
      PROJECT-X | INDEX SYSTEM (FEED & GUEST CHECK)
========================================================================== */

const IndexSystem = {
    init: function() {
        this.injectCSS();
        this.checkUserStatus();
    },

    injectCSS: function() {
        const style = document.createElement('style');
        style.innerHTML = `
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
            
            .guest-actions { display: flex; flex-direction: column; gap: 12px; }
            
            .btn-login-index {
                background: #ff6b00;
                color: #000;
                padding: 15px;
                border-radius: 12px;
                text-decoration: none;
                font-weight: 800;
                font-size: 0.9rem;
                transition: 0.3s;
                box-shadow: 0 4px 15px rgba(255, 107, 0, 0.2);
            }
            .btn-login-index:hover { transform: scale(1.03); filter: brightness(1.1); }

            @keyframes slideIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    },

    checkUserStatus: function() {
        const user = NexusStorage.getActiveUser();
        const mainContent = document.querySelector('main');

        if (!user) {
            // Renderiza mensagem para Visitante
            mainContent.innerHTML = `
                <div class="welcome-card">
                    <h2>Bem-vindo ao PROJ<b>ECT-X</b></h2>
                    <p>Você está acessando como visitante. Entre na sua conta para personalizar seu perfil e interagir na rede.</p>
                    
                    <div class="guest-actions">
                        <a href="login.html" class="btn-login-index">ENTRAR OU CRIAR CONTA</a>
                    </div>
                </div>
            `;
        } else {
            // Aqui futuramente carregaremos o Feed
            const profile = NexusStorage.loadProfile();
            mainContent.innerHTML = `
                <div style="padding: 20px; color: #fff;">
                    <h3 style="color: #ff6b00;">Olá, ${profile.name}!</h3>
                    <p style="font-size: 0.8rem; color: #666;">O feed global está sendo preparado...</p>
                </div>
            `;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => IndexSystem.init());
