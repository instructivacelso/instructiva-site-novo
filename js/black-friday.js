/* =======================================================================
   BLACK FRIDAY INSTRUCTIVA — liga o "clima de Black" no site inteiro
   (faixa de LED no topo, capa da Black na home, cronômetros, etiquetas,
   popup da lista VIP).
   >>> PRA DESLIGAR: troque ativo: true por ativo: false e suba só este arquivo. <<<
   >>> PRA MUDAR A DATA FINAL: mude "fim" (horário de Brasília). <<<
   Depois do "fim" o site volta sozinho pro normal, sem precisar mexer em nada.
   Este arquivo fica no <head> de todas as páginas.
   ======================================================================= */
var INSTRUCTIVA_BF = {
  ativo: true,
  fim: '2026-11-30T23:59:59-03:00',
  faixa: ['Black Friday Instructiva', 'Ofertas em cursos, livros e na loja', 'Só enquanto o cronômetro estiver rodando', 'Parcele em até 12x'],
  whatsapp: '5544920066945'
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

  BF.linkVip = 'https://wa.me/' + BF.whatsapp + '?text=' +
    encodeURIComponent('Olá, Dayane! Vim pelo site e quero entrar na lista VIP da Black Friday da Instructiva.');

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
    if (t.total <= 0) { html.classList.remove('bf'); clearInterval(timer); }
  }
  var timer;

  // ------------------------------------------------------------------ faixa de LED no topo (todas as páginas)
  function faixa() {
    if (document.querySelector('.bf-bar')) return;
    var um = BF.faixa.map(esc).join('<i>✦</i>') + '<i>✦</i>';
    var frases = um + um; // repete pra não ter buraco em tela larga
    var bar = document.createElement('div');
    bar.className = 'bf-bar';
    bar.innerHTML =
      '<a class="bf-bar-in" href="' + url('cursos.html') + '" aria-label="Black Friday Instructiva: ver as ofertas">' +
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
    faixa();
    etiquetaPreco();
    var vips = document.querySelectorAll('[data-bf-vip]');
    for (var i = 0; i < vips.length; i++) if (vips[i].tagName === 'A') vips[i].href = BF.linkVip;
    tick();
    timer = setInterval(tick, 1000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
