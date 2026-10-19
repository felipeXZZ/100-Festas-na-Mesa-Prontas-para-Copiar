"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { Gift, Timer, X } from "lucide-react";
import {
  upsell,
  upsellAuto,
  bonuses,
  BASIC_CHECKOUT_URL,
  UPSELL_CHECKOUT_URL,
} from "@/content";
import { PRICES } from "@/offer";
import { PAGE_VARIANT, trackEvent } from "@/lib/track";

/**
 * Popup de UPSELL — o Plano Completo (com os 5 bônus) por PRICES.upsell.
 *
 * É UMA tela só, igual nos dois caminhos de entrada:
 *
 *  - `BasicCtaWithUpsell` — a pessoa clicou no plano Básico (PRICES.basic);
 *  - `AutoUpsellPopup` — ninguém pediu a oferta (demorou no site ou foi sair).
 *
 * Em ambos:
 *      aceitar → PRICES.upsell (`UPSELL_CHECKOUT_URL`)
 *      recusar → checkout do Básico (PRICES.basic)
 *      fechar  → o popup acaba e a pessoa volta para a página
 *
 * O segundo degrau de R$ 12,90, que aparecia para quem fechava, foi RETIRADO:
 * fechar agora fecha, e só. Se um dia voltar, volta com tela e checkout
 * próprios — não reaproveite os desta.
 *
 * A tela não trava o fechar. O diálogo sabe travar (`Oferta.travaFecharMs`),
 * mas nenhuma oferta usa — e com uma tela só isso importa ainda mais: quem
 * não consegue sair do popup fecha a ABA, e aí não volta mais.
 *
 * A tela também não tem prazo. O diálogo sabe contar (`Oferta.expiraMs`),
 * mas a oferta de hoje não usa — ver o porquê em `upsell`, no content. Se
 * voltar, lembre que zerar NÃO é fechar: o fim do prazo só apaga o popup, e
 * quem não fez gesto nenhum não é mandada para checkout nenhum.
 *
 * O caminho muda só o texto da recusa; a oferta em si é a mesma para todo
 * mundo.
 *
 * Recusar continua sendo um link de verdade, e não um "fechar disfarçado":
 * quem quer só os projetos vai para o checkout do Básico sem obstáculo.
 *
 * Os data-* são lidos pelo Tracking central (cta_click, checkout_redirect e
 * InitiateCheckout com o valor certo). O `data-cta-location` do "sim" é
 * `upsell-accept`, e ele PRECISA existir no mapa de valores do Tracking.tsx
 * valendo PRICES.upsell. Sem a linha de lá, a venda vai para o Meta com o valor do Básico.
 */

/**
 * Quantos diálogos de upsell estão abertos agora. O popup automático lê isto
 * para não subir por cima do que a pessoa abriu no clique.
 */
let dialogsAbertos = 0;

type DialogProps = {
  open: boolean;
  /**
   * Precisa ser memoizado (useCallback) — ver o efeito lá embaixo.
   * Só é chamado quando a trava já passou (ver `oferta.travaFecharMs`):
   * enquanto ela corre, o Esc, o clique fora e o X nem chegam aqui.
   */
  onClose: () => void;
  /**
   * Ref do elemento que recebe o foco de volta ao fechar (quando houve um).
   * É a REF, e não o elemento: ler `.current` no render é proibido, e aqui
   * ele só é lido dentro do efeito, na hora certa.
   */
  openerRef?: RefObject<HTMLElement | null>;
  /** Texto do link de recusa — muda conforme quem abriu o popup. */
  decline: string;
  /** Sufixo dos data-track-id, para separar os caminhos no relatório. */
  origem: string;
  /** A oferta em si — a mesma para os dois caminhos. */
  oferta: Oferta;
  /**
   * Chamado quando o cronômetro zera. Precisa FECHAR o popup de vez: é o que
   * faz o prazo ser real. Sem ele, o contador nem é renderizado — melhor
   * nenhum relógio do que um relógio que não cumpre. Memoizado, como o
   * `onClose`.
   */
  onExpire?: () => void;
};

/**
 * A oferta inteira num lugar só — texto, preço e destino do "sim". Ficam
 * juntos de propósito: assim não existe como o texto de um preço apontar para
 * o checkout de outro. Hoje há uma oferta só (`OFERTA_POPUP`); o tipo existe
 * para que uma segunda, se um dia voltar, nasça completa em vez de herdar
 * pedaços desta.
 */
