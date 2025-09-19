-- Insere os status de aula baseados no Enum StatusAula.js
-- ON CONFLICT garante que não haverá erro se o script for rodado mais de uma vez
INSERT INTO status_aula (id, nome) VALUES
    (1, 'SOLICITADA'),
    (2, 'CONFIRMADA'),
    (3, 'CANCELADA_PELO_ALUNO'),
    (4, 'CANCELADA_PELO_PROFESSOR'),
    (5, 'REALIZADA')
ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome;

-- Insere Alunos de exemplo
INSERT INTO aluno (nome, email) VALUES
    ('Bruna Kutova', 'bruna@gmail.com'),
    ('Rafael Souza', 'rafael@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Insere Professores de exemplo
INSERT INTO professor (nome, email, biografia, valor_base_aula) VALUES
    ('Daniel Augusto', 'daniel.augusto@gmail.com', 'Músico experiente com 10 anos de carreira, especializado em violão clássico e popular.', 120.00),
    ('Melina Peixoto', 'mel.peixoto@gmail.com', 'Pianista formada pela UEMG, com foco em técnica e teoria musical para iniciantes.', 150.00)
ON CONFLICT (email) DO NOTHING;

-- Insere uma Aula de exemplo
WITH vars AS (
    SELECT
        (SELECT id FROM aluno WHERE email = 'bruna@gmail.com') AS aluno_id,
        (SELECT id FROM professor WHERE email = 'daniel.augusto@gmail.com') AS professor_id,
        (SELECT id FROM status_aula WHERE nome = 'CONFIRMADA') AS status_id
)
INSERT INTO aula (aluno_id, professor_id, data_hora, status_id, modalidade, valor_acordado)
SELECT
    v.aluno_id,
    v.professor_id,
    NOW() + INTERVAL '2 days',
    v.status_id,
    'online',
    120.00
FROM vars v
ON CONFLICT DO NOTHING;

-- Insere uma Avaliação de exemplo
WITH vars AS (
    SELECT
        (SELECT id FROM aluno WHERE email = 'bruna@gmail.com') AS aluno_id,
        (SELECT id FROM professor WHERE email = 'daniel.augusto@gmail.com') AS professor_id
)
INSERT INTO avaliacao (aluno_id, professor_id, nota, comentario)
SELECT
    v.aluno_id,
    v.professor_id,
    5,
    'O professor Daniel é excelente! Muito paciente e didático.'
FROM vars v
ON CONFLICT DO NOTHING;