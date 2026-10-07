import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Tracking } from "@/components/Tracking";
import { SITE_URL, BRAND_NAME } from "@/content";
import { OFFER_NAME, PRICES } from "@/offer";
import "./globals.css";

// Fonte única do site — Poppins (corpo + títulos). A lista de pesos é enxuta
// de propósito: cada peso vira um woff2 com preload no <head>, disputando
// banda com a primeira dobra num tráfego de anúncio em conexão lenta. O 500
// saiu: eram só 3 textos pequenos (`font-medium`), que passaram para o 400.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  display: "swap",
  variable: "--font-body",
});

const TITLE = OFFER_NAME;
const DESCRIPTION =
  "Transforme a mesa que você já tem em uma festa infantil linda. 150 projetos com antes e depois, lista de compras, medidas e mapa de montagem. Acesso imediato.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${TITLE} | Festa infantil na mesa que você já tem`,
  description: DESCRIPTION,
  applicationName: TITLE,
  keywords: [
    "festa na mesa",
    "mesa de festa infantil",
    "decoração de mesa de aniversário",
    "festa infantil em casa",
    "festa infantil simples",
    "festa infantil econômica",
    "decoração de aniversário pequena",
    "temas de festa infantil",
  ],
  alternates: { canonical: "/" },
  // Evita que o iOS transforme os preços em links de telefone.
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: BRAND_NAME,
    // ⚠️ REVISAR: falta a imagem de compartilhamento (1200x630) da nova
    // oferta. Coloque o arquivo em /public e declare `images` aqui — sem ela
    // o link compartilhado no WhatsApp/Instagram aparece sem miniatura.
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#2563EB",
  width: "device-width",
  initialScale: 1,
  // maximumScale NÃO é limitado de propósito: o usuário precisa poder dar
  // zoom (requisito de acessibilidade).
};

/**
 * Dados estruturados (Product) — rich results no Google.
 * Sem `aggregateRating`: não existe avaliação real coletada, e declarar uma
 * nota inventada aqui seria dado falso publicado em markup estruturado.
 */