type Oferta = {
  /** Faixa azul do topo, sob o ícone de presente. */
  eyebrow: string;
  /** O que o Básico deixa de fora, na caixa vermelha (festas + bônus). */
  missing: string[];
  /** Caixa verde: "Por apenas + R$ X, destrave o" / NOME / nota. */
  upgradeLine: string;
  upgradeName: string;
  upgradeNote: string;
  /**
   * Quando presente, a oferta tem prazo DE VERDADE: o cronômetro aparece e,
   * ao zerar, o popup fecha. Sem isto, nenhum contador é renderizado — é o
   * caso da oferta de hoje (ver `upsell`, no content).
   */
  expiraMs?: number;
  countdownNote?: string;
  /**
   * Por quantos ms a oferta NÃO pode ser dispensada: sem X, sem Esc e sem
   * clique fora. Passado o tempo, o X aparece e os três voltam a valer.
   * Ausente ou 0 = fecha desde o primeiro instante — é o caso da tela de
   * hoje. ⚠️ Preencher isto tira o X da tela pelo tempo que marcar, e
   * precisa ficar MENOR que `expiraMs`: senão o popup some antes de o botão
   * de fechar sequer aparecer.
   */
  travaFecharMs?: number;
  cta: string;
  href: string;
  /** Define o valor do InitiateCheckout no Tracking.tsx. */
  ctaLocation: string;
  /** Sufixo do data-track-id do "sim" — carrega o preço em centavos. */
  trackId: string;
};

/* As festas que faltam (se faltar alguma) e os 5 bônus por extenso: é o que
   fica de fora que precisa justificar a troca de plano. `missingProjects`
   vazio some da lista. */
const FALTA_NO_BASICO = [
  upsell.missingProjects,
  ...bonuses.items.map((b) => b.title),
].filter(Boolean);
const NOTA_BONUS = `${upsell.upgradeNote} ${bonuses.totalValue})`;

/** A oferta — a mesma para quem clicou no Básico e para quem não pediu nada. */
const OFERTA_POPUP: Oferta = {
  eyebrow: upsell.eyebrow,
  /* Sem `expiraMs`: nenhum cronômetro — ver `upsell`, no content. */
  missing: FALTA_NO_BASICO,
  upgradeLine: upsell.upgradeLine,
  upgradeName: upsell.upgradeName,
  upgradeNote: NOTA_BONUS,
  cta: upsell.cta,
  href: UPSELL_CHECKOUT_URL,
  ctaLocation: "upsell-accept",
  trackId: `upsell-premium-${Math.round(PRICES.upsell * 100)}`,
};

/**
 * Cola o "R$" no número com espaço INQUEBRÁVEL.
 *
 * Sem isto, uma frase que não coube na linha quebra bem no meio do valor —
 * "R$" no fim de uma linha e "29,90" no começo da outra. O preço é o
 * argumento da tela: ele não pode ser a parte que se parte.
 *
 * Não substitui frase curta: texto que estoura a caixa continua quebrando,
 * só que entre palavras.
 */
// O \u00A0 vai escrito como ESCAPE, e nunca como um NBSP digitado direto: no
// código-fonte ele é invisível, e quem mexer aqui depois o apagaria sem ver.
const valorInteiro = (texto: string) => texto.replace(/R\$\s+/g, "R$\u00A0");

/**
 * Cronômetro da oferta com prazo. Conta a partir do momento em que ENTRA na
 * tela (é aí que ele monta), e não do carregamento da página.
 *
 * Ao zerar chama `onFim` — e quem passa esse callback fecha o popup. É o que
 * mantém a frase honesta: a oferta acaba de verdade quando o tempo acaba, em
 * vez de o número travar em 00:00 e continuar comprável (contador de mentira
 * é justamente o que o `Countdown` da barra de urgência se recusa a fazer).
 */
