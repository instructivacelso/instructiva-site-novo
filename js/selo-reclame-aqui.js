/* Selo "Verificada por Reclame AQUI" (código oficial do painel do Reclame Aqui).
   Aparece uma vez por página, no lugar que mais passa confiança:
   - página de curso: logo abaixo do preço
   - home: na seção de garantia
   - demais páginas: no rodapé
   O selo oficial fica dentro de um cartão com o texto ao lado.
   Se o Reclame Aqui não carregar (bloqueador, internet lenta), o cartão
   continua aparecendo só com o texto e o link pra página da empresa.
   PRA TROCAR O SELO: mude só o DATA_ID (vem do painel do Reclame Aqui). */
(function () {
  var DATA_ID = 'TVg3R1NaREEyTGRtX182QzppbnN0cnVjdGl2YQ==';
  var MODEL = 'compact_1';
  var PAGINA_RA = 'https://www.reclameaqui.com.br/empresa/instructiva/';

  if (document.getElementById('ra-verified-seal')) return;

  var spot, mode;
  if ((spot = document.querySelector('.price-panel'))) mode = 'after';
  else if ((spot = document.querySelector('.buy-card'))) mode = 'inside';
  else if ((spot = document.querySelector('.guarantee-text'))) mode = 'inside';
  else if ((spot = document.querySelector('footer .foot-bottom'))) mode = 'inside';
  else return;

  var box = document.createElement('div');
  box.className = 'ra-seal ra-seal--' + (mode === 'after' ? 'price' : spot.classList.contains('buy-card') ? 'card'
    : spot.classList.contains('foot-bottom') ? 'footer' : 'guarantee');
  box.innerHTML =
    '<div class="ra-seal-tile"></div>' +
    '<div class="ra-seal-copy">' +
      '<span class="ra-seal-kicker"><i></i>Empresa verificada</span>' +
      '<strong class="ra-seal-title">Selo oficial Reclame AQUI</strong>' +
      '<p class="ra-seal-text">Cadastro confirmado pelo Reclame AQUI. Veja nossa reputação antes de comprar.</p>' +
      '<a class="ra-seal-link" href="' + PAGINA_RA + '" target="_blank" rel="noopener">Ver nossa página <span class="arr">→</span></a>' +
    '</div>';

  var target = document.createElement('div');
  target.id = 'ra-verified-seal';
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.id = 'ra-embed-verified-seal';
  s.src = 'https://s3.amazonaws.com/raichu-beta/ra-verified/bundle.js';
  s.setAttribute('data-id', DATA_ID);
  s.setAttribute('data-target', 'ra-verified-seal');
  s.setAttribute('data-model', MODEL);
  target.appendChild(s);
  box.querySelector('.ra-seal-tile').appendChild(target);

  if (mode === 'after') spot.parentNode.insertBefore(box, spot.nextSibling);
  else spot.appendChild(box);

  // selo não veio? some o quadrinho vazio e fica só o texto
  setTimeout(function () {
    if (!document.getElementById('ra-widget-verified')) box.classList.add('ra-seal--sem-selo');
  }, 8000);
})();
