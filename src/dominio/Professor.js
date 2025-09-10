class Professor {
    // Atributos privados
    #id;
    #nome;
    #email;
    #biografia;
    #valorBaseAula;
    #agenda;
    #avaliacoesRecebidas;

    constructor(id, nome, email, biografia, valorBaseAula) {
        this.#id = id;
        this.#nome = nome;
        this.#email = email;
        this.#biografia = biografia;
        this.#valorBaseAula = valorBaseAula;
        this.#agenda = [];
        this.#avaliacoesRecebidas = [];
    }

    // --- Métodos de Negócio ---

    /**
     * Calcula a média das notas recebidas nas avaliações.
     * @returns {number} A nota média do professor.
     */
    calcularNotaMedia() {
        if (this.#avaliacoesRecebidas.length === 0) {
            return 0;
        }
        const somaDasNotas = this.#avaliacoesRecebidas.reduce((soma, avaliacao) => soma + avaliacao.obterNota(), 0);
        return somaDasNotas / this.#avaliacoesRecebidas.length;
    }

    /**
     * Adiciona uma nova aula à agenda do professor.
     * @param {Aula} aula 
     */
    adicionarAulaNaAgenda(aula) {
        this.#agenda.push(aula);
    }

    /**
     * Adiciona uma nova avaliação à lista do professor.
     * @param {Avaliacao} avaliacao 
     */
    adicionarAvaliacao(avaliacao) {
        this.#avaliacoesRecebidas.push(avaliacao);
    }

    // --- Métodos de Acesso (Getters e Setters) ---
    obterId() {
        return this.#id;
    }
    obterNome() {
        return this.#nome;
    }
    alterarNome(novoNome) {
        this.#nome = novoNome;
    }
    obterAvaliacoesRecebidas() {
        return this.#avaliacoesRecebidas;
    }
}

// Exporta a classe para ser usada em outros arquivos
module.exports = Professor;