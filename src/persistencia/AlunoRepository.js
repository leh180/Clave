const Aluno = require('../dominio/Aluno'); // Importa sua classe Aluno

class AlunoRepository {
    
    // CREATE - Salvar um novo aluno
    async salvar(aluno) {
        const connection = await Database.getConnection();
        const [result] = await connection.execute(
            'INSERT INTO alunos (nome, email) VALUES (?, ?)',
            [aluno.obterNome(), aluno.obterEmail()]
        );
        return result.insertId; // Retorna o ID gerado
    }

    // READ - Buscar aluno por ID
    async buscarPorId(id) {
        const connection = await Database.getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM alunos WHERE id = ?',
            [id]
        );
        
        if (rows.length === 0) return null;
        
        const alunoData = rows[0];
        return new Aluno(
            alunoData.id,
            alunoData.nome,
            alunoData.email
        );
    }

    // READ - Buscar todos os alunos
    async buscarTodos() {
        const connection = await Database.getConnection();
        const [rows] = await connection.execute('SELECT * FROM alunos');
        
        return rows.map(row =>
            new Aluno(row.id, row.nome, row.email)
        );
    }

    // UPDATE - Atualizar aluno
    async atualizar(aluno) {
        const connection = await Database.getConnection();
        await connection.execute(
            'UPDATE alunos SET nome = ?, email = ? WHERE id = ?',
            [aluno.obterNome(), aluno.obterEmail(), aluno.obterId()]
        );
    }

    // DELETE - Deletar aluno
    async deletar(id) {
        const connection = await Database.getConnection();
        await connection.execute(
            'DELETE FROM alunos WHERE id = ?',
            [id]
        );
    }

    // Buscar por email (exemplo adicional)
    async buscarPorEmail(email) {
        const connection = await Database.getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM alunos WHERE email = ?',
            [email]
        );
        
        if (rows.length === 0) return null;
        
        const alunoData = rows[0];
        return new Aluno(
            alunoData.id,
            alunoData.nome,
            alunoData.email
        );
    }
}

module.exports = AlunoRepository;