import { BRAND_NAME } from "@/content";

/**
 * CAPA PROVISÓRIA DO PRODUTO — desenhada em CSS + SVG (sem arquivo).
 *
 * Entra no lugar do mockup enquanto `hero.mockup.src` / `plans.premium.image.src`
 * estiverem vazios: as artes antigas eram da oferta "+150 Festas Infantis".
 * Mesma ideia do BonusCover — é uma ILUSTRAÇÃO, não foto de festa montada.
 *
 * Ocupa um QUADRADO (a proporção 1254×1254 do mockup antigo), então trocar
 * pela arte real não mexe no layout. Tudo escala com a largura do quadrado
 * (unidades `cqw`), do card de plano (~300px) à hero (560px).
 */
export function ProductCover({
  label,
  bonusCount = 0,
  className,
}: {
  /** Texto alternativo (vem do content.ts). */
  label: string;
  /** > 0 mostra o selo "+ N bônus" (card do Pacote Completo). */
  bonusCount?: number;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`@container relative mx-auto aspect-square w-full ${className ?? ""}`}
    >
      <div className="absolute inset-y-[3%] left-1/2 flex w-[70%] -translate-x-1/2 overflow-hidden rounded-r-[3cqw] rounded-l-[1cqw] bg-white shadow-[0_6cqw_12cqw_-5cqw_rgba(11,30,91,0.55)] ring-1 ring-black/5">
        {/* Lombada */}
        <span aria-hidden className="w-[5.5%] shrink-0 bg-plum" />

        <div className="flex flex-1 flex-col items-center px-[5cqw] pb-[4cqw] pt-[5cqw] text-center">
          <span className="text-[2.4cqw] font-bold uppercase tracking-[0.18em] text-ink-soft">
            {BRAND_NAME}
          </span>

          <span className="font-display mt-[2.5cqw] text-[19cqw] leading-[0.85] text-purple-ink">
            150
          </span>
          <span className="font-display mt-[1cqw] text-[7.4cqw] uppercase leading-none text-plum">
            Festas na Mesa
          </span>
          <span className="mt-[2.2cqw] rounded-full bg-gold px-[3.5cqw] py-[1cqw] text-[3.6cqw] font-extrabold leading-tight text-ink">
            prontas para copiar
          </span>

          <TableArt />

          <ul className="mt-auto grid w-full grid-cols-2 gap-[1.4cqw] text-[2.5cqw] font-bold leading-tight text-plum">
            {["Antes e depois", "Lista de compras", "Mapa de montagem", "Custo estimado"].map(
              (t) => (
                <li key={t} className="rounded-[1.2cqw] bg-lilac px-[1cqw] py-[1.2cqw]">
                  {t}
                </li>
              ),
            )}
          </ul>
        </div>
      </div>

      {bonusCount > 0 && (
        <span className="absolute right-[2%] top-[20%] flex size-[24cqw] rotate-12 flex-col items-center justify-center rounded-full bg-gold text-center font-extrabold leading-none text-ink shadow-[0_2cqw_5cqw_-2cqw_rgba(0,0,0,0.5)] ring-[0.8cqw] ring-white">
          <span className="text-[7cqw]">+{bonusCount}</span>
          <span className="text-[3.6cqw] uppercase">bônus</span>
        </span>
      )}
    </div>
  );
}

/**
 * Mesa compacta: fundo pequeno de balões, bolo no centro, bandejas dos lados
 * — a proporção que a oferta vende (tudo cabe em cima de uma mesa comum).
 */
function TableArt() {
  return (
    <svg viewBox="0 0 200 110" className="mt-[2.5cqw] w-[82%]" aria-hidden>
      {/* balões atrás da mesa, na largura dela */}
      <g>
        <circle cx="46" cy="30" r="13" fill="#A5C4F5" />
        <circle cx="64" cy="20" r="11" fill="#3B82F6" />
        <circle cx="80" cy="30" r="9" fill="#F0B429" />
        <circle cx="154" cy="30" r="13" fill="#A5C4F5" />
        <circle cx="136" cy="20" r="11" fill="#3B82F6" />
        <circle cx="120" cy="30" r="9" fill="#F0B429" />
      </g>
      {/* bolo em boleira */}
      <rect x="84" y="44" width="32" height="12" rx="2" fill="#DCE6F7" />
      <rect x="88" y="34" width="24" height="11" rx="2" fill="#FFFFFF" stroke="#A5C4F5" />
      <rect x="99" y="27" width="2" height="7" fill="#F0B429" />
      <rect x="90" y="56" width="20" height="3" fill="#1D4ED8" />
      <rect x="98" y="59" width="4" height="7" fill="#1D4ED8" />
      {/* bandejas com doces */}
      <ellipse cx="52" cy="64" rx="20" ry="3.5" fill="#1D4ED8" />
      <circle cx="44" cy="59" r="4" fill="#F0B429" />
      <circle cx="53" cy="58" r="4" fill="#3B82F6" />
      <circle cx="62" cy="59" r="4" fill="#A5C4F5" />
      <ellipse cx="148" cy="64" rx="20" ry="3.5" fill="#1D4ED8" />
      <circle cx="140" cy="59" r="4" fill="#A5C4F5" />
      <circle cx="149" cy="58" r="4" fill="#F0B429" />
      <circle cx="158" cy="59" r="4" fill="#3B82F6" />
      {/* tampo e pés da mesa */}
      <rect x="18" y="66" width="164" height="7" rx="2" fill="#0B1E5B" />
      <rect x="28" y="73" width="6" height="34" fill="#0B1E5B" />
      <rect x="166" y="73" width="6" height="34" fill="#0B1E5B" />
    </svg>
  );
}
