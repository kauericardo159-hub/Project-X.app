/* ==========================================================================
      PROJECT-X | EDITAR PERFIL (CREATIVE STUDIO)
========================================================================== */

const EditProfile = {
    init: function() {
        this.injectCSS();
        this.renderForm();
        this.setupListeners();
        this.preventExit();
    },

    injectCSS: function() {
        const style = document.createElement('style');
        style.innerHTML = `
            .edit-container { color: #fff; font-family: 'Inter', sans-serif; animation: slideUp 0.6s ease; }
            .preview-section { position: relative; margin-bottom: 80px; }
            .banner-preview { width: 100%; height: 120px; border-radius: 15px; object-fit: cover; background: #1a1a1a; border: 1px solid rgba(255,107,0,0.3); }
            .avatar-preview { width: 90px; height: 90px; border-radius: 50%; border: 4px solid #050505; position: absolute; bottom: -45px; left: 20px; object-fit: cover; background: #222; }
            
            .upload-group { display: flex; gap: 10px; margin-top: 55px; margin-bottom: 25px; }
            .btn-upload { flex: 1; padding: 10px; font-size: 0.7rem; border-radius: 8px; border: 1px solid #ff6b00; background: rgba(255,107,0,0.1); color: #ff6b00; cursor: pointer; font-weight: bold; text-align: center; transition: 0.3s; }
            
            .input-box { margin-bottom: 15px; text-align: left; }
            .input-box label { display: block; font-size: 0.7rem; color: #ff6b00; text-transform: uppercase; margin-bottom: 5px; font-weight: 800; }
            .input-box input, .input-box textarea { width: 100%; background: #111; border: 1px solid #333; padding: 12px; border-radius: 10px; color: #fff; outline: none; transition: 0.3s; font-family: inherit; }
            .input-box textarea { height: 80px; resize: none; font-size: 0.9rem; }
            .input-box input:focus, .input-box textarea:focus { border-color: #ff6b00; background: #161616; }
            
            .action-btns { display: flex; gap: 15px; margin-top: 30px; }
            .btn-save { flex: 2; padding: 15px; border-radius: 12px; background: #ff6b00; color: #000; border: none; font-weight: 800; cursor: pointer; }
            .btn-cancel { flex: 1; padding: 15px; border-radius: 12px; background: #222; color: #fff; border: none; cursor: pointer; }
            
            .px-toast { position: fixed; top: 20px; right: 20px; padding: 16px 24px; background: #ff6b00; color: #000; border-radius: 12px; font-weight: 800; z-index: 10000; animation: toastIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); border-left: 5px solid #fff; }
            .px-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 10001; }
            .px-modal { background: #111; border: 1px solid #ff6b00; padding: 30px; border-radius: 24px; width: 90%; max-width: 400px; text-align: center; }
            
            @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes toastIn { from { transform: translateX(120%); } to { transform: translateX(0); } }
        `;
        document.head.appendChild(style);
    },

    renderForm: function() {
        const data = NexusStorage.loadProfile();
        const container = document.querySelector('.edit-screen');
        
        container.innerHTML = `
            <div class="edit-container">
                <div class="preview-section">
                    <img src="${data.banner}" id="viewBanner" class="banner-preview">
                    <img src="${data.avatar}" id="viewAvatar" class="avatar-preview">
                </div>

                <div class="upload-group">
                    <label class="btn-upload">ESCOLHER AVATAR <input type="file" id="inAvatar" hidden accept="image/*"></label>
                    <label class="btn-upload">ESCOLHER BANNER <input type="file" id="inBanner" hidden accept="image/*"></label>
                </div>

                <div class="input-box">
                    <label>Nome</label>
                    <input type="text" id="editName" value="${data.name}">
                </div>

                <div class="input-box">
                    <label>@Usuário (7 dias para alterar)</label>
                    <input type="text" id="editNick" value="${data.nick}">
                </div>

                <div class="input-box">
                    <label>Data de Nascimento</label>
                    <input type="text" id="editBirth" placeholder="00/00/0000" maxlength="10" value="${data.birth}">
                </div>

                <div class="input-box">
                    <label>Idade (Emojis permitidos)</label>
                    <input type="text" id="editAge" placeholder="Ex: 19 ⚡" value="${data.age}">
                </div>

                <div class="input-box">
                    <label>Pronome</label>
                    <input type="text" id="editPronoun" placeholder="Ex: Ele/Dele" value="${data.pronoun}">
                </div>

                <div class="input-box">
                    <label>Biografia</label>
                    <textarea id="editBio" placeholder="Conte um pouco sobre você...">${data.bio}</textarea>
                </div>

                <div class="action-btns">
                    <button class="btn-cancel" onclick="EditProfile.confirmCancel()">CANCELAR</button>
                    <button class="btn-save" onclick="EditProfile.save()">SALVAR ALTERAÇÕES</button>
                </div>
            </div>
        `;
    },

    setupListeners: function() {
        const birthInput = document.getElementById('editBirth');
        if(birthInput) {
            birthInput.addEventListener('input', e => {
                let v = e.target.value.replace(/\D/g,'');
                if (v.length > 2) v = v.slice(0,2) + '/' + v.slice(2);
                if (v.length > 5) v = v.slice(0,5) + '/' + v.slice(5,10);
                e.target.value = v;
            });
        }
        document.getElementById('inAvatar').onchange = e => this.previewMedia(e, 'viewAvatar');
        document.getElementById('inBanner').onchange = e => this.previewMedia(e, 'viewBanner');
    },

    previewMedia: function(e, elementId) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = img => document.getElementById(elementId).src = img.target.result;
            reader.readAsDataURL(file);
        }
    },

    save: function() {
        const newNick = document.getElementById('editNick').value.trim();
        const currentNick = localStorage.getItem('nexus_user_nick');
        const lastChange = localStorage.getItem('nexus_nick_last_change') || 0;
        const now = Date.now();

        if (newNick !== currentNick) {
            const daysPassed = (now - lastChange) / (1000 * 60 * 60 * 24);
            if (daysPassed < 7) {
                this.showToast("⏳ Aguarde 7 dias para mudar o @usuário!");
                return;
            }
            localStorage.setItem('nexus_nick_last_change', now);
            localStorage.setItem('nexus_user_nick', newNick);
        }

        // Salva fotos (Se houver novas selecionadas)
        const avInput = document.getElementById('inAvatar').files[0];
        const bnInput = document.getElementById('inBanner').files[0];
        if(avInput) NexusStorage.saveMedia(avInput, 'avatar');
        if(bnInput) NexusStorage.saveMedia(bnInput, 'banner');

        // Salva todos os textos, incluindo a nova Bio
        NexusStorage.saveUserData({
            name: document.getElementById('editName').value,
            birth: document.getElementById('editBirth').value,
            age: document.getElementById('editAge').value,
            pronoun: document.getElementById('editPronoun').value,
            bio: document.getElementById('editBio').value
        });

        this.showToast("✅ Alterações salvas com sucesso!");
        setTimeout(() => { window.onbeforeunload = null; window.location.href = 'perfil.html'; }, 1500);
    },

    confirmCancel: function() {
        const modal = document.createElement('div');
        modal.className = 'px-modal-overlay';
        modal.innerHTML = `
            <div class="px-modal">
                <h4>Descartar alterações?</h4>
                <p>Todas as mudanças feitas serão perdidas permanentemente.</p>
                <div class="action-btns">
                    <button class="btn-cancel" id="closeModal">VOLTAR</button>
                    <button class="btn-save" id="confirmExit">DESCARTAR</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('closeModal').onclick = () => modal.remove();
        document.getElementById('confirmExit').onclick = () => {
            window.onbeforeunload = null;
            window.location.href = 'perfil.html';
        };
    },

    preventExit: function() {
        window.onbeforeunload = (e) => {
            e.preventDefault();
            return "Mudanças não salvas serão perdidas!";
        };
    },

    showToast: function(msg) {
        const t = document.createElement('div');
        t.className = 'px-toast';
        t.innerText = msg;
        document.body.appendChild(t);
        setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 500); }, 2500);
    }
};

document.addEventListener('DOMContentLoaded', () => EditProfile.init());
