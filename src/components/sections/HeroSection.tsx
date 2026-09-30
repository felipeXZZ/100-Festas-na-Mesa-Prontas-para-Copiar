import Image from "next/image";
import {
  ListOrdered,
  ShoppingCart,
  Sparkles,
  Star,
  Wallet,
  Zap,
} from "lucide-react";
import { hero } from "@/content";
import { Highlight } from "@/components/Highlight";
import { CTAButton } from "@/components/CTAButton";
import { ProductCover } from "@/components/ProductCover";
import { PAGE_VARIANT } from "@/lib/track";

/**
 * 2. HERO — primeira dobra.
 *
 * Ordem no MOBILE (a maior parte do tráfego): selo → headline → subheadline →
 * mockup do produto → CTA → linha de segurança. O mockup entra logo depois do
 * texto porque é ele que materializa a promessa ("isso aqui é um material de
 * verdade, com projetos dentro") antes de pedir o clique.
 *
 * No desktop vira duas colunas: texto à esquerda, mockup à direita.
 */
export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-cream px-5 pb-14 pt-8 sm:pb-20 sm:pt-12"
    >
      {/* Fundo CHAPADO de propósito: nada de gradiente nem de manchas
          desfocadas atrás do texto — a hero é a dobra que precisa ler mais
          rápido, e o mockup já dá cor suficiente. */}
      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        {/* ---------------- Coluna de texto ---------------- */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          {/* Eyecatcher da oferta */}
          {/* A pílula INTEIRA escala com a largura da tela: fonte fluida
              (`clamp`) e estrelas medidas em `em`. Com tamanho fixo, 5
              estrelas + uma frase de ~37 caracteres em negrito não cabem em
              telas de 360–414px — a frase quebrava em duas linhas e o selo
              ficava com cara de erro. Assim cabe em uma linha de 360px pra
              cima, e o teto de 13px preserva o tamanho no desktop. */}
          <p className="inline-flex max-w-full items-center gap-1 rounded-full bg-white px-3 py-2 text-[clamp(10px,3vw,13px)] font-bold leading-snug text-ink shadow-[0_8px_24px_-10px_rgba(26,35,56,0.45)] ring-1 ring-ink/10 sm:gap-1.5 sm:px-4 sm:py-2.5">
            {hero.badgeStars > 0 ? (
              <span
                role="img"
                aria-label={`${hero.badgeStars} de 5 estrelas`}
                className="flex shrink-0 items-center"
              >
                {Array.from({ length: hero.badgeStars }).map((_, i) => (
                  <Star key={i} className="size-[1.15em] fill-gold text-gold" />
                ))}
              </span>
            ) : (
              <Sparkles className="size-[1.3em] shrink-0 text-gold" aria-hidden />
            )}
            <span>
              <Highlight text={hero.badge} tone="purple" />
            </span>
          </p>

          {/* Headline maior e subheadline menor, a pedido: a diferença de
              tamanho entre as duas é o que faz a promessa ser lida primeiro. */}
          <h1 className="font-display text-balance mt-5 text-[2.15rem] leading-[1.04] text-ink sm:text-[3.1rem] lg:text-[3.5rem]">
            {/* sem `underline`: o traço dourado por baixo do destaque saiu a
                pedido — o azul sozinho já separa o destaque do resto */}
            <Highlight text={hero.headline} tone="purple" />
          </h1>

          <p className="mt-4 max-w-md text-[14px] leading-relaxed text-ink-soft sm:text-[15px]">
            {/* `{{trecho}}` em negrito: o nome do produto dentro da frase. */}
            <Highlight text={hero.subheadline} tone="bold" />
          </p>

          {/* Mockup — no MOBILE aparece aqui, logo abaixo da subheadline;
              no desktop ele vive na coluna da direita. */}
          <div className="mt-8 w-full lg:hidden">
            <HeroMockup />
            <HeroPerks />
          </div>

          {/* O texto do CTA da hero é MAIOR que o dos outros botões: é o
              clique que a dobra inteira existe para conseguir.

              Como ele cresce, três coisas andam juntas para a frase caber em
              UMA linha até em telas de 360px (onde ela já batia na borda com
              o tamanho antigo): a fonte é fluida (`clamp`, do 1rem atual no
              celular pequeno até 1,35rem no desktop), o espaçamento entre
              letras volta ao normal e o padding lateral encolhe no mobile —
              os dois devolvem ~30px de largura útil. */}
          <div className="cta-pulse mt-8 flex w-full justify-center lg:justify-start">
            <CTAButton
              size="lg"
              fullWidth
              href="#planos"
              location="hero"
              trackId="hero-plans"
              attention
              shine={false}
              /* Segunda linha DENTRO do botão: o preço. Ver `hero.priceHint`
                 e a prop `subline` do CTAButton. */
              subline={
                hero.priceHint ? (
                  <Highlight text={hero.priceHint} tone="bold" />
                ) : null
              }
              className="px-5 text-[clamp(1rem,4.6vw,1.35rem)] tracking-normal sm:px-8 sm:text-[1.35rem]"
            >
              {hero.cta}
            </CTAButton>
          </div>

          {/* Uma linha só, colada no botão: por onde a entrega chega. A
              linha de "pagamento seguro" que ficava aqui saiu a pedido. */}
          <HeroDelivery />
        </div>

        {/* ---------------- Mockup (desktop) ---------------- */}
        <div className="hidden lg:block">
          <HeroMockup />
          <HeroPerks />
        </div>
      </div>
    </section>
  );
}

