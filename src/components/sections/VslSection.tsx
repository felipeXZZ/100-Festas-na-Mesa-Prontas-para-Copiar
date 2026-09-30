import { vsl } from "@/content";
import { Section, SectionHead } from "@/components/Section";
import { Highlight } from "@/components/Highlight";
import { CTAButton } from "@/components/CTAButton";
import { VimeoVsl } from "@/components/VimeoVsl";
import { PlaceholderImage } from "@/components/PlaceholderImage";

/**
 * 3. VSL — o vídeo de demonstração, no lugar do carrossel de pranchas.
 *
 * EM TESTE: substitui `ShowcaseCarousel` no page.tsx. O carrossel continua no
 * repositório e volta trocando a linha de lá — ver o comentário no page.tsx.
 *
 * EM TESTE de novo: fundo AZUL ESCURO (`bg-plum`), como o carrossel usava,
 * com título em branco e destaque dourado. A versão branca (título
 * `text-ink`, destaque em `purple-ink`, apoio em `text-ink-soft`) está no
 * histórico — é trocar o `bg` e as três cores de volta.
 *
 * A hero acima é creme e os bônus abaixo também: escura no meio, esta é a
 * única quebra de cor entre as duas.
 *
 * Fica FORA do `dobra-diferida` (o `content-visibility` do carrossel): o
 * vídeo é o argumento principal desta versão e precisa estar pintado quando
 * a pessoa chega nele, sem esperar o navegador materializar a seção.
 */
export function VslSection() {
  return (
    <Section bg="plum" id="vitrine">
      <SectionHead>
        {/* Sem eyebrow (o rótulo em maiúsculas acima do título), a pedido do
            dono: o título já diz a mesma coisa que ele dizia. */}
        <h2 className="font-display text-balance text-[1.75rem] leading-tight sm:text-4xl">
          <Highlight text={vsl.title} tone="gold" />
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-invert sm:text-base">
          {vsl.paragraph}
        </p>
      </SectionHead>

      {/* Vertical (9/16): a largura máxima é pequena de propósito — no
          desktop um vídeo vertical largo viraria uma coluna gigante. */}
      <div className="mx-auto mt-9 w-full max-w-[320px] sm:mt-11">
        {/* Sem `videoId`: espaço reservado na MESMA proporção do vídeo —
            ver o aviso PENDENTE em `vsl` no content.ts. */}
        {vsl.videoId ? (
          <VimeoVsl
            videoId={vsl.videoId}
            poster={vsl.poster}
            label={vsl.playLabel}
            aspect={vsl.aspect}
            title={vsl.iframeTitle}
          />
        ) : (
          <PlaceholderImage
            label={vsl.placeholder}
            ratio={String(vsl.aspect)}
            rounded="rounded-3xl"
          />
        )}
      </div>

      <div className="mt-9 flex justify-center">
        <CTAButton size="lg" href="#planos" location="vsl" trackId="vsl-plans">
          {vsl.cta}
        </CTAButton>
      </div>
    </Section>
  );
}
