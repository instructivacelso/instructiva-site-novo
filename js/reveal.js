/* Movimento premium: elementos surgem suavemente ao rolar + topo ganha vida ao carregar.
   Seguro: se JS falhar, prefers-reduced-motion, ou sem suporte, TUDO fica visível normal. */
(function () {
  var mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if ((mq && mq.matches) || !('IntersectionObserver' in window)) return; // nada é escondido

  var SELECTOR = [
    '.stat', '.sec-head', '.bento-card', '.feature-card', '.cat-card', '.flow-node',
    '.prof-media', '.prof-copy', '.testi-track-wrap', '.guarantee-inner', '.faq-side', '.faq-item',
    '.final-card', '.course-card', '.course-list li', '.compare-col', '.quote-block', '.quote-sm',
    '.error-card', '.guarantee-banner', '.course-final > .wrap', '.foot-grid'
  ].join(',');

  document.documentElement.classList.add('has-reveal');

  function start() {
    var els = Array.prototype.slice.call(document.querySelectorAll(SELECTOR));
    els.forEach(function (el, i) {
      el.classList.add('reveal');
      // stagger leve: itens vizinhos aparecem em cascata
      var sibs = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0;
      el.style.transitionDelay = ((sibs % 5) * 70) + 'ms';
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    els.forEach(function (el) { io.observe(el); });
    // rede de segurança: revela tudo depois de 3.5s aconteça o que acontecer
    setTimeout(function () { els.forEach(function (el) { el.classList.add('in'); }); }, 3500);
  }

  if (document.readyState !== 'loading') start();
  else document.addEventListener('DOMContentLoaded', start);
})();