/**
 * Ícones dos microbenefícios da hero — a chave vem de `hero.perks[].icon`.
 * Quando o valor NÃO é uma chave daqui, ele é desenhado como texto: é assim
 * que um emoji entra no lugar do ícone vetorial (ver `hero.perks`).
 */
const PERK_ICONS = {
  cart: ShoppingCart,
  wallet: Wallet,
  steps: ListOrdered,
  bolt: Zap,
} as const;

/**
 * TESTE — lista de microbenefícios logo abaixo do mockup.
 *
 * Formato da referência: uma linha por benefício, ícone à esquerda, e o
 * BLOCO inteiro centralizado (`w-fit` + `mx-auto`) em vez de cada linha
 * centralizada sozinha. É o que mantém os cinco ícones em uma coluna reta —
 * com `text-center` em cada item os ícones ficariam em zigue-zague, seguindo
 * a largura de cada frase.
 *
 * Só o ÍCONE é colorido (`text-purple-ink`, o mesmo azul do destaque do
 * headline). O texto fica na cor de corpo e o `{{trecho}}` sai apenas em
 * negrito (tone="bold"): dois azuis lado a lado — ícone e palavra —
 * apagariam justamente o contraste que faz o ícone ser visto primeiro.
 * A exceção é a linha dos bônus, que usa emoji: ele traz as cores dele.
 */
