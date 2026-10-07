/* =======================================================================
   RASTREAMENTO — Pixel do Facebook (Meta) e Google Analytics 4
   >>> PRA LIGAR: cole os IDs aqui embaixo e suba só este arquivo. <<<
   Vazio = desligado (o site funciona normal sem eles).

   O que é registrado automaticamente:
   - PageView ............ toda página aberta
   - ViewContent ......... abriu uma página de curso (com o nome do curso)
   - InitiateCheckout .... clicou num botão de compra (checkout)
   - Contact ............. clicou pra falar no WhatsApp
   - Lead ................ deixou o WhatsApp no popup de captura
   ======================================================================= */
var INSTRUCTIVA_TRACKING = {
  metaPixelId: '',   // ex.: '123456789012345'
  ga4Id: ''          // ex.: 'G-ABCDE12345'
};

(function () {
  var cfg = window.INSTRUCTIVA_TRACKING || {};
  var pixel = String(cfg.metaPixelId || '').trim();
  var ga4 = String(cfg.ga4Id || '').trim();
  if (!pixel && !ga4) return;

  // ---------------------------------------------------------------- Meta Pixel (código oficial)
  if (pixel) {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', pixel);
    window.fbq('track', 'PageView');
  }

  // ---------------------------------------------------------------- Google Analytics 4 (código oficial)
  if (ga4) {
    var g = document.createElement('script');
    g.async = true;
    g.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ga4);
    document.head.appendChild(g);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', ga4);
  }

  function track(fbEvent, gaEvent, params) {
    try { if (pixel && window.fbq) window.fbq('track', fbEvent, params || {}); } catch (e) {}
    try { if (ga4 && window.gtag) window.gtag('event', gaEvent, params || {}); } catch (e) {}
  }

  // página de curso
  var courseEl = document.querySelector('.course-infobar h2, .course-hero h1');
  var course = courseEl ? courseEl.textContent.trim() : '';
  if (course) track('ViewContent', 'view_item', { content_name: course });

  // cliques em compra e WhatsApp (pega também os botões criados depois)
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.href || '';
    if (/payfast\.greenn\.com\.br|instructiva\.co\//.test(href)) {
      track('InitiateCheckout', 'begin_checkout', course ? { content_name: course } : {});
    } else if (/wa\.me\//.test(href)) {
      track('Contact', 'contact', {});
    }
  }, true);

  // lead do popup de captura (js/popup.js dispara esse aviso)
  window.addEventListener('instructiva:lead', function () {
    track('Lead', 'generate_lead', {});
  });
})();