const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: TITLE,
  description: DESCRIPTION,
  brand: { "@type": "Brand", name: BRAND_NAME },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "BRL",
    lowPrice: PRICES.basic.toFixed(2),
    highPrice: PRICES.premium.toFixed(2),
    offerCount: 2,
    availability: "https://schema.org/InStock",
    url: `${SITE_URL}/`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${poppins.variable} h-full scroll-smooth antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Resource hints das CDNs de terceiros.

            TODOS são `dns-prefetch`, nenhum é `preconnect`: depois que os
            scripts passaram para `lazyOnload` (ver o fim do <body>), nenhuma
            dessas origens é pedida antes do `load`. Um `preconnect` abre
            TCP+TLS na hora — no 4G lento seria handshake competindo com a
            imagem de LCP para uma origem que só vai ser usada depois. Com
            dns-prefetch o DNS já vem resolvido e o handshake fica para o
            momento em que a origem for realmente pedida. */}
        <link rel="dns-prefetch" href="https://cdn.utmify.com.br" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <link rel="dns-prefetch" href="https://scripts.clarity.ms" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://api6.ipify.org" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      </head>
      <body className="min-h-full" suppressHydrationWarning>
        <ScrollToTop />
        <Tracking />
        {children}

        {/* Destrava as animações decorativas (ver globals.css) no PRIMEIRO
            GESTO da visitante — rolar, tocar, clicar ou teclar — e não mais
            no `load`. Elas nascem pausadas para não roubar frame da pintura
            da primeira dobra (era o que segurava o LCP).

            Por que esperar o gesto: o float da hero e o pulso do CTA ficam
            DENTRO da primeira dobra e rodam em loop. Destravados no `load`,
            a tela nunca parava de mudar, e o Speed Index lia isso como
            página ainda carregando (4,1s com FCP de 1,0s). Quem chega do
            anúncio rola no primeiro segundo, então na prática a animação
            começa quase junto. Quem não mexe em nada ganha a animação pelo
            teto de 10s depois do `load`.

            Script inline e não componente cliente: roda uma vez e morre;
            virar componente custaria hidratação e bytes de bundle. O
            <noscript> garante que, sem JS, a página não fique com o
            carrossel congelado. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var E=['scroll','wheel','touchstart','pointerdown','keydown'],feito=false,t;" +
              "function a(){if(feito)return;feito=true;clearTimeout(t);" +
              "for(var i=0;i<E.length;i++)removeEventListener(E[i],a,true);" +
              "document.documentElement.classList.add('animar')}" +
              "for(var i=0;i<E.length;i++)addEventListener(E[i],a,{capture:true,passive:true});" +
              "function teto(){t=setTimeout(a,10000)}" +
              "if(document.readyState==='complete'){teto()}else{addEventListener('load',teto,{once:true})}})();",
          }}
        />
        <noscript>
          <style>{`.cta-pulse,.cta-attention::before,.hero-float,.marquee-track,.vsl-batida,.vsl-rastro{animation-play-state:running}`}</style>
        </noscript>

        {/* Acerta o POUSO da rolagem suave dos CTAs.

            As seções abaixo da dobra usam `content-visibility: auto` (ver
            globals.css): enquanto estão fora da tela o navegador usa a altura
            ESTIMADA delas, e troca pela real quando cada uma entra no
            enquadramento. A rolagem do `#planos` atravessa três dessas
            seções, então o alvo se move DURANTE a animação — e o clique
            parava ~110px depois do ponto certo, cortando o título do primeiro
            plano.

            A correção roda uma vez, quando a rolagem termina: se o alvo não
            estiver na posição pedida (respeitando o `scroll-mt` dele), faz um
            último ajuste suave. `scrollend` é o sinal exato; onde ele não
            existe (Safari mais antigo), um timer de 900ms cobre a duração
            típica da animação. Qualquer gesto de rolagem da pessoa no meio do
            caminho CANCELA o ajuste — quem assumiu a rolagem manda nela. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var TOL=8;" +
              "addEventListener('click',function(e){" +
              "var a=e.target&&e.target.closest&&e.target.closest('a[href^=\"#\"]');if(!a)return;" +
              "var id=a.getAttribute('href').slice(1);if(!id)return;" +
              "var alvo=document.getElementById(id);if(!alvo)return;" +
              "var cancelado=false;" +
              "function cancelar(){cancelado=true;limpar()}" +
              "function limpar(){removeEventListener('wheel',cancelar);removeEventListener('touchstart',cancelar);removeEventListener('keydown',cancelar)}" +
              "addEventListener('wheel',cancelar,{once:true,passive:true});" +
              "addEventListener('touchstart',cancelar,{once:true,passive:true});" +
              "addEventListener('keydown',cancelar,{once:true});" +
              "function corrigir(){limpar();if(cancelado)return;" +
              "var m=parseFloat(getComputedStyle(alvo).scrollMarginTop)||0;" +
              "if(Math.abs(alvo.getBoundingClientRect().top-m)>TOL)" +
              "alvo.scrollIntoView({block:'start',behavior:'smooth'})}" +
              "if('onscrollend' in window){addEventListener('scrollend',corrigir,{once:true})}" +
              "else{setTimeout(corrigir,900)}" +
              // Rede de segurança: se a rolagem nunca acontecer (o clique caiu
              // num alvo que já estava na posição), o `scrollend` não vem e as
              // três vigias de cancelamento ficariam registradas à toa.
              "setTimeout(limpar,4000)" +
              "},true)})();",
          }}
        />

        {/* `__aposGesto(fn)`: roda `fn` UMA vez, no primeiro gesto da
            visitante (rolar, tocar, clicar, teclar) ou 5s depois de ser
            chamada, o que vier antes. Hoje é o portão só do Clarity — o pixel
            da Utmify saiu dele (ver lá embaixo) porque o atraso custava
            PageViews.

            Por quê: medido no Lighthouse mobile, scripts de rastreamento
            pesados logo depois do `load` viravam tarefas longas — a maior
            parte do Total Blocking Time da página. `lazyOnload` sozinho não
            bastava: ele só tira o script da frente do LCP, mas a tarefa longa
            continuava caindo dentro da janela que o PageSpeed mede.

            O stub `clarity()` é criado na hora e guarda as chamadas feitas
            antes do script chegar. Inline e não `next/script`: precisa
            existir antes do `lazyOnload` abaixo, que o chama. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(w){var E=['scroll','wheel','touchstart','pointerdown','keydown'];" +
              "w.__aposGesto=function(fn){var feito=false,t;" +
              "function go(){if(feito)return;feito=true;clearTimeout(t);" +
              "for(var i=0;i<E.length;i++)w.removeEventListener(E[i],go,true);fn()}" +
              "for(var i=0;i<E.length;i++)w.addEventListener(E[i],go,{capture:true,passive:true});" +
              "t=setTimeout(go,5000)}})(window);",
          }}
        />

        {/* Pixel da Utmify já atualizado para a conta desta oferta
            (6abc7fa45ab9e61c3f4efef0). */}

        {/* Utmify — captura de UTMs.
            `lazyOnload` (era `afterInteractive`): em `afterInteractive` o Next
            põe um <link rel=preload as=script> no <head>, e esse preload entra
            com prioridade ALTA na mesma fila da imagem de LCP — mais um TLS
            handshake e 6,5 KB na frente da primeira dobra. Nada se perde: o
            link do checkout é reescrito com as UTMs no CLIQUE por withUtms()
            (lib/track.ts), lendo a URL da própria página. */}
        <Script
          src="https://cdn.utmify.com.br/scripts/utms/latest.js"
          strategy="lazyOnload"
          data-utmify-prevent-xcod-sck=""
          data-utmify-prevent-subids=""
        />

        {/* Microsoft Clarity — mapa de calor e gravação de sessão.
            Projeto desta oferta: yu7rdlbpqf (os antigos y3snimvd08 e xnmgji9f58 eram herdados
            de versões anteriores).

            ⚠️ Passou de `afterInteractive` para `lazyOnload`. O clarity.js
            custa 26 KB e UMA TAREFA LONGA de ~1s de JavaScript; em
            `afterInteractive` ela caía em cima da janela em que o navegador
            ainda tentava pintar a primeira dobra e empurrava o LCP sozinha.
            Em `lazyOnload` ele sobe depois do `load` — a gravação perde o
            primeiro segundo de sessão, mas começa muito antes de qualquer
            interação humana. Se algum dia o replay precisar do frame zero,
            é aqui que se volta para `afterInteractive` (e o LCP volta junto). */}
        {/* ⚠️ E, além do `lazyOnload`, o clarity.js só é PEDIDO no primeiro
            gesto da visitante (rolar, tocar, clicar, teclar) ou 5s depois do
            `load`, o que vier antes (`__aposGesto`, lá em cima). Mesmo depois do `load`, a tarefa longa
            dele caía dentro da janela que o PageSpeed mede e era a maior
            parcela do TBT. O stub `clarity()` é criado na hora, então
            qualquer chamada feita antes fica na fila e não se perde. O
            custo: a gravação começa no primeiro gesto, e não no `load`. */}
        <Script id="ms-clarity" strategy="lazyOnload">
          {`
            (function(c,l,a,r,i){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              c.__aposGesto(function(){
                var t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                var y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              });
            })(window, document, "clarity", "script", "yu7rdlbpqf");
          `}
        </Script>

        {/* Utmify — Pixel de conversão. É o ÚNICO pixel da Meta da página: o
            pixel.js injeta o fbevents.js e inicializa o pixel da Meta
            configurado no painel da Utmify (1572102274047011). O Meta Pixel
            próprio (881594511471095) saiu a pedido — com os dois, todo
            `fbq("track")` fazia broadcast e cada evento chegava em dobro.

            ⚠️ Não crie um stub de `fbq` antes deste script: o snippet da
            Meta aborta com `if(f.fbq)return`, e o fbevents.js nunca seria
            carregado.

            ⚠️ NÃO passa pelo `__aposGesto` nem espera o `load`
            (`afterInteractive`, sem atraso). Já passou: o PageSpeed melhorava,
            mas quem saía em poucos segundos sem tocar em nada não gerava
            PageView — o funil da Utmify mostrava só ~67% dos cliques virando
            visualização, e o Meta otimizava com dados a menos. O sinal para a
            campanha vale mais que a nota do Lighthouse. Inline (sem `src`),
            então o Next não põe preload na frente da imagem de LCP: o
            pixel.js entra `async`. */}
        <Script id="utmify-pixel" strategy="afterInteractive">
          {`
            window.pixelId = "6abc7fa45ab9e61c3f4efef0";
            (function () {
              var a = document.createElement("script");
              a.setAttribute("async", "");
              a.setAttribute("defer", "");
              a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
              document.head.appendChild(a);
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
