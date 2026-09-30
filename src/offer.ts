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
 *  ⚠️ ANTES DE PUBLICAR: tudo marcado PENDENTE veio da oferta anterior
 *  ("150 Festas Infantis") e NÃO está confirmado para esta oferta.
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
 * ⚠️ PENDENTE — OS TRÊS LINKS ABAIXO SÃO DA OFERTA "150 FESTAS INFANTIS".
 * Não são o checkout desta oferta: quem comprar por eles recebe o produto
 * antigo. Troque pelas URLs dos produtos "150 Festas na Mesa" antes de
 * publicar. O domínio precisa continuar batendo com CHECKOUT_HOST em
 * Tracking.tsx (hoje ggcheckout.app), senão as UTMs e o InitiateCheckout
 * deixam de ser enviados no clique.
 */

/** Pacote Completo (PRICES.premium). ⚠️ PENDENTE: link da oferta anterior. */
export const CHECKOUT_URL =
  "https://ggcheckout.app/checkout/v5/TrDo8Xg6jiuCWxmTrXEi";

/** Pacote Básico (PRICES.basic). ⚠️ PENDENTE: link da oferta anterior (entregava 50 festas). */
export const BASIC_CHECKOUT_URL =
  "https://ggcheckout.app/checkout/v5/dHBGUyfqTCc1FSzI0XPk";

/** Upsell do popup (PRICES.upsell). ⚠️ PENDENTE: link da oferta anterior. */
export const UPSELL_CHECKOUT_URL =
  "https://ggcheckout.app/checkout/v5/GwyvIf2cHvXUvPxPInpC";
