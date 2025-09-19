const Database = require('./database');
const Professor = require('../dominio/Professor');

class ProfessorRepository {
    
    // CREATE - Salvar um novo professor
    async salvar(professor) {
        const connection = await Database.getConnection();
        const [result] = await connection.execute(
            'INSERT INTO professores (nome, email, biografia, valor_base_aula) VALUES (?, ?, ?, ?)',
            [
                professor.obterNome(),
                professor.obterEmail(),
                professor.obterBiografia(),
                professor.obterValorBaseAula()
            ]
        );
        return result.insertId;
    }

    // READ - Buscar professor por ID
    async buscarPorId(id) {
        const connection = await Database.getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM professores WHERE id = ?',
            [id]
        );
        
        if (rows.length === 0) return null;
        
        const professorData = rows[0];
        return new Professor(
            professorData.id,
            professorData.nome,
            professorData.email,
            professorData.biografia,
            parseFloat(professorData.valor_base_aula)
        );
    }

    // READ - Buscar professor por email
    async buscarPorEmail(email) {
        const connection = await Database.getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM professores WHERE email = ?',
            [email]
        );
        
        if (rows.length === 0) return null;
        
        const professorData = rows[0];
        return new Professor(
            professorData.id,
            professorData.nome,
            professorData.email,
            professorData.biografia,
            parseFloat(professorData.valor_base_aula)
        );
    }

    // READ - Buscar todos os professores
    async buscarTodos() {
        const connection = await Database.getConnection();
        const [rows] = await connection.execute('SELECT * FROM professores ORDER BY nome');
        
        return rows.map(row =>
            new Professor(
                row.id,
                row.nome,
                row.email,
                row.biografia,
                parseFloat(row.valor_base_aula)
            )
        );
    }

    // READ - Buscar professores com filtros
    async buscarComFiltros(filtros = {}) {
        const connection = await Database.getConnection();
        let query = 'SELECT * FROM professores WHERE 1=1';
        const params = [];
        
        if (filtros.nome) {
            query += ' AND nome LIKE ?';
            params.push(`%${filtros.nome}%`);
        }
        
        if (filtros.valorMaximo) {
            query += ' AND valor_base_aula <= ?';
            params.push(filtros.valorMaximo);
        }
        
        query += ' ORDER BY nome';
        
        const [rows] = await connection.execute(query, params);
        
        return rows.map(row =>
            new Professor(
                row.id,
                row.nome,
                row.email,
                row.biografia,
                parseFloat(row.valor_base_aula)
            )
        );
    }

    // UPDATE - Atualizar professor
    async atualizar(professor) {
        const connection = await Database.getConnection();
        await connection.execute(
            'UPDATE professores SET nome = ?, email = ?, biografia = ?, valor_base_aula = ? WHERE id = ?',
            [
                professor.obterNome(),
                professor.obterEmail(),
                professor.obterBiografia(),
                professor.obterValorBaseAula(),
                professor.obterId()
            ]
        );
    }

    // UPDATE - Atualizar apenas o nome
    async atualizarNome(id, novoNome) {
        const connection = await Database.getConnection();
        await connection.execute(
            'UPDATE professores SET nome = ? WHERE id = ?',
            [novoNome, id]
        );
    }

    // DELETE - Deletar professor
    async deletar(id) {
        const connection = await Database.getConnection();
        await connection.execute(
            'DELETE FROM professores WHERE id = ?',
            [id]
        );
    }

    // Métodos específicos para estatísticas
    async obterMediaValorAula() {
        const connection = await Database.getConnection();
        const [rows] = await connection.execute(
            'SELECT AVG(valor_base_aula) as media FROM professores'
        );
        
        return rows[0].media || 0;
    }

    async obterProfessorMaisCaro() {
        const connection = await Database.getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM professores ORDER BY valor_base_aula DESC LIMIT 1'
        );
        
        if (rows.length === 0) return null;
        
        const professorData = rows[0];
        return new Professor(
            professorData.id,
            professorData.nome,
            professorData.email,
            professorData.biografia,
            parseFloat(professorData.valor_base_aula)
        );
    }

    // Método para buscar professor com avaliações (usando JOIN)
    async buscarProfessorComAvaliacoes(professorId) {
        const connection = await Database.getConnection();
        const [rows] = await connection.execute(
            `SELECT p.*,
                    AVG(av.nota) as nota_media,
                    COUNT(av.id) as total_avaliacoes
            FROM professores p
            LEFT JOIN avaliacoes av ON p.id = av.professor_avaliado_id
            WHERE p.id = ?
            GROUP BY p.id`,
            [professorId]
        );
        
        if (rows.length === 0) return null;
        
        const professorData = rows[0];
        const professor = new Professor(
            professorData.id,
            professorData.nome,
            professorData.email,
            professorData.biografia,
            parseFloat(professorData.valor_base_aula)
        );
        
        // Adicionar informações extras
        professor.notaMedia = parseFloat(professorData.nota_media) || 0;
        professor.totalAvaliacoes = professorData.total_avaliacoes;
        
        return professor;
    }
}

module.exports = ProfessorRepository;