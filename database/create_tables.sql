-- Limpa o banco de dados (DROP em ordem reversa de dependência)
-- O CASCADE garante que se uma tabela depende da outra, ela cai junto.
DROP TABLE IF EXISTS mensagem CASCADE;
DROP TABLE IF EXISTS avaliacao CASCADE;
DROP TABLE IF EXISTS pagamento CASCADE;
DROP TABLE IF EXISTS aula CASCADE;
DROP TABLE IF EXISTS disponibilidade CASCADE;
DROP TABLE IF EXISTS curso CASCADE; -- Adicionado aqui para garantir limpeza
DROP TABLE IF EXISTS professor_estilo CASCADE;
DROP TABLE IF EXISTS professor_instrumento CASCADE;
DROP TABLE IF EXISTS status_aula CASCADE;
DROP TABLE IF EXISTS estilo_musical CASCADE;
DROP TABLE IF EXISTS instrumento CASCADE;
DROP TABLE IF EXISTS professor CASCADE;
DROP TABLE IF EXISTS aluno CASCADE;

-- 1. Tabelas de Domínio/Catálogo
CREATE TABLE instrumento (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE estilo_musical (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE status_aula (
    id INTEGER PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

-- 2. Usuários (Aluno e Professor)
CREATE TABLE aluno (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    foto_url TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE professor (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    biografia TEXT,
    valor_base_aula DECIMAL(10, 2) NOT NULL, -- Pode ser um valor padrão "a partir de"
    foto_url TEXT,
    link_video_demo TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Relacionamentos N:N
CREATE TABLE professor_instrumento (
    professor_id INTEGER REFERENCES professor(id) ON DELETE CASCADE,
    instrumento_id INTEGER REFERENCES instrumento(id) ON DELETE CASCADE,
    PRIMARY KEY (professor_id, instrumento_id)
);

CREATE TABLE professor_estilo (
    professor_id INTEGER REFERENCES professor(id) ON DELETE CASCADE,
    estilo_id INTEGER REFERENCES estilo_musical(id) ON DELETE CASCADE,
    PRIMARY KEY (professor_id, estilo_id)
);

-- 4. Produtos (Gigs/Cursos)
-- Esta é a tabela principal do estilo "Fiverr"
CREATE TABLE curso (
    id SERIAL PRIMARY KEY,
    professor_id INTEGER REFERENCES professor(id) ON DELETE CASCADE,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    video_url TEXT,
    thumbnail_url TEXT,
    modalidade VARCHAR(20) DEFAULT 'online',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Agenda e Disponibilidade
CREATE TABLE disponibilidade (
    id SERIAL PRIMARY KEY,
    professor_id INTEGER REFERENCES professor(id) ON DELETE CASCADE,
    dia_semana INTEGER NOT NULL, -- 0=Domingo, 1=Segunda, ... 6=Sábado
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL
);

-- 6. Aulas (Transação)
CREATE TABLE aula (
    id SERIAL PRIMARY KEY,
    aluno_id INTEGER REFERENCES aluno(id) ON DELETE SET NULL,
    professor_id INTEGER REFERENCES professor(id) ON DELETE SET NULL,
    curso_id INTEGER REFERENCES curso(id) ON DELETE SET NULL, -- IMPORTANTE: Saber qual "Gig" foi comprado
    data_hora TIMESTAMP NOT NULL,
    duracao_minutos INTEGER DEFAULT 60,
    status_id INTEGER REFERENCES status_aula(id),
    modalidade VARCHAR(20) CHECK (modalidade IN ('online', 'presencial')),
    valor_acordado DECIMAL(10, 2) NOT NULL,
    link_reuniao TEXT,
    endereco_aula TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Financeiro
CREATE TABLE pagamento (
    id SERIAL PRIMARY KEY,
    aula_id INTEGER UNIQUE REFERENCES aula(id) ON DELETE CASCADE,
    valor DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pendente', 'aprovado', 'recusado', 'estornado')),
    metodo VARCHAR(50),
    data_pagamento TIMESTAMP,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Social
CREATE TABLE avaliacao (
    id SERIAL PRIMARY KEY,
    aula_id INTEGER UNIQUE REFERENCES aula(id) ON DELETE CASCADE,
    aluno_id INTEGER REFERENCES aluno(id),
    professor_id INTEGER REFERENCES professor(id),
    nota INTEGER CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mensagem (
    id SERIAL PRIMARY KEY,
    aula_id INTEGER REFERENCES aula(id) ON DELETE CASCADE,
    remetente_tipo VARCHAR(10) CHECK (remetente_tipo IN ('ALUNO', 'PROFESSOR')),
    texto TEXT NOT NULL,
    lida BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);