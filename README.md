# 150 Festas na Mesa Prontas para Copiar — landing page

Landing page de venda (Next.js 16 + Tailwind 4) para o produto digital
**"150 Festas na Mesa Prontas para Copiar"** (marca Decoração Sem
Complicação): 150 projetos de decoração infantil compacta (50 no Pacote
Básico) para montar sobre
mesas de jantar, mesas pequenas, aparadores e bancadas — com antes e depois,
materiais com quantidades, paleta, medidas, mapa de posicionamento,
orientações de montagem e custo estimado.

Promessa central: **transforme a mesa que você já tem em uma festa infantil
linda** — "Pinterest mostra a festa. Nós mostramos como fazer."

Página adaptada da oferta "150 Festas Infantis": mesma estrutura, seções e
componentes. Nome, preços e checkout ficam em `src/offer.ts`.

## ⚠️ Pendências da nova oferta

| O quê | Onde | Situação |
|---|---|---|
| **Preços** | `src/offer.ts` → `PRICES` | Confirmados: Básico R$ 5,99 · Completo R$ 19,90 · popup R$ 12,99. Os checkouts precisam cobrar esses valores. |
| **Preços "De R$…" riscados** | `content.ts` → `plans.*.priceFrom`, `bonuses.items[].price`, `bonuses.totalValue` | Valores herdados. Confirmar. |
| **Vídeo** | `content.ts` → `vsl.videoId` / `vsl.poster` | Vazio: espaço reservado. O vídeo anterior mostrava o material de 150 festas. |
| **Prova social** | `content.ts` → `hero.badge`, `testimonials.prints`, `purchaseNotifications` | Mantida como estava, a pedido. É da oferta anterior. |
| **Imagem de compartilhamento (OG)** | `src/app/layout.tsx` | Ainda falta (1200×630). |

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de produção
npm run lint
```

---

## ⚠️ Antes de publicar

Os pontos abaixo estão marcados com `REVISAR` no código:

| O quê | Onde | Por quê |
|---|---|---|
| **Links de checkout** | `src/content.ts` → `CHECKOUT_URL`, `BASIC_CHECKOUT_URL` | Ainda apontam para o checkout do produto **anterior** (quartos). Do jeito que estão, quem compra recebe o material errado. |
| **Domínio** | `src/content.ts` → `SITE_URL` | Usado em metadados, `robots.txt` e `sitemap.xml`. |
| **Pixel / Clarity** | `src/app/layout.tsx` | O `pixelId` da Utmify e o projeto do Clarity vieram da página anterior. |
| **Prazo da garantia** | `src/content.ts` → `guarantee.badge` e o selo | Precisa bater com a política real do checkout. |
| **Links do rodapé** | `src/content.ts` → `footer.links` | Termos, Privacidade e Suporte estão como `#`. |
| **Imagem de compartilhamento** | `src/app/layout.tsx` | Falta a imagem OG (1200×630). Sem ela o link não gera miniatura no WhatsApp/Instagram. |
| **Vídeo** | `src/content.ts` → `video.mediaId` | Vazio: a seção mostra o espaço reservado. |
| **Prova social** | `src/content.ts` → `testimonials.items` | Todos os itens estão como espaço reservado (veja abaixo). |

---

## Todo o texto vive em um arquivo só

`src/content.ts` é o único arquivo que precisa ser editado para mudar copy,
preços, temas, bônus e perguntas. **Nenhum componente tem texto fixo.**

Sintaxe usada nos títulos (componente `<Highlight/>`):

- `{{texto}}` → trecho colorido de destaque
- `[[150]]` → número em destaque, 1,5× maior
- `\n` → quebra de linha manual

---

## Imagens: como trocar

A página não depende de nenhuma foto para funcionar. Cada item visual tem um
campo `src` **opcional**:

1. `src` preenchido → mostra a **foto real** (otimizada pelo `next/image`);
2. `src` vazio, mas com `theme` → mostra a **ilustração vetorial** da festa,
   desenhada com a paleta daquele tema (`src/components/ThemeArt.tsx`);
3. nenhum dos dois → **espaço reservado** cinza com o rótulo do que falta.

Como o container tem proporção fixa, trocar ilustração por foto **não muda o
layout** (zero CLS). Exemplo:

```ts
// src/content.ts
{ code: "Projeto 012", theme: "safari-boho", tier: "intermediaria",
  src: "/festas/safari-boho.webp" },   // ← coloque o arquivo em /public/festas
```

Prefira fotos **verticais (3/4)** de mesas decoradas, painéis, cilindros, arcos
de balões, bolos e composições montadas em casa/quintal/salão pequeno.

> As ilustrações são vetores declarados como ilustração — não são fotografia e
> não devem ser apresentadas como registro real de uma festa montada.

