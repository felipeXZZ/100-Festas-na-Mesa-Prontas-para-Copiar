/* =====================================================================
 *  CONTEÚDO DA LANDING PAGE — "150 Festas na Mesa Prontas para Copiar"
 *  Básico R$ 5,99 (50 projetos) · Completo R$ 19,90 (150 projetos + 5 bônus)
 *  Popup: uma tela só. Preços e checkout: src/offer.ts
 * =====================================================================
 *  Este é o ÚNICO arquivo que você precisa editar para trocar textos,
 *  imagens, preços, temas e perguntas. Nenhum componente tem copy fixa.
 *
 *  COMO TROCAR UMA IMAGEM: cada item visual tem um campo `src` opcional.
 *  Enquanto ele estiver vazio/ausente, a página desenha uma ilustração
 *  vetorial da festa (paleta do próprio projeto). Preencha o `src` com o
 *  caminho de um arquivo em /public (ex.: "/festas/safari-boho.webp") e a
 *  foto real entra no lugar, sem mexer no layout.
 * ===================================================================== */

/* ------------------------------------------------------------------ */
/*  OFERTA — nome, preços e checkout vivem em src/offer.ts             */
/* ------------------------------------------------------------------ */
/*
 * Mudou um preço em src/offer.ts? Os textos daqui que usam `brl()`/`reais()`
 * acompanham sozinhos; confira só os valores "De R$…" riscados, que são
 * texto fixo, e o valor cobrado no link de checkout correspondente.
 */
import { PRICES, brl, reais } from "./offer";
export {
  OFFER_NAME,
  PRICES,
  CHECKOUT_URL,
  BASIC_CHECKOUT_URL,
  UPSELL_CHECKOUT_URL,
} from "./offer";

/**
 * Back-redirect: página para onde o visitante é levado ao apertar "voltar".
 * ⚠️ Enquanto for o placeholder abaixo, o redirect fica DESLIGADO (para não
 * mandar ninguém a um domínio inexistente). Troque pela URL real para ativar.
 */
export const BACK_REDIRECT_URL = "https://meubackredirect.com.br"; // REVISAR

/**
 * Domínio público da página (metadados, canonical, sitemap e robots).
 * Sem barra no final: os outros endereços são montados a partir daqui.
 */
export const SITE_URL = "https://150festasnamesaparacopiar.vercel.app";

/* ------------------------------------------------------------------ */
/*  Marca / rodapé                                                     */
/* ------------------------------------------------------------------ */
/** É a mesma marca da outra página (Decoração Sem Complicação). */
export const BRAND_NAME = "Decoração Sem Complicação";
export const BRAND_YEAR = 2026;

/**
 * RODAPÉ — curto de propósito, igual ao da outra página: só a linha de
 * direitos e o aviso de não-afiliação. Sem menu de links, para o último
 * elemento da página não competir com o botão de compra logo acima.
 */
export const footer = {
  rights: "Todos os direitos reservados.",
  disclaimer:
    "Este site não é afiliado ao Facebook ou Meta. Resultados podem variar de pessoa para pessoa.",
};

/**
 * Aviso curto reaproveitado nas seções que citam custo/quantidade.
 * Some da página inteira se você apagar o texto.
 */
export const ESTIMATE_NOTE =
  "Custos, quantidades e medidas são referências aproximadas e podem variar conforme projeto, fornecedor e região.";

/* ------------------------------------------------------------------ */
/*  1. Barra de urgência (topo)                                        */
/* ------------------------------------------------------------------ */
export const urgencyBar = {
  emoji: "🔥",
  text: "Promoção acaba hoje,",
  /**
   * true → anexa ao texto a DATA DO DIA em que a pessoa abre o site (lida no
   * navegador dela, no fuso dela). É a urgência "evergreen": a data sempre
   * bate com o dia da visita.
   *
   * ⚠️ Só faça sentido se a promoção realmente for renovada todo dia. Se o
   * preço não muda nunca, "acaba hoje" é uma afirmação que não se cumpre —
   * nesse caso deixe `false` e use um texto neutro (ex.: "Oferta especial
   * disponível hoje") ou um prazo real via `deadline`.
   */
  showTodayDate: true,
  /**
   * Contador REAL, opcional e independente do de cima. Com `null` não aparece
   * contador nenhum. Para ligar, use uma data ISO real de fim da promoção,
   * ex.: "2026-08-31T23:59:59-03:00". Quando o prazo passa, o contador some —
   * nunca reinicia sozinho.
   */
  deadline: null as string | null,
  countdownLabel: "Termina em",
};

