// Função para permitir drop
function allowDrop(ev) {
    ev.preventDefault();
}

// Função para pegar o item arrastado
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

// Função para soltar o item na zona de montagem
function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const nodeCopy = document.getElementById(data).cloneNode(true);
    nodeCopy.removeAttribute("id"); // Remove o ID para poder adicionar múltiplos elementos
    ev.target.appendChild(nodeCopy);
}

// Função para gerar o nome da cadeia
function gerarNome() {
    const dropzone = document.getElementById("dropzone");
    const elementos = dropzone.children;
    let numCarbonos = 0;
    let numLigacoesDuplas = 0;
    let numLigacoesTriplas = 0;
    let posicoesDuplas = [];
    let posicoesTriplas = [];

    // Itera sobre os elementos da área de montagem
    for (let i = 0; i < elementos.length; i++) {
        if (elementos[i].classList.contains('carbono')) {
            numCarbonos++;
        } else if (elementos[i].classList.contains('ligacao')) {
            if (elementos[i].innerText === '=') {
                numLigacoesDuplas++;
                posicoesDuplas.push(Math.ceil(i / 2));
            } else if (elementos[i].innerText === '≡') {
                numLigacoesTriplas++;
                posicoesTriplas.push(Math.ceil(i / 2));
            }
        }
    }

    let nomeBase = gerarNomeBase(numCarbonos);
    let nomeFinal = '';

    if (numLigacoesDuplas === 0 && numLigacoesTriplas === 0) {
        nomeFinal = nomeBase + 'ano'; // Cadeia saturada (alcano)
    } else if (numLigacoesDuplas > 0 && numLigacoesTriplas === 0) {
        nomeFinal = gerarNomeInsaturacao(nomeBase, 'eno', posicoesDuplas);
    } else if (numLigacoesTriplas > 0 && numLigacoesDuplas === 0) {
        nomeFinal = gerarNomeInsaturacao(nomeBase, 'ino', posicoesTriplas);
    } else {
        nomeFinal = "Cadeia com múltiplas insaturações (complexa)";
    }

    document.getElementById("resultado").innerText = "Nome da cadeia: " + nomeFinal;
}

// Função auxiliar para gerar o nome base (met-, et-, prop-, etc.)
function gerarNomeBase(numCarbonos) {
    switch (numCarbonos) {
        case 1:
            return "Met";
        case 2:
            return "Et";
        case 3:
            return "Prop";
        case 4:
            return "But";
        case 5:
            return "Pent";
        case 6:
            return "Hex";
        case 7:
            return "Hept";
        case 8:
            return "Oct";
        case 9:
            return "Non";
        case 10:
            return "Dec";
        default:
            return "Cadeia Desconhecida";
    }
}

// Função auxiliar para gerar o nome da insaturação com posições no meio
function gerarNomeInsaturacao(nomeBase, sufixo, posicoes) {
    let posicoesTexto = posicoes.length > 1 ? posicoes.join(',') : posicoes[0];
    return nomeBase + '-' + posicoesTexto + '-' + sufixo;
}

// Adiciona os eventos de arrastar e soltar
document.addEventListener("DOMContentLoaded", function() {
    const carbonos = document.querySelectorAll('.carbono');
    const ligacoes = document.querySelectorAll('.ligacao');
    const dropzone = document.getElementById("dropzone");

    carbonos.forEach(carbono => {
        carbono.addEventListener("dragstart", drag);
    });

    ligacoes.forEach(ligacao => {
        ligacao.addEventListener("dragstart", drag);
    });

    dropzone.addEventListener("dragover", allowDrop);
    dropzone.addEventListener("drop", drop);

    document.getElementById("gerarNome").addEventListener("click", gerarNome);
});
