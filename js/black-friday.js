/* =======================================================================
   BLACK FRIDAY INSTRUCTIVA — liga o "clima de Black" no site inteiro
   (faixa no topo, capa da Black na home, cronômetros, etiquetas,
   preços "de/por", popup da lista VIP).
   >>> PRA DESLIGAR: troque ativo: true por ativo: false e suba só este arquivo. <<<
   >>> PRA MUDAR A DATA FINAL: mude "fim" (horário de Brasília). <<<
   >>> PREÇOS DA BLACK: lista "precos" logo abaixo. <<<
   Depois do "fim" o site volta sozinho pro normal (inclusive os preços),
   sem precisar mexer em nada. Este arquivo fica no <head> de todas as páginas.
   ======================================================================= */
var INSTRUCTIVA_BF = {
  ativo: true,
  fim: '2026-11-30T23:59:59-03:00',
  faixa: ['Black Friday Instructiva', 'Ofertas nos cursos da Instructiva', 'Só enquanto o cronômetro estiver rodando', 'Parcele em até 12x'],
  whatsapp: '5544920066945',

  /* ---------------------------------------------------------------------
     PREÇOS DA BLACK
     de:      preço NORMAL à vista (já está preenchido, não precisa mexer)
     por:     preço da BLACK à vista. Use PONTO no lugar da vírgula: 1997 ou 1997.90
     parcela: valor de CADA parcela no 12x da Black, como aparece no checkout: 208.98
     link:    link de pagamento da Black. Deixe '' se o link continuar o mesmo.
     Enquanto "por" estiver 0, o curso continua com o preço normal.
     O site calcula sozinho a % de desconto, o "de R$ ... por R$ ..." e o "ATÉ X% OFF".
     --------------------------------------------------------------------- */
  precos: {
    // Especialistas — hoje R$ 2.497 à vista ou 12x R$ 261,30
    'especialista-em-manutencao-de-inversores-solares':                   { de: 2497, por: 1697, parcela: 177.58, link: 'https://instructiva.co/6584485031' },
    'especialista-em-equipamentos-odontologicos-esteticos':               { de: 2497, por: 1697, parcela: 177.58, link: 'https://instructiva.co/2852094' },
    // Especialista Tecnologias Inverter — hoje R$ 1.897 ou 12x R$ 198,51
    'especialista-em-manutencao-em-tecnologias-inverter':                 { de: 1897, por: 1197, parcela: 125.26, link: 'https://instructiva.co/3070516' },
    // Especialistas — hoje R$ 1.697 à vista ou 12x R$ 177,58
    'especialista-em-manutencao-em-televisores-led-e-lcd':                { de: 1697, por: 1197, parcela: 125.26, link: 'https://instructiva.co/60428821' },
    'especialista-em-manutencao-em-fontes-chaveadas':                     { de: 1697, por: 1197, parcela: 125.26, link: 'https://instructiva.co/313886' },
    'especialista-em-reparo-em-placas-eletronicas-emac':                  { de: 1697, por: 1197, parcela: 125.26, link: 'https://instructiva.co/235641' },
    'especialista-em-manutencao-em-amplificadores-de-audio':              { de: 1697, por: 1197, parcela: 125.26, link: 'https://instructiva.co/980211956' },
    'especialista-em-manutencao-em-inversores-de-frequencia-e-softstarter': { de: 1697, por: 1197, parcela: 125.26, link: 'https://instructiva.co/2027354' },
    'especialista-em-manutencao-em-esteira-de-academias':                 { de: 1697, por: 1197, parcela: 125.26, link: 'https://instructiva.co/2964570' },
    // Pra começar — hoje R$ 697 à vista ou 12x R$ 72,94
    'eletronica-inicial-analogica':                                       { de: 697, por: 497, parcela: 52.01, link: 'https://instructiva.co/5223723' },
    'manuseio-de-osciloscopio':                                           { de: 697, por: 497, parcela: 52.01, link: 'https://instructiva.co/4157442' },
    // Livros + videoaulas — FORA da Black (preço normal: R$ 397 ou 12x R$ 41,54). Vale pro site e pra loja.
    'livro-analise-e-procedimentos-videoaulas':                           { de: 397, por: 0, parcela: 0, link: '' },
    'livro-fontes-chaveadas-topologia-flyback-videoaulas':                { de: 397, por: 0, parcela: 0, link: '' },
    'livro-retificador-pfc-monofasico-videoaulas':                        { de: 397, por: 0, parcela: 0, link: '' },
    'livro-eletronica-de-potencia-semicondutores':                        { de: 397, por: 0, parcela: 0, link: '' },
    'livro-eletronica-de-potencia-retificadores':                         { de: 397, por: 0, parcela: 0, link: '' },
    'livro-eletronica-de-potencia-conversores-cc-cc':                     { de: 397, por: 0, parcela: 0, link: '' },
    'livro-de-exercicios-analise-de-circuitos-e-defeitos':                { de: 397, por: 0, parcela: 0, link: '' },
    // Loja — FORA da Black. Vale pra todas as camisetas / todas as canecas
    'camiseta':                                                           { de: 117.9, por: 0, parcela: 0 },
    'caneca':                                                             { de: 87.9, por: 0, parcela: 0 }
  }
};

