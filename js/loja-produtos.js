/* =======================================================================
   PRODUTOS DA LOJA INSTRUCTIVA (página loja.html)
   >>> PRA MUDAR PREÇO, LINK, NOME OU FOTO: edite aqui e suba só este arquivo. <<<

   - A ordem aqui é a ordem em que aparecem na loja.
   - checkout: link de pagamento. O botão "Comprar" leva direto pra ele
     (cor, tamanho, quantidade e frete a pessoa escolhe lá no pagamento).
   - preco: valor à vista, com PONTO no lugar da vírgula (117.9 = R$ 117,90)
   - parcelas / parcela: ex.: 12 e 12.34 = "12x de R$ 12,34"
   - tipo: 'livro', 'camiseta', 'caneca', 'bone' ou 'copo' (é o que separa nos filtros)
   - selos: etiquetas em cima da foto (pode deixar vazio: [])
   - pagina: (só livros) página com todos os detalhes
   - fotos: assets/img/loja/ (quadradas, ex.: 1254x1254)
   - oculto: true = o produto NÃO aparece na loja (fica guardado aqui).
     >>> Bonés, copo térmico e a camiseta "Dica prende" estão OCULTOS esperando foto.
         Quando a foto chegar: coloque o arquivo em assets/img/loja/ com o nome
         que está em "foto" e troque oculto: true por oculto: false. <<<
   ======================================================================= */