/* ------------------------------------------------------------------ */
/*  2. Hero / primeira dobra                                           */
/* ------------------------------------------------------------------ */
export const hero = {
  /**
   * EYECATCHER acima do título — pílula branca com estrelas.
   * `{{trecho}}` sai colorido (ver <Highlight/>).
   *
   * ⚠️ O selo afirma número de clientes E nota de avaliação. Mantenha os
   * dois batendo com os seus números reais de venda/avaliação — dado
   * inventado aqui é publicidade enganosa (CDC, art. 37).
   * Versão sem afirmação de prova social, se precisar:
   *   badge: "{{150 Festas na Mesa}} Prontas para Copiar",  badgeStars: 0
   *
   * O espaço entre "no" e "Brasil" é NÃO-QUEBRÁVEL: em telas muito estreitas
   * (abaixo de ~360px) a frase ainda quebra, e sem ele a quebra deixaria
   * "Brasil" sozinho embaixo. Frase mais longa que esta volta a quebrar no
   * celular — o selo do HeroSection é dimensionado para ~37 caracteres.
   */
  badge: "Aprovado por {{1.847+ pessoas}} no Brasil",
  /** Estrelas amarelas do selo. 0 = escondidas (entra um ícone dourado). */
  badgeStars: 5,
  // [[ ]] = número em destaque 1,5x; {{ }} = destaque colorido. Ver <Highlight/>.
  // Mesmo formato da headline da oferta anterior: número grande + destaque
  // azul em "+150 Festas na Mesa", o resto em preto, e a quebra antes de
  // "para Você Copiar". O traço dourado por baixo segue desligado no
  // HeroSection (prop `underline`).
  headline: "[[+150]] {{Festas na Mesa}} Prontas\npara Você Copiar",
  // Fala com os DOIS públicos do mesmo material: quem monta a festa em casa
  // e a decoradora que monta para clientes. `{{trecho}}` sairia em negrito.
  subheadline:
    "Escolha o tema, siga a lista e monte uma festa linda numa mesa só, para o seu filho ou para o seu cliente.",
  cta: "Quero as 150 festas agora",
  /**
   * ENTREGA — única linha abaixo do CTA, com os ícones do WhatsApp e do
   * Gmail. Ela responde "como e quando isso chega até mim?", que é a
   * pergunta que trava o clique num produto digital. Entrou no lugar da
   * linha de "pagamento seguro", que dizia a mesma coisa que esta ("acesso
   * imediato" / "na hora") sem mostrar por onde a entrega acontece.
   *
   * `[whatsapp]` e `[email]` são substituídos pelo ícone colorido da marca
   * seguido do nome em NEGRITO (o nome vem do mapa em HeroSection.tsx). O
   * resto da frase sai em texto normal. Texto vazio ("") tira a linha.
   */
  delivery:
    "Você recebe tudo na hora, direto no seu [whatsapp] e no seu [email]",
  /**
   * ✅ LIGADO — preço na primeira dobra, como segunda linha DENTRO do
   * botão verde da hero (ver a prop `subline` do CTAButton). Com o texto
   * vazio a linha some e o botão volta a ter só o rótulo.
   * "A partir de" porque o rótulo fala em 150 festas e R$ 5,99 é o Básico.
   *
   * A ideia era que "custa pouco" é o argumento central da oferta e só
   * aparecia na seção de planos, lá embaixo — quem saía na primeira tela
   * nunca ficava sabendo. Ficou de fora porque o botão tem UM trabalho, que
   * é ser clicado, e a segunda linha roubava a atenção do rótulo.
   *
   * Para LIGAR de volta: escreva o texto aqui. `{{trecho}}` sai em negrito e
   * o valor precisa bater com `plans.basic.price` e com `stickyBar.price`.
   */
  priceHint: `A partir de {{R$ ${reais(PRICES.basic)}}} · acesso imediato no e-mail`,
  /**
   * MICROBENEFÍCIOS abaixo do mockup — TESTE. Lista vertical com ícone
   * colorido, no formato da referência: só o ÍCONE é azul, o texto fica na
   * cor normal e o `{{trecho}}` sai apenas em NEGRITO. Entra DEPOIS da
   * imagem e ANTES do CTA porque o mockup mostra que o material existe, e
   * estas linhas dizem o que tem DENTRO dele — é a última informação que
   * falta para o clique.
   *
   * `icon` aceita: cart | wallet | steps | bolt (mapa em HeroSection.tsx)
   * — ou um EMOJI direto, que entra no lugar do ícone vetorial com as cores
   * dele. Mantenha cada linha CURTA: o bloco é centralizado
   * como um todo, mas cada item é lido da esquerda para a direita — se a
   * frase quebrar em duas linhas, a coluna de ícones perde o alinhamento
   * visual. Array vazio (`perks: []`) faz o bloco sumir da página — é como
   * ele está agora: a hero vai do mockup direto para o CTA.
   *
   * ⚠️ Se voltar uma linha prometendo bônus, confira o número na seção de
   * bônus antes — as duas precisam contar a mesma quantidade.
   */
  perks: [] as { icon: string; text: string }[],
  /**
   * Mockup do produto na primeira dobra (abaixo da subheadline no celular,
   * coluna da direita no desktop). É o elemento de LCP da página.
   * WebP com transparência → renderizado em `object-contain`, sem cantos
   * arredondados nem fundo.
   *
   * Arte da nova oferta (1254×1254, fundo transparente). Com `src` vazio a
   * página desenha a capa provisória (ProductCover.tsx) no mesmo quadrado.
   */
  mockup: {
    src: "/mockup-hero-150-festas-v3.webp",
    width: 1254,
    height: 1254,
    alt: "Guia +150 Festas na Mesa Prontas para Você Copiar: capa, páginas de temas, bônus e versão no celular",
  },
};

/* ------------------------------------------------------------------ */
/*  2.5 Vitrine — carrossel duplo logo abaixo da hero                  */
/* ------------------------------------------------------------------ */

/**
 * VITRINE ("O que você vai receber") — as pranchas reais do produto passando
 * em duas faixas, uma para cada lado, logo depois da hero.
 *
 * É a prova do produto no momento em que a promessa ainda está quente: a
 * pessoa acabou de ler "150 festas na mesa prontas para copiar" e vê, sem rolar nem
 * clicar, as páginas de verdade — antes/depois, lista de materiais, custo e
 * ordem de montagem.
 *
 * COMO TROCAR/ADICIONAR UMA PRANCHA: coloque a imagem grande em
 * `_originais-carrosel/` com o nome que quer na URL (ex.: `projeto-133-circo.png`),
 * rode `npm run carrosel` (gera as duas larguras em /public/carrosel) e
 * acrescente o item abaixo com esse mesmo nome no `slug`.
 *
 * A vitrine divide a lista sozinha entre as duas faixas: os itens de índice
 * PAR vão para a faixa de cima, os ÍMPARES para a de baixo. Por isso a ordem
 * abaixo alterna temas de menino/menina e econômico/completo — assim as duas
 * faixas ficam variadas, e não uma "faixa rosa" e uma "faixa verde".
 */
/* ------------------------------------------------------------------ */
/*  3-VSL. Vídeo de demonstração (EM TESTE, no lugar do carrossel)     */
/* ------------------------------------------------------------------ */
/**
 * A VSL que substitui a vitrine em carrossel (`showcase`) no page.tsx.
 *
 * ⚠️ TESTE: as duas seções existem no repositório, mas só UMA entra na
 * página por vez — ver o comentário no page.tsx para trocar de volta.
 *
 * A capa (`poster`) é o primeiro quadro do vídeo, baixado do Vimeo e servido
 * do nosso domínio: é ela que aparece até alguém tocar, e é o que evita
 * carregar o player do Vimeo para quem não assiste (ver VimeoVsl.tsx).
 *
 * ⚠️ Trocou o vídeo? Troque a capa junto. Capa de um vídeo com o conteúdo de
 * outro é promessa que o play não cumpre.
 */
export const vsl = {
  /* Sem `eyebrow`: esta seção não usa o rótulo em maiúsculas acima do
     título (ver VslSection.tsx). */
  title: "Veja como o material {{funciona por dentro}}",
  paragraph:
    "Em menos de um minuto você vê como escolher a mesa, descobrir o que comprar e seguir o mapa de montagem.",
  /**
   * ID do vídeo no Vimeo (vimeo.com/<id>) — é o player EM USO.
   *
   * ⚠️ PENDENTE: o vídeo anterior (1229733524) e a capa dele mostram o
   * material "+150 Festas Infantis". Com `videoId` vazio a seção mostra o
   * espaço reservado abaixo, na mesma proporção. Gravou o vídeo novo?
   * Preencha o ID e a capa (`poster`, primeiro quadro do vídeo).
   */
  videoId: "",
  placeholder: "[INSERIR VÍDEO DA NOVA OFERTA — 150 FESTAS NA MESA]",
  /** Título do player (leitor de tela). */
  iframeTitle: "Demonstração: 150 Festas na Mesa",
  /**
   * O mesmo vídeo como ARQUIVO nosso, em /public: 640px e ~10 MB, comprimido
   * do original de 1080p e 69 MB. Não está em uso — serve para voltar ao
   * `<video>` nativo (VslPlayer.tsx), que tira a marca do Vimeo e os 300 KB
   * do player dele.
   *
   * ⚠️ Com ele a banda passa a ser NOSSA: cada play baixa 10 MB da Vercel
   * (~10 mil plays no teto de 100 GB do plano gratuito).
   */
  src: "/vsl.mp4",
  /** Primeiro quadro do vídeo, em /public. */
  poster: "/vsl-capa.webp",
  aspect: 0.5625, // 9/16 (vertical)
  /**
   * Frase sobre a capa — é ela que diz que aquilo é um vídeo.
   *
   * ⚠️ Cada linha é um item: a quebra é ESCRITA, não deixada para o
   * navegador. Largura de caixa preta é estreita e muda com o aparelho; com
   * a quebra automática a frase virava três linhas tortas num celular e duas
   * em outro. Escrita aqui, ela é a mesma em toda tela.
   *
   * Mexeu no texto? Reescreva as duas linhas com tamanhos parecidos — é o
   * que mantém o bloco retangular em vez de escada.
   */
  playLabel: ["Toque para ver o", "material por dentro"],
  /* Fala do RESULTADO ("montar mesas assim"), e não do produto ("ver os 150
     projetos"): logo abaixo do vídeo, quem acabou de ver a mesa montada
     quer aquilo, não um catálogo. */
  cta: "Quero montar mesas assim",
};

