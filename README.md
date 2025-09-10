# Clave: Plataforma de Aulas de Música - Camada de Domínio

Este repositório contém a implementação da **Camada de Domínio** para o projeto da plataforma **Clave**.

## 1. Sobre o Nome: Clave

O nome **Clave** foi escolhido por seu profundo significado no universo musical. A clave (como a Clave de Sol ou de Fá) é o símbolo no início de uma partitura que define a altura das notas musicais. Ela é, literalmente, a "chave" para a leitura e a compreensão da música.

Para a nossa plataforma, o nome simboliza que o projeto é a **chave para conectar alunos e professores**, destravando o potencial musical de cada um e fornecendo o guia certo para a jornada de aprendizado.

## 2. Contexto Acadêmico

Este projeto foi desenvolvido como parte da avaliação da disciplina de Engenharia de Software II, do curso de Ciência da Computação da PUC Minas.

- **Instituição:** Pontifícia Universidade Católica de Minas Gerais (PUC Minas)
- **Curso:** Ciência da Computação
- **Disciplina:** Engenharia de Software II
- **Professor:** João Paulo Coelho Furtado

## 3. Descrição do Projeto

O objetivo do projeto completo é criar uma plataforma web onde alunos possam encontrar, agendar e avaliar aulas com professores de música. O sistema visa facilitar a conexão entre estudantes e especialistas, gerenciando perfis, agendas, negociações e pagamentos de forma intuitiva e segura.

## 4. Contexto da Atividade

Este código representa a entrega da atividade focada na **implementação da Camada de Domínio** do sistema. O objetivo foi traduzir os requisitos funcionais e o modelo de arquitetura em classes concretas que representam o "coração" do negócio.

O foco foi em:
- **Modelar as entidades principais:** `Professor`, `Aluno`, `Aula` e `Avaliacao`.
- **Garantir o encapsulamento:** Utilizando atributos privados (`#`) para proteger o estado interno dos objetos.
- **Implementar Regras de Negócio:** Criar métodos que contenham lógicas essenciais do sistema, como o cálculo de médias e a transição de status de uma aula.

## 5. Tecnologias Utilizadas

- **Runtime:** [Node.js](https://nodejs.org/) (versão 22.19.0 LTS ou superior)
- **Linguagem:** JavaScript (com sintaxe de Classes do ES6+)
- **Ambiente de Desenvolvimento:** Visual Studio Code

## 6. Estrutura do Projeto

O projeto está organizado da seguinte forma para garantir a separação de responsabilidades:

```
clave/
|
+-- src/
|   +-- dominio/
|       |-- Professor.js
|       |-- Aluno.js
|       |-- Aula.js
|       |-- Avaliacao.js
|       `-- StatusAula.js
|
+-- main.js          (Arquivo principal para simular e testar o domínio)
`-- README.md        (Este arquivo)
```

## 7. Modelo de Domínio Detalhado

A camada de domínio é o núcleo do software, contendo as classes que representam os conceitos do negócio.

### `StatusAula.js`
- **Responsabilidade:** Funciona como uma enumeração para definir os possíveis estados de uma aula. O uso de um objeto congelado (`Object.freeze`) impede modificações acidentais, garantindo que os status sejam sempre consistentes em todo o sistema.

### `Professor.js`
- **Responsabilidade:** Representa a entidade Professor. Ele gerencia suas informações pessoais, sua agenda e as avaliações que recebe de seus alunos.
- **Métodos de Negócio:**
  - `calcularNotaMedia()`: Implementa a regra de negócio para calcular a média aritmética das notas de todas as avaliações recebidas. Se o professor não tiver avaliações, a média retornada é 0 para evitar erros de divisão por zero.

### `Aluno.js`
- **Responsabilidade:** Representa a entidade Aluno no sistema.

### `Aula.js`
- **Responsabilidade:** É uma classe central que conecta um `Professor` a um `Aluno`. Representa um evento de agendamento e controla seu ciclo de vida.
- **Métodos de Negócio:**
  - `confirmar()` e `cancelarPorAluno()`: Implementam a "máquina de estados" da aula. Eles contêm lógicas que garantem que o status só possa ser alterado a partir de um estado válido.

### `Avaliacao.js`
- **Responsabilidade:** Representa o feedback formal que um `Aluno` (autor) fornece sobre um `Professor` após uma aula.
- **Métodos de Negócio:**
  - O próprio **construtor** da classe implementa uma regra de negócio crucial: ele dispara um erro (`throw new Error`) se a nota fornecida não estiver no intervalo de 1 a 5, garantindo a integridade dos dados.

## 8. Como Executar

Para testar a camada de domínio e ver as regras de negócio em ação, siga os passos abaixo.

**Pré-requisitos:**
- Ter o [Node.js](https://nodejs.org/) instalado na sua máquina.

**Passos:**

1.  **Clone o repositório** (ou crie os arquivos e pastas conforme a estrutura acima).
2.  **Abra o terminal** na pasta raiz do projeto (`clave/`).
3.  **Execute o arquivo de simulação** com o seguinte comando:
    ```bash
    node main.js
    ```
4.  O terminal exibirá uma simulação passo a passo, mostrando a criação de professores e alunos, o agendamento de uma aula, a mudança de seu status e o cálculo da média de avaliações de um professor.

## 9. Grupo

- Ana Cristina Martins Silva
- Letícia Azevedo Cota Barbosa
- Lucas Gabriel Almeida Gomes
- Pedro Henrique Gaioso de Oliveira
- Victor Lustosa
