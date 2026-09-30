import { UrgencyBar } from "@/components/sections/UrgencyBar";
import { HeroSection } from "@/components/sections/HeroSection";
import { ShowcaseCarousel } from "@/components/sections/ShowcaseCarousel";
import { PinterestComparison } from "@/components/sections/PinterestComparison";
import { BonusSection } from "@/components/sections/BonusSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { GuaranteeSection } from "@/components/sections/GuaranteeSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/sections/Footer";
import { CamadasDiferidas } from "@/components/CamadasDiferidas";

/**
 * "150 Festas na Mesa Prontas para Copiar" — landing page de venda.
 *
 * A ordem das seções é a jornada mental da visitante, e não uma lista de
 * blocos: quero uma festa bonita → achei que seria caro → cabe na mesa que
 * eu tenho → tem 150 modelos → não preciso criar nada → vou saber o que comprar
 * → vou saber montar → ainda ganho materiais extras → custa menos que
 * contratar decoração → posso comprar agora.
 *
 * Todo o texto vive em src/content.ts.
 */
export default function Home() {
  return (
    <>
      <UrgencyBar />
      <main>
        {/* 2 · "Sua próxima festa pode ser mais simples do que parece" */}
        <HeroSection />
        {/* 3 · Vitrine em carrossel (voltou no lugar da VSL, a pedido). Para
            voltar à VSL: troque <ShowcaseCarousel /> por <VslSection /> e o
            import lá em cima. Os dois componentes continuam no repositório,
            e cada um traz o próprio bloco no content.ts (`showcase` e `vsl`).
            ⚠️ As pranchas ainda são as da oferta de 150 festas — ver o
            aviso em `showcase.items`. */}
        <ShowcaseCarousel />
        {/* 4 · Antes e depois — o Pinterest mostra a festa; nós mostramos
            como fazer */}
        <PinterestComparison />
        {/* 8 · Ainda recebo materiais extras */}
        <BonusSection />
        {/* 9 · Prova social (espaços reservados p/ material real) */}
        <TestimonialsSection />
        {/* 10 · Custa muito menos que contratar decoração */}
        <PricingSection />
        {/* 11 · Sem risco */}
        <GuaranteeSection />
        {/* 12 · Dúvidas */}
        <FAQSection />
        {/* 13 · Posso comprar agora */}
        <FinalCTA />
        {/* 14 · Rodapé */}
        <Footer />
      </main>
      {/* As duas CAMADAS da página, carregadas FORA do pacote inicial (ver
          CamadasDiferidas): o popup de R$17 que sobe sozinho depois de um
          tempo na página ou quando o ponteiro vai sair pelo topo, e o
          balãozinho de "fulana acabou de comprar" no canto inferior esquerdo,
          a partir de 5s. Ficam FORA do <main> porque não são conteúdo da
          página: são camadas por cima dela — e o popup fica ACIMA do balão no
          empilhamento. ⚠️ O balão AFIRMA vendas: ver o aviso em
          purchaseNotifications, no content.ts. */}
      <CamadasDiferidas />
      {/* Seções desligadas a pedido — os componentes continuam em
          components/sections/ e voltam com um import + a linha aqui:
            <StickyMobileCTA />   barra fixa de CTA no celular
            <ProjectGallery />    galeria ilustrada "veja alguns dos projetos"
            <VideoSection />      vídeo demonstrativo (ainda sem vídeo real)
            <ProjectInside />     "cada projeto mostra como chegar ao resultado"
            <ThreeSteps />        "da escolha do tema à festa pronta em 3
                                  passos" — saiu quando a VSL entrou: o vídeo
                                  mostra os mesmos 3 passos acontecendo, e a
                                  seção repetia em texto o que ele já mostra
          ProjectGallery, VideoSection e ProjectInside saíram porque a
          vitrine em carrossel logo abaixo da hero já mostra as pranchas
          REAIS — as ilustrações vetoriais e o espaço reservado do vídeo
          repetiam o argumento com material mais fraco. */}
    </>
  );
}