export const showcase = {
  eyebrow: "Veja por dentro do material",
  title: "O que você vai {{receber}}",
  // Duas linhas no celular, no mesmo formato da outra página: o que é + o que
  // vem dentro, em três blocos curtos.
  paragraph:
    "Veja alguns dos 150 projetos de festa na mesa: o que comprar, onde colocar cada item e como montar.",
  cta: "Ver os 150 projetos",
  /**
   * Pranchas das festas na mesa (10 projetos). A vitrine tem 16 cards — 8 por
   * faixa, como antes — para manter tamanho, velocidade e densidade: com menos
   * cards a faixa ficaria mais curta que uma tela larga e abriria um buraco
   * no loop. Cada faixa tem 8 projetos DIFERENTES, em ordens diferentes.
   * Índice par = faixa de cima; ímpar = faixa de baixo.
   */
  items: [
    { code: "Projeto 014", name: "Girafas e Acácias", slug: "projeto-014-girafas-e-acacias" },
    { code: "Projeto 010", name: "Passarinhos no Jardim", slug: "projeto-010-passarinhos-no-jardim" },
    { code: "Projeto 011", name: "Pinguins no Gelo", slug: "projeto-011-pinguins-no-gelo" },
    { code: "Projeto 007", name: "Abelhinhas e Margaridas", slug: "projeto-007-abelhinhas-e-margaridas" },
    { code: "Projeto 003", name: "Fazendinha de Papel", slug: "projeto-003-fazendinha-de-papel" },
    { code: "Projeto 008", name: "Aventura na Selva", slug: "projeto-008-aventura-na-selva" },
    { code: "Projeto 009", name: "Tartarugas e Ondas", slug: "projeto-009-tartarugas-e-ondas" },
    { code: "Projeto 011", name: "Pinguins no Gelo", slug: "projeto-011-pinguins-no-gelo" },
    { code: "Projeto 007", name: "Abelhinhas e Margaridas", slug: "projeto-007-abelhinhas-e-margaridas" },
    { code: "Projeto 006", name: "Jardim das Joaninhas", slug: "projeto-006-jardim-das-joaninhas" },
    { code: "Projeto 012", name: "Coelhinhos na Horta", slug: "projeto-012-coelhinhos-na-horta" },
    { code: "Projeto 014", name: "Girafas e Acácias", slug: "projeto-014-girafas-e-acacias" },
    { code: "Projeto 006", name: "Jardim das Joaninhas", slug: "projeto-006-jardim-das-joaninhas" },
    { code: "Projeto 012", name: "Coelhinhos na Horta", slug: "projeto-012-coelhinhos-na-horta" },
    { code: "Projeto 013", name: "Leãozinho Rei", slug: "projeto-013-leaozinho-rei" },
    { code: "Projeto 009", name: "Tartarugas e Ondas", slug: "projeto-009-tartarugas-e-ondas" },
  ],
};

/* ------------------------------------------------------------------ */
/*  TEMAS — paleta de cada tema (usada na ilustração dos cards)         */
/*  cores: [principal, secundária, apoio, fundo claro]                  */
/* ------------------------------------------------------------------ */
export type Theme = {
  id: string;
  name: string;
  colors: [string, string, string, string];
};

export const themes: Theme[] = [
  { id: "safari", name: "Safari", colors: ["#8A7248", "#C4AE86", "#6E8560", "#EFE6D6"] },
  { id: "safari-boho", name: "Safari Boho", colors: ["#A98E6B", "#D8C3A5", "#7C8F6E", "#F3EADD"] },
  { id: "princesa", name: "Princesa", colors: ["#D98BA8", "#F0C3D2", "#C9A227", "#FBECF1"] },
  { id: "dinossauros", name: "Dinossauros", colors: ["#4F7F52", "#86A85C", "#B8862F", "#E9EFDF"] },
  { id: "espaco", name: "Espaço", colors: ["#3F4C74", "#7C8CB5", "#E7B44C", "#E4E7F0"] },
  { id: "fazendinha", name: "Fazendinha", colors: ["#C4564C", "#E0B84C", "#7E9668", "#F5E9D8"] },
  { id: "jardim-encantado", name: "Jardim Encantado", colors: ["#D98BA8", "#EFC9B4", "#7E9668", "#FAEDE6"] },
  // O terceiro tom não pode ser quase preto: na ilustração ele vira balão, e
  // balão preto lê como "buraco" no arco em vez de decoração.
  { id: "futebol", name: "Futebol", colors: ["#3C8259", "#E8E4DC", "#5F6B76", "#E6EFE7"] },
  { id: "carrinhos", name: "Carrinhos", colors: ["#C4564C", "#4E7CA8", "#E0B84C", "#EDE7DE"] },
  { id: "construcao", name: "Construção", colors: ["#D79A28", "#6E6A63", "#C4564C", "#F1EADC"] },
  { id: "bailarina", name: "Bailarina", colors: ["#DE9CAE", "#F2D3D8", "#C9A227", "#FBEFF1"] },
  { id: "circo", name: "Circo", colors: ["#C4564C", "#E0B84C", "#4E7CA8", "#F4E9DC"] },
  { id: "bosque", name: "Bosque", colors: ["#6E8560", "#A9927A", "#C9A227", "#EBEDE1"] },
  { id: "fundo-do-mar", name: "Fundo do Mar", colors: ["#4A90A4", "#8FC4CE", "#E0B84C", "#E2EEF0"] },
  { id: "arco-iris", name: "Arco-íris", colors: ["#E07A63", "#E0B84C", "#7E9668", "#F7ECE2"] },
  { id: "ursinho", name: "Ursinho", colors: ["#A9866B", "#D9C0A8", "#8FA0B8", "#F2E9DF"] },
  { id: "borboletas", name: "Borboletas", colors: ["#D98BA8", "#C5A3C9", "#E0B84C", "#F8ECF2"] },
  { id: "astronauta", name: "Astronauta", colors: ["#48587F", "#8E9CBE", "#E0B84C", "#E5E8F1"] },
  { id: "cowboy", name: "Cowboy", colors: ["#A9724A", "#D8B98C", "#6E8560", "#F1E6D6"] },
  { id: "tropical", name: "Tropical", colors: ["#3F8F7A", "#E0B84C", "#E07A63", "#E4F0EA"] },
  { id: "dinossauro-baby", name: "Dinossauro Baby", colors: ["#8FBF9A", "#CFE3CC", "#E0B84C", "#EEF6EE"] },
  { id: "minimalista", name: "Festa Minimalista", colors: ["#B7A99A", "#E3DAD0", "#C9A227", "#F5F1EC"] },
  { id: "primeiro-ano", name: "Festa de 1 Ano", colors: ["#E3A9A0", "#F0D6C6", "#C9A227", "#FBF0EA"] },
];

