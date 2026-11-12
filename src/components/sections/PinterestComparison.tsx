import { Check, X } from "lucide-react";
import type { ReactNode } from "react";
import { comparison } from "@/content";
import { Section } from "@/components/Section";
import { Highlight } from "@/components/Highlight";
import { CTAButton } from "@/components/CTAButton";

/**
 * 7. DIFERENCIAÇÃO — "Pinterest mostra a festa. Nós mostramos como fazer."
 *
 * É a seção que define a categoria do produto na cabeça da visitante: ela já
 * tem inspiração salva; o que falta é o plano. Por isso o contraste entre as
 * duas colunas é o elemento visual mais forte da página.
 *
 * Dobra CLARA (branca). Ficava azul escura como o carrossel logo acima e as
 * duas viravam um bloco escuro só, de duas telas de altura — sem essa
 * respirada no meio, nem o carrossel nem esta seção pareciam começar. Branco
 * (e não creme) porque a dobra de bônus logo abaixo já é creme.
 *
 * Com a seção clara, o contraste entre as colunas inverte: "procurar
 * inspiração" fica APAGADA (creme, recuada) e "escolher um projeto pronto"
 * fica ESCURA com anel dourado — a mesma linguagem do card do Plano Completo
 * nos planos, que é o outro lugar da página onde a escolha certa é a escura.
 */
export function PinterestComparison() {
  return (
    <Section bg="white" className="dobra-diferida [--altura-estimada:912px]">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-balance text-[1.9rem] leading-[1.1] text-ink sm:text-5xl">
          {/* `purple` (azul da marca) no lugar do dourado: sobre branco o
              amarelo some — ver a nota de `tone` em Highlight.tsx. */}
          <Highlight text={comparison.title} tone="purple" />
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-ink-soft sm:text-lg">
          {comparison.subtitle}
        </p>
      </div>

      {/* Cards com emojis, a pedido. Cada item: emoji num quadradinho branco
          + selinho de ✕ (vermelho) ou ✓ (verde) no canto — o emoji diz DO
          QUE se trata e o selinho diz se é problema ou solução, então a
          leitura de semáforo dos dois cards continua valendo. Os emojis vêm
          de `comparison` no content.ts. */}
      <div className="relative mx-auto mt-12 grid max-w-4xl items-stretch gap-5 md:grid-cols-2 md:gap-6">
        {/* Antes — juntar referências soltas. Card em TOM VERMELHO: nomeia o
            lado como o problema antes mesmo de a visitante ler os itens. */}
        <div className="rounded-3xl bg-danger-vivid/[0.06] p-6 ring-1 ring-danger-vivid/20 sm:p-7">
          <CardHeader
            tag={comparison.before.tag}
            emoji={comparison.before.emoji}
            title={comparison.before.title}
            tom="ruim"
          />
          <ul className="mt-5 space-y-3">
            {comparison.before.items.map((item) => (
              <Item key={item.text} emoji={item.emoji} tom="ruim">
                {item.text}
              </Item>
            ))}
          </ul>
        </div>

        {/* "VS" entre os cards: no celular fica no vão entre um e outro; no
            desktop, no meio das duas colunas. */}
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 z-10 hidden size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-[0.95rem] font-extrabold text-white shadow-lg ring-4 ring-white md:flex"
        >
          VS
        </span>
        <span
          aria-hidden
          className="-my-7 mx-auto flex size-11 items-center justify-center rounded-full bg-ink text-[0.85rem] font-extrabold text-white shadow-lg ring-4 ring-white md:hidden"
        >
          VS
        </span>

        {/* Depois — escolher um projeto pronto. Card em TOM VERDE, e mais
            PESADO que o vermelho (menta mais forte, anel de 2px e sombra
            verde): senão a seção vira duas listas empatadas. */}
        <div className="relative rounded-3xl bg-green/[0.13] p-6 shadow-[0_24px_60px_-26px_rgba(34,180,85,0.75)] ring-2 ring-cta/70 sm:p-7">
          <CardHeader
            tag={comparison.after.tag}
            emoji={comparison.after.emoji}
            title={comparison.after.title}
            tom="bom"
          />
          <ul className="mt-5 space-y-3">
            {comparison.after.items.map((item) => (
              <Item key={item.text} emoji={item.emoji} tom="bom">
                {item.text}
              </Item>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <CTAButton
          size="lg"
          href="#planos"
          location="comparison"
          trackId="comparison-plans"
        >
          {comparison.cta}
        </CTAButton>
      </div>
    </Section>
  );
}

type Tom = "ruim" | "bom";

/** Etiqueta ("do jeito difícil/fácil") + emoji grande + título do card. */
function CardHeader({
  tag,
  emoji,
  title,
  tom,
}: {
  tag: string;
  emoji: string;
  title: string;
  tom: Tom;
}) {
  const bom = tom === "bom";
  return (
    <div>
      <span
        className={
          bom
            ? "inline-block rounded-full bg-cta px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white"
            : "inline-block rounded-full bg-danger-vivid/12 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-danger"
        }
      >
        {tag}
      </span>
      <h3
        className={
          bom
            ? "mt-3 flex items-center gap-2.5 text-xl font-extrabold leading-tight text-green-ink sm:text-2xl"
            : "mt-3 flex items-center gap-2.5 text-lg font-extrabold leading-tight text-danger sm:text-xl"
        }
      >
        <span aria-hidden className="text-[1.6em] leading-none">
          {emoji}
        </span>
        {title}
      </h3>
    </div>
  );
}

/**
 * Um item da lista: emoji num quadradinho branco com o selinho ✕/✓ no canto.
 * O texto continua no tom cheio do card (vermelho ou verde) — com opacidade
 * menor, o vermelho sobre o rosado reprovava no contraste da WCAG AA.
 */
function Item({
  emoji,
  tom,
  children,
}: {
  emoji: string;
  tom: Tom;
  children: ReactNode;
}) {
  const bom = tom === "bom";
  const Selo = bom ? Check : X;
  return (
    <li
      className={
        bom
          ? "flex items-center gap-3 text-base font-bold leading-snug text-green-ink sm:text-[17px]"
          : "flex items-center gap-3 text-[15px] font-semibold leading-snug text-danger"
      }
    >
      <span
        aria-hidden
        className={
          bom
            ? "relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-[1.25rem] shadow-sm ring-1 ring-cta/25"
            : "relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-[1.25rem] shadow-sm ring-1 ring-danger-vivid/20"
        }
      >
        {emoji}
        <span
          className={
            bom
              ? "absolute -bottom-1 -right-1 flex size-[18px] items-center justify-center rounded-full bg-cta ring-2 ring-white"
              : "absolute -bottom-1 -right-1 flex size-[18px] items-center justify-center rounded-full bg-danger-vivid ring-2 ring-white"
          }
        >
          <Selo className="size-2.5 text-white" strokeWidth={5} />
        </span>
      </span>
      {children}
    </li>
  );
}
