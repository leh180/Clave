<<<<<<< HEAD
const Database = require('./database');
const Professor = require('../dominio/Professor'); // Corrigindo o caminho para a pasta dominio

class ProfessorRepository {
    
    // CREATE - Salvar um novo professor
    async salvar(professor) {
        const pool = Database.getPool();
        const sql = 'INSERT INTO professor (nome, email, instrumento, preco_hora) VALUES ($1, $2, $3, $4) RETURNING id';
        const values = [
            professor.obterNome(),
            professor.obterEmail(),
            professor.obterInstrumento(), // Supondo que exista este método
            professor.obterPrecoHora()    // Supondo que exista este método
        ];
        
        const resultado = await pool.query(sql, values);
        return resultado.rows[0].id;
    }

    // READ - Buscar professor por ID
    async buscarPorId(id) {
        const pool = Database.getPool();
        const sql = 'SELECT * FROM professor WHERE id = $1';
        const { rows } = await pool.query(sql, [id]);
        
        if (rows.length === 0) return null;
        
        const row = rows[0];
        // Você precisará ajustar os construtores para corresponder aos dados da sua tabela
        return new Professor(row.id, row.nome, row.email, null, parseFloat(row.preco_hora));
    }

    // READ - Buscar todos os professores
    async buscarTodos() {
        const pool = Database.getPool();
        const sql = 'SELECT * FROM professor ORDER BY nome';
        const { rows } = await pool.query(sql);
        
        return rows.map(row =>
            new Professor(row.id, row.nome, row.email, null, parseFloat(row.preco_hora))
        );
    }

    // UPDATE - Atualizar professor
    async atualizar(professor) {
        const pool = Database.getPool();
        const sql = 'UPDATE professor SET nome = $1, email = $2, instrumento = $3, preco_hora = $4 WHERE id = $5';
        const values = [
            professor.obterNome(),
            professor.obterEmail(),
            professor.obterInstrumento(),
            professor.obterPrecoHora(),
            professor.obterId()
        ];
        await pool.query(sql, values);
    }

    // DELETE - Deletar professor
    async deletar(id) {
        const pool = Database.getPool();
        const sql = 'DELETE FROM professor WHERE id = $1';
        await pool.query(sql, [id]);
    }
}

=======
const Database = require('./database');
const Professor = require('../dominio/Professor'); // Corrigindo o caminho para a pasta dominio

class ProfessorRepository {
    
    // CREATE - Salvar um novo professor
    async salvar(professor) {
        const pool = Database.getPool();
        const sql = 'INSERT INTO professor (nome, email, instrumento, preco_hora) VALUES ($1, $2, $3, $4) RETURNING id';
        const values = [
            professor.obterNome(),
            professor.obterEmail(),
            professor.obterInstrumento(), // Supondo que exista este método
            professor.obterPrecoHora()    // Supondo que exista este método
        ];
        
        const resultado = await pool.query(sql, values);
        return resultado.rows[0].id;
    }

    // READ - Buscar professor por ID
    async buscarPorId(id) {
        const pool = Database.getPool();
        const sql = 'SELECT * FROM professor WHERE id = $1';
        const { rows } = await pool.query(sql, [id]);
        
        if (rows.length === 0) return null;
        
        const row = rows[0];
        // Você precisará ajustar os construtores para corresponder aos dados da sua tabela
        return new Professor(row.id, row.nome, row.email, null, parseFloat(row.preco_hora));
    }

    // READ - Buscar todos os professores
    async buscarTodos() {
        const pool = Database.getPool();
        const sql = 'SELECT * FROM professor ORDER BY nome';
        const { rows } = await pool.query(sql);
        
        return rows.map(row =>
            new Professor(row.id, row.nome, row.email, null, parseFloat(row.preco_hora))
        );
    }

    // UPDATE - Atualizar professor
    async atualizar(professor) {
        const pool = Database.getPool();
        const sql = 'UPDATE professor SET nome = $1, email = $2, instrumento = $3, preco_hora = $4 WHERE id = $5';
        const values = [
            professor.obterNome(),
            professor.obterEmail(),
            professor.obterInstrumento(),
            professor.obterPrecoHora(),
            professor.obterId()
        ];
        await pool.query(sql, values);
    }

    // DELETE - Deletar professor
    async deletar(id) {
        const pool = Database.getPool();
        const sql = 'DELETE FROM professor WHERE id = $1';
        await pool.query(sql, [id]);
    }
}

>>>>>>> 34ba386cc9e0d9669e4166a584f8edc6bdbf0446
module.exports = ProfessorRepository;