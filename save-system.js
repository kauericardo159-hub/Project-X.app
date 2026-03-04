/* ==========================================================================
      PROJECT-X | NEXUS STORAGE ENGINE V10.0 (CORE TITANIUM)
      Foco: Apenas Gestão de Perfis, Contas e Segurança de Dados.
      (Sistema de Feed desativado neste arquivo para evitar conflitos)
========================================================================== */

const NexusStorage = {
    dbName: "NexusDatabase",
    dbVersion: 10, // Versão elevada para garantir limpeza de estruturas antigas
    db: null,

    /**
     * INICIALIZAÇÃO DO MOTOR DE DADOS
     */
    async init() {
        await this.requestPersistence();

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                // Cria apenas a store de contas se não existir
                if (!db.objectStoreNames.contains('accounts')) {
                    db.createObjectStore('accounts', { keyPath: 'nick' });
                    console.log("🛠️ Store 'accounts' criada.");
                }
            };

            request.onsuccess = async (e) => {
                this.db = e.target.result;
                console.log("🚀 Nexus Engine V10.0: Motor de Contas Ativo.");
                await this.selfHealSystem(); 
                resolve();
            };

            request.onerror = (e) => {
                console.error("❌ Falha crítica no motor:", e.target.error);
                reject(e.target.error);
            };
        });
    },

    /**
     * PROTEÇÃO CONTRA LIMPEZA AUTOMÁTICA DO NAVEGADOR
     */
    async requestPersistence() {
        if (navigator.storage && navigator.storage.persist) {
            await navigator.storage.persist();
        }
    },

    /**
     * SISTEMA DE AUTO-REPARAÇÃO (LS <-> IDB)
     */
    async selfHealSystem() {
        if (!this.db) return;

        const tx = this.db.transaction('accounts', 'readonly');
        const store = tx.objectStore('accounts');
        const request = store.getAll();

        request.onsuccess = () => {
            const idbData = request.result;
            const lsAccounts = JSON.parse(localStorage.getItem('nexus_accounts') || '{}');
            let updated = false;

            // Cura o LocalStorage se ele estiver vazio mas o IDB tiver dados
            if (idbData.length > 0) {
                idbData.forEach(item => {
                    if (!lsAccounts[item.nick]) {
                        lsAccounts[item.nick] = item.data;
                        updated = true;
                    }
                });
                if (updated) {
                    localStorage.setItem('nexus_accounts', JSON.stringify(lsAccounts));
                    console.log("🔧 LocalStorage recuperado via IndexedDB.");
                }
            }
        };
    },

    getActiveUser() {
        const nick = localStorage.getItem('nexus_user_nick');
        if (!nick) return null;
        return nick.replace('@', '').toLowerCase().trim();
    },

    getAllUsers() {
        const accounts = JSON.parse(localStorage.getItem('nexus_accounts') || '{}');
        return Object.keys(accounts).map(key => ({
            nick: `@${key}`,
            name: accounts[key].name || "Usuário Nexus",
            avatar: accounts[key].avatar || "user-photo.jpg",
            uid: accounts[key].uid || "#0000"
        }));
    },

    /* ==========================================================================
          SISTEMA DE PERFIL
    ========================================================================== */

    async saveUserData(data) {
        const user = this.getActiveUser();
        if (!user) return false;

        // 1. Atualiza LocalStorage
        const accounts = JSON.parse(localStorage.getItem('nexus_accounts') || '{}');
        accounts[user] = { ...accounts[user], ...data, lastUpdate: Date.now() };
        localStorage.setItem('nexus_accounts', JSON.stringify(accounts));

        // 2. Atualiza IndexedDB (Cópia de Segurança)
        return new Promise((resolve) => {
            const tx = this.db.transaction('accounts', 'readwrite');
            const store = tx.objectStore('accounts');
            const req = store.put({ nick: user, data: accounts[user] });
            req.onsuccess = () => resolve(true);
            req.onerror = () => resolve(false);
        });
    },

    loadProfile() {
        const user = this.getActiveUser();
        const accounts = JSON.parse(localStorage.getItem('nexus_accounts') || '{}');
        const data = accounts[user] || {};

        return {
            nick: user ? `@${user}` : "@visitante",
            uid: data.uid || localStorage.getItem('nexus_user_id') || "#0000",
            name: data.name || "Membro Nexus",
            bio: data.bio || "Este perfil ainda não possui uma biografia.",
            avatar: data.avatar || "user-photo.jpg",
            banner: data.banner || "banner.jpg",
            fullBg: data.fullBg || "bg-padrao-nexus.png",
            bgDarkness: data.bgDarkness !== undefined ? data.bgDarkness : 0.5,
            joinDate: data.joinDate || "2026",
            birth: data.birth || "--/--/----",
            pronoun: data.pronoun || "Não definido",
            age: data.age || "—"
        };
    },

    async saveMedia(file, type) {
        const user = this.getActiveUser();
        if (!user || !file) return false;
        try {
            const result = await this.processMedia(file, type === 'fullBg' ? 1200 : 800);
            const update = {};
            update[type] = result.data;
            return await this.saveUserData(update);
        } catch (e) { return false; }
    },

    async processMedia(file, maxWidth = 800) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                if (file.type.includes('video')) return resolve({ data: e.target.result, type: 'video' });
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let w = img.width, h = img.height;
                    if (w > maxWidth) { h *= maxWidth / w; w = maxWidth; }
                    canvas.width = w; canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, w, h);
                    resolve({ data: canvas.toDataURL('image/jpeg', 0.7), type: 'image' });
                };
            };
            reader.onerror = reject;
        });
    },

    /* ==========================================================================
          BACKUP EXTERNO (JSON)
    ========================================================================== */

    exportProfileBackup() {
        const user = this.getActiveUser();
        const accounts = JSON.parse(localStorage.getItem('nexus_accounts') || '{}');
        if (!user || !accounts[user]) return;

        const blob = new Blob([JSON.stringify({ nick: user, data: accounts[user] })], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nexus_backup_${user}.json`;
        a.click();
    }
};

const SaveSystem = {
    async processProfileUpdate(profileData) {
        if (profileData.files) {
            if (profileData.files.avatar) await NexusStorage.saveMedia(profileData.files.avatar, 'avatar');
            if (profileData.files.banner) await NexusStorage.saveMedia(profileData.files.banner, 'banner');
            if (profileData.files.fullBg) await NexusStorage.saveMedia(profileData.files.fullBg, 'fullBg');
        }
        await NexusStorage.saveUserData({
            name: profileData.name,
            birth: profileData.birth,
            pronoun: profileData.pronoun,
            bio: profileData.bio,
            bgDarkness: profileData.bgDarkness,
            age: profileData.age
        });
    }
};

// Inicialização automática
NexusStorage.init();
