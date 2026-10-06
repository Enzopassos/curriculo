/**
 * ============================================================================
 * LÓGICA DA APLICAÇÃO WEB - CURRÍCULO BRUTALISTA
 * Desenvolvedor: Enzo da Silva Passos
 * Padrões: Vanilla JS Modular, Princípios SOLID, Clean Code e Fail-Fast
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  inicializarAplicacao();
});

/**
 * Função principal que inicializa todos os módulos da aplicação de forma desacoplada.
 */
function inicializarAplicacao() {
  configurarAlternadorDeTema();
  configurarFiltroDeHabilidades();
  configurarCopiaDeContato();
  configurarBotaoImprimir();
}

/**
 * Gerencia a alternância entre tema claro e tema escuro brutalista (Dark Brutalism).
 * Persiste a preferência do usuário no localStorage.
 */
function configurarAlternadorDeTema() {
  const CHAVE_ARMAZENAMENTO_TEMA = 'tema_preferido_enzo';
  const elementoHtml = document.documentElement;
  const botaoAlternarTema = document.getElementById('botao-alternar-tema');
  const iconeTema = document.getElementById('icone-tema');
  const rotuloTema = document.getElementById('rotulo-tema');

  if (!botaoAlternarTema || !iconeTema || !rotuloTema) {
    return;
  }

  // Recupera preferência prévia ou verifica preferência do sistema operacional
  const temaSalvo = localStorage.getItem(CHAVE_ARMAZENAMENTO_TEMA);
  const prefereEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const temaInicial = temaSalvo || (prefereEscuro ? 'escuro' : 'claro');

  aplicarTema(temaInicial);

  botaoAlternarTema.addEventListener('click', () => {
    const temaAtual = elementoHtml.getAttribute('data-tema') || 'claro';
    const novoTema = temaAtual === 'claro' ? 'escuro' : 'claro';
    aplicarTema(novoTema);
    localStorage.setItem(CHAVE_ARMAZENAMENTO_TEMA, novoTema);
  });

  function aplicarTema(tema) {
    elementoHtml.setAttribute('data-tema', tema);
    if (tema === 'escuro') {
      iconeTema.textContent = '☀️';
      rotuloTema.textContent = 'CLARO';
    } else {
      iconeTema.textContent = '🌙';
      rotuloTema.textContent = 'ESCURO';
    }
  }
}

/**
 * Filtra os itens da grade de tecnologias com base na categoria selecionada.
 */
function configurarFiltroDeHabilidades() {
  const botoesFiltro = document.querySelectorAll('.botao-filtro');
  const itensHabilidade = document.querySelectorAll('.item-habilidade');

  if (!botoesFiltro.length || !itensHabilidade.length) {
    return;
  }

  botoesFiltro.forEach((botao) => {
    botao.addEventListener('click', () => {
      const filtroSelecionado = botao.getAttribute('data-filtro');

      // Atualiza estado visual e semântico dos botões
      botoesFiltro.forEach((b) => {
        b.classList.remove('botao-filtro--ativo');
        b.setAttribute('aria-selected', 'false');
      });
      botao.classList.add('botao-filtro--ativo');
      botao.setAttribute('aria-selected', 'true');

      // Aplica o filtro aos itens
      itensHabilidade.forEach((item) => {
        const categoriaItem = item.getAttribute('data-categoria');
        const deveExibir = filtroSelecionado === 'todos' || categoriaItem === filtroSelecionado;

        if (deveExibir) {
          item.classList.remove('oculto');
        } else {
          item.classList.add('oculto');
        }
      });
    });
  });
}

/**
 * Configura o botão de cópia de e-mail e canais de contato com feedback visual.
 */
function configurarCopiaDeContato() {
  const botaoCopiarEmail = document.getElementById('botao-copiar-email');
  const botaoCopiarRapido = document.getElementById('botao-copiar-email-rapido');
  const avisoFlutuante = document.getElementById('aviso-flutuante');

  if (botaoCopiarEmail) {
    botaoCopiarEmail.addEventListener('click', () => {
      const conteudo = botaoCopiarEmail.getAttribute('data-conteudo') || '';
      copiarParaAreaDeTransferencia(conteudo, 'E-mail copiado para a área de transferência!');
    });
  }

  if (botaoCopiarRapido) {
    botaoCopiarRapido.addEventListener('click', () => {
      const email = botaoCopiarRapido.getAttribute('data-email') || '';
      copiarParaAreaDeTransferencia(email, 'E-mail copiado: ' + email);
    });
  }

  /**
   * Copia o texto para o clipboard com suporte a fallback e exibe notificação temporária.
   * @param {string} texto 
   * @param {string} mensagemSucesso 
   */
  function copiarParaAreaDeTransferencia(texto, mensagemSucesso) {
    if (!texto) return;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(texto)
        .then(() => exibirAviso(mensagemSucesso))
        .catch(() => fallbackCopiar(texto, mensagemSucesso));
    } else {
      fallbackCopiar(texto, mensagemSucesso);
    }
  }

  function fallbackCopiar(texto, mensagemSucesso) {
    const areaTextoTemporaria = document.createElement('textarea');
    areaTextoTemporaria.value = texto;
    areaTextoTemporaria.style.position = 'fixed';
    areaTextoTemporaria.style.left = '-999999px';
    document.body.appendChild(areaTextoTemporaria);
    areaTextoTemporaria.focus();
    areaTextoTemporaria.select();

    try {
      document.execCommand('copy');
      exibirAviso(mensagemSucesso);
    } catch (erro) {
      console.error('Falha ao copiar texto:', erro);
    } finally {
      document.body.removeChild(areaTextoTemporaria);
    }
  }

  let temporizadorAviso = null;
  function exibirAviso(mensagem) {
    if (!avisoFlutuante) return;

    avisoFlutuante.textContent = mensagem;
    avisoFlutuante.hidden = false;

    if (temporizadorAviso) {
      clearTimeout(temporizadorAviso);
    }

    temporizadorAviso = setTimeout(() => {
      avisoFlutuante.hidden = true;
    }, 3000);
  }
}

/**
 * Aciona a caixa de diálogo de impressão nativa do navegador para salvar em PDF.
 */
function configurarBotaoImprimir() {
  const botaoImprimir = document.getElementById('botao-imprimir');
  if (botaoImprimir) {
    botaoImprimir.addEventListener('click', () => {
      window.print();
    });
  }
}
