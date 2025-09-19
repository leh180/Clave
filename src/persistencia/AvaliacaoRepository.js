const Database = require('./database');
const Avaliacao = require('../dominio/Avaliacao');

class AvaliacaoRepository {
    
    // CREATE - Salvar uma nova avaliação
    async salvar(avaliacao) {
        const pool = Database.getPool();
        const sql = 'INSERT INTO avaliacao (aula_id, nota, comentario) VALUES ($1, $2, $3) RETURNING id';
        const values = [
            avaliacao.obterAulaId(), // O objeto Avaliacao precisa ter o ID da aula
            avaliacao.obterNota(),
            avaliacao.obterComentario()
        ];
        const resultado = await pool.query(sql, values);
        return resultado.rows[0].id;
    }

    // READ - Buscar avaliação por ID da aula
    async buscarPorAulaId(aulaId) {
        const pool = Database.getPool();
        const sql = 'SELECT * FROM avaliacao WHERE aula_id = $1';
        const { rows } = await pool.query(sql, [aulaId]);
        
        if (rows.length === 0) return null;
        
        const row = rows[0];
        // O construtor da Avaliacao precisará ser adaptado
        return new Avaliacao(row.id, row.aula_id, row.nota, row.comentario);
    }
    
    // DELETE - Deletar avaliação
    async deletar(id) {
        const pool = Database.getPool();
        const sql = 'DELETE FROM avaliacao WHERE id = $1';
        await pool.query(sql, [id]);
    }
}

module.exports = AvaliacaoRepository;