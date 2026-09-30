import { showcase } from "@/content";
import { Eyebrow } from "@/components/Eyebrow";
import { Highlight } from "@/components/Highlight";
import { CTAButton } from "@/components/CTAButton";
import { PAGE_VARIANT } from "@/lib/track";
import { cn } from "@/lib/utils";

/**
 * Proporção real das pranchas (1055 × 1491), na maior largura gerada — fixa o
 * espaço do card e evita CLS. As duas larguras saem do `npm run carrosel`.
 */
const SHEET_W = 640;
const SHEET_H = 904;

/** Uma volta completa da faixa. As duas correm no MESMO tempo (e, como têm o
 *  mesmo número de cards, na mesma velocidade) — só mudam de sentido. */
const DURACAO = "17s";

type Item = (typeof showcase.items)[number];

/**
 * 2.5 VITRINE — carrossel duplo logo abaixo da hero.
 *
 * Duas faixas correndo em sentidos opostos: é o movimento que segura o olho
 * na dobra seguinte à hero e, ao mesmo tempo, entrega VOLUME (muitas festas
 * diferentes passando) e PROVA (as páginas são reais, dá pra ver o antes e
 * depois) antes de pedir qualquer coisa.
 *
 * Por que duas faixas e não uma: uma faixa só lê como "banner decorativo";
 * duas, em sentidos contrários, leem como catálogo grande. As velocidades são
 * diferentes de propósito — iguais, as faixas "espelham" e o olho percebe a
 * repetição.
 *
 * Fundo AZUL PROFUNDO: a hero é creme e as pranchas também são claras. Sobre
 * o creme elas sumiriam; sobre o azul, cada card vira um retângulo branco
 * recortado — e o CTA verde fica o ponto mais quente da tela.
 *
 * Zero JavaScript: animação em CSS (globals.css), pausa no hover e, com
 * `prefers-reduced-motion`, as faixas param e viram rolagem manual.
 */
export function ShowcaseCarousel() {
  // Índices pares na faixa de cima, ímpares na de baixo (ver nota em content.ts).
  const topRow = showcase.items.filter((_, i) => i % 2 === 0);
  const bottomRow = showcase.items.filter((_, i) => i % 2 === 1);

  return (
    <section
      id="vitrine"
      className="dobra-diferida [--altura-estimada:817px] relative overflow-hidden bg-plum py-14 text-white sm:py-20"
    >
      <div className="mx-auto max-w-2xl px-5 text-center">
        <Eyebrow tone="gold">{showcase.eyebrow}</Eyebrow>
        <h2 className="font-display text-balance mt-3 text-[1.75rem] leading-tight sm:text-4xl">
          <Highlight text={showcase.title} tone="gold" />
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-invert sm:text-base">
          {showcase.paragraph}
        </p>
      </div>

      {/* As faixas sangram até a borda da tela de propósito: cortadas nos dois
          lados, elas sugerem que continuam para fora do enquadramento. */}
      <div className="faixas mt-9 flex flex-col gap-3 sm:mt-11 sm:gap-4">
        <Row items={topRow} />
        <Row items={bottomRow} reverse />
      </div>

      <DeferirPranchas />

      {/* Sem JS as faixas ficam com as caixas vazias (as <img> nascem sem
          `src`): escondemos as faixas e mostramos a grade estática no lugar.
          Os dois <noscript> são inertes quando há JavaScript. */}
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<style>#vitrine .faixas{display:none}</style>`,
        }}
      />
      <VitrineSemJs />

      <div className="mt-10 px-5">
        <div className="flex justify-center">
          <CTAButton
            size="lg"
            href="#planos"
            location="showcase"
            trackId="showcase-plans"
          >
            {showcase.cta}
          </CTAButton>
        </div>

      </div>
    </section>
  );
}

/**
 * Uma faixa em loop contínuo. A lista é duplicada e o trilho anda até -50%,
 * então a segunda metade assume exatamente onde a primeira parou.
 *
 * A margem vai em TODOS os cards (inclusive o último) em vez de `gap`: com
 * `gap`, o trilho fica com um vão a menos que o número de cards e o -50%
 * cairia fora do ponto, criando um "pulo" a cada volta.
 */
