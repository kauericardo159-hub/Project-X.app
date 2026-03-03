/* ==========================================================================
      PROJECT-X | VISUALIZAÇÃO DE PERFIL (PROFILE VIEW)
========================================================================== */

const ProfileView = {
    init: function() {
        this.injectCSS();
        this.renderProfile();
    },

    // CSS para organizar as informações do perfil de forma estilosa
    injectCSS: function() {
        const style = document.createElement('style');
        style.innerHTML = `
            .profile-container { color: #fff; font-family: 'Inter', sans-serif; animation: fadeIn 0.8s ease; }
            
            /* Cabeçalho de Perfil */
            .header-wrapper { position: relative; margin-bottom: 60px; }
            .banner-img { width: 100%; height: 180px; object-fit: cover; border-radius: 0 0 20px 20px; background: #111; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
            .avatar-img { width: 110px; height: 110px; border-radius: 50%; border: 5px solid #0d0d0d; position: absolute; bottom: -50px; left: 20px; object-fit: cover; background: #222; }
            
            /* Botão Editar */
            .edit-btn-anchor { position: absolute; bottom: -45px; right: 20px; padding: 10px 20px; background: #ff6b00; color: #000; border-radius: 12px; font-weight: 800; text-decoration: none; font-size: 0.8rem; transition: 0.3s; box-shadow: 0 4px 15px rgba(255, 107, 0, 0.3); }
            .edit-btn-anchor:hover { transform: translateY(-3px); filter: brightness(1.1); }

            /* Info do Usuário */
            .user-info { padding: 0 20px; text-align: left; }
            .user-info h1 { font-size: 1.5rem; font-weight: 800; margin-bottom: 2px; }
            .user-info .user-handle { color: #ff6b00; font-size: 0.9rem; font-weight: 600; margin-bottom: 15px; display: block; }
            
            /* Badges e Stats */
            .data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0; }
            .data-item { background: rgba(255,255,255,0.05); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,107,0,0.1); }
            .data-item span { display: block; font-size: 0.65rem; color: #ff6b00; text-transform: uppercase; font-weight: 800; margin-bottom: 4px; }
            .data-item p { font-size: 0.9rem; font-weight: 600; color: #eee; }

            /* Bio Section */
            .bio-box { background: rgba(255,107,0,0.03); border: 1px dashed rgba(255,107,0,0.2); padding: 15px; border-radius: 15px; margin-top: 10px; }
            .bio-box span { font-size: 0.7rem; color: #ff6b00; font-weight: 800; display: block; margin-bottom: 8px; }
            .bio-box p { font-size: 0.95rem; color: #ccc; line-height: 1.4; }

            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        `;
        document.head.appendChild(style);
    },

    renderProfile: function() {
        // Carrega os dados reais do save-system
        const data = NexusStorage.loadProfile();
        const container = document.querySelector('.profile-view');

        if (!container) return;

        container.innerHTML = `
            <div class="profile-container">
                <div class="header-wrapper">
                    <img src="${data.banner}" class="banner-img" alt="Banner">
                    <img src="${data.avatar}" class="avatar-img" alt="Avatar">
                    
                    <a href="EditarPerfil.html" class="edit-btn-anchor">EDITAR PERFIL</a>
                </div>

                <div class="user-info">
                    <h1>${data.name}</h1>
                    <span class="user-handle">${data.nick} • ${data.id}</span>

                    <div class="data-grid">
                        <div class="data-item">
                            <span>Nascimento</span>
                            <p>${data.birth || "00/00/0000"}</p>
                        </div>
                        <div class="data-item">
                            <span>Idade</span>
                            <p>${data.age || "Não informada"}</p>
                        </div>
                        <div class="data-item">
                            <span>Pronome</span>
                            <p>${data.pronoun || "Não definido"}</p>
                        </div>
                        <div class="data-item">
                            <span>Membro desde</span>
                            <p>${data.joinDate || "Recentemente"}</p>
                        </div>
                    </div>

                    <div class="bio-box">
                        <span>BIO</span>
                        <p>${data.bio}</p>
                    </div>
                </div>
            </div>
        `;
    }
};

// Inicia a renderização
document.addEventListener('DOMContentLoaded', () => ProfileView.init());
