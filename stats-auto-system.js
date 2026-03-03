/* ==========================================================================
      SYSTEM: STATS AUTOMÁTICO (LIVE SYSTEM)
========================================================================== */

const StatusSystem = {
    // Configurações de tempo (em milissegundos)
    config: {
        idleTime: 30000,    // 30 segundos sem mexer = Ausente
        inactiveTime: 60000, // 60 segundos sem mexer = Inativo
        checkInterval: 1000  // Checar a cada 1 segundo
    },

    lastActivity: Date.now(),

    // Definição dos estados
    states: {
        online:  { label: 'Online',  img: 'status-online.png',  color: '#2ecc71' },
        ausente: { label: 'Ausente', img: 'status-ausente.png', color: '#f1c40f' },
        inativo: { label: 'Inativo', img: 'status-inatico.png', color: '#e74c3c' },
        offline: { label: 'Off-line', img: 'status-offline.png', color: '#95a5a6' }
    },

    /* ==========================================================================
          INICIALIZAÇÃO E MONITORES
    ========================================================================== */
    init: function() {
        // Registrar qualquer interação como atividade
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(evt => {
            document.addEventListener(evt, () => this.resetTimer(), { passive: true });
        });

        // Iniciar o loop de verificação
        setInterval(() => this.checkStatus(), this.config.checkInterval);
        console.log("System: Stats Automático Ativado.");
    },

    resetTimer: function() {
        // Se estava ausente e voltou a mexer, volta para Online imediatamente
        if (Date.now() - this.lastActivity > this.config.idleTime) {
            this.updateUI(this.states.online);
        }
        this.lastActivity = Date.now();
    },

    /* ==========================================================================
          LÓGICA DE VERIFICAÇÃO (LIVE)
    ========================================================================== */
    checkStatus: function() {
        const diff = Date.now() - this.lastActivity;

        if (diff >= this.config.inactiveTime) {
            this.updateUI(this.states.inativo);
        } 
        else if (diff >= this.config.idleTime) {
            this.updateUI(this.states.ausente);
        } 
        else {
            this.updateUI(this.states.online);
        }
    },

    /* ==========================================================================
          ATUALIZAÇÃO VISUAL (DOM)
    ========================================================================== */
    updateUI: function(state) {
        // 1. Atualizar na Navbar (injetada pelo components.js)
        const navStatusImg = document.querySelector('.status-row img');
        const navStatusText = document.getElementById('status-text');

        // 2. Atualizar no Perfil (se estiver na página de perfil)
        const profileStatusImg = document.querySelector('.status-badge img');
        const profileStatusText = document.querySelector('.status-badge span');

        // Aplicar mudanças se os elementos existirem na tela
        if (navStatusImg) navStatusImg.src = state.img;
        if (navStatusText) navStatusText.innerText = state.label;

        if (profileStatusImg) profileStatusImg.src = state.img;
        if (profileStatusText) profileStatusText.innerText = state.label;
        
        // Opcional: Mudar cor do texto do status para dar feedback visual
        if (navStatusText) navStatusText.style.color = state.color;
    }
};

// Iniciar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => StatusSystem.init());
