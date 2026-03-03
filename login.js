/* ==========================================================================
      SISTEMA DE AUTENTICAÇÃO PROJECT-X - SPACE EDITION
========================================================================== */

const LoginSystem = {
    // Inicialização
    init: function() {
        this.injectCSS();
        this.renderLogin();
    },

    // Injeção de CSS para os elementos de interface
    injectCSS: function() {
        const style = document.createElement('style');
        style.innerHTML = `
            .login-container {
                color: #fff;
                font-family: 'Inter', sans-serif;
                animation: fadeIn 0.5s ease;
            }
            .login-container h2 {
                margin-bottom: 25px;
                font-weight: 800;
                letter-spacing: 1px;
                background: linear-gradient(to right, #00c6ff, #b400ff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-align: center;
            }
            .input-group {
                margin-bottom: 20px;
                text-align: left;
            }
            .input-group label {
                display: block;
                font-size: 0.75rem;
                color: #8a2be2;
                margin-bottom: 8px;
                text-transform: uppercase;
                font-weight: 700;
            }
            .input-group input {
                width: 100%;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(0, 198, 255, 0.2);
                padding: 12px 15px;
                border-radius: 12px;
                color: #fff;
                outline: none;
                transition: 0.3s;
            }
            .input-group input:focus {
                border-color: #00c6ff;
                background: rgba(255, 255, 255, 0.1);
                box-shadow: 0 0 10px rgba(0, 198, 255, 0.2);
            }
            .btn-main {
                width: 100%;
                padding: 14px;
                border-radius: 12px;
                border: none;
                background: linear-gradient(90deg, #0066ff, #8a2be2);
                color: #fff;
                font-weight: 800;
                cursor: pointer;
                transition: 0.3s;
                margin-top: 10px;
            }
            .btn-main:hover {
                filter: brightness(1.2);
                transform: translateY(-2px);
            }
            .btn-secondary {
                background: transparent;
                color: #00c6ff;
                border: 1px solid #00c6ff;
                margin-top: 15px;
                width: 100%;
                padding: 10px;
                border-radius: 12px;
                cursor: pointer;
                font-size: 0.8rem;
                font-weight: 600;
            }
            .footer-text {
                margin-top: 20px;
                font-size: 0.85rem;
                color: #aaa;
                text-align: center;
            }
            .disabled-input {
                opacity: 0.5;
                cursor: not-allowed;
            }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        `;
        document.head.appendChild(style);
    },

    /* ==========================================================================
          GERADOR DE ID ÚNICO
    ========================================================================== */
    generateUniqueID: function(existingAccounts) {
        let isUnique = false;
        let newID = "";
        
        while (!isUnique) {
            // Gera um número entre 1000 e 9999
            newID = Math.floor(1000 + Math.random() * 9000).toString();
            
            // Verifica se algum usuário já tem esse ID
            const idExists = Object.values(existingAccounts).some(acc => acc.userID === newID);
            if (!idExists) isUnique = true;
        }
        return newID;
    },

    /* ==========================================================================
          TELAS (RENDERIZAÇÃO)
    ========================================================================== */

    renderLogin: function() {
        const container = document.querySelector('.login-screen');
        container.innerHTML = `
            <div class="login-container">
                <h2>PROJECT-X</h2>
                <div class="input-group">
                    <label>@Nome ou E-mail</label>
                    <input type="text" id="loginUser" placeholder="Digite seu usuário">
                </div>
                <div class="input-group">
                    <label>Senha</label>
                    <input type="password" id="loginPass" placeholder="Digite sua senha">
                </div>
                <button class="btn-main" onclick="LoginSystem.handleLogin()">ENTRAR</button>
                <div class="footer-text">
                    Não tem uma conta? <br>
                    <button class="btn-secondary" onclick="LoginSystem.renderRegister()">CRIAR CONTA</button>
                </div>
            </div>
        `;
    },

    renderRegister: function() {
        const container = document.querySelector('.login-screen');
        container.innerHTML = `
            <div class="login-container">
                <h2>CRIAR CONTA</h2>
                <div class="input-group">
                    <label>Nome</label>
                    <input type="text" id="regRealName" placeholder="Seu nome real">
                </div>
                <div class="input-group">
                    <label>@Usuário</label>
                    <input type="text" id="regUser" placeholder="@nome_unico">
                </div>
                <div class="input-group">
                    <label>Senha</label>
                    <input type="password" id="regPass" placeholder="Crie uma senha">
                </div>
                <div class="input-group">
                    <label>Confirmar Senha</label>
                    <input type="password" id="regPassConfirm" placeholder="Repita a senha">
                </div>
                <div class="input-group">
                    <label>E-mail (Indisponível)</label>
                    <input type="email" class="disabled-input" disabled placeholder="Indisponível por enquanto">
                </div>
                <button class="btn-main" onclick="LoginSystem.handleRegister()">CRIAR CONTA</button>
                <button class="btn-secondary" onclick="LoginSystem.renderLogin()">VOLTAR AO LOGIN</button>
            </div>
        `;
    },

    /* ==========================================================================
          LÓGICA DE DADOS
    ========================================================================== */

    handleRegister: function() {
        const name = document.getElementById('regRealName').value;
        const user = document.getElementById('regUser').value.replace('@', '').toLowerCase().trim();
        const pass = document.getElementById('regPass').value;
        const passConfirm = document.getElementById('regPassConfirm').value;

        if (!name || !user || !pass) return alert("Preencha todos os campos!");
        if (pass !== passConfirm) return alert("As senhas não coincidem!");

        const existingUsers = JSON.parse(localStorage.getItem('nexus_accounts') || '{}');
        
        // Verifica se o usuário já existe (Indisponível se já usado)
        if (existingUsers[user]) return alert("Este @usuário já está em uso e não está disponível!");

        // GERA O ID ÚNICO PARA O NOVO USUÁRIO
        const newUserID = this.generateUniqueID(existingUsers);

        // Salvar nova conta com ID
        existingUsers[user] = { 
            name: name, 
            pass: pass,
            userID: newUserID,
            joinDate: new Date().toLocaleDateString()
        };
        
        localStorage.setItem('nexus_accounts', JSON.stringify(existingUsers));
        
        // Logar automaticamente e salvar sessão
        localStorage.setItem('nexus_user_nick', `@${user}`);
        localStorage.setItem('nexus_user_id', `#${newUserID}`);
        
        alert(`Conta criada! Seu ID é #${newUserID}`);
        window.location.href = 'index.html';
    },

    handleLogin: function() {
        const userInput = document.getElementById('loginUser').value.replace('@', '').toLowerCase().trim();
        const pass = document.getElementById('loginPass').value;

        const accounts = JSON.parse(localStorage.getItem('nexus_accounts') || '{}');
        const userData = accounts[userInput];

        if (userData && userData.pass === pass) {
            // Salva o nick e o ID da conta encontrada
            localStorage.setItem('nexus_user_nick', `@${userInput}`);
            localStorage.setItem('nexus_user_id', `#${userData.userID}`);
            window.location.href = 'index.html';
        } else {
            alert("Usuário ou senha incorretos!");
        }
    }
};

// Iniciar sistema
document.addEventListener('DOMContentLoaded', () => LoginSystem.init());