function Row({
  items,
  reverse = false,
}: {
  items: Item[];
  reverse?: boolean;
}) {
  const loop = [...items, ...items];

  return (
    <div className="marquee-mask edge-fade no-scrollbar relative w-full overflow-hidden">
      <ul
        className={cn("marquee-track flex w-max", reverse && "marquee-reverse")}
        style={{ "--marquee-duration": DURACAO } as React.CSSProperties}
      >
        {loop.map((item, i) => {
          const duplicate = i >= items.length;
          return (
            <li
              key={i}
              aria-hidden={duplicate}
              className="mr-3 w-[190px] shrink-0 sm:mr-4 sm:w-[250px] lg:w-[290px]"
            >
              <a
                href="#planos"
                tabIndex={duplicate ? -1 : undefined}
                data-cta-location="showcase-card"
                data-track-id="showcase-card-plans"
                data-page-variant={PAGE_VARIANT}
                className="block overflow-hidden rounded-2xl bg-white shadow-[0_18px_40px_-18px_rgba(0,0,0,0.75)] ring-1 ring-white/15 transition-transform duration-200 hover:-translate-y-1"
              >
                {/* <img> em vez de next/image DE PROPÓSITO: as pranchas já
                    saem prontas do `npm run carrosel` nas duas larguras que os
                    cards usam. Passá-las pelo otimizador faria o servidor
                    processar 16 imagens a cada `npm run dev` frio — e é o
                    otimizador que derrubava o dev. Assim o navegador baixa
                    arquivo estático (com cache imutável, ver next.config.ts) e
                    nem o dev nem a Vercel fazem trabalho nenhum. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  /* SEM `src` no HTML — o endereço fica em `data-src` e só
                     vira `src` quando a vitrine chega perto da tela (ver
                     DeferirPranchas no fim do arquivo).

                     Por que não `loading="lazy"` com `src` de verdade: o
                     limiar do lazy do Chrome é de ~1250px abaixo da tela, e a
                     vitrine começa a ~940px — ou seja, DENTRO do limiar. No
                     trace as 16 pranchas (~480KB) apareciam baixando junto com
                     a imagem de LCP da hero, exatamente o que o `lazy` deveria
                     ter evitado. Sem `src` não existe request para o navegador
                     antecipar, e a janela do LCP fica só com a hero.

                     A caixa do card NÃO fica vazia por isso: `width`/`height`
                     abaixo dão a proporção, então o espaço já está reservado
                     (CLS continua 0) — o que falta é só o pixel. */
                  data-src={`/carrosel/${item.slug}-640.webp`}
                  data-srcset={`/carrosel/${item.slug}-400.webp 400w, /carrosel/${item.slug}-640.webp 640w`}
                  sizes="(min-width: 1024px) 290px, (min-width: 640px) 250px, 190px"
                  alt={
                    duplicate
                      ? ""
                      : `${item.code}, festa com tema ${item.name}: antes e depois, lista de materiais e custo estimado`
                  }
                  width={SHEET_W}
                  height={SHEET_H}
                  decoding="async"
                  data-carrosel-prancha=""
                  className="h-auto w-full"
                />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Preenche o `src` das pranchas quando a vitrine se aproxima da tela.
 *
 * As <img> nascem SEM `src` (só `data-src`/`data-srcset`) para não existirem
 * como request na janela em que o navegador ainda tenta pintar a hero — ver a
 * nota longa na <img> do <Row>. Este script devolve o endereço a elas.
 *
 * São TRÊS condições em série, e cada uma existe por um motivo:
 *
 *  1. IntersectionObserver na seção, com 600px de folga — quem nunca rola a
 *     página não baixa 480KB de prancha. (No celular a vitrine começa só
 *     ~120px abaixo da dobra, então na prática esta condição já nasce
 *     satisfeita; ela conta mesmo é em tela grande e para quem sai rápido.)
 *  2. Evento `load` — a imagem de LCP da hero segura o `load`, então esperar
 *     por ele garante que as pranchas nunca disputem banda com ela. É a
 *     condição que realmente protege o LCP em 4G lento.
 *  3. `requestIdleCallback` — espera a thread esvaziar antes de disparar 16
 *     downloads, senão o preenchimento cai no aperto da hidratação. Sem rIC
 *     no navegador, o fallback é um setTimeout curto.
 *
 * As DUAS faixas são preenchidas de uma vez — carregar por card não serve,
 * porque o `overflow` da faixa esconde do observer as pranchas fora do
 * enquadramento e o carrossel giraria com buracos.
 *
 * Script inline e não componente cliente: roda uma vez e morre — virar
 * componente cliente custaria hidratação e mais bytes de bundle do que o
 * próprio script.
 */
function DeferirPranchas() {
  const codigo =
    "(function(){var f=false;function s(){if(f)return;f=true;" +
    "var i=document.querySelectorAll('img[data-carrosel-prancha]');" +
    "for(var n=0;n<i.length;n++){var m=i[n];" +
    "if(m.dataset.srcset)m.srcset=m.dataset.srcset;if(m.dataset.src)m.src=m.dataset.src;}}" +
    "function ocioso(){(window.requestIdleCallback||function(c){setTimeout(c,80)})(s,{timeout:1500})}" +
    "function q(){if(document.readyState==='complete'){ocioso()}" +
    "else{addEventListener('load',ocioso,{once:true})}}" +
    "var e=document.getElementById('vitrine');" +
    "if(!e||!('IntersectionObserver' in window)){q();return}" +
    "var o=new IntersectionObserver(function(en){if(en[0].isIntersecting){o.disconnect();q()}}," +
    "{rootMargin:'600px 0px'});o.observe(e)})();";
  return <script dangerouslySetInnerHTML={{ __html: codigo }} />;
}

/**
 * Vitrine para quem está sem JavaScript.
 *
 * Sem o script acima as <img> ficam sem `src` e as faixas apareceriam vazias.
 * O conteúdo de um <noscript> NÃO vira DOM quando há JavaScript (o parser o
 * trata como texto cru), então isto não custa request nem elemento nenhum no
 * caso normal — só os bytes comprimidos do markup.
 *
 * É uma grade estática, e não o carrossel: sem JS as faixas não animam de
 * qualquer forma, e a grade mostra as mesmas pranchas sem depender de
 * movimento.
 */
function VitrineSemJs() {
  // A lista repete pranchas para encher as duas faixas; a grade mostra cada
  // uma só uma vez.
  const cards = showcase.items
    .filter((item, i, all) => all.findIndex((x) => x.slug === item.slug) === i)
    .map(
      (item) =>
        `<li><img src="/carrosel/${item.slug}-400.webp" width="${SHEET_W}" height="${SHEET_H}" loading="lazy" decoding="async" alt="${item.code}: festa com tema ${item.name}" style="height:auto;width:100%;border-radius:1rem;background:#fff"></li>`,
    )
    .join("");

  return (
    <noscript
      dangerouslySetInnerHTML={{
        __html: `<ul style="display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem;max-width:42rem;margin:2.25rem auto 0;padding:0 1.25rem;list-style:none">${cards}</ul>`,
      }}
    />
  );
}
