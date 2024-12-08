// utils.js
function saudacao(nome) {
    return `Olá, ${nome}!`;
}

function soma(a, b) {
    return a + b;
}

// Torne as funções globais
window.saudacao = saudacao;
window.soma = soma;
