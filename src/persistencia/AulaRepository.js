const Database = require('./database');
const Aula = require('../dominio/Aula');
const Aluno = require('../dominio/Aluno');
const Professor = require('../dominio/Professor');

class AulaRepository {

    // CREATE - Salvar uma nova aula
    async salvar(aula) {
        const pool = Database.getPool();
        const sql = 'INSERT INTO aula (aluno_id, professor_id, inicio, fim, status_id, modalidade, valor_acordado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id';
        const values = [
            aula.obterAluno().obterId(),
            aula.obterProfessor().obterId(),
            aula.obterInicio(), // Supondo que o objeto Date seja passado
            aula.obterFim(),
            aula.obterStatusId(), // Supondo que você tenha um obterStatusId()
            aula.obterModalidade(),
            aula.obterValorAcordado()
        ];
        
        const resultado = await pool.query(sql, values);
        return resultado.rows[0].id;
    }

    // READ - Buscar aula por ID
    async buscarPorId(id) {
        const pool = Database.getPool();
        const sql = `
            SELECT a.*, al.nome AS aluno_nome, p.nome AS professor_nome, s.nome AS status_nome
            FROM aula a
            JOIN aluno al ON al.id = a.aluno_id
            JOIN professor p ON p.id = a.professor_id
            JOIN status_aula s ON s.id = a.status_id
            WHERE a.id = $1
        `;
        const { rows } = await pool.query(sql, [id]);

        if (rows.length === 0) return null;

        return this.#mapearParaObjeto(rows[0]);
    }

    // UPDATE - Atualizar status de uma aula
    async atualizarStatus(id, statusId) {
        const pool = Database.getPool();
        const sql = 'UPDATE aula SET status_id = $1 WHERE id = $2';
        await pool.query(sql, [statusId, id]);
    }

    // DELETE - Deletar aula
    async deletar(id) {
        const pool = Database.getPool();
        const sql = 'DELETE FROM aula WHERE id = $1';
        await pool.query(sql, [id]);
    }

    // Método privado para mapear dados do banco para objeto Aula
    #mapearParaObjeto(row) {
        const aluno = new Aluno(row.aluno_id, row.aluno_nome, null);
        const professor = new Professor(row.professor_id, row.professor_nome, null, null, null);
        
        // Ajuste o construtor da Aula conforme necessário
        const aula = new Aula(
            row.id,
            aluno,
            professor,
            row.inicio,
            row.fim,
            row.status_id,
            row.modalidade,
            parseFloat(row.valor_acordado)
        );
        
        // Adicionando propriedade extra para o nome do status
        aula.statusNome = row.status_nome;

        return aula;
    }
}

module.exports = AulaRepository;