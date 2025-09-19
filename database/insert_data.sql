INSERT INTO status_aula (id, nome) VALUES
    (1, 'solicitada'),
    (2, 'aceita'),
    (3, 'concluida'),
    (4, 'cancelada')
ON CONFLICT (id) DO NOTHING;

-- Alunos
INSERT INTO aluno (nome, email, telefone) VALUES
    ('Pedro Gaioso', 'gaioso@example.com', '(31) 99999-1111'),
    ('Rafael Souza', 'rafael@example.com', '(31) 98888-2222')
ON CONFLICT (email) DO NOTHING;

-- Professores
INSERT INTO professor (nome, email, instrumento, preco_hora) VALUES
    ('Carlos Lima', 'carlos.lima@example.com', 'Violão', 120.00),
    ('Bianca Torres', 'bianca.torres@example.com', 'Piano', 150.00)
ON CONFLICT (email) DO NOTHING;

-- Uma aula de exemplo
WITH a AS (
    SELECT id AS aluno_id FROM aluno WHERE email='gaioso@example.com'
),
p AS (
    SELECT id AS professor_id FROM professor WHERE email='carlos.lima@example.com'
)
INSERT INTO aula (aluno_id, professor_id, inicio, fim, status_id, modalidade, valor_acordado)
SELECT a.aluno_id, p.professor_id,
    DATE_TRUNC('day', NOW()) + INTERVAL '2 day' + INTERVAL '18 hour',
    DATE_TRUNC('day', NOW()) + INTERVAL '2 day' + INTERVAL '19 hour',
    1, 'online', 120.00
FROM a, p
ON CONFLICT DO NOTHING;

-- SELECT: listar todos os alunos
SELECT * FROM aluno;

-- SELECT com JOIN: aulas com professor e status
SELECT a.id, al.nome AS aluno, p.nome AS professor, a.inicio, a.fim, s.nome AS status
FROM aula a
JOIN aluno al ON al.id = a.aluno_id
JOIN professor p ON p.id = a.professor_id
JOIN status_aula s ON s.id = a.status_id;

-- UPDATE: atualizar telefone de um aluno
UPDATE aluno
SET telefone = '(31) 97777-3333'
WHERE email = 'gaioso@example.com';

-- UPDATE: alterar status de uma aula
UPDATE aula
SET status_id = 2
WHERE id = (SELECT id FROM aula LIMIT 1);

-- DELETE: remover uma avaliação de teste
DELETE FROM avaliacao
WHERE comentario LIKE '%teste%';
