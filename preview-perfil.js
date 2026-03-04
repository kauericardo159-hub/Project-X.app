/* ==========================================================================
      PROJECT-X | PREVIEW PROFILE ENGINE (VISUALIZAÇÃO DE TERCEIROS)
========================================================================== */

const PreviewProfile = {
    init: async function() {
        // 1. Pega o nick da URL (?u=nome)
        const params = new URLSearchParams(window.location.search);
        const targetNick = params.get('u');

        if (!targetNick) {
            console.error("Usuário não especificado.");
            window.location.href = 'index.html';
            return;
        }

        // 2. Busca os dados no NexusStorage
        const allAccounts = JSON.parse(localStorage.getItem('nexus_accounts') || '{}');
        const userData = allAccounts[targetNick.toLowerCase()];

        if (!userData) {
            document.body.innerHTML = "<h1 style='color:white; text-align:center; margin-top:50px;'>Usuário não encontrado!</h1>";
            return;
        }

        this.injectCSS(userData.bgDarkness || 0.5);
        this.render(userData, targetNick);
    },

    injectCSS: function(darkness) {
        const style = document.createElement('style');
        style.innerHTML = `
            /* O CSS aqui será similar ao perfil.js, mas com ajustes de visualização */
            .preview-container { color: #fff; font-family: 'Inter', sans-serif; min-height: 100vh; }
            
            .full-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -2; }
            .dark-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #000; opacity: ${darkness}; z-index: -1; }
            
            .header { position: relative; height: 200px; }
            .banner { width: 100%; height: 100%; object-fit: cover; border-radius: 0 0 25px 25px; }
            
            .avatar-box { position: absolute; bottom: -50px; left: 20px; }
            .avatar { width: 100px; height: 100px; border-radius: 50%; border: 4px solid #000; object-fit: cover; }
            
            .info-section { padding: 60px 20px 20px; }
            .name { font-size: 1.5rem; font-weight: 900; margin: 0; }
            .handle { color: #ff6b00; font-weight: 700; font-size: 0.9rem; }
            
            .bio-card { background: rgba(0,0,0,0.5); padding: 15px; border-radius: 15px; margin-top: 20px; border: 1px solid rgba(255,107,0,0.2); backdrop-filter: blur(10px); }
            
            /* Botão de Voltar */
            .back-btn { position: fixed; top: 20px; left: 20px; background: rgba(0,0,0,0.6); color: #fff; border: 1px solid #ff6b00; padding: 10px; border-radius: 50%; z-index: 100; cursor: pointer; }
        `;
        document.head.appendChild(style);
    },

    render: function(data, nick) {
        const container = document.querySelector('.preview-render-area');
        
        container.innerHTML = `
            <button class="back-btn" onclick="window.history.back()">←</button>
            
            <img src="${data.fullBg || 'bg-padrao.png'}" class="full-bg">
            <div class="dark-overlay"></div>

            <div class="preview-container">
                <div class="header">
                    <img src="${data.banner || 'banner.jpg'}" class="banner">
                    <div class="avatar-box">
                        <img src="${data.avatar || 'user-photo.jpg'}" class="avatar">
                    </div>
                </div>

                <div class="info-section">
                    <h1 class="name">${data.name}</h1>
                    <span class="handle">@${nick} • ${data.uid || '#0000'}</span>
                    
                    <div class="bio-card">
                        <p style="font-size: 0.9rem; color: #ccc; line-height: 1.5;">${data.bio || 'Sem biografia.'}</p>
                    </div>
                    
                    </div>
            </div>
        `;
    }
};

document.addEventListener('DOMContentLoaded', () => PreviewProfile.init());