(function () {
  var BF = window.INSTRUCTIVA_BF;
  var FIM = Date.parse(BF.fim);
  if (!BF.ativo || !(FIM > Date.now())) { BF.ativo = false; return; }

  var html = document.documentElement;
  html.classList.add('bf');

  // caminho funciona tanto na raiz quanto em /cursos/
  var SRC = (document.currentScript && document.currentScript.src) || '';
  function url(p) { try { return new URL('../' + p, SRC).href; } catch (e) { return p; } }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function brl(v) {
    var p = Number(v).toFixed(2).split('.');
    return 'R$ ' + p[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + p[1];
  }
  function slugDe(href) { var m = /([^\/?#]+)\.html/.exec(href || ''); return m ? m[1] : ''; }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  BF.linkVip = 'https://wa.me/' + BF.whatsapp + '?text=' +
    encodeURIComponent('Olá, Dayane! Vim pelo site e quero entrar na lista VIP da Black Friday da Instructiva.');

  // ------------------------------------------------------------------ preços da Black
  // devolve a oferta de um curso/produto, ou null se ele está com o preço normal
  function oferta(chave) {
    var p = (BF.precos || {})[chave];
    if (!p || !(Number(p.por) > 0) || !(Number(p.de) > Number(p.por))) return null;
    return {
      de: Number(p.de), por: Number(p.por),
      parcela: Number(p.parcela) > 0 ? Number(p.parcela) : 0,
      link: p.link || '',
      off: Math.floor((1 - p.por / p.de) * 100)
    };
  }
  BF.oferta = oferta;
  // link de pagamento da Black (vale mesmo quando o preço é igual ao normal)
  BF.linkDe = function (chave) { var p = (BF.precos || {})[chave]; return p && p.link ? p.link : ''; };
  BF.brl = brl;
  BF.maxOff = 0;
  for (var k in BF.precos) { var o = oferta(k); if (o && o.off > BF.maxOff) BF.maxOff = o.off; }
  // esconde os preços antigos por um instante, até trocar pelos da Black (evita "piscar" o preço velho)
  if (BF.maxOff) html.classList.add('bf-precos');

  function precoGrande(o) {   // "12x de R$ 208,98" ou, sem parcela, o valor à vista
    return o.parcela ? { inst: '12x de', valor: brl(o.parcela) } : { inst: 'à vista', valor: brl(o.por) };
  }
  function selo(o) { return '<span class="bf-sticker" aria-label="' + o.off + '% de desconto"><b>-' + o.off + '%</b><small>off</small></span>'; }

  // cards da vitrine da home e capas da capa (marcados com data-bf="slug-do-curso")
  function aplicarVitrine() {
    $$('[data-bf]').forEach(function (card) {
      var o = oferta(card.getAttribute('data-bf'));
      if (!o) return;
      card.classList.add('bf-tem-oferta');
      var g = precoGrande(o);
      var de = card.querySelector('.bf-card-de'); if (de) de.textContent = 'de ' + brl(o.de);
      var pr = card.querySelector('.bf-card-price'); if (pr) pr.innerHTML = '<small>' + g.inst + '</small>' + g.valor;
      var av = card.querySelector('.bf-card-vista'); if (av) av.textContent = o.parcela ? 'ou ' + brl(o.por) + ' à vista' : 'pagamento único';
      var st = card.querySelector('[data-bf-selo]'); if (st) st.innerHTML = selo(o);
    });
  }

  // cards do catálogo e "outros cursos" no fim das páginas de curso
  function aplicarCatalogo() {
    $$('a.course-card').forEach(function (card) {
      var o = oferta(slugDe(card.getAttribute('href')));
      if (!o || card.classList.contains('bf-tem-oferta')) return;
      card.classList.add('bf-tem-oferta');
      var g = precoGrande(o);
      var mini = card.querySelector('.price-mini');
      if (mini) {
        var inst = mini.querySelector('.pm-inst'), val = mini.querySelector('.pm-value');
        if (inst) inst.textContent = g.inst;
        if (val) val.textContent = g.valor;
        var de = document.createElement('span');
        de.className = 'pm-de';
        de.textContent = 'de ' + brl(o.de);
        mini.insertBefore(de, mini.firstChild);
      }
      // selo "-20% off" ao lado do preço (sem cobrir o pôster)
      var explore = card.querySelector('.foot .explore');
      if (explore) explore.insertAdjacentHTML('beforebegin', selo(o));
      else { var poster = card.querySelector('.course-poster'); if (poster) poster.insertAdjacentHTML('beforeend', selo(o)); }
    });
  }

  // página de um curso: quadro de preço, barra do topo, chamada final, barra fixa e links de pagamento
  function aplicarPaginaCurso() {
    var panel = document.querySelector('.price-panel');
    if (!panel) return;
    var slug = slugDe(location.pathname);
    // link de pagamento da Black (troca todos os botões que levam pro link antigo)
    var linkNovo = BF.linkDe(slug), cta = panel.querySelector('a.btn[href^="http"]');
    if (linkNovo && cta) {
      var velho = cta.getAttribute('href');
      $$('a[href="' + velho + '"]').forEach(function (a) { a.setAttribute('href', linkNovo); });
    }
    var o = oferta(slug);
    if (!o) return;
    html.classList.add('bf-curso-oferta');
    var pv = panel.querySelector('.p-value');
    var parcelaVelha = pv ? pv.textContent.replace(/\s+/g, ' ').trim() : '';   // "R$ 261,30"
    var vistaVelha = brl(o.de), vistaNova = brl(o.por);
    var parcelaNova = o.parcela ? brl(o.parcela) : '';

    var lbl = panel.querySelector('.p-lbl');
    var row = document.createElement('div');
    row.className = 'bf-de-row';
    row.innerHTML = '<s>de ' + vistaVelha + '</s><b>-' + o.off + '% OFF</b>';
    if (lbl) lbl.parentNode.insertBefore(row, lbl.nextSibling); else panel.insertBefore(row, panel.firstChild);

    if (pv) {
      var g = precoGrande(o), c = g.valor.split(',');
      pv.innerHTML = esc(c[0]) + '<sup>,' + esc(c[1]) + '</sup>';
      var inst = panel.querySelector('.p-inst'); if (inst) inst.textContent = g.inst;
    }
    var alt = panel.querySelector('.p-alt');
    if (alt) {
      if (o.parcela) alt.innerHTML = alt.innerHTML.split(vistaVelha).join(vistaNova);
      else alt.innerHTML = 'Preço de Black Friday';
    }
    // textos com preço espalhados pela página
    $$('.meta, .final-price, .sticky-copy').forEach(function (el) {
      var h = el.innerHTML;
      if (parcelaVelha && parcelaNova) h = h.split(parcelaVelha).join(parcelaNova);
      h = h.split(vistaVelha).join(vistaNova);
      el.innerHTML = h;
    });
  }

  // "ATÉ X% OFF" (capa, vitrine, última chamada, catálogo)
  function aplicarAte() {
    if (!BF.maxOff) return;
    html.classList.add('bf-tem-off');
    $$('[data-bf-ate]').forEach(function (el) { el.textContent = BF.maxOff + '%'; });
  }

  // abas da vitrine da home
  function abas() {
    var tabs = $$('[data-bf-aba]');
    if (!tabs.length) return;
    var reduz = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function mostra(grupo, anima) {
      tabs.forEach(function (t) { t.setAttribute('aria-selected', t.getAttribute('data-bf-aba') === grupo ? 'true' : 'false'); });
      var i = 0;
      $$('.bf-grid [data-grupo]').forEach(function (card) {
        var ok = card.getAttribute('data-grupo') === grupo;
        card.hidden = !ok;
        card.classList.remove('is-in');
        if (ok && anima && !reduz) { card.style.setProperty('--d', (i * 55) + 'ms'); void card.offsetWidth; card.classList.add('is-in'); }
        if (ok) i++;
      });
    }
    tabs.forEach(function (t) {
      t.addEventListener('click', function () { mostra(t.getAttribute('data-bf-aba'), true); });
    });
    mostra(tabs[0].getAttribute('data-bf-aba'), false);
  }

  // ------------------------------------------------------------------ cronômetros
  function restante() {
    var d = Math.max(0, FIM - Date.now());
    return { total: d, d: Math.floor(d / 864e5), h: Math.floor(d / 36e5) % 24, m: Math.floor(d / 6e4) % 60, s: Math.floor(d / 1e3) % 60 };
  }
  function tick() {
    var t = restante();
    var nodes = document.querySelectorAll('[data-bf-countdown]');
    for (var i = 0; i < nodes.length; i++) {
      var b = nodes[i].querySelectorAll('[data-u]');
      for (var k = 0; k < b.length; k++) b[k].textContent = pad(t[b[k].getAttribute('data-u')]);
    }
    var curto = (t.d ? t.d + 'd ' : '') + pad(t.h) + ':' + pad(t.m) + ':' + pad(t.s);
    var cs = document.querySelectorAll('[data-bf-countdown-compact]');
    for (var j = 0; j < cs.length; j++) cs[j].textContent = curto;
    if (t.total <= 0) { clearInterval(timer); location.reload(); }   // acabou: recarrega já com o site normal
  }
  var timer;

  // ------------------------------------------------------------------ faixa no topo (todas as páginas)
  function faixa() {
    if (document.querySelector('.bf-bar')) return;
    var lista = BF.faixa.slice();
    if (BF.maxOff) lista.unshift('Até ' + BF.maxOff + '% OFF');
    var um = lista.map(esc).join('<i>✦</i>') + '<i>✦</i>';
    var frases = um + um; // repete pra não ter buraco em tela larga
    var alvo = document.getElementById('ofertas') ? '#ofertas' : url('index.html#ofertas');
    var bar = document.createElement('div');
    bar.className = 'bf-bar';
    bar.innerHTML =
      '<a class="bf-bar-in" href="' + alvo + '" aria-label="Black Friday Instructiva: ver as ofertas">' +
        '<span class="bf-bar-tag"><i></i>Black Friday</span>' +
        '<span class="bf-bar-marquee" aria-hidden="true"><span class="bf-bar-track"><span>' + frases + '</span><span>' + frases + '</span></span></span>' +
        '<span class="bf-bar-clock"><small>acaba em</small><b data-bf-countdown-compact>--:--:--</b></span>' +
      '</a>';
    document.body.insertBefore(bar, document.body.firstChild);
  }

  // ------------------------------------------------------------------ quadro de preço das páginas de curso
  function etiquetaPreco() {
    var panel = document.querySelector('.price-panel');
    if (!panel || panel.querySelector('.bf-panel-tag')) return;
    if (!oferta(slugDe(location.pathname))) return;
    var tag = document.createElement('div');
    tag.className = 'bf-panel-tag';
    tag.innerHTML = '<span><i></i>Oferta Black Friday</span><small>acaba em <b data-bf-countdown-compact>--:--:--</b></small>';
    panel.insertBefore(tag, panel.firstChild);
  }

  // ------------------------------------------------------------------ botões "lista VIP": abrem o popup (ou o WhatsApp)
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('[data-bf-vip]') : null;
    if (!a) return;
    if (typeof window.INSTRUCTIVA_ABRIR_POPUP === 'function') {
      e.preventDefault();
      window.INSTRUCTIVA_ABRIR_POPUP();
    }
  });

  function iniciar() {
    try {
      faixa();
      etiquetaPreco();
      aplicarVitrine();
      aplicarCatalogo();
      aplicarPaginaCurso();
      aplicarAte();
      abas();
      var vips = document.querySelectorAll('[data-bf-vip]');
      for (var i = 0; i < vips.length; i++) if (vips[i].tagName === 'A') vips[i].href = BF.linkVip;
    } finally {
      html.classList.add('bf-precos-ok');
    }
    tick();
    timer = setInterval(tick, 1000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
