-- Garante que a extensão para gerar UUIDs esteja disponível
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TABELAS BÁSICAS

-- Tabela de Alunos, alinhada com a classe Aluno.js
CREATE TABLE IF NOT EXISTS aluno (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(180) UNIQUE NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabela de Professores, alinhada com a classe Professor.js
CREATE TABLE IF NOT EXISTS professor (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(180) UNIQUE NOT NULL,
    biografia TEXT,
    valor_base_aula NUMERIC(10, 2) NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabela de Status
CREATE TABLE IF NOT EXISTS status_aula (
    id SMALLINT PRIMARY KEY,
    nome VARCHAR(30) UNIQUE NOT NULL
);

-- Tabela de Aulas
CREATE TABLE IF NOT EXISTS aula (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aluno_id UUID NOT NULL REFERENCES aluno(id) ON DELETE CASCADE,
    professor_id UUID NOT NULL REFERENCES professor(id) ON DELETE CASCADE,
    data_hora TIMESTAMP NOT NULL,
    status_id SMALLINT NOT NULL REFERENCES status_aula(id),
    modalidade VARCHAR(30),
    valor_acordado NUMERIC(10, 2) NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabela de Avaliações
CREATE TABLE IF NOT EXISTS avaliacao (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aluno_id UUID NOT NULL REFERENCES aluno(id) ON DELETE CASCADE,
    professor_id UUID NOT NULL REFERENCES professor(id) ON DELETE CASCADE,
    nota SMALLINT NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario TEXT,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices úteis para performance em buscas de agendamentos
CREATE INDEX IF NOT EXISTS idx_aula_prof_data ON aula(professor_id, data_hora);
CREATE INDEX IF NOT EXISTS idx_aula_aluno_data ON aula(aluno_id, data_hora);