/** Busca a paleta de um tema pelo id (fallback neutro se não existir). */
export function getTheme(id: string): Theme {
  return (
    themes.find((t) => t.id === id) ?? {
      id,
      name: id,
      colors: ["#B7A99A", "#E3DAD0", "#C9A227", "#F5F1EC"],
    }
  );
}

/* ------------------------------------------------------------------ */
/*  3. Galeria — "veja alguns dos projetos"                            */
/* ------------------------------------------------------------------ */

/** Faixa de custo do projeto — sempre tratada como ESTIMATIVA. */
export type Tier = "economica" | "intermediaria" | "completa";

export const tierLabels: Record<Tier, { label: string; budget: string }> = {
  economica: { label: "Econômica", budget: "Custo aprox.: até R$300" },
  intermediaria: { label: "Intermediária", budget: "Custo aprox.: até R$500" },
  completa: { label: "Completa", budget: "Montagem mais completa" },
};

export const gallery = {
  eyebrow: "Veja alguns dos projetos",
  title: "150 festas na mesa para diferentes {{temas, mesas e orçamentos}}",
  paragraph:
    "Encontre uma festa que combine com seu filho, com a mesa que você tem e com o quanto quer gastar.",
  // `src` opcional: preencha com a foto real da festa na mesa (vertical ou quadrada).
  items: [
    { code: "Projeto 012", theme: "safari-boho", tier: "intermediaria" as Tier, src: "" },
    { code: "Projeto 027", theme: "jardim-encantado", tier: "economica" as Tier, src: "" },
    { code: "Projeto 041", theme: "dinossauros", tier: "intermediaria" as Tier, src: "" },
    { code: "Projeto 058", theme: "fazendinha", tier: "economica" as Tier, src: "" },
    { code: "Projeto 066", theme: "fundo-do-mar", tier: "completa" as Tier, src: "" },
    { code: "Projeto 073", theme: "futebol", tier: "economica" as Tier, src: "" },
    { code: "Projeto 081", theme: "borboletas", tier: "intermediaria" as Tier, src: "" },
    { code: "Projeto 088", theme: "astronauta", tier: "completa" as Tier, src: "" },
    { code: "Projeto 094", theme: "circo", tier: "intermediaria" as Tier, src: "" },
    { code: "Projeto 100", theme: "arco-iris", tier: "economica" as Tier, src: "" },
  ],
  // Faixa de temas que passa em loop abaixo da galeria.
  stripLabel: "E ainda: princesa, espaço, bosque, cowboy, tropical, ursinho, bailarina…",
  strip: [
    "princesa",
    "espaco",
    "bosque",
    "cowboy",
    "tropical",
    "ursinho",
    "bailarina",
    "carrinhos",
    "construcao",
    "safari",
    "dinossauro-baby",
    "minimalista",
    "primeiro-ano",
  ],
  cta: "Ver os 150 projetos",
  note: ESTIMATE_NOTE,
};

/* ------------------------------------------------------------------ */
/*  4. Vídeo                                                           */
/* ------------------------------------------------------------------ */
export const video = {
  eyebrow: "Veja por dentro",
  title: "Dá uma olhada em como os projetos funcionam",
  subtitle:
    "Em menos de um minuto você entende como escolher sua mesa, descobrir o que comprar e seguir o mapa de montagem.",
  /**
   * Vídeo demonstrativo. Deixe `mediaId: ""` para exibir o espaço reservado
   * (placeholder). Preencha com o ID da mídia no Wistia para publicar o vídeo.
   */
  mediaId: "", // REVISAR: gravar e subir o vídeo da nova oferta
  aspect: 0.5625, // 9/16 (vertical)
  placeholder: "[INSERIR VÍDEO DEMONSTRATIVO REAL]",
  cta: "Quero começar minha festa",
};

/* ------------------------------------------------------------------ */
/*  5. Simples assim — 3 passos                                        */
/* ------------------------------------------------------------------ */
export const steps = {
  eyebrow: "Simples assim",
  title: "Da escolha do tema à mesa pronta em {{3 passos}}",
  subtitle:
    "Você não precisa criar a decoração do zero. Escolha um projeto que caiba na sua mesa e siga a composição pronta.",
  items: [
    {
      n: "1",
      icon: "search" as const,
      title: "Escolha sua festa",
      desc: "Escolha pelo tema e pelo tipo de mesa: de jantar, pequena, aparador ou bancada.",
    },
    {
      n: "2",
      icon: "list" as const,
      title: "Veja o que comprar",
      desc: "Confira materiais com quantidades, paleta de cores e custo estimado — e o que dá para reaproveitar de casa.",
    },
    {
      n: "3",
      icon: "sparkles" as const,
      title: "Monte sua mesa",
      desc: "Siga o mapa de posicionamento: bolo, bandejas, enfeites e balões, cada um no seu lugar.",
    },
  ],
  cta: "Quero escolher minha festa",
};

