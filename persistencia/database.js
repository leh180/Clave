const mysql = require('mysql2/promise');

class Database {
    static #instance = null; // Instância única (Singleton)

    static async getConnection() {
        if (!Database.#instance) {
            // Se não existe, cria uma nova conexão
            Database.#instance = await mysql.createConnection({
                host: 'localhost',
                user: 'seu_usuario',
                password: 'sua_senha',
                database: 'sistema_aulas'
            });
            console.log('Conexão com o banco estabelecida!');
        }
        return Database.#instance;
    }
}

module.exports = Database;