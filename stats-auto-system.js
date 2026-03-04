/* ==========================================================================
      PROJECT-X | STATS AUTO SYSTEM V9.0 (ULTRA-SYNC)
      Novidades: Persistência no LocalStorage, Broadcast de Status e Correções
========================================================================== */

const StatusSystem = {
    config: {
        idleTime: 30000,    // 30s = Ausente
        inactiveTime: 60000, // 60s = Inativo
        checkInterval: 2000  // Checagem a cada 2s para poupar CPU
    },

    lastActivity: Date.now(),
    currentState: null,

    states: {
        online:  { label: 'Online',  img: 'status-online.png',  color: '#2ecc71' },
        ausente: { label: 'Ausente', img: 'status-ausente.png', color: '#f1c40f' },
        inativo: { label: 'Inativo', img: 'status-inativo.png', color: '#e74c3c' },
        offline: { label: 'Off-line', img: 'status-offline.png', color: '#95a5a6' }
    },

    init: function() {
        // 1. Registrar eventos de atividade
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(evt => {
            document.addEventListener(evt, () => this.resetTimer(), { passive: true });
        });

        // 2. Iniciar loop de verificação
        setInterval(() => this.checkStatus(), this.config.checkInterval);

        // 3. Notificar offline ao fechar a aba
        window.addEventListener('beforeunload', () => this.broadcastStatus('offline'));

        console.log("🚀 System: Stats Automático Sincronizado.");
    },

    resetTimer: function() {
        const diff = Date.now() - this.lastActivity;
        // Se retornar de um estado de inatividade, força atualização imediata
        if (diff > this.config.idleTime) {
            this.checkStatus();
        }
        this.lastActivity = Date.now();
    },

    checkStatus: function() {
        const diff = Date.now() - this.lastActivity;
        let newState;

        if (diff >= this.config.inactiveTime) {
            newState = 'inativo';
        } 
        else if (diff >= this.config.idleTime) {
            newState = 'ausente';
        } 
        else {
            newState = 'online';
        }

        if (this.currentState !== newState) {
            this.currentState = newState;
            this.applyStatus(this.states[newState]);
        }
    },

    /**
     * Aplica visualmente e persiste o dado
     */
    applyStatus: function(stateObj) {
        // 1. Persistência no LocalStorage para o index.js ler
        this.broadcastStatus(stateObj.label);

        // 2. Elementos da Navbar (Componentes)
        const navImg = document.querySelector('.status-row img, .quick-status-row img');
        const navText = document.getElementById('status-text') || document.querySelector('.status-text');

        // 3. Elementos do Perfil
        const profileImg = document.querySelector('.status-badge img');
        const profileText = document.querySelector('.status-badge span');

        // Aplicação segura (apenas se o elemento existir)
        const targets = [
            { img: navImg, txt: navText },
            { img: profileImg, txt: profileText }
        ];

        targets.forEach(t => {
            if (t.img) t.img.src = stateObj.img;
            if (t.txt) {
                t.txt.innerText = stateObj.label;
                t.txt.style.color = stateObj.color;
            }
        });
    },

    /**
     * Salva o status de forma que o IndexSystem.getUserStatus consiga ler
     */
    broadcastStatus: function(label) {
        const user = localStorage.getItem('nexus_user_nick');
        if (user) {
            const cleanNick = user.replace('@', '').toLowerCase().trim();
            localStorage.setItem(`nexus_status_${cleanNick}`, label);
        }
    },

    // Função auxiliar para o IndexSystem consultar status de terceiros
    getUserStatus: function(nick) {
        const cleanNick = nick.replace('@', '').toLowerCase().trim();
        return localStorage.getItem(`nexus_status_${cleanNick}`) || 'offline';
    }
};

document.addEventListener('DOMContentLoaded', () => StatusSystem.init());
