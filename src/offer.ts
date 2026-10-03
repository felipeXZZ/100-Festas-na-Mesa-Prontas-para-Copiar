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
  premium: 24.9,
  /** Popup de upsell — Completo com desconto. ✅ Confirmado. */
  upsell: 10,
};

/** 10 → "10,00" */
export const reais = (v: number) => v.toFixed(2).replace(".", ",");
/** 10 → "R$10,00" (formato dos preços grandes dos cards) */
export const brl = (v: number) => `R$${reais(v)}`;

/* ------------------------------------------------------------------ */
/*  CHECKOUT                                                           */
/* ------------------------------------------------------------------ */
/*
 * Checkouts desta oferta na Lowify. Cada link precisa cobrar o mesmo
 * valor do PRICES correspondente — mudou um preço aqui, mude no painel da Lowify
 * também. O domínio precisa continuar batendo com CHECKOUT_HOST em
 * Tracking.tsx (hoje pay.lowify.com.br), senão as UTMs e o InitiateCheckout
 * deixam de ser enviados no clique.
 */

/** Pacote Completo — R$ 24,90 (PRICES.premium). */
export const CHECKOUT_URL =
  "https://pay.lowify.com.br/go.php?offer=72c7fa56";

/** Pacote Básico — R$ 5,99 (PRICES.basic). */
export const BASIC_CHECKOUT_URL =
  "https://pay.lowify.com.br/go.php?offer=a0fc54fb";

/** Upsell do popup — R$ 10,00 (PRICES.upsell). */
export const UPSELL_CHECKOUT_URL =
  "https://pay.lowify.com.br/checkout.php?product_id=QZfjZA";
