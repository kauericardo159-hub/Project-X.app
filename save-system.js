/* ==========================================================================
      PROJECT-X | SISTEMA DE SALVAMENTO AVANÇADO (V3.0)
========================================================================== */

const NexusStorage = {
    
    // Pega o nick limpo do usuário logado
    getActiveUser: function() {
        const nick = localStorage.getItem('nexus_user_nick');
        if (!nick) return null;
        // Limpa o @ e espaços para usar como chave no banco
        return nick.replace('@', '').toLowerCase().trim();
    },

    /* ==========================================================================
          LISTAGEM DE COMUNIDADE (NOVO)
          Retorna todos os usuários reais cadastrados para a Home
    ========================================================================== */
    getAllUsers: function() {
        try {
            const accounts = JSON.parse(localStorage.getItem('nexus_accounts') || '{}');
            // Converte o objeto de contas em uma lista (Array) fácil de usar
            return Object.keys(accounts).map(key => ({
                nick: `@${key}`,
                name: accounts[key].name || "Usuário",
                avatar: accounts[key].avatar || "user-photo.jpg",
                uid: accounts[key].id || "#0000"
            }));
        } catch (e) {
            console.error("Erro ao listar comunidade", e);
            return [];
        }
    },

    /* ==========================================================================
          SALVAMENTO DE DADOS (MERGE SEGURO)
    ========================================================================== */
    saveUserData: function(data) {
        const user = this.getActiveUser();
        if (!user) return;

        const accounts = JSON.parse(localStorage.getItem('nexus_accounts') || '{}');
        
        // Mantém o que já existe e adiciona/atualiza apenas o que foi enviado
        accounts[user] = {
            ...accounts[user], 
            ...data            
        };

        localStorage.setItem('nexus_accounts', JSON.stringify(accounts));
        console.log(`[SYSTEM] Database Sync: ${user}`);
    },

    /* ==========================================================================
          PROCESSAMENTO DE IMAGENS
    ========================================================================== */
    saveMedia: function(file, type) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Data = e.target.result;
                const update = {};
                update[type] = base64Data; 
                
                this.saveUserData(update);
                resolve(base64Data);
            };
            reader.onerror = () => reject("Erro ao processar imagem");
            reader.readAsDataURL(file);
        });
    },

    /* ==========================================================================
          CARREGAMENTO DE PERFIL (VINCULADO AO ID)
    ========================================================================== */
    loadProfile: function() {
        const user = this.getActiveUser();
        const accounts = JSON.parse(localStorage.getItem('nexus_accounts') || '{}');
        const data = accounts[user] || {};

        // Retorna o perfil fundindo o LocalStorage (Nick/ID) com o Banco (Dados)
        return {
            // Identidade (Mantendo IDs Originais)
            nick: localStorage.getItem('nexus_user_nick') || "@visitante",
            uid: data.id || localStorage.getItem('nexus_user_id') || "#0000",
            
            // Informações Pessoais
            name: data.name || "Usuário Project-X",
            bio: data.bio || "Nenhuma biografia definida.",
            birth: data.birth || "00/00/0000",
            age: data.age || "N/A",
            pronoun: data.pronoun || "Não definido",
            
            // Mídia
            avatar: data.avatar || "user-photo.jpg",
            banner: data.banner || "banner.jpg",
            
            // Metadados
            joinDate: data.joinDate || "Membro desde 2026"
        };
    }
};
