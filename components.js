// Função para carregar os componentes
function loadComponents() {
    const nickAtivo = localStorage.getItem('userNick') || 'Viajante';
    const fotoAtiva = localStorage.getItem('userPhoto') || 'user-photo.jpg';

    // 1. INJETAR O TOPO (Navbar)
    const headerHTML = `
        <header class="navbar-topo">
            <div class="logo-container" onclick="window.location.href='index.html'" style="cursor:pointer">
                <img src="icon.png" alt="Logo" class="site-icon">
                <span class="site-name">Project X</span>
            </div>
            <div class="user-status">
                <span id="welcome-user">Olá, ${nickAtivo}</span>
            </div>
        </header>
    `;

    // 2. INJETAR A BARRA INFERIOR (Menu)
    // Verifica em qual página estamos para dar o brilho (active) no ícone certo
    const path = window.location.pathname;
    const isHome = path.includes('index.html') || path.endsWith('/');
    const isPerfil = path.includes('perfil.html');

    const navHTML = `
        <nav class="menu-inferior">
            <a href="index.html" class="nav-item ${isHome ? 'active' : ''}">
                <img src="home-icon.png" alt="Home">
                <span>Home</span>
            </a>
            <a href="perfil.html" class="nav-item ${isPerfil ? 'active' : ''}">
                <img src="profile-icon.png" alt="Profile">
                <span>Profile</span>
            </a>
            <a href="#" class="nav-item" onclick="logout()">
                <img src="https://cdn-icons-png.flaticon.com/512/182/182448.png" alt="Sair" style="filter: invert(1) brightness(0.7);">
                <span>Sair</span>
            </a>
        </nav>
    `;

    // Inserir no início e no fim do body
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    document.body.insertAdjacentHTML('beforeend', navHTML);
}

// Função de Logout
function logout() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'login.html';
}

// Executar ao carregar a página
window.addEventListener('DOMContentLoaded', loadComponents);
