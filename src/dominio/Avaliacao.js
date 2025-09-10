class Avaliacao {
    #id;
    #autor;
    #professorAvaliado;
    #nota;
    #comentario;

    constructor(id, autor, professorAvaliado, nota, comentario) {
        // Regra de negócio direto no construtor para garantir a integridade do objeto
        if (nota < 1 || nota > 5) {
            throw new Error("A nota da avaliação deve ser um valor entre 1 e 5.");
        }
        this.#id = id;
        this.#autor = autor;
        this.#professorAvaliado = professorAvaliado;
        this.#nota = nota;
        this.#comentario = comentario;
    }

    // --- Métodos de Acesso ---
    obterNota() {
        return this.#nota;
    }

    obterComentario() {
        return this.#comentario;
    }
}

module.exports = Avaliacao;