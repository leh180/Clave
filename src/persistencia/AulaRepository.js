const Database = require('./database');
const Aula = require('./Aula');
const StatusAula = require('./StatusAula');

class AulaRepository {
    
    // CREATE - Salvar uma nova aula
    async salvar(aula) {
        const connection = await Database.getConnection();
        const [result] = await connection.execute(
            'INSERT INTO aulas (professor_id, aluno_id, data_hora, valor_acordado, status) VALUES (?, ?, ?, ?, ?)',
            [
                aula.obterProfessor().obterId(),
                aula.obterAluno().obterId(),
                aula.obterDataHora().toISOString().slice(0, 19).replace('T', ' '),
                aula.obterValorAcordado(),
                aula.obterStatus()
            ]
        );
        return result.insertId;
    }

    // READ - Buscar aula por ID
    async buscarPorId(id) {
        const connection = await Database.getConnection();
        const [rows] = await connection.execute(
            `SELECT a.*, 
                    prof.nome as professor_nome,
                    aluno.nome as aluno_nome
             FROM aulas a
             INNER JOIN professores prof ON a.professor_id = prof.id
             INNER JOIN alunos aluno ON a.aluno_id = aluno.id
             WHERE a.id = ?`,
            [id]
        );
        
        if (rows.length === 0) return null;
        
        return this.#mapearParaObjeto(rows[0]);
    }

    // READ - Buscar aulas por professor
    async buscarPorProfessor(professorId) {
        const connection = await Database.getConnection();
        const [rows] = await connection.execute(
            `SELECT a.*, prof.nome as professor_nome, aluno.nome as aluno_nome
             FROM aulas a
             INNER JOIN professores prof ON a.professor_id = prof.id
             INNER JOIN alunos aluno ON a.aluno_id = aluno.id
             WHERE a.professor_id = ?
             ORDER BY a.data_hora DESC`,
            [professorId]
        );
        
        return rows.map(row => this.#mapearParaObjeto(row));
    }

    // READ - Buscar aulas por aluno
    async buscarPorAluno(alunoId) {
        const connection = await Database.getConnection();
        const [rows] = await connection.execute(
            `SELECT a.*, prof.nome as professor_nome, aluno.nome as aluno_nome
             FROM aulas a
             INNER JOIN professores prof ON a.professor_id = prof.id
             INNER JOIN alunos aluno ON a.aluno_id = aluno.id
             WHERE a.aluno_id = ?
             ORDER BY a.data_hora DESC`,
            [alunoId]
        );
        
        return rows.map(row => this.#mapearParaObjeto(row));
    }

    // READ - Buscar aulas por status
    async buscarPorStatus(status) {
        const connection = await Database.getConnection();
        const [rows] = await connection.execute(
            `SELECT a.*, prof.nome as professor_nome, aluno.nome as aluno_nome
             FROM aulas a
             INNER JOIN professores prof ON a.professor_id = prof.id
             INNER JOIN alunos aluno ON a.aluno_id = aluno.id
             WHERE a.status = ?
             ORDER BY a.data_hora DESC`,
            [status]
        );
        
        return rows.map(row => this.#mapearParaObjeto(row));
    }

    // UPDATE - Atualizar status da aula (método genérico)
    async atualizarStatus(id, novoStatus) {
        const connection = await Database.getConnection();
        await connection.execute(
            'UPDATE aulas SET status = ? WHERE id = ?',
            [novoStatus, id]
        );
    }

    // Métodos específicos para ações de negócio
    async confirmarAula(id) {
        await this.atualizarStatus(id, StatusAula.CONFIRMADA);
    }

    async cancelarPorAluno(id) {
        await this.atualizarStatus(id, StatusAula.CANCELADA_PELO_ALUNO);
    }

    async cancelarPorProfessor(id) {
        await this.atualizarStatus(id, StatusAula.CANCELADA_PELO_PROFESSOR);
    }

    async marcarComoRealizada(id) {
        await this.atualizarStatus(id, StatusAula.REALIZADA);
    }

    // UPDATE - Atualizar dados completos da aula
    async atualizar(aula) {
        const connection = await Database.getConnection();
        await connection.execute(
            'UPDATE aulas SET professor_id = ?, aluno_id = ?, data_hora = ?, valor_acordado = ?, status = ? WHERE id = ?',
            [
                aula.obterProfessor().obterId(),
                aula.obterAluno().obterId(),
                aula.obterDataHora().toISOString().slice(0, 19).replace('T', ' '),
                aula.obterValorAcordado(),
                aula.obterStatus(),
                aula.obterId()
            ]
        );
    }

    // DELETE - Deletar aula
    async deletar(id) {
        const connection = await Database.getConnection();
        await connection.execute(
            'DELETE FROM aulas WHERE id = ?',
            [id]
        );
    }

    // Método privado para mapear dados do banco para objeto Aula
    #mapearParaObjeto(row) {
        const professor = { 
            obterId: () => row.professor_id, 
            obterNome: () => row.professor_nome 
        };
        
        const aluno = { 
            obterId: () => row.aluno_id, 
            obterNome: () => row.aluno_nome 
        };
        
        const aula = new Aula(
            row.id,
            professor,
            aluno,
            row.data_hora,
            parseFloat(row.valor_acordado)
        );
        
        // Definir o status atual (já que o construtor sempre inicia como SOLICITADA)
        aula.obterStatus = () => row.status;
        
        return aula;
    }
}

module.exports = AulaRepository;