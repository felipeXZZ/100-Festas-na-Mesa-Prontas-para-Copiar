/* =====================================================================
 *  CONFIGURAÇÃO DA OFERTA — "150 Festas na Mesa Prontas para Copiar"
 * =====================================================================
 *  Nome, preços e links de checkout num lugar só. Os textos da página
 *  (content.ts), o rastreamento (Tracking.tsx / lib/track.ts) e os dados
 *  estruturados (layout.tsx) leem daqui — mudar um preço é mudar UMA linha.
 *
 *  Arquivo separado do content.ts de propósito: o Tracking.tsx vai no
 *  pacote inicial do navegador e só precisa destes números, não do texto
 *  da página inteira.
 *
 * ===================================================================== */

export const OFFER_NAME = "150 Festas na Mesa Prontas para Copiar";

/**
 * Preços em reais (número). Os textos de preço da página são gerados a
 * partir daqui com `brl()`/`reais()`.
 */
export const PRICES = {
  /** Pacote Básico — 50 projetos. ✅ Confirmado: preço principal. */
  basic: 5.99,
  /** Pacote Completo — 150 projetos + 5 bônus. ✅ Confirmado. */
  premium: 19.9,
  /** Popup de upsell — Completo com desconto. ✅ Confirmado. */
  upsell: 14.9,
};

/** 10 → "10,00" */
export const reais = (v: number) => v.toFixed(2).replace(".", ",");
/** 10 → "R$10,00" (formato dos preços grandes dos cards) */
export const brl = (v: number) => `R$${reais(v)}`;

/* ------------------------------------------------------------------ */
/*  CHECKOUT                                                           */
/* ------------------------------------------------------------------ */
/*
 * Checkouts desta oferta na Wiapy. Cada link precisa cobrar o mesmo
 * valor do PRICES correspondente — mudou um preço aqui, mude no painel da Wiapy
 * também. O domínio precisa continuar batendo com CHECKOUT_HOST em
 * Tracking.tsx (hoje pay.wiapy.com), senão as UTMs e o InitiateCheckout
 * deixam de ser enviados no clique.
 */

/** Pacote Completo — R$ 19,90 (PRICES.premium). */
export const CHECKOUT_URL =
  "https://pay.wiapy.com/iBacz6Sxymjr";

/** Pacote Básico — R$ 5,99 (PRICES.basic). */
export const BASIC_CHECKOUT_URL =
  "https://pay.wiapy.com/gPwDgI1skAIN";

/** Upsell do popup — R$ 14,90 (PRICES.upsell). */
export const UPSELL_CHECKOUT_URL =
  "https://pay.wiapy.com/y_4Nnf4QGl4";
