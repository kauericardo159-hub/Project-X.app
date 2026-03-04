/* ==========================================================================
      PROJECT-X | CONFIGURAÇÕES SYSTEM V1.1
      Função: Gestão de Sessão e Desconexão
========================================================================== */

const ConfigSettings = {
    init: function() {
        this.injectCSS();
        this.render();
    },

    // ==================================================
    // ESTILIZAÇÃO DA INTERFACE
    // ==================================================
    injectCSS: function() {
        const style = document.createElement('style');
        style.innerHTML = `
            .config-container {
                padding: 25px 20px;
                padding-bottom: 110px;
                animation: fadeIn 0.4s ease-out;
            }

            .config-header { margin-bottom: 35px; }
            .config-header p { color: #ff6b00; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px; }
            .config-header h1 { font-size: 1.8rem; font-weight: 900; color: #fff; margin: 0; }

            .config-section { margin-bottom: 30px; }
            .section-label { font-size: 0.7rem; color: #444; font-weight: 800; text-transform: uppercase; margin-left: 5px; margin-bottom: 12px; display: block; }

            .config-card {
                background: rgba(15, 15, 15, 0.8);
                border: 1px solid rgba(255, 107, 0, 0.1);
                border-radius: 20px;
                overflow: hidden;
                backdrop-filter: blur(10px);
            }

            .config-item {
                display: flex;
                align-items: center;
                padding: 18px;
                gap: 15px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.03);
            }
            .config-item:last-child { border-bottom: none; }

            .item-icon {
                width: 40px; height: 40px;
                background: rgba(255, 107, 0, 0.05);
                border-radius: 12px;
                display: flex; align-items: center; justify-content: center;
                font-size: 1.1rem;
            }

            .item-info { flex: 1; }
            .item-info span { display: block; font-size: 0.9rem; font-weight: 700; color: #fff; }
            .item-info p { font-size: 0.65rem; color: #666; margin-top: 2px; }

            /* ÁREA DE SAÍDA */
            .logout-zone { margin-top: 50px; text-align: center; }
            .btn-logout {
                width: 100%;
                padding: 18px;
                background: rgba(255, 50, 50, 0.1);
                border: 1px solid rgba(255, 50, 50, 0.2);
                border-radius: 18px;
                color: #ff4444;
                font-weight: 900;
                font-size: 0.8rem;
                letter-spacing: 1px;
                cursor: pointer;
                transition: 0.3s;
                text-transform: uppercase;
            }
            .btn-logout:active { background: rgba(255, 50, 50, 0.2); transform: scale(0.98); }

            @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        `;
        document.head.appendChild(style);
    },

    // ==================================================
    // RENDERIZAÇÃO DINÂMICA
    // ==================================================
    render: function() {
        const root = document.getElementById('config-root');
        if (!root) return;

        root.innerHTML = `
            <div class="config-container">
                <div class="config-header">
                    <p>Central de Controle</p>
                    <h1>Configurações</h1>
                </div>

                <div class="config-section">
                    <span class="section-label">Sessão Atual</span>
                    <div class="config-card">
                        <div class="config-item">
                            <div class="item-icon">📱</div>
                            <div class="item-info">
                                <span>Dispositivo Ativo</span>
                                <p>Acesso autorizado via Navegador</p>
                            </div>
                        </div>
                        <div class="config-item">
                            <div class="item-icon">🛡️</div>
                            <div class="item-info">
                                <span>Segurança do Save</span>
                                <p>Sincronizado com Nexus Database</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="logout-zone">
                    <button class="btn-logout" onclick="ConfigSettings.logout()">Desconectar da Conta</button>
                    <p style="font-size: 0.55rem; color: #222; margin-top: 20px; font-weight: 800;">PROJECT-X ENGINE v6.0</p>
                </div>
            </div>
        `;
    },

    // ==================================================
    // LÓGICA DE LOGOUT
    // ==================================================
    logout: function() {
        // Remove apenas o nick ativo para forçar novo login
        localStorage.removeItem('nexus_user_nick');
        
        // Feedback visual rápido antes do redirecionamento
        const btn = document.querySelector('.btn-logout');
        btn.innerText = "SAINDO...";
        btn.style.opacity = "0.5";

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 500);
    }
};

document.addEventListener('DOMContentLoaded', () => ConfigSettings.init());
