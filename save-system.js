/* ==========================================================================
      PROJECT-X | SISTEMA DE SALVAMENTO AVANÇADO (V2)
========================================================================= */

const NexusStorage = {
    
    // Pega o nick do usuário logado no momento
    getActiveUser: function() {
        const nick = localStorage.getItem('nexus_user_nick');
        if (!nick) return null;
        // Limpa o nick para usar como chave no banco (remove @ e espaços)
        return nick.replace('@', '').toLowerCase().trim();
    },

    /* ==========================================================================
          BUSCA DE TODOS OS USUÁRIOS (Para a Lista da Home)
    ========================================================================== */
    getAllUsers: function() {
        const accounts = JSON.parse(localStorage.getItem('nexus_accounts') || '{}');
        // Transforma o objeto de contas em uma lista (Array) para o JS ler fácil
        return Object.keys(accounts).map(key => {
            const user = accounts[key];
            return {
                nick: `@${key}`,
                name: user.name || "Membro Project-X",
                avatar: user.avatar || "user-photo.jpg",
                uid: user.uid || "NX-999"
            };
        });
    },

    /* ==========================================================================
          SALVAMENTO DE DADOS (MERGE SEGURO)
    ========================================================================== */
    saveUserData: function(data) {
        const user = this.getActiveUser();
        if (!user) return;

        const accounts = JSON.parse(localStorage.getItem('nexus_accounts') || '{}');
        
        // Se a conta não existir, cria o esqueleto básico primeiro
        if (!accounts[user]) {
            accounts[user] = {
                joinDate: new Date().toLocaleDateString('pt-BR'),
                uid: "NX-" + Math.floor(1000 + Math.random() * 9000)
            };
        }

        // Faz o "Merge" (une os dados antigos com os novos sem apagar nada)
        accounts[user] = {
            ...accounts[user], 
            ...data            
        };

        localStorage.setItem('nexus_accounts', JSON.stringify(accounts));
        console.log(`[SYSTEM] Dados sincronizados para: ${user}`);
    },

    /* ==========================================================================
          SALVAMENTO DE MÍDIA (FOTO/BANNER)
    ========================================================================== */
    saveMedia: function(file, type) {
        return new Promise((resolve, reject) => {
            // Verifica se é imagem antes de processar
            if (!file.type.match('image.*')) {
                reject("Apenas imagens são permitidas");
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Data = e.target.result;
                const update = {};
                update[type] = base64Data; 
                
                this.saveUserData(update);
                resolve(base64Data);
            };
            reader.onerror = () => reject("Erro ao ler arquivo");
            reader.readAsDataURL(file);
        });
    },

    /* ==========================================================================
          CARREGAMENTO DE PERFIL (COM FALLBACKS)
    ========================================================================== */
    loadProfile: function() {
        const user = this.getActiveUser();
        const accounts = JSON.parse(localStorage.getItem('nexus_accounts') || '{}');
        const data = accounts[user] || {};

        // Retorna o objeto pronto para o Perfil e a Home
        return {
            nick: localStorage.getItem('nexus_user_nick') || "@visitante",
            uid: data.uid || localStorage.getItem('nexus_user_id') || "NX-000",
            
            name: data.name || "Usuário Project-X",
            bio: data.bio || "Nenhuma biografia definida.",
            birth: data.birth || "00/00/0000",
            age: data.age || "N/A",
            pronoun: data.pronoun || "Não definido",
            
            avatar: data.avatar || "user-photo.jpg",
            banner: data.banner || "banner.jpg",
            
            joinDate: data.joinDate || "Membro Recente"
        };
    }
};
