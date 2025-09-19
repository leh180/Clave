# Clave: Plataforma de Aulas de Música

Este repositório contém a implementação das camadas de **Domínio** e **Persistência** para o projeto da plataforma **Clave**.

## 1. Sobre o Nome: Clave

O nome **Clave** foi escolhido por seu profundo significado no universo musical. A clave é a "chave" para a leitura da música, e nossa plataforma é a chave para **conectar alunos e professores**, destravando o potencial musical de cada um.

## 2. Contexto Acadêmico

Este projeto foi desenvolvido para a disciplina de Engenharia de Software II, do curso de Ciência da Computação da PUC Minas, sob orientação do professor João Paulo Coelho Furtado.

## 3. Arquitetura e Camadas

O projeto está dividido em camadas para garantir a separação de responsabilidades:

-   **Domínio (`src/dominio`):** Contém as classes que representam o coração do negócio (`Professor`, `Aluno`, `Aula`, etc.), com suas regras e lógicas internas.
-   **Persistência (`src/persistencia`):** Responsável por toda a comunicação com o banco de dados. Utiliza o padrão Repository para abstrair as operações de CRUD.

## 4. Banco de Dados

Os scripts para a criação e povoamento do banco de dados PostgreSQL estão na pasta `database/`.

-   **`database/create_tables.sql`**: Script DDL que cria toda a estrutura de tabelas, relacionamentos e restrições.
-   **`database/insert_data.sql`**: Script DML que insere dados iniciais no banco para testes.

## 5. Como Executar o Projeto

**Pré-requisitos:**
-   [Node.js](https://nodejs.org/) instalado.
-   Um servidor [PostgreSQL](https://www.postgresql.org/) rodando localmente.

**Passos:**

1.  **Configuração do Banco de Dados:**
    -   Crie um banco de dados no PostgreSQL (ex: `clave_db`).
    -   Execute o script `database/create_tables.sql` para criar as tabelas.
    -   Execute o script `database/insert_data.sql` para popular o banco com dados iniciais.

2.  **Configuração da Aplicação:**
    -   Clone este repositório.
    -   Na pasta raiz, instale as dependências: `npm install mysql2`
    -   Abra o arquivo `src/persistencia/database.js` e **configure seu usuário e senha** do PostgreSQL.

3.  **Execução dos Testes:**
    -   Abra um terminal na pasta raiz do projeto.
    -   Execute o arquivo de simulação com o comando:
        ```bash
        node teste.js
        ```
    -   O terminal exibirá o resultado das operações de CRUD (criar, ler, atualizar e deletar) no banco de dados.

## 6. Grupo

-   Ana Cristina Martins Silva
-   Letícia Azevedo Cota Barbosa
-   Lucas Gabriel Almeida Gomes
-   Pedro Henrique Gaioso de Oliveira
-   Victor Lustosa