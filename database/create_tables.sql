CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TABELAS BÁSICAS
CREATE TABLE IF NOT EXISTS aluno (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(180) UNIQUE NOT NULL,
    telefone VARCHAR(30),
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS professor (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(180) UNIQUE NOT NULL,
    instrumento VARCHAR(80) NOT NULL,
    preco_hora NUMERIC(10,2) NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS status_aula (
    id SMALLINT PRIMARY KEY,
    nome VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS aula (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aluno_id UUID NOT NULL REFERENCES aluno(id) ON DELETE CASCADE,
    professor_id UUID NOT NULL REFERENCES professor(id) ON DELETE CASCADE,
    inicio TIMESTAMP NOT NULL,
    fim TIMESTAMP NOT NULL,
    status_id SMALLINT NOT NULL REFERENCES status_aula(id),
    modalidade VARCHAR(30) NOT NULL, -- presencial/online/híbrida
    valor_acordado NUMERIC(10,2) NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_fim_depois_inicio CHECK (fim > inicio)
);

CREATE TABLE IF NOT EXISTS avaliacao (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aula_id UUID NOT NULL UNIQUE REFERENCES aula(id) ON DELETE CASCADE,
    nota SMALLINT NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario TEXT,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices úteis
CREATE INDEX IF NOT EXISTS idx_aula_prof_data ON aula(professor_id, inicio);
CREATE INDEX IF NOT EXISTS idx_aula_aluno_data ON aula(aluno_id, inicio);
