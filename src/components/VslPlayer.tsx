"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { PAGE_VARIANT, trackEvent } from "@/lib/track";

/**
 * VSL servida do NOSSO domínio: um <video> comum, sem Vimeo, sem YouTube.
 *
 * Por que trocamos o Vimeo por isto: o player deles custava ~300 KB de
 * script, mostrava a marca do Vimeo e sugeria outros vídeos no fim — numa
 * página de venda, sugestão de vídeo é porta de saída. Aqui os controles são
 * os do próprio navegador e o arquivo vem do mesmo domínio da página.
 *
 * ⚠️ Em troca, a banda passou a ser NOSSA: cada play baixa o arquivo da
 * Vercel. É por isso que o vsl.mp4 é 640px de largura e ~10 MB, e não o
 * original de 1080p e 69 MB — ver o aviso em `vsl`, no content.
 *
 * `preload="none"`: sem isto o navegador começaria a baixar o vídeo junto
 * com o resto da página, e quem nunca dá play pagaria os 10 MB. O que fica
 * na tela até o clique é a capa (`poster`), um webp de 75 KB.
 *
 * Os controles nativos só aparecem DEPOIS do play: antes disso, quem manda
 * na tela é a capa com o botão grande e a frase — a barra cinza do navegador
 * em cima da capa entregaria que ali tem um vídeo comum e roubaria o clique
 * do botão.
 */
export function VslPlayer({
  src,
  poster,
  label,
  aspect,
  className,
}: {
  /** Arquivo em /public, ex.: "/vsl.mp4". */
  src: string;
  /** Capa em /public — o primeiro quadro do vídeo. */
  poster: string;
  /** Chamada sobre a capa, UMA LINHA POR ITEM (ver `vsl.playLabel`). */
  label: readonly string[];
  /** largura/altura, ex.: 0.5625 para 9/16 (vertical). */
  aspect: number;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [iniciado, setIniciado] = useState(false);

  const tocar = () => {
    if (iniciado) return;
    trackEvent("vsl_play", { src });
    setIniciado(true);
    // O play vem de um clique da pessoa, então o navegador libera o som.
    // `catch` porque `play()` devolve promessa e pode ser rejeitada (ex.:
    // a pessoa sai da página antes de o vídeo começar) — rejeição solta
    // vira erro no console e nada mais.
    videoRef.current?.play().catch(() => {});
  };

  return (
    <div
      style={{ aspectRatio: String(aspect) }}
      className={`relative w-full overflow-hidden rounded-3xl bg-black shadow-[0_25px_60px_-20px_rgba(0,0,0,0.7)] ${className ?? ""}`}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload="none"
        playsInline
        controls={iniciado}
        /* Se a pessoa der play pelos controles nativos (ou pelo teclado), a
           capa sai do mesmo jeito. */
        onPlay={() => setIniciado(true)}
        className="absolute inset-0 size-full object-cover"
      />

      {iniciado ? null : (
        <button
          type="button"
          onClick={tocar}
          data-track-id="vsl-play"
          data-page-variant={PAGE_VARIANT}
          aria-label={label.join(" ")}
          className="group absolute inset-0 size-full cursor-pointer"
        >
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
