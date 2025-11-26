-- 1. LIMPEZA TOTAL (Garante que o dado velho corrompido suma)
TRUNCATE TABLE professor, aluno, curso, aula, avaliacao, pagamento RESTART IDENTITY CASCADE;

-- 2. STATUS E CATEGORIAS
INSERT INTO status_aula (id, nome) VALUES (1, 'SOLICITADA'), (2, 'CONFIRMADA'), (3, 'CANCELADA_ALUNO'), (4, 'CANCELADA_PROFESSOR'), (5, 'CONCLUIDA') ON CONFLICT (id) DO NOTHING;
INSERT INTO instrumento (nome) VALUES ('Violão'), ('Guitarra'), ('Piano'), ('Teclado'), ('Bateria'), ('Violino'), ('Canto'), ('Baixo') ON CONFLICT (nome) DO NOTHING;
INSERT INTO estilo_musical (nome) VALUES ('Rock'), ('Pop'), ('Clássico'), ('Jazz'), ('MPB'), ('Sertanejo'), ('Gospel'), ('Blues') ON CONFLICT (nome) DO NOTHING;

-- 3. ALUNOS
INSERT INTO aluno (nome, email, senha_hash, telefone) VALUES 
('Bruna Kutova', 'bruna@gmail.com', '$2a$10$X.MwM/Jg/W.w/X.MwM/Jg/W.w/X.MwM/Jg/W.w/X.MwM/Jg/W.w', '31999998888'),
('Rafael Souza', 'rafael@gmail.com', '$2a$10$X.MwM/Jg/W.w/X.MwM/Jg/W.w/X.MwM/Jg/W.w/X.MwM/Jg/W.w', '31988887777') ON CONFLICT (email) DO NOTHING;

-- 4. PROFESSORES (Acentos corrigidos: Música, Lírica)
INSERT INTO professor (nome, email, senha_hash, valor_base_aula, biografia, link_video_demo) VALUES 
('Daniel Augusto', 'daniel.augusto@gmail.com', '$2a$10$X.MwM/Jg/W.w/X.MwM/Jg/W.w/X.MwM/Jg/W.w/X.MwM/Jg/W.w', 120.00, 'Doutor em Música. Aulas regulares para tocar algum dos instrumentos que tenho domínio.', 'https://www.youtube.com/embed/2t7s5FZZwXo'),
('Melina Peixoto', 'mel.peixoto@gmail.com', '$2a$10$X.MwM/Jg/W.w/X.MwM/Jg/W.w/X.MwM/Jg/W.w/X.MwM/Jg/W.w', 150.00, 'Cantora Lírica. Aulas para conseguir desenvolver o canto lírico.', 'https://www.youtube.com/embed/a7zhAlhABrE'),
('João Rocker', 'joao.rock@gmail.com', '$2a$10$X.MwM/Jg/W.w/X.MwM/Jg/W.w/X.MwM/Jg/W.w/X.MwM/Jg/W.w', 90.00, 'Baterista de banda de rock, foco em pegada e ritmo.', NULL) ON CONFLICT (email) DO NOTHING;

-- 5. VÍNCULOS
INSERT INTO professor_instrumento (professor_id, instrumento_id) VALUES 
((SELECT id FROM professor WHERE email='daniel.augusto@gmail.com'), (SELECT id FROM instrumento WHERE nome='Violão')),
((SELECT id FROM professor WHERE email='mel.peixoto@gmail.com'), (SELECT id FROM instrumento WHERE nome='Piano')) ON CONFLICT DO NOTHING;

INSERT INTO professor_estilo (professor_id, estilo_id) VALUES
((SELECT id FROM professor WHERE email='daniel.augusto@gmail.com'), (SELECT id FROM estilo_musical WHERE nome='Clássico')),
((SELECT id FROM professor WHERE email='mel.peixoto@gmail.com'), (SELECT id FROM estilo_musical WHERE nome='Clássico')) ON CONFLICT DO NOTHING;

-- 6. CURSOS (AQUI ESTAVA O ERRO: "Violão", "Avançado")
INSERT INTO curso (professor_id, titulo, descricao, preco, modalidade, thumbnail_url, video_url) VALUES
(
    (SELECT id FROM professor WHERE email='daniel.augusto@gmail.com'), 
    'Violão Clássico: Do Zero ao Avançado', 
    'Aprenda a ler partituras, técnicas de dedilhado e repertório erudito.', 
    120.00, 'online', 
    'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=300&q=80',
    'https://www.youtube.com/embed/2t7s5FZZwXo'
),
(
    (SELECT id FROM professor WHERE email='daniel.augusto@gmail.com'), 
    'Harmonia e Teoria Musical Aplicada', 
    'Entenda como a música funciona. Intervalos, escalas e campo harmônico.', 
    80.00, 'online', 
    'https://images.unsplash.com/photo-1507838153414-b4b713384ebd?auto=format&fit=crop&w=300&q=80',
    NULL
),
(
    (SELECT id FROM professor WHERE email='mel.peixoto@gmail.com'), 
    'Piano Popular para Iniciantes', 
    'Toque suas músicas favoritas sem complicação. Foco em cifras e acompanhamento.', 
    150.00, 'online', 
    'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=300&q=80',
    'https://www.youtube.com/embed/a7zhAlhABrE'
) ON CONFLICT DO NOTHING;

-- 7. DADOS FINAIS
INSERT INTO disponibilidade (professor_id, dia_semana, hora_inicio, hora_fim) VALUES
((SELECT id FROM professor WHERE email='daniel.augusto@gmail.com'), 1, '14:00', '20:00'),
((SELECT id FROM professor WHERE email='daniel.augusto@gmail.com'), 3, '14:00', '20:00');

INSERT INTO aula (aluno_id, professor_id, data_hora, status_id, modalidade, valor_acordado)
SELECT 
    (SELECT id FROM aluno WHERE email='bruna@gmail.com'),
    (SELECT id FROM professor WHERE email='daniel.augusto@gmail.com'),
    NOW() - INTERVAL '5 days', 
    (SELECT id FROM status_aula WHERE nome='CONCLUIDA'), 
    'online', 120.00 
ON CONFLICT DO NOTHING;

INSERT INTO pagamento (aula_id, valor, status, metodo, data_pagamento)
VALUES ((SELECT id FROM aula LIMIT 1), 120.00, 'aprovado', 'pix', NOW() - INTERVAL '5 days') ON CONFLICT DO NOTHING;

INSERT INTO avaliacao (aula_id, aluno_id, professor_id, nota, comentario)
VALUES ((SELECT id FROM aula LIMIT 1), 1, 1, 5, 'Aula incrível, o Daniel é muito paciente!') ON CONFLICT DO NOTHING;