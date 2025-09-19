const Avaliacao = require('../dominio/Avaliacao');

class AvaliacaoRepository {
    
    // CREATE - Salvar uma nova avaliação
    async salvar(avaliacao) {
        const connection = await Database.getConnection();
        const [result] = await connection.execute(
            'INSERT INTO avaliacoes (autor_id, professor_avaliado_id, nota, comentario) VALUES (?, ?, ?, ?)',
            [
                avaliacao.obterAutor().obterId(), // Assumindo que Autor é um objeto Aluno/Professor
                avaliacao.obterProfessorAvaliado().obterId(), // Assumindo que é um objeto Professor
                avaliacao.obterNota(),
                avaliacao.obterComentario()
            ]
        );
        return result.insertId;
    }

    // READ - Buscar avaliação por ID
    async buscarPorId(id) {
        const connection = await Database.getConnection();
        const [rows] = await connection.execute(
            `SELECT av.*,
                    a.nome as autor_nome,
                    p.nome as professor_nome
            FROM avaliacoes av
            INNER JOIN alunos a ON av.autor_id = a.id
            INNER JOIN professores p ON av.professor_avaliado_id = p.id
            WHERE av.id = ?`,
            [id]
        );
        
        if (rows.length === 0) return null;
        
        return this.#mapearParaObjeto(rows[0]);
    }

    // READ - Buscar todas as avaliações de um professor
    async buscarPorProfessor(professorId) {
        const connection = await Database.getConnection();
        const [rows] = await connection.execute(
            `SELECT av.*, a.nome as autor_nome, p.nome as professor_nome
            FROM avaliacoes av
            INNER JOIN alunos a ON av.autor_id = a.id
            INNER JOIN professores p ON av.professor_avaliado_id = p.id
            WHERE av.professor_avaliado_id = ?`,
            [professorId]
        );
        
        return rows.map(row => this.#mapearParaObjeto(row));
    }

    // READ - Buscar todas as avaliações
    async buscarTodas() {
        const connection = await Database.getConnection();
        const [rows] = await connection.execute(
            `SELECT av.*, a.nome as autor_nome, p.nome as professor_nome
            FROM avaliacoes av
            INNER JOIN alunos a ON av.autor_id = a.id
            INNER JOIN professores p ON av.professor_avaliado_id = p.id`
        );
        
        return rows.map(row => this.#mapearParaObjeto(row));
    }

    // READ - Buscar avaliação média de um professor
    async obterMediaProfessor(professorId) {
        const connection = await Database.getConnection();
        const [rows] = await connection.execute(
            'SELECT AVG(nota) as media FROM avaliacoes WHERE professor_avaliado_id = ?',
            [professorId]
        );
        
        return rows[0].media || 0;
    }

    // UPDATE - Atualizar avaliação
    async atualizar(avaliacao) {
        const connection = await Database.getConnection();
        await connection.execute(
            'UPDATE avaliacoes SET nota = ?, comentario = ? WHERE id = ?',
            [avaliacao.obterNota(), avaliacao.obterComentario(), avaliacao.obterId()]
        );
    }

    // DELETE - Deletar avaliação
    async deletar(id) {
        const connection = await Database.getConnection();
        await connection.execute(
            'DELETE FROM avaliacoes WHERE id = ?',
            [id]
        );
    }

    // Método privado para mapear dados do banco para objeto Avaliacao
    #mapearParaObjeto(row) {
        // Você precisará adaptar conforme suas classes Aluno e Professor
        const autor = { obterId: () => row.autor_id, obterNome: () => row.autor_nome };
        const professor = { obterId: () => row.professor_avaliado_id, obterNome: () => row.professor_nome };
        
        return new Avaliacao(
            row.id,
            autor,
            professor,
            row.nota,
            row.comentario
        );
    }
}

module.exports = AvaliacaoRepository;