/* ==========================================================================
      COMPONENTS SYSTEM - PROJECT-X (ORANGE SUNSET V2)
      Novidades: Botão Configurações e Dock Otimizado
========================================================================== */

function loadComponents() {
    const profile = typeof NexusStorage !== 'undefined' ? NexusStorage.loadProfile() : {
        nick: localStorage.getItem('nexus_user_nick') || '@visitante',
        avatar: localStorage.getItem('nexus_user_avatar') || 'user-photo.jpg'
    };

    const style = document.createElement('style');
    style.innerHTML = `
        /* --- NAVBAR TOPO --- */
        .navbar-topo {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 20px;
            background: rgba(10, 10, 10, 0.85);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 107, 0, 0.15);
            position: sticky;
            top: 0;
            z-index: 10000;
        }
        .logo-box { display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .logo-box img { width: 28px; height: 28px; border-radius: 6px; }
        .logo-box span { font-weight: 900; font-size: 1rem; color: #fff; letter-spacing: 1px; }
        .logo-box span b { color: #ff6b00; }

        .user-header-info { display: flex; align-items: center; gap: 12px; }
        .user-text-wrap { display: flex; flex-direction: column; text-align: right; }
        .user-text-wrap .name { font-weight: 800; font-size: 0.85rem; color: #fff; line-height: 1.2; }
        
        .status-row { 
            display: flex; 
            align-items: center; 
            justify-content: flex-end; 
            gap: 6px; 
            margin-top: 2px;
        }
        .status-icon { 
            width: 12px; 
            height: 12px; 
            object-fit: contain;
        }
        .status-text { 
            font-size: 0.65rem; 
            font-weight: 700; 
            color: #aaa; 
            text-transform: uppercase; 
            letter-spacing: 0.5px;
        }

        .mini-avatar-header { 
            width: 38px; 
            height: 38px; 
            border-radius: 50%; 
            border: 2px solid #ff6b00; 
            object-fit: cover; 
            background: #222;
        }

        /* --- BARRA INFERIOR (FLOATING DOCK - 3 ITENS) --- */
        .menu-inferior {
            position: fixed;
            bottom: 20px; 
            left: 50%;
            transform: translateX(-50%);
            width: 92%;
            max-width: 380px; /* Aumentado levemente para 3 ícones */
            height: 68px;
            background: rgba(15, 15, 15, 0.95);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 107, 0, 0.25);
            border-radius: 25px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            z-index: 9999;
            box-shadow: 0 15px 35px rgba(0,0,0,0.7);
            padding: 0 10px;
        }
        .nav-item { 
            text-decoration: none; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            color: #777; 
            flex: 1; /* Distribui o espaço igualmente */
            transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .nav-item img { width: 20px; height: 20px; opacity: 0.4; transition: 0.3s; }
        .nav-item span { font-size: 0.55rem; font-weight: 800; margin-top: 6px; letter-spacing: 0.5px; }
        
        .nav-item.active { color: #ff6b00; transform: translateY(-5px); }
        .nav-item.active img { opacity: 1; filter: drop-shadow(0 0 8px rgba(255,107,0,0.6)); }
    `;
    document.head.appendChild(style);

    // Estrutura do Topo
    const headerHTML = `
        <header class="navbar-topo">
            <div class="logo-box" onclick="window.location.href='index.html'">
                <img src="icon.png" alt="X">
                <span>PROJ<b>ECT-X</b></span>
            </div>
            
            <div class="user-header-info">
                <div class="user-text-wrap">
                    <span class="name">${profile.nick}</span>
                    <div class="status-row">
                        <img src="status-online.png" class="status-icon" id="current-status-img">
                        <span class="status-text" id="current-status-text">Online</span>
                    </div>
                </div>
                <img src="${profile.avatar}" class="mini-avatar-header" onerror="this.src='user-photo.jpg'">
            </div>
        </header>
    `;

    // Lógica de Ativação dos Botões
    const path = window.location.pathname;
    const isHome = path.includes('index.html') || path.endsWith('/') || path === '';
    const isPerfil = path.includes('perfil.html');
    const isConfig = path.includes('configuracoes.html');

    const navHTML = `
        <nav class="menu-inferior">
            <a href="index.html" class="nav-item ${isHome ? 'active' : ''}">
                <img src="home-icon.png" alt="Home">
                <span>INÍCIO</span>
            </a>
            <a href="perfil.html" class="nav-item ${isPerfil ? 'active' : ''}">
                <img src="profile-icon.png" alt="Profile">
                <span>PERFIL</span>
            </a>
            <a href="configuracoes.html" class="nav-item ${isConfig ? 'active' : ''}">
                <img src="config-icon.png" alt="Settings">
                <span>AJUSTES</span>
            </a>
        </nav>
    `;

    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    document.body.insertAdjacentHTML('beforeend', navHTML);
}

window.addEventListener('DOMContentLoaded', loadComponents);
