"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { PAGE_VARIANT, trackEvent } from "@/lib/track";

/**
 * VSL do Vimeo com CAPA (fachada): enquanto ninguém toca, o que está na tela
 * é uma imagem estática nossa; o player do Vimeo só é pedido no clique.
 *
 * Por que fachada e não o <iframe> direto: o player do Vimeo passa de 300 KB
 * entre script, CSS e requisições próprias, e um <iframe> no meio da página
 * começa a carregar junto com o resto. A capa é um webp de ~75 KB servido do
 * nosso domínio (cache imutável, ver next.config.ts). Quem não assiste não
 * paga nada pelo player.
 *
 * O autoplay do iframe é legítimo aqui: ele só entra na tela DEPOIS de um
 * clique da pessoa, que é o gesto que os navegadores exigem para liberar som.
 *
 * A caixa tem `aspectRatio` fixo e a troca acontece dentro dela, então nada
 * se move quando o player entra (CLS continua 0).
 */
export function VimeoVsl({
  videoId,
  poster,
  label,
  aspect,
  title,
  className,
}: {
  /** Título do iframe (lido por leitor de tela). */
  title: string;
  /** ID numérico do vídeo no Vimeo. */
  videoId: string;
  /** Capa em /public — o primeiro quadro do vídeo. */
  poster: string;
  /** Chamada sobre a capa, UMA LINHA POR ITEM (ver `vsl.playLabel`). */
  label: readonly string[];
  /** largura/altura, ex.: 0.5625 para 9/16 (vertical). */
  aspect: number;
  className?: string;
}) {
  const [tocando, setTocando] = useState(false);
  const aquecido = useRef(false);

  /*
   * Aquece a conexão com o Vimeo quando a pessoa MIRA na capa (ponteiro em
   * cima, dedo encostando, foco do teclado) — antes do clique. O DNS + TCP +
   * TLS das origens do player já estão prontos quando o iframe é pedido, e o
   * vídeo começa centenas de ms mais cedo no 4G. Nada disso acontece para
   * quem não chega perto do vídeo.
   */
  const aquecer = () => {
    if (aquecido.current) return;
    aquecido.current = true;
    for (const origem of [
      "https://player.vimeo.com",
      "https://i.vimeocdn.com",
      "https://f.vimeocdn.com",
    ]) {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = origem;
      document.head.appendChild(link);
    }
  };

  const tocar = () => {
    if (tocando) return;
    trackEvent("vsl_play", { video_id: videoId });
    setTocando(true);
  };

  return (
    <div
      style={{ aspectRatio: String(aspect) }}
      className={`relative w-full overflow-hidden rounded-3xl bg-black/40 shadow-[0_25px_60px_-20px_rgba(0,0,0,0.7)] ${className ?? ""}`}
    >
      {tocando ? (
        <iframe
          /* `autoplay=1` só porque veio de um clique. `loop=1`, `badge=0` e
             `autopause=0` são os mesmos do embed original do Vimeo. */
          src={`https://player.vimeo.com/video/${videoId}?autoplay=1&loop=1&badge=0&autopause=0&player_id=0&app_id=58479`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 size-full"
        />
      ) : (
        <button
          type="button"
          onClick={tocar}
          onPointerEnter={aquecer}
          onTouchStart={aquecer}
          onFocus={aquecer}
          data-track-id="vsl-play"
          data-page-variant={PAGE_VARIANT}
          aria-label={label.join(" ")}
          className="group absolute inset-0 size-full cursor-pointer"
        >
          <Image
            src={poster}
            alt=""
            fill
            sizes="(min-width: 640px) 320px, 88vw"
            quality={65}
            className="object-cover"
          />
          {/* Véu escuro: dá contraste para o play e para a frase sem esconder
              o que a capa mostra. */}
          <span className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" />

          <span className="absolute inset-0 flex flex-col items-center justify-center gap-5">
            {/* O play e os dois anéis dividem o mesmo centro: os anéis são
                irmãos do botão dentro desta caixa, cada um do tamanho dele. */}
            <span className="relative flex size-[76px] items-center justify-center">
              <span
                aria-hidden
                className="vsl-rastro absolute inset-0 rounded-full bg-white/70"
              />
              <span
                aria-hidden
                className="vsl-rastro vsl-rastro-2 absolute inset-0 rounded-full bg-white/50"
              />
              <span className="vsl-batida relative flex size-full items-center justify-center rounded-full bg-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)] transition-transform group-hover:scale-105">
                <Play
                  className="size-9 translate-x-0.5 fill-purple-ink text-purple-ink"
                  aria-hidden
                />
              </span>
            </span>
            {/* A caixa abraça o texto: a largura vem da linha mais longa, e
                a quebra vem do content (uma linha por item) — nunca do
                navegador. Sem isso a frase quebrava em lugar diferente a
                cada largura de tela. */}
            <span className="rounded-2xl bg-black/65 px-5 py-3 text-center font-cta text-[17px] uppercase leading-[1.2] tracking-wide text-white sm:text-[19px]">
              {label.map((linha) => (
                <span key={linha} className="block whitespace-nowrap">
                  {linha}
                </span>
              ))}
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
