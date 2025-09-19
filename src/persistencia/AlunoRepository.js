const Database = require('./database');
const Aluno = require('../dominio/Aluno');

class AlunoRepository {
    
    // CREATE - Salvar um novo aluno
    async salvar(aluno) {
        const pool = Database.getPool();
        const sql = 'INSERT INTO aluno (nome, email) VALUES ($1, $2) RETURNING id';
        const values = [aluno.obterNome(), aluno.obterEmail()];
        
        const resultado = await pool.query(sql, values);
        return resultado.rows[0].id;
    }

    // READ - Buscar aluno por ID
    async buscarPorId(id) {
        const pool = Database.getPool();
        const sql = 'SELECT * FROM aluno WHERE id = $1';
        const { rows } = await pool.query(sql, [id]);
        
        if (rows.length === 0) return null;
        
        const row = rows[0];
        return new Aluno(row.id, row.nome, row.email);
    }

    // READ - Buscar todos os alunos
    async buscarTodos() {
        const pool = Database.getPool();
        const sql = 'SELECT * FROM aluno';
        const { rows } = await pool.query(sql);
        
        return rows.map(row => new Aluno(row.id, row.nome, row.email));
    }

    // UPDATE - Atualizar aluno
    async atualizar(aluno) {
        const pool = Database.getPool();
        const sql = 'UPDATE aluno SET nome = $1, email = $2 WHERE id = $3';
        const values = [aluno.obterNome(), aluno.obterEmail(), aluno.obterId()];
        await pool.query(sql, values);
    }

    // DELETE - Deletar aluno
    async deletar(id) {
        const pool = Database.getPool();
        const sql = 'DELETE FROM aluno WHERE id = $1';
        await pool.query(sql, [id]);
    }
}

module.exports = AlunoRepository;