/* Loja Instructiva (loja.html): vitrine, filtros e janela "espiar" produto.
   Os produtos vêm de js/loja-produtos.js (é lá que muda preço, link, foto e nome).
   Todo botão "Comprar" leva direto pro link de pagamento do produto:
   cor, tamanho, quantidade e frete a pessoa escolhe lá no pagamento. */
(function () {
  // produtos com oculto: true ficam fora da loja (ex.: esperando foto)
  var PRODUTOS = (window.LOJA_PRODUTOS || []).filter(function (p) { return !p.oculto; });
  var grid = document.getElementById('lojaGrid');
  if (!grid || !PRODUTOS.length) return;

  var reduz = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var porId = {};
  PRODUTOS.forEach(function (p) { porId[p.id] = p; });

  var ICO = {
    olho: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.8"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    cadeado: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="10.5" width="16" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>'
  };

  function brl(v) {
    var p = Number(v).toFixed(2).split('.');
    return 'R$ ' + p[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + p[1];
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function isLivro(p) { return p.tipo === 'livro'; }

  // Black Friday: preço "de/por" vem de js/black-friday.js (lista "precos")
  function bfAtiva() {
    var BF = window.INSTRUCTIVA_BF;
    return BF && BF.ativo && typeof BF.oferta === 'function' ? BF : null;
  }
  function bfChave(p) { var m = /([^\/]+)\.html/.exec(p.pagina || ''); return m ? m[1] : ''; }
  function bfOferta(p) {
    var BF = bfAtiva();
    if (!BF) return null;
    var chave = bfChave(p);
    return (chave && BF.oferta(chave)) || BF.oferta(p.tipo);
  }
  function bfLink(p) {
    var BF = bfAtiva(), chave = bfChave(p);
    return (BF && chave && BF.linkDe && BF.linkDe(chave)) || '';
  }
  function seloBF(p) {
    var o = bfOferta(p);
    return o ? '<span class="bf-sticker" aria-label="' + o.off + '% de desconto"><b>-' + o.off + '%</b><small>off</small></span>' : '';
  }

  function precoHTML(p) {
    var o = bfOferta(p);
    if (o) {
      var de = '<s class="prod-de">de ' + brl(o.de) + '</s>';
      if (!o.parcela) return de + '<strong>' + brl(o.por) + '</strong>';
      return de + '<small>12x de</small><strong>' + brl(o.parcela) + '</strong><em>ou ' + brl(o.por) + ' à vista</em>';
    }
    if (!p.parcelas) return '<strong>' + brl(p.preco) + '</strong>';
    return '<small>' + p.parcelas + 'x de</small><strong>' + brl(p.parcela) + '</strong>' +
      '<em>ou ' + brl(p.preco) + ' à vista</em>';
  }
  function selosHTML(p) {
    return (p.selos || []).map(function (s, i) {
      return '<span class="prod-tag' + (i ? ' prod-tag--dark' : '') + '">' + esc(s) + '</span>';
    }).join('');
  }
  function comprarHTML(p, cls, texto) {
    var link = bfLink(p) || p.checkout;
    return '<a class="btn btn-cta ' + cls + '" href="' + esc(link) + '" target="_blank" rel="noopener" data-produto="' + esc(p.nome) + '">' + texto + '</a>';
  }

  // ------------------------------------------------------------------ vitrine
  function cardHTML(p) {
    var selos = selosHTML(p);
    return '<article class="prod-card" id="p-' + esc(p.id) + '" data-id="' + esc(p.id) + '" data-tipo="' + esc(p.tipo) + '">' +
      '<button type="button" class="prod-media" data-qv aria-label="Ver detalhes: ' + esc(p.nome) + '">' +
        '<img src="' + esc(p.foto) + '" alt="' + esc(p.nome) + '" width="1254" height="1254" loading="lazy" decoding="async">' +
        (selos ? '<span class="prod-tags">' + selos + '</span>' : '') + seloBF(p) +
        '<span class="prod-spy">' + ICO.olho + 'Espiar</span>' +
      '</button>' +
      '<div class="prod-body">' +
        '<span class="prod-cat">' + esc(p.categoria) + '</span>' +
        '<h3 class="prod-name"><button type="button" data-qv>' + esc(p.nome) + '</button></h3>' +
        '<div class="prod-price">' + precoHTML(p) + '</div>' +
        comprarHTML(p, 'prod-btn', 'Comprar') +
      '</div>' +
    '</article>';
  }
  grid.innerHTML = PRODUTOS.map(cardHTML).join('');

  // ------------------------------------------------------------------ filtros
  var tabs = $$('.loja-tabs [data-filtro]');
  var contador = $('#lojaContador');

  function conta(tipo) {
    return PRODUTOS.filter(function (p) { return tipo === 'todos' || p.tipo === tipo; }).length;
  }
  $$('[data-conta]').forEach(function (el) {
    var n = conta(el.getAttribute('data-conta'));
    el.textContent = el.hasAttribute('data-conta-texto') ? n + (n === 1 ? ' produto' : ' produtos') : n;
  });
  // aba ou categoria sem nenhum produto visível fica escondida (e aparece sozinha quando tiver)
  $$('.loja-tabs [data-filtro], .loja-cat[data-filtro]').forEach(function (el) {
    var t = el.getAttribute('data-filtro');
    if (t !== 'todos') el.style.display = conta(t) ? '' : 'none';
  });

  function filtrar(tipo, anima) {
    tabs.forEach(function (t) { t.setAttribute('aria-pressed', t.getAttribute('data-filtro') === tipo ? 'true' : 'false'); });
    var i = 0;
    $$('.prod-card', grid).forEach(function (card) {
      var mostra = tipo === 'todos' || card.getAttribute('data-tipo') === tipo;
      card.hidden = !mostra;
      card.classList.remove('is-in');
      if (mostra && anima && !reduz) {
        card.style.setProperty('--d', Math.min(i, 11) * 45 + 'ms');
        void card.offsetWidth;
        card.classList.add('is-in');
      }
      if (mostra) i++;
    });
    if (contador) contador.textContent = i + (i === 1 ? ' produto' : ' produtos');
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-filtro]') : null;
    if (!el) return;
    filtrar(el.getAttribute('data-filtro'), true);
    if (el.tagName === 'A') {
      e.preventDefault();
      var alvo = document.getElementById('produtos');
      if (alvo) alvo.scrollIntoView({ behavior: reduz ? 'auto' : 'smooth', block: 'start' });
    }
  });

  // loja.html#livros, #camisetas, #bones, #canecas ou #copos já abre filtrado
  var HASH = { '#livros': 'livro', '#camisetas': 'camiseta', '#bones': 'bone', '#canecas': 'caneca', '#copos': 'copo' };
  var inicial = HASH[location.hash] && conta(HASH[location.hash]) ? HASH[location.hash] : 'todos';
  filtrar(inicial, false);
  if (inicial !== 'todos') {
    setTimeout(function () { var a = document.getElementById('produtos'); if (a) a.scrollIntoView(); }, 60);
  }

  // ------------------------------------------------------------------ "espiar" produto
  var qv = document.createElement('div');
  qv.className = 'qv';
  qv.setAttribute('aria-hidden', 'true');
  qv.innerHTML = '<div class="qv-bg" data-qv-close></div><div class="qv-box" role="dialog" aria-modal="true" aria-labelledby="qvNome"></div>';
  document.body.appendChild(qv);
  var qvBox = $('.qv-box', qv);
  var qvFoco = null;

  function abrirQV(p) {
    var selos = selosHTML(p);
    var lista = p.itens
      ? '<ul class="qv-list">' + p.itens.map(function (t) { return '<li>' + ICO.check + esc(t) + '</li>'; }).join('') + '</ul>'
      : '';
    var opcoes = p.opcoes ? '<p class="qv-opts">' + esc(p.opcoes) + '</p>' : '';
    var acoes = '<div class="qv-actions">' + comprarHTML(p, 'qv-buy', 'Comprar agora') +
      (p.pagina ? '<a class="btn qv-ghost" href="' + esc(p.pagina) + '">Ver página do livro</a>' : '') + '</div>';
    var nota = isLivro(p)
      ? 'Pagamento seguro · cartão em até ' + p.parcelas + 'x ou à vista · garantia de 7 dias'
      : 'Pagamento seguro · em até ' + p.parcelas + 'x · ' + (p.opcoes ? 'cor, tamanho, ' : '') + 'quantidade e frete você escolhe no pagamento';
    qvBox.innerHTML =
      '<button type="button" class="qv-x" data-qv-close aria-label="Fechar">&times;</button>' +
      '<div class="qv-media"><img src="' + esc(p.foto) + '" alt="' + esc(p.nome) + '" width="1254" height="1254">' + (selos ? '<span class="prod-tags">' + selos + '</span>' : '') + seloBF(p) + '</div>' +
      '<div class="qv-info">' +
        '<span class="prod-cat">' + esc(p.categoria) + '</span>' +
        '<h2 id="qvNome">' + esc(p.nome) + '</h2>' +
        '<div class="prod-price qv-price">' + precoHTML(p) + '</div>' +
        '<p class="qv-desc">' + esc(p.descricao) + '</p>' +
        opcoes + lista + acoes +
        '<p class="qv-note">' + ICO.cadeado + '<span>' + nota + '</span></p>' +
      '</div>';
    qvFoco = document.activeElement;
    qv.classList.add('is-open');
    qv.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('loja-travada');
    setTimeout(function () { var x = $('.qv-x', qv); if (x) x.focus(); }, 60);
  }
  function fecharQV() {
    if (!qv.classList.contains('is-open')) return;
    qv.classList.remove('is-open');
    qv.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('loja-travada');
    if (qvFoco && qvFoco.focus) qvFoco.focus();
  }

  qv.addEventListener('click', function (e) {
    if (e.target.closest('[data-qv-close]')) fecharQV();
  });
  grid.addEventListener('click', function (e) {
    if (!e.target.closest('[data-qv]')) return;
    var card = e.target.closest('.prod-card');
    if (card) abrirQV(porId[card.getAttribute('data-id')]);
  });

  document.addEventListener('keydown', function (e) {
    if (!qv.classList.contains('is-open')) return;
    if (e.key === 'Escape') { fecharQV(); return; }
    if (e.key !== 'Tab') return;
    // mantém o foco dentro da janela aberta
    var foc = $$('a[href], button', qvBox);
    var prim = foc[0], ult = foc[foc.length - 1];
    if (e.shiftKey && document.activeElement === prim) { e.preventDefault(); ult.focus(); }
    else if (!e.shiftKey && document.activeElement === ult) { e.preventDefault(); prim.focus(); }
  });
})();