function HeroPerks() {
  if (hero.perks.length === 0) return null;

  return (
    <ul className="mx-auto mt-6 flex w-fit flex-col gap-y-2 text-left">
      {hero.perks.map((perk) => {
        const Icon = PERK_ICONS[perk.icon as keyof typeof PERK_ICONS];
        return (
          <li
            key={perk.text}
            className="flex items-center gap-2.5 text-[14px] leading-snug text-ink sm:text-[15px]"
          >
            {Icon ? (
              <Icon className="size-[19px] shrink-0 text-purple-ink" aria-hidden />
            ) : (
              /* emoji: a caixa de 19px é a MESMA do ícone vetorial, senão a
                 linha dele sai do prumo da coluna de ícones */
              <span
                aria-hidden
                className="flex size-[19px] shrink-0 items-center justify-center text-[16px] leading-none"
              >
                {perk.icon}
              </span>
            )}
            <span>
              <Highlight text={perk.text} tone="bold" />
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Canais de entrega citados na frase — `[token]` em `hero.delivery` vira o
 * ícone da marca + o nome em negrito. Os ícones são SVG inline (e não
 * lucide) porque logo de marca não existe no lucide, e são as ÚNICAS marcas
 * coloridas da dobra: é a cor delas que faz a frase ser reconhecida antes de
 * ser lida.
 */
const DELIVERY_CHANNELS = {
  "[whatsapp]": { label: "WhatsApp", Icon: WhatsAppMark },
  "[email]": { label: "E-mail", Icon: GmailMark },
} as const;

/**
 * TESTE — linha de entrega abaixo do CTA.
 *
 * A frase é montada em texto CORRIDO (nada de flex): assim ela quebra
 * naturalmente no celular, e só o par ícone+nome fica com `whitespace-nowrap`
 * para o logo nunca terminar sozinho no fim de uma linha. O alinhamento
 * (centro no celular, esquerda no desktop) é herdado da coluna de texto.
 */
function HeroDelivery() {
  if (!hero.delivery) return null;

  const parts = hero.delivery.split(/(\[whatsapp\]|\[email\])/g).filter(Boolean);

  return (
    <p className="mt-3 text-[13px] leading-relaxed text-ink">
      {parts.map((part, i) => {
        const channel = DELIVERY_CHANNELS[part as keyof typeof DELIVERY_CHANNELS];
        if (!channel) return <span key={i}>{part}</span>;

        const { label, Icon } = channel;
        return (
          <span key={i} className="whitespace-nowrap">
            <Icon />
            <strong className="font-bold">{label}</strong>
          </span>
        );
      })}
    </p>
  );
}

/* Os dois logos abaixo usam `align-[-0.2em]`: `inline-block` senta na linha
   de base do texto e o ícone fica flutuando acima da palavra. */
const MARK_CLASS = "mr-1 inline-block size-[15px] align-[-0.2em]";

/** Logo do WhatsApp — balão verde com o telefone branco. */
function WhatsAppMark() {
  return (
    <svg viewBox="0 0 24 24" className={MARK_CLASS} aria-hidden>
      <circle cx="12" cy="12" r="11" fill="#25D366" />
      <path
        fill="#fff"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"
      />
    </svg>
  );
}

/** Logo do Gmail — o "M" do envelope. */
function GmailMark() {
  return (
    <svg viewBox="0 0 48 48" className={MARK_CLASS} aria-hidden>
      <path fill="#4caf50" d="M45 16.2l-5 2.75-5 4.75L35 40h7a3 3 0 0 0 3-3V16.2z" />
      <path fill="#1e88e5" d="M3 16.2l3.614 1.71L13 23.7V40H6a3 3 0 0 1-3-3V16.2z" />
      <path fill="#e53935" d="M35 11.2L24 19.45 13 11.2l-1 5.8 1 6.7 11 8.25 11-8.25 1-6.7z" />
      <path fill="#c62828" d="M3 12.298V16.2l10 7.5V11.2L9.876 8.859A4.298 4.298 0 0 0 3 12.298z" />
      <path fill="#fbc02d" d="M45 12.298V16.2l-10 7.5V11.2l3.124-2.341A4.298 4.298 0 0 1 45 12.298z" />
    </svg>
  );
}

/**
 * Mockup do produto — a prova de que existe material de verdade por trás da
 * promessa. É o elemento de LCP da página, por isso vem com `preload` +
 * `eager` + fetchPriority alto (o antigo `priority` foi descontinuado no
 * Next 16 em favor do `preload`).
 *
 * Clicar leva aos planos: a arte é grande e as pessoas tocam nela.
 */
function HeroMockup() {
  return (
    <a
      href="#planos"
      data-cta-location="hero-mockup"
      data-track-id="hero-mockup-plans"
      data-page-variant={PAGE_VARIANT}
      aria-label="Ver os planos"
      className="hero-float block"
    >
      {/* Sem arquivo (`src` vazio) entra a capa provisória desenhada, no
          mesmo quadrado — ver `hero.mockup` no content.ts. */}
      {!hero.mockup.src ? (
        <ProductCover label={hero.mockup.alt} className="max-w-[560px]" />
      ) : (
      <Image
        src={hero.mockup.src}
        alt={hero.mockup.alt}
        width={hero.mockup.width}
        height={hero.mockup.height}
        /* `preload` insere o <link rel="preload"> no <head> (Next 16 —
           substitui o antigo `priority`). Sem ele o navegador só descobre a
           imagem de LCP quando termina de parsear o <body>, e no 4G lento do
           PageSpeed isso são centenas de ms de atraso puro. Os dois <Image>
           da hero (celular e desktop) têm o MESMO src/sizes, então o
           react-dom emite um único link — não há preload duplicado. */
        preload
        loading="eager"
        fetchPriority="high"
        decoding="async"
        quality={65}
        /* O 92vw do celular virou 88vw. A imagem continua ocupando a mesma
           largura na tela (quem manda nisso é o `w-full` do className); o
           que muda é a VARIANTE escolhida no srcset. Num Moto G Power
           (412px, DPR 1,75) a caixa real tem 372px, ou seja 651px de
           pixel — 92vw pedia 663px e caía na variante de 750px, 11 pixels
           acima do degrau. Com 88vw a conta dá 634px e cai na de 640px:
           49KB → 39KB e 27% menos pixel para decodificar, com 1,7% de
           redução de escala, que não se vê. */
        sizes="(min-width: 1024px) 560px, (min-width: 640px) 520px, 88vw"
        className="mx-auto h-auto w-full max-w-[560px] object-contain"
      />
      )}
    </a>
  );
}
