/* ==========================================================================
      PROJECT-X | SISTEMA DE SALVAMENTO AVANÇADO
========================================================================= */

const NexusStorage = {
    
    // Pega o usuário logado no momento
    getActiveUser: function() {
        const nick = localStorage.getItem('nexus_user_nick');
        if (!nick) return null;
        return nick.replace('@', '').toLowerCase().trim();
    },

    /* ==========================================================================
          SALVAMENTO DE DADOS NO BANCO LOCAL
    ========================================================================== */
    saveUserData: function(data) {
        const user = this.getActiveUser();
        if (!user) return;

        const accounts = JSON.parse(localStorage.getItem('nexus_accounts') || '{}');
        
        // Faz o "Merge" dos dados antigos com os novos
        accounts[user] = {
            ...accounts[user], 
            ...data            
        };

        localStorage.setItem('nexus_accounts', JSON.stringify(accounts));
        console.log(`[SYSTEM] Dados atualizados para: ${user}`);
    },

    /* ==========================================================================
          SALVAMENTO DE MÍDIA (FOTO/BANNER)
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
            reader.onerror = () => reject("Erro ao ler arquivo");
            reader.readAsDataURL(file);
        });
    },

    /* ==========================================================================
          CARREGAMENTO DE DADOS (PERFIL COMPLETO)
    ========================================================================== */
    loadProfile: function() {
        const user = this.getActiveUser();
        const accounts = JSON.parse(localStorage.getItem('nexus_accounts') || '{}');
        const data = accounts[user] || {};

        return {
            // Identidade
            nick: localStorage.getItem('nexus_user_nick') || "@visitante",
            id: localStorage.getItem('nexus_user_id') || "#0000",
            
            // Informações Pessoais
            name: data.name || "Usuário Project-X",
            bio: data.bio || "Nenhuma biografia definida.",
            birth: data.birth || "00/00/0000",
            age: data.age || "N/A",
            pronoun: data.pronoun || "Não definido",
            
            // Mídia (Mantendo os JPGs padrão caso não existam)
            avatar: data.avatar || "user-photo.jpg",
            banner: data.banner || "banner.jpg",
            
            // Metadados
            joinDate: data.joinDate || "Recentemente"
        };
    }
};