### Temas e paletas

`themes` em `src/content.ts` define nome + 4 cores de cada tema. A paleta
alimenta a ilustração. Para criar um tema novo, basta adicionar um item ao
array e usar o `id` nos projetos.

---

## Prova social — regra da seção

**Nada nesta seção pode ser inventado**: nem depoimento, nem nome, nem número
de compradores, nem nota de avaliação. Por isso:

- os itens têm `real: false` e aparecem como `[INSERIR DEPOIMENTO REAL]`,
  `[INSERIR FOTO REAL DE CLIENTE]`, `[INSERIR PRINT REAL]`;
- o markup `Product` (JSON-LD) **não** declara `aggregateRating`;
- para publicar sem prova social, remova `<TestimonialsSection/>` de
  `src/app/page.tsx`.

Para preencher: coloque o arquivo em `/public`, aponte o `src` e marque
`real: true`.

Do mesmo jeito, **custos são sempre estimativa** (`ESTIMATE_NOTE`), repetida na
galeria, na ficha do projeto e no rodapé.

---

## Estrutura

`src/app/page.tsx` monta as seções na ordem da jornada de decisão:

| # | Seção | Componente |
|---|---|---|
| 1 | Barra de urgência | `UrgencyBar` |
| 2 | Hero | `HeroSection` |
| 3 | Galeria dos projetos | `ProjectGallery` |
| 4 | Vídeo | `VideoSection` |
| 5 | 3 passos | `ThreeSteps` |
| 6 | Projeto por dentro | `ProjectInside` |
| 7 | Pinterest × projeto pronto | `PinterestComparison` |
| 8 | 5 bônus | `BonusSection` |
| 9 | Prova social | `TestimonialsSection` |
| 10 | Planos | `PricingSection` |
| 11 | Garantia | `GuaranteeSection` |
| 12 | FAQ | `FAQSection` |
| 13 | CTA final | `FinalCTA` |
| 14 | Rodapé | `Footer` |
| — | CTA fixo (mobile) | `StickyMobileCTA` |

Todos os CTAs levam para `#planos` (a seção de preços); só os botões dos cards
de plano vão direto ao checkout.

### Barra de urgência sem contador falso

`urgencyBar.deadline` é `null` por padrão: a barra mostra só o texto e a seção
não envia JS nenhum. Se a promoção tiver prazo **real**, coloque uma data ISO
(`"2026-08-31T23:59:59-03:00"`) e o contador aparece. Quando o prazo passa, ele
some — nunca reinicia sozinho a cada visita.

---

## Design

Tokens em `src/app/globals.css` (nenhuma cor fixa nos componentes):

| Token | Uso |
|---|---|
| `cream` / `sand` / `lilac` | fundos claros alternados (off-white → lilás) |
| `plum` / `plum-deep` | seções escuras e rodapé (roxo profundo) |
| `cta` / `cta-dark` | gradiente do botão principal |
| `purple` | roxo vivo decorativo (pontos, ícones, formas) |
| `purple-ink` | roxo escuro para **texto** destacado em fundo claro |
| `gold` | âmbar dos selos e do texto de destaque no escuro |
| `green` / `green-ink` / `green-soft` | confirmação (checks) e faixa da garantia |
| `ink` / `ink-soft` / `ink-invert` | texto |

Duas regras que evitam texto ilegível:

- **`purple` nunca carrega texto pequeno.** O roxo vivo é decorativo; para
  texto sobre fundo claro use `purple-ink` (8,4:1). O `cta` é um roxo mais
  fechado justamente para o branco do botão passar em 6,3:1.
- **`gold` só sobre fundo escuro.** Sobre creme o âmbar desaparece; em fundo
  claro o destaque é `purple-ink`.

As ilustrações dos temas mantêm as cores da festa (safari verde, princesa rosa,
fundo do mar azul) — elas comunicam "cada projeto tem sua paleta", que é
argumento de venda. O roxo fica na moldura do site, como na referência.

Mobile em primeiro lugar: botões ocupando quase toda a largura, alvos de toque
de 52–60px, galeria em 2 colunas, FAQ em `<details>` nativo e CTA fixo no
rodapé que some ao chegar nos planos.

## Performance

- **Zero requisição de imagem** na primeira dobra: as ilustrações são SVG
  inline, então a página aparece completa já no HTML do servidor.
- HTML inicial ≈ **94 KB comprimido**, com o CSS embutido no `<head>`
  (`inlineCss`), sem CSS render-blocking.
- Client JS só onde é indispensável: contador (quando ligado), barra fixa do
  mobile, player de vídeo e rastreamento. O resto é Server Component.
- Scripts de terceiros (Utmify, Clarity) em `lazyOnload`; o player do vídeo só
  baixa quando a pessoa chega perto dele.