/* ------------------------------------------------------------------ */
/*  6. Como é um projeto por dentro                                     */
/* ------------------------------------------------------------------ */
export const projectInside = {
  eyebrow: "Não é só uma foto bonita",
  title: "Cada projeto mostra {{como chegar ao resultado}}",
  subtitle:
    "Veja um exemplo do que você encontra ao abrir qualquer uma das 150 festas na mesa.",
  // Exemplo de página interna.
  // ⚠️ SEÇÃO DESLIGADA. Antes de religar, troque os valores pelos de um
  // projeto REAL do material (medidas e espaço não podem ser inventados).
  demo: {
    code: "Projeto 037",
    name: "Safari na Mesa de Jantar",
    theme: "safari",
    src: "", // preencha com a foto real desta festa
    specs: [
      { label: "Tipo de mesa", value: "mesa de jantar" },
      { label: "Medidas da mesa", value: "[CONFIRMAR NO MATERIAL]" },
      { label: "Espaço necessário", value: "[CONFIRMAR NO MATERIAL]" },
      { label: "Dificuldade", value: "fácil" },
    ],
    paletteTitle: "Paleta",
    palette: [
      { name: "Verde oliva", hex: "#6E7A4A" },
      { name: "Bege", hex: "#D8C7A8" },
      { name: "Marrom", hex: "#8A6A4B" },
      { name: "Dourado", hex: "#C9A227" },
    ],
    elementsTitle: "Elementos principais",
    elements: [
      "bolo",
      "bandejas",
      "boleiras",
      "enfeites de mesa",
      "balões",
      "fundo",
      "folhagens",
      "objetos de casa",
    ],
  },
  includesTitle: "Você também encontra:",
  includes: [
    "antes e depois no mesmo ângulo",
    "lista de materiais com quantidades",
    "medidas da mesa e espaço",
    "mapa de posicionamento",
    "orientações de montagem",
    "custo estimado e alternativas",
  ],
  note: ESTIMATE_NOTE,
};