window.LOJA_PRODUTOS = [
  {
    id: 'livro-flyback', tipo: 'livro', categoria: 'Livro · Fontes chaveadas',
    nome: 'Fontes Chaveadas: Topologia Flyback',
    foto: 'assets/img/loja/livro-flyback.webp',
    selos: ['4ª edição', 'Frete grátis', '+ Videoaulas'],
    preco: 397, parcelas: 12, parcela: 41.54,
    checkout: 'https://instructiva.co/90126860',
    pagina: 'cursos/livro-fontes-chaveadas-topologia-flyback-videoaulas.html',
    descricao: 'Livro impresso de 260 páginas sobre a topologia Flyback, a mais usada em fontes de TV e carregadores. Acompanha videoaulas.',
    itens: ['Retificadores, circuito Clamp e malha de controle', 'Datasheets, esquemáticos, formas de onda e cálculo de componentes', 'Filtro EMI, transientes de tensão e corrente de irrupção', 'Estudo completo do TL431 e aulas práticas em bancada real']
  },
  {
    id: 'bone-escola-instructiva', oculto: true, tipo: 'bone', categoria: 'Boné',
    nome: 'Boné Escola Instructiva',
    foto: 'assets/img/loja/bone-escola-instructiva.jpg',
    selos: ['Novo'], preco: 99.9, parcelas: 12, parcela: 10.45,
    checkout: 'https://instructiva.co/71869761',
    descricao: 'Boné com a marca da Escola Instructiva. O oficial da escola, pra usar na bancada, no curso ou onde quiser.'
  },
  {
    id: 'camiseta-menos-macete', tipo: 'camiseta', categoria: 'Camiseta',
    nome: 'Camiseta Mais Procedimento, Menos Macete',
    foto: 'assets/img/loja/camiseta-menos-macete.webp',
    selos: ['Novo', 'Branca ou preta'], preco: 117.9, parcelas: 12, parcela: 12.34,
    opcoes: 'Cores: branca ou preta · Tamanhos: P, M, G, GG e XGG',
    checkout: 'https://instructiva.co/6270792',
    descricao: 'Camiseta com a frase “Mais procedimento. Menos macete.” e trilhas de circuito em laranja e preto. Pra quem resolve na bancada com método, não no chute.'
  },
  {
    id: 'copo-sempre-foi-deus', oculto: true, tipo: 'copo', categoria: 'Copo térmico',
    nome: 'Copo Térmico Nunca Foi Sorte, Sempre Foi Deus',
    foto: 'assets/img/loja/copo-sempre-foi-deus.jpg',
    selos: ['Novo'], preco: 149.9, parcelas: 12, parcela: 15.69,
    checkout: 'https://instructiva.co/076211',
    descricao: 'Copo térmico com a frase “Nunca foi sorte. Sempre foi Deus.” Pro café ou a água gelada do dia a dia na bancada.'
  },
  {
    id: 'caneca-quem-aprende', tipo: 'caneca', categoria: 'Caneca',
    nome: 'Caneca Quem Aprende Não Depende',
    foto: 'assets/img/loja/caneca-quem-aprende.webp',
    selos: ['Novo'], preco: 87.9, parcelas: 12, parcela: 9.20,
    checkout: 'https://instructiva.co/681863',
    descricao: 'Caneca branca com a frase do Prof. Celso: “Quem aprende não depende.” Pro café de todo dia enquanto o ferro de solda esquenta.'
  },
  {
    id: 'livro-pfc', tipo: 'livro', categoria: 'Livro · Fontes chaveadas',
    nome: 'Fontes Chaveadas: Retificador PFC Monofásico',
    foto: 'assets/img/loja/livro-pfc.webp',
    selos: ['3ª edição', '+ Videoaulas'],
    preco: 397, parcelas: 12, parcela: 41.54,
    checkout: 'https://instructiva.co/87493535',
    pagina: 'cursos/livro-retificador-pfc-monofasico-videoaulas.html',
    descricao: 'Retificador PFC aplicado em TV, games, desktop, áudio e indústria: topologia BOOST, proteções e estudo de caso real. Acompanha videoaulas.',
    itens: ['Retificador PFC aplicado em TV, games, desktop, áudio e indústria', 'Topologia BOOST, MOSFET e Gate Driver', 'Proteções OVP, OCP, UVLO, OLP, POWER ON e modo RESTART', 'Estudo de caso real: TV Philips chassi TCM3.1LLA']
  },
  {
    id: 'bone-conhecimento-liberta', oculto: true, tipo: 'bone', categoria: 'Boné',
    nome: 'Boné Dicas Escravizam, Conhecimento Liberta',
    foto: 'assets/img/loja/bone-conhecimento-liberta.jpg',
    selos: ['Novo'], preco: 99.9, parcelas: 12, parcela: 10.45,
    checkout: 'https://instructiva.co/9572041',
    descricao: 'Boné com a frase “Dicas escravizam. Conhecimento liberta.” Pra quem cansou de depender de dica de grupo.'
  },
  {
    id: 'camiseta-conhecimento-liberta', tipo: 'camiseta', categoria: 'Camiseta',
    nome: 'Camiseta Dicas Escravizam, Conhecimento Liberta',
    foto: 'assets/img/loja/camiseta-conhecimento-liberta.webp',
    selos: ['Novo', 'Branca ou preta'], preco: 117.9, parcelas: 12, parcela: 12.34,
    opcoes: 'Cores: branca ou preta · Tamanhos: P, M, G, GG e XGG',
    checkout: 'https://instructiva.co/0871520314',
    descricao: 'Camiseta com a frase “Dicas escravizam. Conhecimento liberta.” e trilhas de circuito em laranja e preto. Pra quem cansou de depender de dica de grupo.'
  },
  {
    id: 'camiseta-dica-prende', oculto: true, tipo: 'camiseta', categoria: 'Camiseta',
    nome: 'Camiseta Dica Prende, Conhecimento Liberta',
    foto: 'assets/img/loja/camiseta-dica-prende.jpg',
    selos: ['Novo'], preco: 117.9, parcelas: 12, parcela: 12.34,
    checkout: 'https://instructiva.co/9885122049',
    descricao: 'Camiseta com a frase “Dica prende. Conhecimento liberta.” Pra quem aprende de verdade e não fica preso em macete.'
  },
  {
    id: 'livro-analise', tipo: 'livro', categoria: 'Livro · Fontes chaveadas',
    nome: 'Fontes Chaveadas: Análises e Procedimentos de Manutenção',
    foto: 'assets/img/loja/livro-analise-e-procedimentos.webp',
    selos: ['1ª edição', '+ Videoaulas'],
    preco: 397, parcelas: 12, parcela: 41.54,
    checkout: 'https://instructiva.co/7794631',
    pagina: 'cursos/livro-analise-e-procedimentos-videoaulas.html',
    descricao: 'Manutenção em topologia Flyback com método de diagnóstico passo a passo: sequência de start, análise de curto/fuga e testes em CIs controladores. Acompanha videoaulas.',
    itens: ['Sequência de start e análise de curto/fuga no primário e secundário', 'Manutenção da malha de feedback e testes em CIs controladores', 'Interpretação das proteções internas', 'Aulas práticas demonstradas em bancada real']
  },
  {
    id: 'caneca-menos-macete', tipo: 'caneca', categoria: 'Caneca',
    nome: 'Caneca Mais Procedimento, Menos Macete',
    foto: 'assets/img/loja/caneca-menos-macete.webp',
    selos: ['Novo'], preco: 87.9, parcelas: 12, parcela: 9.20,
    checkout: 'https://instructiva.co/2448176928',
    descricao: 'Caneca branca com a frase “Mais procedimento. Menos macete.”, ponta de prova e trilhas de circuito. Pra deixar na bancada e lembrar do método.'
  },
  {
    id: 'bone-sempre-foi-deus', oculto: true, tipo: 'bone', categoria: 'Boné',
    nome: 'Boné Nunca Foi Sorte, Sempre Foi Deus',
    foto: 'assets/img/loja/bone-sempre-foi-deus.jpg',
    selos: ['Novo'], preco: 99.9, parcelas: 12, parcela: 10.45,
    checkout: 'https://instructiva.co/6618881',
    descricao: 'Boné com a frase “Nunca foi sorte. Sempre foi Deus.”'
  },
  {
    id: 'camiseta-sempre-foi-deus', tipo: 'camiseta', categoria: 'Camiseta',
    nome: 'Camiseta Nunca Foi Sorte, Sempre Foi Deus',
    foto: 'assets/img/loja/camiseta-sempre-foi-deus.webp',
    selos: ['Novo', 'Branca ou preta'], preco: 117.9, parcelas: 12, parcela: 12.34,
    opcoes: 'Cores: branca ou preta · Tamanhos: P, M, G, GG e XGG',
    checkout: 'https://instructiva.co/26416010',
    descricao: 'Camiseta com a frase “Nunca foi sorte. Sempre foi Deus.” e trilhas de circuito em laranja e preto.'
  },
  {
    id: 'livro-semicondutores', tipo: 'livro', categoria: 'Livro · Eletrônica de potência',
    nome: 'Eletrônica de Potência: Semicondutores',
    foto: 'assets/img/loja/livro-semicondutores.webp',
    selos: ['1ª edição'],
    preco: 397, parcelas: 12, parcela: 41.54,
    checkout: 'https://instructiva.co/678235586',
    pagina: 'cursos/livro-eletronica-de-potencia-semicondutores.html',
    descricao: 'Funcionamento e características de diodos, tiristores, BJT, MOSFET e IGBT em eletrônica de potência.',
    itens: ['Funcionamento e características de diodos de potência', 'Aplicações de tiristores e transistores bipolares (BJT)', 'Comportamento e aplicações de MOSFETs', 'Potencial e versatilidade dos IGBTs em sistemas modernos']
  },
  {
    id: 'caneca-conhecimento-liberta', tipo: 'caneca', categoria: 'Caneca',
    nome: 'Caneca Dicas Escravizam, Conhecimento Liberta',
    foto: 'assets/img/loja/caneca-conhecimento-liberta.webp',
    selos: ['Novo'], preco: 87.9, parcelas: 12, parcela: 9.20,
    checkout: 'https://instructiva.co/676069',
    descricao: 'Caneca branca com a frase “Dicas escravizam. Conhecimento liberta.” e trilhas de circuito em laranja e preto.'
  },
  {
    id: 'bone-quem-aprende', oculto: true, tipo: 'bone', categoria: 'Boné',
    nome: 'Boné Quem Aprende Não Depende',
    foto: 'assets/img/loja/bone-quem-aprende.jpg',
    selos: ['Novo'], preco: 99.9, parcelas: 12, parcela: 10.45,
    checkout: 'https://instructiva.co/621283',
    descricao: 'Boné com a frase do Prof. Celso: “Quem aprende não depende.”'
  },
  {
    id: 'camiseta-quem-aprende', tipo: 'camiseta', categoria: 'Camiseta',
    nome: 'Camiseta Quem Aprende Não Depende',
    foto: 'assets/img/loja/camiseta-quem-aprende.webp',
    selos: ['Novo', 'Branca ou preta'], preco: 117.9, parcelas: 12, parcela: 12.34,
    opcoes: 'Cores: branca ou preta · Tamanhos: P, M, G, GG e XGG',
    checkout: 'https://instructiva.co/802154',
    descricao: 'Camiseta com estampa no peito da frase do Prof. Celso: “Quem aprende não depende.” Discreta, pra usar no dia a dia.'
  },
  {
    id: 'livro-retificadores', tipo: 'livro', categoria: 'Livro · Eletrônica de potência',
    nome: 'Eletrônica de Potência: Retificadores',
    foto: 'assets/img/loja/livro-retificadores.webp',
    selos: ['1ª edição'],
    preco: 397, parcelas: 12, parcela: 41.54,
    checkout: 'https://instructiva.co/94033809',
    pagina: 'cursos/livro-eletronica-de-potencia-retificadores.html',
    descricao: 'Retificadores controlados e não controlados, de meia onda até configurações em ponte, com cálculo de tensões, correntes e fator de potência.',
    itens: ['Retificadores monofásicos de meia onda até configurações em ponte', 'Cálculo de tensões, correntes e fator de potência', 'Exemplos reais e estudos de caso', 'Projeto e otimização de sistemas de conversão de energia']
  },
  {
    id: 'caneca-sempre-foi-deus', tipo: 'caneca', categoria: 'Caneca',
    nome: 'Caneca Nunca Foi Sorte, Sempre Foi Deus',
    foto: 'assets/img/loja/caneca-sempre-foi-deus.webp',
    selos: ['Novo'], preco: 87.9, parcelas: 12, parcela: 9.20,
    checkout: 'https://instructiva.co/80754720',
    descricao: 'Caneca branca com a frase “Nunca foi sorte. Sempre foi Deus.” e trilhas de circuito em laranja e preto.'
  },
  {
    id: 'bone-menos-macete', oculto: true, tipo: 'bone', categoria: 'Boné',
    nome: 'Boné Mais Procedimento, Menos Macete',
    foto: 'assets/img/loja/bone-menos-macete.jpg',
    selos: ['Novo'], preco: 99.9, parcelas: 12, parcela: 10.45,
    checkout: 'https://instructiva.co/592518',
    descricao: 'Boné com a frase “Mais procedimento. Menos macete.” Pra quem resolve na bancada com método, não no chute.'
  },
  {
    id: 'livro-cc-cc', tipo: 'livro', categoria: 'Livro · Eletrônica de potência',
    nome: 'Eletrônica de Potência: Conversores CC-CC',
    foto: 'assets/img/loja/livro-cc-cc.webp',
    selos: ['1ª edição'],
    preco: 397, parcelas: 12, parcela: 41.54,
    checkout: 'https://instructiva.co/985651953',
    pagina: 'cursos/livro-eletronica-de-potencia-conversores-cc-cc.html',
    descricao: 'Topologias fundamentais de conversores CC-CC, princípios de chaveamento e técnicas de análise de defeitos.',
    itens: ['Topologias fundamentais de conversores CC-CC', 'Princípios de chaveamento e controle', 'Técnicas de análise de defeitos e dimensionamento de componentes', 'Interpretação de formas de onda em diferentes condições de carga']
  },
  {
    id: 'camiseta-logo-instructiva', tipo: 'camiseta', categoria: 'Camiseta',
    nome: 'Camiseta Escola Instructiva',
    foto: 'assets/img/loja/camiseta-logo-instructiva.webp',
    selos: ['Novo', 'Branca ou preta'], preco: 117.9, parcelas: 12, parcela: 12.34,
    opcoes: 'Cores: branca ou preta · Tamanhos: P, M, G, GG e XGG',
    checkout: 'https://instructiva.co/7368007201',
    descricao: 'Camiseta com a marca da Escola Instructiva no peito. A oficial da escola, pra usar na bancada, no curso ou onde quiser.'
  },
  {
    id: 'livro-exercicios', tipo: 'livro', categoria: 'Livro · Análise de circuitos',
    nome: 'Análise de Circuitos: Livro de Exercícios',
    foto: 'assets/img/loja/livro-exercicios.webp',
    selos: ['1ª edição'],
    preco: 397, parcelas: 12, parcela: 41.54,
    checkout: 'https://instructiva.co/4659087',
    pagina: 'cursos/livro-de-exercicios-analise-de-circuitos-e-defeitos.html',
    descricao: 'Exercícios práticos com resistores, capacitores, indutores, diodos e transistores em circuitos série, paralelo e mistos.',
    itens: ['Exercícios com resistores, capacitores, indutores, diodos e transistores', 'Circuitos em série, paralelo e combinações mistas', 'Componentes abertos, alterados ou em curto-circuito', 'Desafios de análise de tensões, correntes e semicondutores']
  }
];
