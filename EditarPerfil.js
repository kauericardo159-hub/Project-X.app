/* ==========================================================================
      PROJECT-X | EDITAR PERFIL (CREATIVE STUDIO V2)
      Novidades: Fundo Global, Controle de Escuridão e Bio Avançada
========================================================================== */

const EditProfile = {
    state: {
        bgDarkness: 0.5,
        hasUnsavedChanges: false
    },

    init: function() {
        this.injectCSS();
        this.renderForm();
        this.setupListeners();
        this.preventExit();
    },

    injectCSS: function() {
        const style = document.createElement('style');
        style.innerHTML = `
            :root { --nx-main: #ff6b00; --nx-bg: #050505; --nx-card: #111; }
            
            .edit-container { color: #fff; font-family: 'Inter', sans-serif; animation: slideUp 0.6s ease; max-width: 500px; margin: auto; padding-bottom: 50px; }
            
            /* Preview System */
            .preview-header { position: relative; margin-bottom: 60px; border-radius: 20px; overflow: visible; background: var(--nx-card); border: 1px solid #222; }
            .banner-preview { width: 100%; height: 140px; border-radius: 18px 18px 0 0; object-fit: cover; background: #1a1a1a; }
            .avatar-preview { width: 95px; height: 95px; border-radius: 50%; border: 5px solid var(--nx-bg); position: absolute; bottom: -45px; left: 20px; object-fit: cover; background: #222; z-index: 2; }
            
            /* Background Preview Mini */
            .bg-preview-wrapper { margin: 20px 0; padding: 15px; background: var(--nx-card); border-radius: 15px; border: 1px solid #222; }
            .bg-mini-frame { width: 100%; height: 80px; border-radius: 10px; position: relative; overflow: hidden; background: #000; margin-bottom: 10px; border: 1px dashed #444; }
            #viewFullBg { width: 100%; height: 100%; object-fit: cover; transition: 0.3s; }
            .bg-overlay-preview { position: absolute; inset: 0; background: #000; pointer-events: none; }

            /* Grid Layout */
            .upload-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin: 20px 0; }
            .btn-upload { background: rgba(255,107,0,0.05); border: 1px solid rgba(255,107,0,0.3); color: var(--nx-main); padding: 12px 5px; border-radius: 10px; cursor: pointer; font-size: 0.65rem; font-weight: 800; text-align: center; transition: 0.2s; display: flex; flex-direction: column; align-items: center; gap: 5px; }
            .btn-upload:hover { background: rgba(255,107,0,0.15); border-color: var(--nx-main); }

            /* Inputs */
            .input-box { margin-bottom: 18px; }
            .input-box label { display: block; font-size: 0.7rem; color: var(--nx-main); text-transform: uppercase; margin-bottom: 6px; font-weight: 900; letter-spacing: 1px; }
            .input-box input, .input-box textarea { width: 100%; background: #0f0f0f; border: 1px solid #222; padding: 14px; border-radius: 12px; color: #fff; outline: none; transition: 0.3s; font-size: 0.95rem; }
            .input-box textarea { height: 110px; resize: none; line-height: 1.5; }
            .input-box input:focus, .input-box textarea:focus { border-color: var(--nx-main); box-shadow: 0 0 15px rgba(255,107,0,0.1); }
            
            /* Darkness Slider */
            .slider-group { margin-top: 5px; }
            input[type=range] { width: 100%; accent-color: var(--nx-main); cursor: pointer; }

            /* Action Bar */
            .action-bar { display: flex; gap: 12px; margin-top: 40px; position: sticky; bottom: 20px; z-index: 100; }
            .btn-save { flex: 2; padding: 18px; border-radius: 15px; background: var(--nx-main); color: #000; border: none; font-weight: 900; cursor: pointer; box-shadow: 0 10px 20px rgba(255,107,0,0.2); }
            .btn-cancel { flex: 1; padding: 18px; border-radius: 15px; background: #1a1a1a; color: #eee; border: 1px solid #333; font-weight: 600; cursor: pointer; }

            /* New Loading/Toast Style */
            .nx-sync-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 20000; display: flex; flex-direction: column; align-items: center; justify-content: center; animation: fadeIn 0.3s ease; }
            .nx-sync-box { text-align: center; }
            .nx-spinner { width: 40px; height: 40px; border: 4px solid rgba(255,107,0,0.1); border-top-color: var(--nx-main); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 15px; }
            .nx-sync-text { color: var(--nx-main); font-weight: 800; letter-spacing: 2px; text-transform: uppercase; font-size: 0.8rem; }

            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        `;
        document.head.appendChild(style);
    },

    renderForm: function() {
        const data = NexusStorage.loadProfile();
        const container = document.querySelector('.edit-screen');
        this.state.bgDarkness = data.bgDarkness || 0.5;
        
        container.innerHTML = `
            <div class="edit-container">
                <div class="preview-header">
                    <img src="${data.banner}" id="viewBanner" class="banner-preview">
                    <img src="${data.avatar}" id="viewAvatar" class="avatar-preview">
                </div>

                <div class="upload-grid">
                    <label class="btn-upload"><span>PERFIL</span><input type="file" id="inAvatar" hidden accept="image/*"></label>
                    <label class="btn-upload"><span>BANNER</span><input type="file" id="inBanner" hidden accept="image/*"></label>
                    <label class="btn-upload"><span>FUNDO</span><input type="file" id="inFullBg" hidden accept="image/*"></label>
                </div>

                <div class="bg-preview-wrapper">
                    <div class="input-box" style="margin-bottom:10px">
                        <label>Ajuste de Escuridão do Fundo</label>
                        <div class="bg-mini-frame">
                            <div class="bg-overlay-preview" id="bgDarkOverlay" style="opacity: ${this.state.bgDarkness}"></div>
                            <img src="${data.fullBg || 'default-bg.png'}" id="viewFullBg">
                        </div>
                        <input type="range" id="darknessRange" min="0" max="1" step="0.1" value="${this.state.bgDarkness}">
                    </div>
                </div>

                <div class="input-box">
                    <label>Nome de Exibição</label>
                    <input type="text" id="editName" value="${data.name || ''}" placeholder="Seu nome real ou artístico">
                </div>

                <div class="input-box">
                    <label>Identidade @Nick</label>
                    <input type="text" id="editNick" value="${data.nick || ''}" placeholder="Seu nick único">
                </div>

                <div class="upload-grid" style="grid-template-columns: 1fr 1fr;">
                    <div class="input-box">
                        <label>Nascimento</label>
                        <input type="text" id="editBirth" placeholder="00/00/0000" maxlength="10" value="${data.birth || ''}">
                    </div>
                    <div class="input-box">
                        <label>Pronome</label>
                        <input type="text" id="editPronoun" placeholder="Ex: Ele/Dele" value="${data.pronoun || ''}">
                    </div>
                </div>

                <div class="input-box">
                    <label>Biografia Criativa</label>
                    <textarea id="editBio" placeholder="Escreva algo marcante sobre você...">${data.bio || ''}</textarea>
                </div>

                <div class="action-bar">
                    <button class="btn-cancel" onclick="EditProfile.confirmCancel()">DESCARTAR</button>
                    <button class="btn-save" onclick="EditProfile.save()">SINCRONIZAR PERFIL</button>
                </div>
            </div>
        `;
    },

    setupListeners: function() {
        // Preview de Imagens
        document.getElementById('inAvatar').onchange = e => this.previewMedia(e, 'viewAvatar');
        document.getElementById('inBanner').onchange = e => this.previewMedia(e, 'viewBanner');
        document.getElementById('inFullBg').onchange = e => this.previewMedia(e, 'viewFullBg');

        // Slider de Escuridão
        const range = document.getElementById('darknessRange');
        const overlay = document.getElementById('bgDarkOverlay');
        range.oninput = (e) => {
            const val = e.target.value;
            this.state.bgDarkness = val;
            overlay.style.opacity = val;
            this.state.hasUnsavedChanges = true;
        };

        // Máscara de Data
        document.getElementById('editBirth').oninput = e => {
            let v = e.target.value.replace(/\D/g,'');
            if (v.length > 2) v = v.slice(0,2) + '/' + v.slice(2);
            if (v.length > 5) v = v.slice(0,5) + '/' + v.slice(5,10);
            e.target.value = v;
            this.state.hasUnsavedChanges = true;
        };

        // Detectar mudanças simples
        const fields = ['editName', 'editNick', 'editPronoun', 'editBio'];
        fields.forEach(id => {
            document.getElementById(id).onchange = () => this.state.hasUnsavedChanges = true;
        });
    },

    previewMedia: function(e, elementId) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = img => {
                document.getElementById(elementId).src = img.target.result;
                this.state.hasUnsavedChanges = true;
            };
            reader.readAsDataURL(file);
        }
    },

    save: function() {
        this.showSyncLoading();

        setTimeout(() => {
            const profileData = {
                name: document.getElementById('editName').value,
                nick: document.getElementById('editNick').value,
                birth: document.getElementById('editBirth').value,
                pronoun: document.getElementById('editPronoun').value,
                bio: document.getElementById('editBio').value,
                bgDarkness: this.state.bgDarkness,
                // Referências para o SaveSystem processar os arquivos
                files: {
                    avatar: document.getElementById('inAvatar').files[0],
                    banner: document.getElementById('inBanner').files[0],
                    fullBg: document.getElementById('inFullBg').files[0]
                }
            };

            // Envia para o SaveSystem (Global)
            if (typeof SaveSystem !== 'undefined') {
                SaveSystem.processProfileUpdate(profileData);
            } else {
                // Fallback caso save-system não esteja pronto
                NexusStorage.saveUserData(profileData);
                if(profileData.files.avatar) NexusStorage.saveMedia(profileData.files.avatar, 'avatar');
                if(profileData.files.banner) NexusStorage.saveMedia(profileData.files.banner, 'banner');
                if(profileData.files.fullBg) NexusStorage.saveMedia(profileData.files.fullBg, 'fullBg');
            }

            this.state.hasUnsavedChanges = false;
            window.onbeforeunload = null;
            window.location.href = 'perfil.html';
        }, 2000);
    },

    showSyncLoading: function() {
        const overlay = document.createElement('div');
        overlay.className = 'nx-sync-overlay';
        overlay.innerHTML = `
            <div class="nx-sync-box">
                <div class="nx-spinner"></div>
                <div class="nx-sync-text">Sincronizando Nexus...</div>
            </div>
        `;
        document.body.appendChild(overlay);
    },

    confirmCancel: function() {
        if (!this.state.hasUnsavedChanges) {
            window.location.href = 'perfil.html';
            return;
        }

        if (confirm("Deseja descartar as alterações criativas?")) {
            window.onbeforeunload = null;
            window.location.href = 'perfil.html';
        }
    },

    preventExit: function() {
        window.onbeforeunload = (e) => {
            if (this.state.hasUnsavedChanges) {
                e.preventDefault();
                return "Existem edições não sincronizadas!";
            }
        };
    }
};

document.addEventListener('DOMContentLoaded', () => EditProfile.init());
