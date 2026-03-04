/* ==========================================================================
      PROJECT-X | VISUALIZAÇÃO DE PERFIL (PROFILE VIEW V2)
      Novidades: Suporte a Fundo Global e Overlay de Escuridão Dinâmico
========================================================================== */

const ProfileView = {
    init: function() {
        const data = NexusStorage.loadProfile();
        this.injectCSS(data.bgDarkness); // Passamos a escuridão para o CSS
        this.renderProfile(data);
    },

    injectCSS: function(darkness = 0.5) {
        const style = document.createElement('style');
        style.innerHTML = `
            /* Estrutura de Fundo Global */
            .nx-full-background {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                object-fit: cover;
                z-index: -2;
            }

            .nx-dark-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: #000;
                opacity: ${darkness}; /* Valor dinâmico vindo do editor */
                z-index: -1;
            }

            .profile-container { 
                color: #fff; 
                font-family: 'Inter', sans-serif; 
                animation: fadeIn 0.8s ease;
                min-height: 100vh;
                padding-bottom: 40px;
            }
            
            /* Cabeçalho de Perfil */
            .header-wrapper { position: relative; margin-bottom: 60px; }
            .banner-img { 
                width: 100%; 
                height: 200px; 
                object-fit: cover; 
                border-radius: 0 0 25px 25px; 
                background: #111; 
                box-shadow: 0 10px 40px rgba(0,0,0,0.8);
                border-bottom: 1px solid rgba(255,107,0,0.2);
            }
            
            /* Avatar e Círculo de Status */
            .avatar-wrapper { 
                position: absolute; 
                bottom: -50px; 
                left: 20px; 
                width: 120px; 
                height: 120px; 
            }
            .avatar-img { 
                width: 100%; 
                height: 100%; 
                border-radius: 50%; 
                border: 6px solid #0a0a0a; 
                object-fit: cover; 
                background: #222;
                box-shadow: 0 5px 20px rgba(0,0,0,0.5);
            }
            .status-indicator-profile {
                position: absolute;
                bottom: 8px;
                right: 8px;
                width: 30px;
                height: 30px;
                border: 4px solid #0a0a0a;
                border-radius: 50%;
                background: #000;
                z-index: 10;
            }
            
            /* Botão Editar */
            .edit-btn-anchor { 
                position: absolute; 
                bottom: -45px; 
                right: 20px; 
                padding: 12px 24px; 
                background: #ff6b00; 
                color: #000; 
                border-radius: 14px; 
                font-weight: 900; 
                text-decoration: none; 
                font-size: 0.75rem; 
                transition: 0.3s; 
                box-shadow: 0 8px 20px rgba(255, 107, 0, 0.4); 
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .edit-btn-anchor:hover { transform: translateY(-3px) scale(1.05); filter: brightness(1.2); }

            /* Info do Usuário */
            .user-info { padding: 0 20px; text-align: left; margin-top: 15px; }
            .user-info h1 { font-size: 1.7rem; font-weight: 900; margin-bottom: 4px; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
            .user-info .user-handle { color: #ff6b00; font-size: 0.95rem; font-weight: 700; margin-bottom: 20px; display: block; opacity: 0.9; }
            
            /* Grid de Dados */
            .data-grid { 
                display: grid; 
                grid-template-columns: 1fr 1fr; 
                gap: 12px; 
                margin: 25px 0; 
            }
            .data-item { 
                background: rgba(0,0,0,0.4); 
                padding: 15px; 
                border-radius: 16px; 
                border: 1px solid rgba(255,107,0,0.15); 
                backdrop-filter: blur(10px);
            }
            .data-item span { display: block; font-size: 0.65rem; color: #ff6b00; text-transform: uppercase; font-weight: 900; margin-bottom: 5px; letter-spacing: 1px; }
            .data-item p { font-size: 1rem; font-weight: 600; color: #fff; }

            /* Bio Section Melhorada */
            .bio-box { 
                background: rgba(0,0,0,0.4); 
                border: 1px solid rgba(255,107,0,0.2); 
                padding: 20px; 
                border-radius: 20px; 
                margin-top: 15px; 
                backdrop-filter: blur(10px);
            }
            .bio-box span { font-size: 0.75rem; color: #ff6b00; font-weight: 900; display: block; margin-bottom: 12px; letter-spacing: 1.5px; }
            .bio-box p { font-size: 1rem; color: #e0e0e0; line-height: 1.6; white-space: pre-wrap; font-weight: 400; }

            @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        `;
        document.head.appendChild(style);
    },

    renderProfile: function(data) {
        const container = document.querySelector('.profile-view');
        if (!container) return;

        // Fundo padrão caso o usuário não tenha um fundo personalizado
        const defaultBg = "bg-padrao-nexus.png"; 
        const userBg = data.fullBg || defaultBg;

        container.innerHTML = `
            <img src="${userBg}" class="nx-full-background" id="main-profile-bg" onerror="this.src='${defaultBg}'">
            <div class="nx-dark-overlay"></div>

            <div class="profile-container">
                <div class="header-wrapper">
                    <img src="${data.banner}" class="banner-img" alt="Banner" onerror="this.src='banner.jpg'">
                    
                    <div class="avatar-wrapper">
                        <img src="${data.avatar}" class="avatar-img" alt="Avatar" onerror="this.src='user-photo.jpg'">
                        <img src="status-online.png" class="status-indicator-profile" id="profile-status-dot">
                    </div>
                    
                    <a href="EditarPerfil.html" class="edit-btn-anchor">EDITAR PERFIL</a>
                </div>

                <div class="user-info">
                    <h1>${data.name}</h1>
                    <span class="user-handle">@${data.nick} • ID: ${data.uid || '0000'}</span>

                    <div class="data-grid">
                        <div class="data-item">
                            <span>Nascimento</span>
                            <p>${data.birth || 'Não informado'}</p>
                        </div>
                        <div class="data-item">
                            <span>Pronome</span>
                            <p>${data.pronoun || 'Não informado'}</p>
                        </div>
                        <div class="data-item">
                            <span>Idade / Status</span>
                            <p>${data.age || '—'}</p>
                        </div>
                        <div class="data-item">
                            <span>Membro desde</span>
                            <p>${data.joinDate || 'Recente'}</p>
                        </div>
                    </div>

                    <div class="bio-box">
                        <span>BIOGRAFIA</span>
                        <p>${data.bio || 'Este usuário ainda não escreveu uma biografia...'}</p>
                    </div>
                </div>
            </div>
        `;
    }
};

document.addEventListener('DOMContentLoaded', () => ProfileView.init());