function ContadorOferta({ ms, onFim }: { ms: number; onFim: () => void }) {
  const [restante, setRestante] = useState(ms);

  useEffect(() => {
    // O fim é um instante fixo, e não uma soma de intervalos: aba em segundo
    // plano estrangula o setInterval, e contar "menos 1" a cada disparo faria
    // o relógio atrasar junto.
    const fim = Date.now() + ms;
    const tick = () => {
      const falta = fim - Date.now();
      if (falta <= 0) {
        clearInterval(id);
        setRestante(0);
        onFim();
        return;
      }
      setRestante(falta);
    };
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [ms, onFim]);

  const total = Math.ceil(restante / 1000);
  const mm = String(Math.floor(total / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");

  return (
    <span className="tabular-nums" aria-hidden>
      {mm}:{ss}
    </span>
  );
}

function UpsellDialog({
  open,
  onClose,
  openerRef,
  decline,
  origem,
  oferta,
  onExpire,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const acceptRef = useRef<HTMLAnchorElement>(null);

  /**
   * A trava de fechar da oferta. Enquanto `podeFechar` é falso não há X, o
   * clique fora não é escutado e o Esc não responde; quando o relógio libera,
   * os três voltam juntos. Hoje nenhuma oferta trava (ver o topo do arquivo);
   * o mecanismo fica de pé para o dia em que uma travar.
   *
   * O estado é ajustado no RENDER (e não num efeito) porque a oferta pode
   * trocar com o diálogo já na tela: esperar o efeito deixaria o X da oferta
   * anterior aparecer por um quadro em cima da nova — justo o botão que a
   * trava existe para tirar. É o padrão de "resetar estado quando a prop muda".
   */
  const trava = oferta.travaFecharMs ?? 0;
  const [travaAtual, setTravaAtual] = useState(trava);
  const [podeFechar, setPodeFechar] = useState(trava <= 0);
  if (travaAtual !== trava) {
    setTravaAtual(trava);
    setPodeFechar(trava <= 0);
  }

  useEffect(() => {
    if (trava <= 0) return;
    const id = setTimeout(() => setPodeFechar(true), trava);
    return () => clearTimeout(id);
  }, [trava]);

  /**
   * O mesmo valor para o handler de tecla ler. Vai por REF de propósito: se
   * `podeFechar` entrasse nas dependências do efeito abaixo, o efeito rodaria
   * de novo ao liberar (e na troca de oferta) — e o cleanup devolveria o foco
   * ao botão que abriu o popup, com a oferta ainda na tela.
   */
  const podeFecharRef = useRef(podeFechar);
  useEffect(() => {
    podeFecharRef.current = podeFechar;
  }, [podeFechar]);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    // Guardado agora: no cleanup, a ref já pode apontar para outra coisa.
    const paraFocar = openerRef?.current;
    dialogsAbertos += 1;
    document.body.style.overflow = "hidden";
    acceptRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Durante a trava o Esc não fecha — some com o popup pelo teclado
        // seria uma saída que a tela não está oferecendo a ninguém.
        if (podeFecharRef.current) onClose();
        return;
      }
      // Prende o Tab dentro do popup enquanto ele estiver aberto.
      if (e.key !== "Tab") return;
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      dialogsAbertos -= 1;
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      paraFocar?.focus();
    };
    // `onClose` vem memoizado dos dois chamadores: sem isso, cada render do
    // pai refaria este efeito e o cleanup roubaria o foco de volta ao botão.
    // A OFERTA de propósito não entra aqui: se um dia o conteúdo trocar com o
    // diálogo aberto, refazer o efeito devolveria o foco ao botão do Básico
    // bem na hora em que a nova oferta aparece.
  }, [open, onClose, openerRef]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
      /* Sem handler enquanto a trava corre: clicar fora ali não é uma
         escolha, é o reflexo de quem já dispensou a tela anterior. */
      onClick={podeFechar ? onClose : undefined}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={oferta.eyebrow}
        onClick={(e) => e.stopPropagation()}
        /* Cartão branco com topo AZUL: o azul é a cor da marca, e o vermelho
           fica guardado para o que a pessoa PERDE (a lista abaixo) — assim
           as duas cores contam a história sem disputar. `overflow-hidden`
           faz o topo encostar na borda arredondada. */
        className="relative my-auto w-full max-w-md overflow-hidden rounded-3xl bg-white text-center shadow-2xl"
      >
        {/* Topo: ícone + a frase. `px-11` guarda o lugar do X — e continua
            guardando enquanto ele ainda não existe, para o texto não se
            remontar na hora em que o botão aparecer. */}
        <div className="relative bg-gradient-to-b from-purple-ink to-plum px-11 pb-4 pt-4">
          <span
            aria-hidden
            className="mx-auto flex size-10 items-center justify-center rounded-xl bg-white/15 text-white"
          >
            <Gift className="size-5" />
          </span>
          <p className="mt-2 text-balance text-[15px] font-extrabold leading-snug text-white sm:text-[17px]">
            {oferta.eyebrow}
          </p>
          {podeFechar ? (
            <button
              type="button"
              onClick={onClose}
              aria-label={upsell.closeLabel}
              className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/30"
            >
              <X className="size-[18px]" aria-hidden />
            </button>
          ) : null}
        </div>

        <div className="p-5 sm:p-6">
          {/* Cronômetro — só existe na oferta que tem prazo de verdade. */}
          {oferta.expiraMs && onExpire ? (
            <div className="mb-4 flex flex-col items-center gap-1">
              <p className="inline-flex items-center gap-2 rounded-full bg-danger-vivid px-4 py-1.5 font-display text-[1.35rem] leading-none text-white shadow-[0_6px_16px_-6px_rgba(198,43,36,0.8)]">
                <Timer className="size-[18px] animate-pulse" aria-hidden />
                <ContadorOferta ms={oferta.expiraMs} onFim={onExpire} />
              </p>
              {oferta.countdownNote ? (
                <p className="text-balance text-[11px] font-bold uppercase tracking-wide text-danger-vivid">
                  {valorInteiro(oferta.countdownNote)}
                </p>
              ) : null}
            </div>
          ) : null}

          {/* O que fica de fora. É o argumento da tela: a pessoa lê o que
              PERDE antes de ler o preço de levar tudo. */}
          <h3 className="text-[15px] font-extrabold uppercase tracking-wide text-ink sm:text-base">
            {upsell.missingLead}{" "}
            <span className="text-danger-vivid">{upsell.missingEmphasis}</span>
          </h3>
          <ul className="mt-3 space-y-2 rounded-2xl border border-danger/15 bg-danger/[0.05] px-4 py-3.5 text-left">
            {oferta.missing.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-[13px] font-bold leading-snug text-danger"
              >
                <X className="mt-px size-4 shrink-0" strokeWidth={3} aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Quanto custa a mais levar tudo — a diferença, e não o preço
              cheio: "+ R$ 7" pesa menos que "R$ 17". */}
          <div className="mt-4 rounded-2xl border border-cta/30 bg-green-soft px-4 py-3.5">
            <p className="text-[13px] font-bold leading-snug text-green-ink">
              {valorInteiro(oferta.upgradeLine)}
            </p>
            <p className="font-display mt-1 text-[1.6rem] uppercase leading-none text-green-ink sm:text-[1.8rem]">
              {oferta.upgradeName}
            </p>
            <p className="mt-1.5 text-[12px] font-semibold leading-snug text-ink-soft">
              {valorInteiro(oferta.upgradeNote)}
            </p>
          </div>

          {/* Aceitar — Pacote Completo pelo preço da oferta. Pode quebrar em
              duas linhas (`text-balance` divide por igual); o que não pode é
              o valor se partir — `valorInteiro` cola o "R$" no número. */}
          <a
            ref={acceptRef}
            href={oferta.href}
            data-cta-location={oferta.ctaLocation}
            data-track-id={`${oferta.trackId}-${origem}`}
            data-page-variant={PAGE_VARIANT}
            className="mt-5 flex min-h-[56px] w-full items-center justify-center text-balance rounded-2xl bg-gradient-to-b from-cta to-cta-dark px-4 py-3.5 text-center text-[15px] font-extrabold leading-tight text-white shadow-[0_12px_28px_-8px_rgba(34,180,85,0.65)] ring-1 ring-inset ring-white/25 transition hover:-translate-y-0.5 hover:brightness-110 sm:px-5"
          >
            {valorInteiro(oferta.cta)}
          </a>

          {/* Recusar — segue com o Básico (PRICES.basic). Continua sendo um link
              de verdade, com corpo de botão, mas BRANCO e de contorno: quem
              quer só o básico acha o caminho, e o verde segue sendo o óbvio.
              Vai DIRETO ao checkout do Básico. */}
          <a
            href={BASIC_CHECKOUT_URL}
            data-cta-location="upsell-decline"
            data-track-id={`basic-checkout-1000-${origem}`}
            data-page-variant={PAGE_VARIANT}
            className="mt-3 flex min-h-[46px] w-full items-center justify-center text-balance rounded-xl border border-border bg-white px-4 py-2.5 text-center text-[13px] font-bold leading-snug text-ink-soft transition hover:bg-cream"
          >
            {valorInteiro(decline)}
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * O funil, que tem UM degrau só: a oferta de PRICES.upsell. Fechar encerra o popup
 * e devolve a pessoa para a página — ninguém é mandado a um checkout sem
 * clicar.
 *
 * Já houve aqui um segundo degrau (R$ 12,90 para quem fechava). Ele saiu: a
 * segunda tela era a primeira repetida mais barata, e ensinava que fechar
 * barateia. Se um dia voltar, precisa de tela e checkout próprios.
 *
 * `fechar` PRECISA ser memoizado: o efeito do diálogo depende dele, e um
 * `onClose` novo a cada render refaria o efeito (roubando o foco de volta
 * para o botão que abriu).
 */
function useFunilUpsell(origem: string) {
  const [aberto, setAberto] = useState(false);

  const abrir = useCallback(() => setAberto(true), []);

  const fechar = useCallback(() => {
    // Acabou o funil, e sem mandar ninguém a checkout nenhum.
    trackEvent("upsell_closed", { origem });
    setAberto(false);
  }, [origem]);

  /**
   * Fim do prazo da oferta — não é um "fechar". Separado do `fechar` de
   * propósito: o relatório separa quem dispensou a oferta de quem só deixou
   * o prazo acabar.
   */
  const encerrar = useCallback(() => {
    trackEvent("upsell_expired", { origem });
    setAberto(false);
  }, [origem]);

  return { aberto, abrir, fechar, encerrar };
}

/** Marca de "já apareceu" — dura a sessão da aba, não o navegador todo. */
const CHAVE_VISTO = "upsell_auto_visto";

function jaViu() {
  try {
    return sessionStorage.getItem(CHAVE_VISTO) === "1";
  } catch {
    // Aba anônima / storage bloqueado: sem memória, mas o popup ainda vale
    // uma vez por carregamento — os dois gatilhos são de disparo único.
    return false;
  }
}

function marcarVisto() {
  try {
    sessionStorage.setItem(CHAVE_VISTO, "1");
  } catch {
    /* ver acima — não poder lembrar não é motivo para não mostrar */
  }
}

/**
 * Botão do plano Básico que, em vez de ir direto ao checkout do Básico, oferece
 * o Completo por PRICES.upsell.
 *
 * Quem clicou aqui estava indo comprar: recebe a oferta inteira de uma vez.
 * Fechar encerra o popup e devolve a pessoa para a página.
 */
export function BasicCtaWithUpsell({ label }: { label: string }) {
  const { aberto, abrir, fechar, encerrar } = useFunilUpsell("plano");
  // Guarda quem abriu o popup para devolver o foco ao fechar.
  const openerRef = useRef<HTMLButtonElement>(null);

  const abrirNoClique = useCallback(() => {
    // Quem já viu a oferta aqui não precisa vê-la de novo daqui a pouco pelo
    // relógio do popup automático: seria a MESMA tela, dispensada há um
    // minuto. Vale para os dois gatilhos automáticos.
    marcarVisto();
    abrir();
  }, [abrir]);

  return (
    <>
      <button
        ref={openerRef}
        type="button"
        onClick={abrirNoClique}
        data-cta-location="plan-basic"
        data-track-id="basic-open-upsell"
        data-page-variant={PAGE_VARIANT}
        /* Preenchido (não é mais só contorno). Fica CHAPADO de propósito —
           sem gradiente, sem brilho e sem a animação de shine — para o botão
           do Completo continuar sendo o mais pesado dos dois. */
        className="mt-6 flex min-h-[54px] w-full items-center justify-center rounded-2xl bg-cta px-6 py-3.5 text-center font-cta text-[0.95rem] uppercase leading-tight tracking-wide text-white shadow-[0_8px_20px_-8px_rgba(34,180,85,0.55)] transition hover:-translate-y-0.5 hover:brightness-110 sm:text-[1rem]"
      >
        {label}
      </button>

      <UpsellDialog
        open={aberto}
        onClose={fechar}
        onExpire={encerrar}
        openerRef={openerRef}
        decline={upsell.decline}
        origem="plano"
        oferta={OFERTA_POPUP}
      />
    </>
  );
}

/**
 * Abre a oferta de PRICES.upsell sem ninguém pedir, mas SÓ quando a pessoa está
 * de saída. São dois gatilhos, um para cada tipo de aparelho:
 *
 *  1. PONTEIRO (desktop) — o ponteiro deixa a janela POR CIMA, onde ficam a
 *     aba, a barra de endereço e o X. Sair pelos lados ou por baixo não
 *     conta: ali não há para onde ir;
 *  2. FIM DA PÁGINA (celular) — a pessoa chega ao fim de tudo, depois do
 *     último CTA. No celular não existe ponteiro para vigiar, e quem leu a
 *     página inteira e continua rolando está saindo.
 *
 * ⚠️ O gatilho de TEMPO foi RETIRADO a pedido do dono ("aparecia na tela do
 * nada"): ele abria o popup no meio da leitura, sem nenhum sinal de que a
 * pessoa ia embora. Se um dia voltar, volte sabendo que é isso que ele faz.
 *
 * Fechar encerra o popup e a visitante volta para a página.
 *
 * Vale UMA vez por sessão: reaparecer a cada rolagem transformaria a oferta
 * em incômodo. Também não sequestra o botão "voltar" para simular saída no
 * celular — quebrar o "voltar" custa mais do que esse popup ganha.
 *
 * Não renderiza nada até um dos gatilhos disparar.
 */
export function AutoUpsellPopup() {
  const { aberto, abrir, fechar, encerrar } = useFunilUpsell("auto");

  useEffect(() => {
    if (jaViu()) return;

    let disparado = false;

    const onMouseOut = (e: MouseEvent) => {
      // relatedTarget preenchido = o ponteiro só trocou de elemento dentro da
      // página. Nulo E clientY <= 0 = saiu de verdade, pelo topo da janela.
      if (e.relatedTarget) return;
      if (e.clientY > 0) return;
      dispararGatilho("saida");
    };

    // Fim da página: o equivalente da "intenção de saída" no celular. A folga
    // de `upsellAuto.fimDaPaginaPx` evita depender do pixel exato — barra do
    // navegador que some, zoom e arredondamento nunca deixam a conta fechar
    // redondo.
    const onScroll = () => {
      const doc = document.documentElement;
      const faltam = doc.scrollHeight - (window.scrollY + window.innerHeight);
      if (faltam <= upsellAuto.fimDaPaginaPx) dispararGatilho("fim-da-pagina");
    };

    const limpar = () => {
      clearTimeout(armar);
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", onScroll);
    };

    function dispararGatilho(gatilho: string) {
      if (disparado) return;
      // O popup do plano Básico já está na tela: a oferta está sendo vista,
      // não faz sentido empilhar uma segunda cópia dela por cima.
      if (dialogsAbertos > 0) return;
      // ...e se ele JÁ passou por aqui (a pessoa clicou no Básico, viu a
      // oferta e fechou), o assunto está encerrado. O `jaViu` do topo do
      // efeito só vale para quem chega com a marca da sessão; esta segunda
      // conferência é para quem ganhou a marca DEPOIS, com a página aberta —
      // sem ela, rolar até o fim traria a mesma oferta de volta.
      if (jaViu()) {
        disparado = true;
        limpar();
        return;
      }
      disparado = true;
      limpar();
      marcarVisto();
      trackEvent("upsell_auto_open", { trigger: gatilho });
      abrir();
    }

    // As duas vigias só entram depois da carência (ver `upsellAuto`): sem
    // ela, quem cai de um anúncio já com o ponteiro no topo — ou numa página
    // curta, já no fim — levaria o popup no primeiro segundo.
    const armar = setTimeout(() => {
      document.addEventListener("mouseout", onMouseOut);
      window.addEventListener("scroll", onScroll, { passive: true });
    }, upsellAuto.exitArmMs);

    return limpar;
    // `abrir` é memoizado sem dependências: nunca muda, então os gatilhos são
    // armados UMA vez só. Se um dia ele deixar de ser estável, o relógio do
    // popup reinicia a cada render — e o popup nunca aparece.
  }, [abrir]);

  return (
    <UpsellDialog
      open={aberto}
      onClose={fechar}
      onExpire={encerrar}
      decline={upsellAuto.decline}
      origem="auto"
      oferta={OFERTA_POPUP}
    />
  );
}
