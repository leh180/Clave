const Database = require('./database');
const StatusAula = require('../dominio/StatusAula');

class StatusAulaManager {
    
    // Método para validar se um status é válido
    static isValidStatus(status) {
        return Object.values(StatusAula).includes(status);
    }

    // Método para obter todos os status possíveis
    static getTodosStatus() {
        return Object.values(StatusAula);
    }

    // Método para obter estatísticas de status das aulas
    static async obterEstatisticasStatus() {
        const connection = await Database.getConnection();
        const [rows] = await connection.execute(
            `SELECT status, COUNT(*) as quantidade
            FROM aulas
            GROUP BY status
            ORDER BY quantidade DESC`
        );
        
        return rows;
    }

    // Método para obter a distribuição de status por professor
    static async obterStatusPorProfessor(professorId) {
        const connection = await Database.getConnection();
        const [rows] = await connection.execute(
            `SELECT status, COUNT(*) as quantidade
            FROM aulas
            WHERE professor_id = ?
            GROUP BY status`,
            [professorId]
        );
        
        return rows;
    }

    // Método para obter a distribuição de status por aluno
    static async obterStatusPorAluno(alunoId) {
        const connection = await Database.getConnection();
        const [rows] = await connection.execute(
            `SELECT status, COUNT(*) as quantidade
            FROM aulas
            WHERE aluno_id = ?
            GROUP BY status`,
            [alunoId]
        );
        
        return rows;
    }

    // Método para converter status para formato mais amigável
    static formatarStatus(status) {
        const formatos = {
            'SOLICITADA': 'Solicitada',
            'CONFIRMADA': 'Confirmada',
            'CANCELADA_PELO_ALUNO': 'Cancelada pelo Aluno',
            'CANCELADA_PELO_PROFESSOR': 'Cancelada pelo Professor',
            'REALIZADA': 'Realizada'
        };
        
        return formatos[status] || status;
    }

    // Método para obter aulas por status com paginação
    static async buscarAulasPorStatus(status, pagina = 1, limite = 10) {
        if (!this.isValidStatus(status)) {
            throw new Error('Status inválido');
        }
        
        const offset = (pagina - 1) * limite;
        const connection = await Database.getConnection();
        
        const [rows] = await connection.execute(
            `SELECT a.*,
                    prof.nome as professor_nome,
                    aluno.nome as aluno_nome
            FROM aulas a
            INNER JOIN professores prof ON a.professor_id = prof.id
            INNER JOIN alunos aluno ON a.aluno_id = aluno.id
            WHERE a.status = ?
            ORDER BY a.data_hora DESC
            LIMIT ? OFFSET ?`,
            [status, limite, offset]
        );
        
        // Contar total para paginação
        const [totalRows] = await connection.execute(
            'SELECT COUNT(*) as total FROM aulas WHERE status = ?',
            [status]
        );
        
        return {
            aulas: rows,
            total: totalRows[0].total,
            pagina,
            totalPaginas: Math.ceil(totalRows[0].total / limite)
        };
    }

    // Método para obter histórico de mudanças de status de uma aula
    static async obterHistoricoStatus(aulaId) {
        // Isso assumiria que você tem uma tabela de histórico de status
        // Se não tiver, pode ser implementada posteriormente
        const connection = await Database.getConnection();
        const [rows] = await connection.execute(
            `SELECT * FROM historico_status_aula
            WHERE aula_id = ?
            ORDER BY data_mudanca DESC`,
            [aulaId]
        );
        
        return rows;
    }

    // Método para verificar transições válidas de status
    static isTransicaoValida(statusAtual, novoStatus) {
        const transicoesValidas = {
            'SOLICITADA': ['CONFIRMADA', 'CANCELADA_PELO_ALUNO', 'CANCELADA_PELO_PROFESSOR'],
            'CONFIRMADA': ['REALIZADA', 'CANCELADA_PELO_ALUNO', 'CANCELADA_PELO_PROFESSOR'],
            'REALIZADA': [], // Não pode mudar depois de realizada
            'CANCELADA_PELO_ALUNO': [], // Não pode mudar depois de cancelada
            'CANCELADA_PELO_PROFESSOR': [] // Não pode mudar depois de cancelada
        };
        
        return transicoesValidas[statusAtual]?.includes(novoStatus) || false;
    }
}

module.exports = StatusAulaManager;