/* ------------------------------------------------------------------ */
/*  7. Diferenciação — Pinterest x projeto pronto                       */
/* ------------------------------------------------------------------ */
export const comparison = {
  title: "Pinterest mostra a festa.\n{{Nós mostramos como fazer.}}",
  subtitle:
    "Pare de salvar fotos de mesas lindas sem saber como montar. Comece com um projeto pronto para a sua mesa.",
  cta: "Quero as mesas prontas",
  before: {
    title: "Procurar inspiração",
    items: [
      "dezenas de fotos salvas",
      "não sabe se cabe na sua mesa",
      "não sabe o que comprar",
      "não sabe onde vai cada item",
      "acaba improvisando no dia",
    ],
  },
  after: {
    title: "Escolher um projeto pronto",
    items: [
      "antes e depois da mesma mesa",
      "lista com quantidades",
      "medidas e espaço necessário",
      "mapa de onde vai cada item",
      "montagem sem improviso",
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  8. Bônus (5)                                                       */
/* ------------------------------------------------------------------ */
export const bonuses = {
  eyebrow: "Presentes exclusivos",
  title: "Leve também {{5 bônus}} para facilitar sua festa na mesa",
  subtitle:
    "Materiais complementares para a parte prática: balões, compras, objetos de casa, prazos e lembrancinhas.",
  /*
   * CAPAS: mockup 3D de cada bônus (560×839, fundo transparente). Com `src`
   * vazio a página desenha a capa em CSS (BonusCover.tsx) no lugar.
   *
   * ⚠️ PENDENTE: os valores "De R$…" de cada bônus (e a soma em
   * `totalValue`) são os da oferta anterior, mantidos na mesma posição.
   * Confirme se valem para estes materiais.
   */
  items: [
    {
      tag: "Bônus #1",
      title: "Guia de Balões para Festas na Mesa",
      icon: "balloon" as const,
      colors: ["#3B82F6", "#E4EEFE"] as [string, string],
      description:
        "Quantos balões usar, de que tamanho e onde prender para compor o fundo na medida da sua mesa, sem tomar a sala inteira.",
      price: "R$ 47,00",
      src: "/bonus-1-guia-baloes-mesa.webp",
    },
    {
      tag: "Bônus #2",
      title: "Checklist de Compras e Montagem",
      icon: "clipboard" as const,
      colors: ["#1D4ED8", "#DCE4FA"] as [string, string],
      description:
        "Confira tudo antes de sair para comprar e siga a ordem de montagem da mesa sem esquecer nenhum item.",
      price: "R$ 37,00",
      src: "/bonus-2-checklist-compras-montagem.webp",
    },
    {
      tag: "Bônus #3",
      title: "Guia para Reaproveitar Objetos de Casa",
      icon: "recycle" as const,
      colors: ["#0B1E5B", "#D5DEF0"] as [string, string],
      description:
        "Como transformar travessas, pratos, potes, livros e caixas que você já tem em suportes e enfeites da mesa.",
      price: "R$ 40,00",
      src: "/bonus-3-reaproveitar-objetos.webp",
    },
    {
      tag: "Bônus #4",
      title: "Cronograma da Festa",
      icon: "calendar" as const,
      colors: ["#2563EB", "#DCE7FD"] as [string, string],
      description:
        "O que organizar nos dias antes e no próprio dia para montar a mesa com calma, sem deixar tudo para a última hora.",
      price: "R$ 34,00",
      src: "/bonus-4-cronograma-festa.webp",
    },
    {
      tag: "Bônus #5",
      title: "50 Ideias de Lembrancinhas",
      icon: "gift" as const,
      colors: ["#0EA5E9", "#DEF1FD"] as [string, string],
      description:
        "Sugestões bonitas e simples para fechar a festa sem transformar as lembrancinhas em mais uma grande despesa.",
      price: "R$ 38,00",
      src: "/bonus-5-50-lembrancinhas.webp",
    },
  ],
  totalLabel: "Valor total dos 5 bônus:",
  totalValue: "R$ 196,00",
  freeLabel: "Hoje: grátis",
  warning:
    "Atenção: os 5 bônus só entram junto para quem garantir o acesso agora.",
  cta: "Quero as 150 festas + 5 bônus",
};

/* ------------------------------------------------------------------ */
/*  9. Prova social                                                    */
/* ------------------------------------------------------------------ */
/**
 * ⚠️ NADA AQUI PODE SER INVENTADO.
 * Os itens abaixo são ESPAÇOS RESERVADOS. Substitua o texto do placeholder
 * e preencha `src` com o print/foto real. Enquanto `real` for false, o card
 * aparece marcado como espaço reservado — nunca como depoimento verdadeiro.
 */
export const testimonials = {
  eyebrow: "O que estão dizendo",
  /**
   * Fala com os DOIS públicos que compram: a mãe que monta a festa do filho
   * e a decoradora que usa os projetos no trabalho. Não opor um ao outro
   * ("em vez de contratar decorador") — a decoradora também é cliente.
   */
  title: "Festas reais montadas a partir {{dos nossos projetos}}",
  subtitle:
    "Mães que montaram a festa do filho em casa e decoradoras que ganharam temas novos para oferecer às clientes, todas começando de um projeto pronto.",
  /**
   * Prints de conversa (WhatsApp/Instagram) exibidos no carrossel da seção.
   *
   * `width`/`height` são os do arquivo e servem para reservar o espaço do card
   * (evita salto de layout) — os prints NÃO têm todos a mesma proporção, então
   * ao trocar uma imagem confira as medidas novas.
   */
  prints: [
    {
      src: "/PRINT4.png",
      label:
        "Print de cliente: escolheu um tema pronto e montou a festa. Foto da decoração",
      width: 1122,
      height: 1402,
    },
    {
      src: "/PRINT3.png",
      label:
        "Print de cliente: o guia ajudou na organização da festa. Foto do resultado final",
      width: 1122,
      height: 1402,
    },
    {
      src: "/PRINT2.png",
      label:
        "Print de cliente: copiou o tema do material com facilidade. Foto da decoração",
      width: 1122,
      height: 1402,
    },
    {
      src: "/PRINT1.png",
      label:
        "Print de cliente: ficou lindo e recomenda o produto. Foto da decoração",
      width: 1122,
      height: 1402,
    },
  ],
  /**
   * ⚠️ Depoimentos de demonstração, escritos para o layout. Antes de publicar,
   * troque texto, nome, cidade e foto pelos de clientes reais — o selo "Compra
   * verificada" afirma um fato e só pode ficar no ar se for verdade.
   *
   * `{{trecho}}` sai em negrito dentro da aspa (ver TestimonialCard).
   */
  items: [
    {
      quote:
        "Eu já tinha orçado a decoração e só a mesa do bolo vinha {{R$ 1.200}}. Achei o guia, escolhi um tema pronto e montei tudo em casa no sábado. {{Gastei menos de R$ 300}} e ninguém acreditou que fui eu que montei.",
      name: "Marcela F.",
      role: "Belo Horizonte/MG",
      avatar: "/avaliacoes/marcela-2.webp",
      stars: 5,
    },
    {
      quote:
        "O que me salvou foi o {{manual de montagem}}. Eu ficava horas no Pinterest e não saía do lugar, porque nada explicava por onde começar. Aqui já vem {{a ordem certa: painel, balões, mesa e doces}}. Montei sozinha em uma tarde.",
      name: "Juliana R.",
      role: "Curitiba/PR",
      avatar: "/avaliacoes/juliana-2.webp",
      stars: 5,
    },
    {
      quote:
        "Comprei achando que eram só fotos bonitas, mas {{cada projeto traz as cores e a lista do que usar}}. Fiz o tema safári igualzinho, {{com material de papelaria e balões}}. O aniversariante amou e ficou lindo nas fotos.",
      name: "Ana Paula S.",
      role: "Salvador/BA",
      avatar: "/avaliacoes/ana-paula-2.webp",
      stars: 5,
    },
  ],
  verifiedLabel: "Compra verificada",
  cta: "Quero os projetos prontos",
};

/* ------------------------------------------------------------------ */
/*  9.5 Avisos de compra (balãozinho no canto inferior esquerdo)        */
/* ------------------------------------------------------------------ */
/**
 * ⚠️ ESTES AVISOS AFIRMAM QUE ALGUÉM ACABOU DE COMPRAR.
 * Vale a mesma regra do selo do hero e dos depoimentos: se o nome e a cidade
 * não vierem de uma venda real, é publicidade enganosa (CDC, art. 37). O jeito
 * honesto de manter o componente é alimentá-lo com vendas de verdade (webhook
 * do checkout) ou desligá-lo — basta tirar <PurchaseNotifications /> do
 * page.tsx; nada mais depende dele.
 *
 * Nome só com a inicial do sobrenome e cidade sem bairro: um aviso público não
 * pode identificar a compradora.
 */
export const purchaseNotifications = {
  /** Segundos até o PRIMEIRO aviso aparecer, contados ao abrir a página. */
  firstDelaySeconds: 8,
  /** Quanto tempo cada aviso fica na tela (segundos). */
  visibleSeconds: 6,
  /**
   * Intervalo entre um aviso sair e o próximo entrar (segundos, sorteado na
   * faixa). O sorteio existe para o ritmo não virar um relógio — cadência
   * exata é o que denuncia que o aviso é automático.
   *
   * Não baixe muito daqui sem alongar a lista de `people`: cada ciclo é
   * `visibleSeconds` + este intervalo, e quando a lista dá a volta a mesma
   * pessoa reaparece — aviso repetido entrega o revezamento.
   *
   * ⚠️ Era 4–8s (um aviso a cada ~11s): vinham em fila, um atrás do outro,
   * e um balão que nunca sai da tela deixa de ser notícia e vira enfeite —
   * além de competir com o vídeo e com os preços pela atenção. Agora são
   * 25–45s: ~31 a 51s por aviso, e a lista de 18 pessoas leva uns 12
   * minutos para dar a volta.
   */
  gapSecondsMin: 25,
  gapSecondsMax: 45,
  /** Linha de baixo, depois da cidade. */
  timeLabel: "agora mesmo",
  /** Complemento do nome, na linha de cima. */
  actionLabel: "acabou de comprar",
  /** Rótulo lido por leitor de tela em volta da região dos avisos. */
  ariaLabel: "Avisos de compras recentes",
  /**
   * Quase todas mulheres, e de propósito: quem compra é a mãe que está
   * organizando a festa, e ela se reconhece na lista. Os dois nomes de homem
   * ficam porque uma lista 100% feminina soa montada — pai também compra.
   *
   * Nenhum NOME repete os depoimentos da seção 9 — a mesma pessoa aparecendo
   * como depoimento e como compra de agora entrega o revezamento. Cidade
   * repetida não é problema: cidade grande tem mais de uma compradora.
   *
   * A lista é longa (18) porque o intervalo é curto — com poucos nomes, a
   * primeira volta a aparecer rápido demais e a repetição fica visível.
   */
  people: [
    { name: "Camila R.", city: "Fortaleza, CE" },
    { name: "Fernanda S.", city: "Campinas, SP" },
    { name: "Patrícia L.", city: "Belo Horizonte, MG" },
    { name: "Vanessa O.", city: "São Paulo, SP" },
    { name: "Aline T.", city: "Salvador, BA" },
    { name: "Larissa D.", city: "Manaus, AM" },
    { name: "Rodrigo A.", city: "Curitiba, PR" },
    { name: "Débora F.", city: "Florianópolis, SC" },
    { name: "Simone A.", city: "Goiânia, GO" },
    { name: "Tatiane M.", city: "Porto Alegre, RS" },
    { name: "Renata B.", city: "Recife, PE" },
    { name: "Cristiane V.", city: "Brasília, DF" },
    { name: "Bianca G.", city: "Ribeirão Preto, SP" },
    { name: "Bruno C.", city: "Natal, RN" },
    { name: "Priscila M.", city: "Uberlândia, MG" },
    { name: "Sabrina L.", city: "Belém, PA" },
    { name: "Michele S.", city: "São Luís, MA" },
    { name: "Carolina N.", city: "Niterói, RJ" },
  ],
};

/* ------------------------------------------------------------------ */
/*  10. Planos                                                         */
/* ------------------------------------------------------------------ */
export const plans = {
  eyebrow: "Escolha seu acesso",
  title: "Escolha a opção {{ideal para você}}",
  basic: {
    name: "Pacote Básico",
    tagline: "Para quem quer começar com 50 festas na mesa.",
    /**
     * Mockup dentro do card, entre a chamada e o preço — é a MESMA arte da
     * hero de propósito: quem rolou a página inteira reencontra o produto que
     * viu no começo bem na hora de escolher o plano.
     * (Hoje o PricingSection não desenha esta imagem; `src` vazio = capa
     * provisória, igual à da hero.)
     */
    image: {
      src: "",
      width: 1254,
      height: 1254,
      alt: "Capa do guia com 50 Festas na Mesa Prontas para Copiar",
    },
    /** ⚠️ PENDENTE: preço "de" riscado herdado da oferta anterior — confirmar. */
    priceFrom: "De R$67",
    /** Preço do Básico (PRICES.basic, em src/offer.ts). */
    price: brl(PRICES.basic),
    cta: "Quero o Básico",
    /**
     * Só a entrega essencial: tudo que descreve o material (temas, paletas,
     * referências, montagem) passou para o Completo, a pedido — assim a
     * diferença entre os dois planos fica visível na hora da escolha.
     *
     * `included: false` vira um X vermelho: dizer o que NÃO vem é o que faz o
     * Básico funcionar como âncora em vez de concorrer com o Completo.
     */
    features: [
      { text: "50 Festas na Mesa Prontas para Copiar", included: true },
      { text: "Guia digital com acesso imediato", included: true },
    ],
    nudge: "Espera: há uma opção muito mais completa logo abaixo",
  },
  premium: {
    badge: "Mais escolhido",
    /**
     * Faixa vermelha logo abaixo do selo "Mais escolhido". A DATA do dia da
     * visita é anexada automaticamente pelo componente (mesma mecânica da
     * barra de urgência do topo), então a urgência nunca envelhece.
     *
     * ⚠️ Mesma ressalva do `urgencyBar`: só se sustenta enquanto o desconto do
     * combo for realmente renovado todo dia.
     */
    todayBadge: "Combo com desconto disponível apenas hoje",
    name: "Pacote Completo",
    tagline: "Os 150 projetos + 5 materiais extras para montar sua mesa com mais facilidade.",
    /**
     * Mesmo lugar do mockup do Básico (entre a chamada e o preço), mas com a
     * arte que mostra o guia JUNTO dos 5 bônus — a diferença entre os planos
     * aparece na imagem antes mesmo de o visitante ler a lista.
     *
     * Com `src` vazio entra a capa provisória com o selo "+ 5 bônus"
     * (ProductCover.tsx), no mesmo quadrado.
     */
    image: {
      src: "/plano-completo-150-festas-na-mesa.webp",
      width: 1254,
      height: 1254,
      alt: "Guia +150 Festas na Mesa Prontas para Você Copiar com os 5 bônus do Pacote Completo",
    },
    /** ⚠️ PENDENTE: preço "de" riscado herdado da oferta anterior — confirmar. */
    priceFrom: "De R$196",
    /** Mesma escrita do popup: "De R$X" riscado → "POR APENAS" → preço. */
    priceConnector: "Por apenas",
    /** Preço do Completo (PRICES.premium, em src/offer.ts). */
    price: brl(PRICES.premium),
    // A pílula "Acesso vitalício" que ficava aqui saiu: a informação agora
    // aparece uma vez só, na faixa abaixo dos dois planos (`assurances`).
    cta: "Quero o Completo",
    /** Linha pequena com relógio no FIM do card do Completo, depois da lista. */
    ctaNote: "Oferta especial disponível por tempo limitado",
    bonusTitle: "5 bônus incluídos",
    features: [
      "150 Festas na Mesa Prontas para Copiar",
      "Antes e depois da mesma mesa",
      "Materiais com quantidades e paleta",
      "Medidas e mapa de montagem",
      "Custo estimado e alternativas",
    ],
  },
  /**
   * Faixa abaixo dos DOIS cards: o que vale para qualquer plano. Ficava
   * repetido dentro de cada lista e agora aparece uma vez só — quem compara
   * os planos vê só a diferença entre eles, e as garantias ficam por fora da
   * comparação. `icon`: "infinity" | "shield" | "zap" (ver PricingSection).
   */
  assurances: [
    { icon: "infinity" as const, text: "Acesso vitalício" },
    { icon: "shield" as const, text: "Garantia de 7 dias" }, // precisa bater com o checkout
    { icon: "zap" as const, text: "Acesso imediato após a compra" },
  ],
};

/* ------------------------------------------------------------------ */
/*  10b. Popup de upsell (PRICES.upsell) — tela única                  */
/* ------------------------------------------------------------------ */
/**
 * A tela do popup: o Plano Completo (com os 5 bônus) por PRICES.upsell (src/offer.ts). Aparece
 * por DOIS caminhos — no clique do plano Básico e sozinho (tempo no site /
 * intenção de saída, ver `upsellAuto`).
 *  - aceitar  → UPSELL_CHECKOUT_URL (PRICES.upsell)
 *  - recusar  → BASIC_CHECKOUT_URL (PRICES.basic, só 50 projetos)
 *  - FECHAR   → encerra o popup e devolve a pessoa à página
 *
 * É uma tela SÓ. Já houve um segundo degrau aqui duas vezes: R$ 19,00 caindo
 * para 17,90, e depois 17,90 caindo para 12,90 no fechar. Os dois saíram pelo
 * mesmo motivo — duas telas quase iguais, e a primeira ensinando que fechar
 * barateia. A oferta chega inteira a quem lê uma janela só.
 *
 * O argumento é o que FALTA no Pacote Básico: a tela lista o que a pessoa
 * deixa para trás (as outras 100 festas + os 5 bônus) e mostra
 * quanto custa a mais levar tudo. Os nomes dos bônus NÃO são repetidos aqui:
 * saem de `bonuses.items`, e o valor deles de `bonuses.totalValue`, para não
 * existirem duas listas que podem divergir.
 *
 * Preços: `upgradeLine`, `cta` e o valor de `upsell-accept` no Tracking.tsx
 * saem todos de PRICES (src/offer.ts). Mexeu no preço? Confira só se o
 * `UPSELL_CHECKOUT_URL` cobra o mesmo valor.
 */
export const upsell = {
  /** Faixa azul do topo, abaixo do ícone de presente (sem emoji: o ícone já é o presente). */
  eyebrow: "ESPERE! Vai deixar esses bônus incríveis?",
  /** Título da lista vermelha: `missingLead` normal + `missingEmphasis` em vermelho. */
  missingLead: "O Pacote Básico",
  missingEmphasis: "não inclui:",
  /**
   * Primeira linha da lista, antes dos bônus: as festas que faltam no Básico
   * (150 − 50). Texto vazio tira a linha.
   */
  missingProjects: "+100 Festas na Mesa (total de 150)",
  /**
   * Caixa verde: a diferença para o Básico (PRICES.upsell − PRICES.basic).
   */
  upgradeLine: `Por apenas + R$ ${reais(PRICES.upsell - PRICES.basic)}, destrave o`,
  upgradeName: "Pacote Completo",
  /** O valor dos bônus é anexado a esta frase, vindo de `bonuses.totalValue`. */
  upgradeNote: "150 festas + 5 bônus (valem",
  cta: `SIM! Quero o Pacote Completo por R$ ${reais(PRICES.upsell)}`,
  decline: "Continuar apenas com o pacote básico",
  closeLabel: "Fechar",
  /*
   * SEM cronômetro de propósito — não existe `expiraMs` aqui.
   *
   * O popup sabe contar (`Oferta.expiraMs`, em UpsellPopup.tsx): 5 minutos
   * na tela e a janela sumia sozinha. O relógio veio junto quando esta oferta
   * veio junto com a 2ª tela, e lá ele fazia sentido — era a última chance
   * de quem já tinha fechado o popup uma vez.
   *
   * Aqui é a única tela, e um prazo nela custa mais do que rende: empurra
   * o preço para baixo da dobra no celular e, ao zerar, fecha o popup na cara
   * de quem ainda estava decidindo (zerar não leva a checkout nenhum — só
   * apaga a oferta).
   *
   * ⚠️ Se um dia voltar, o campo precisa de `countdownNote` junto e o
   * cronômetro tem de ser REAL, como o `Countdown` da barra de urgência:
   * contador que reinicia a cada visita é urgência fabricada.
   */
};

/* ------------------------------------------------------------------ */
/*  10c. Gatilho automático — tempo no site e intenção de saída        */
/* ------------------------------------------------------------------ */
/**
 * NÃO é uma oferta: são os tempos e os textos de quando o popup abre SOZINHO
 * — e hoje isso só acontece quando a visitante está DE SAÍDA (ponteiro
 * deixando a janela pelo topo, no desktop; fim da página, no celular). A
 * oferta que aparece é a MESMA de `upsell` (PRICES.upsell) — o que muda aqui é só
 * o texto da recusa, porque ninguém escolheu o básico ainda.
 *
 * FECHAR encerra o popup e devolve a visitante à página, igual ao do Básico.
 *
 * Abre UMA vez por sessão, e nunca por cima do popup do plano Básico.
 */
export const upsellAuto = {
  /**
   * Carência antes de ligar as duas vigias de saída. Quem chega do anúncio
   * ainda está com o ponteiro lá em cima — sem esta espera o popup abriria no
   * primeiro segundo, antes de a pessoa ter visto a oferta.
   *
   * ⚠️ Havia aqui um `delayMs` de 45s: o popup abria só por tempo na página,
   * no meio da leitura. Saiu a pedido do dono — aparecia "na tela do nada".
   */
  exitArmMs: 5000,
  /**
   * A quantos pixels do fim da página o popup considera que a pessoa chegou
   * ao fim (o gatilho de saída do celular, onde não há ponteiro para vigiar).
   *
   * Uma folga, e não o pixel exato: barra do navegador que aparece e some,
   * zoom e arredondamento de altura nunca deixam a conta fechar redonda.
   */
  fimDaPaginaPx: 120,
  /** Substitui `upsell.decline`: aqui ninguém escolheu o básico ainda. */
  decline: `Quero apenas o pacote básico por R$ ${reais(PRICES.basic)}`,
};

/* ------------------------------------------------------------------ */
/*  11. Garantia                                                       */
/* ------------------------------------------------------------------ */
export const guarantee = {
  eyebrow: "Sem risco para você",
  title: "Você pode conhecer o material sem medo",
  text: "Seu acesso é protegido pela nossa garantia. Durante o período informado na oferta, você poderá conhecer o material e, caso ele não faça sentido para você, solicitar o reembolso conforme os termos da garantia.",
  /** ⚠️ Precisa bater com a política real do checkout. */
  badge: "Garantia de 7 dias",
  /**
   * Selo dourado "7 DIAS" (300×300, fundo transparente). Com `sealSrc`
   * vazio a seção mostra o escudo verde no lugar. O selo NÃO pode informar
   * um prazo diferente do checkout.
   */
  sealSrc: "/selo-garantia-7dias.webp",
  sealAlt: "Selo de garantia de 7 dias",
};

/* ------------------------------------------------------------------ */
/*  12. FAQ                                                            */
/* ------------------------------------------------------------------ */
export const faq = {
  eyebrow: "Tire suas dúvidas",
  title: "Perguntas Frequentes",
  cta: "Quero começar minha festa",
  /**
   * Só 4 perguntas, a pedido — e são as 4 objeções que de fato seguram a
   * compra, na ordem em que aparecem na cabeça de quem está decidindo:
   * "não sei fazer" → "vai ficar caro" → "como recebo" → "qual plano".
   *
   * As outras (quantidades exatas, festa grande, acessar mais de uma vez,
   * comprar tudo que aparece) saíram porque já estão respondidas no corpo da
   * página — e, com poucas perguntas, cada linha do FAQ precisa derrubar uma
   * objeção diferente. "É material físico?" e "Como recebo?" viraram uma
   * pergunta só: era a mesma dúvida ocupando duas das quatro vagas.
   */
  items: [
    {
      q: "Preciso saber decorar?",
      a: "Não. Cada projeto mostra a mesa antes e depois, a lista do que comprar e um mapa de onde colocar bolo, bandejas, enfeites e balões. Serve para a festa da sua família e para decoradoras que montam para clientes.",
    },
    {
      q: "Funciona com a mesa que eu tenho?",
      a: "Sim. Há projetos para mesa de jantar, mesa pequena, aparador e bancada, e cada um informa as medidas da mesa e o espaço necessário. Você também vê o custo estimado e o que dá para trocar por objetos de casa.",
    },
    {
      q: "É kit físico? Como recebo?",
      a: "Não é kit físico nem aluguel de decoração: é um produto digital. Após a confirmação do pagamento, o acesso chega na hora pelo WhatsApp e pelo e-mail, e você abre no celular, tablet ou computador.",
    },
    {
      q: "Qual a diferença entre o Básico e o Completo?",
      a: "O Básico traz 50 projetos de festa na mesa. O Completo traz os 150 projetos mais os 5 bônus.",
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  13. CTA final                                                      */
/* ------------------------------------------------------------------ */
export const finalCta = {
  title: "Uma festa linda {{pode caber na sua mesa}}",
  subtitle:
    "Escolha entre 150 projetos, veja o que comprar e siga o mapa de montagem, em casa ou para suas clientes.",
  highlight: "150 festas + 5 bônus no Completo",
  // Preço do Pacote Completo, a pedido — o mesmo do card de destaque.
  // Vem de PRICES.premium (src/offer.ts).
  price: brl(PRICES.premium),
  priceNote: "Pagamento único",
  cta: "Quero garantir meu acesso",
  badges: ["Acesso imediato", "Pagamento único", "Garantia", "Sem mensalidade"],
};

/* ------------------------------------------------------------------ */
/*  Barra fixa no mobile                                               */
/* ------------------------------------------------------------------ */
export const stickyBar = {
  label: "A partir de",
  price: brl(PRICES.basic),
  cta: "Ver as 150 festas",
};
