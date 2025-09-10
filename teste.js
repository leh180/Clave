// Importa as classes que criamos
const Professor = require('./src/dominio/Professor');
const Aluno = require('./src/dominio/Aluno');
const Aula = require('./src/dominio/Aula');
const Avaliacao = require('./src/dominio/Avaliacao');

console.log("--- Iniciando simulação da plataforma ---");

// 1. Criando um professor e um aluno
const profCarlos = new Professor(1, "Carlos Santana", "carlos@email.com", "Lenda da guitarra", 150.00);
const alunoJoao = new Aluno(101, "João", "joao@email.com");

console.log(`Professor criado: ${profCarlos.obterNome()}`);
console.log(`Aluno criado: ${alunoJoao.obterNome()}`);

// 2. Aluno solicita uma aula
const aulaDeGuitarra = new Aula(1, profCarlos, alunoJoao, "2025-10-20T10:00:00", 150.00);
alunoJoao.adicionarAula(aulaDeGuitarra);
profCarlos.adicionarAulaNaAgenda(aulaDeGuitarra);
console.log(`\nAula solicitada. Status atual: ${aulaDeGuitarra.obterStatus()}`);

// 3. Professor confirma a aula
aulaDeGuitarra.confirmar();
console.log(`Status da aula após confirmação: ${aulaDeGuitarra.obterStatus()}`);

// 4. Aluno faz uma avaliação após a aula
const avaliacao1 = new Avaliacao(1, alunoJoao, profCarlos, 5, "Aula fantástica, muito didático!");
profCarlos.adicionarAvaliacao(avaliacao1);
console.log(`\n${alunoJoao.obterNome()} avaliou o professor ${profCarlos.obterNome()} com nota ${avaliacao1.obterNota()}`);

// 5. Outro aluno avalia o mesmo professor
const alunoPedro = new Aluno(102, "Pedro", "pedro@email.com");
const avaliacao2 = new Avaliacao(2, alunoPedro, profCarlos, 4, "Muito bom!");
profCarlos.adicionarAvaliacao(avaliacao2);
console.log(`${alunoPedro.obterNome()} avaliou o professor ${profCarlos.obterNome()} com nota ${avaliacao2.obterNota()}`);

// 6. Verificando a média do professor
const mediaDoProfessor = profCarlos.calcularNotaMedia();
console.log(`\nA nota média do professor ${profCarlos.obterNome()} é: ${mediaDoProfessor.toFixed(2)}`);

console.log("\n--- Simulação finalizada ---");