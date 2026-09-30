"use client";

import { Suspense, lazy, useEffect, useState } from "react";

/**
 * As duas CAMADAS da página (popup de upsell e balão de "acabou de comprar")
 * carregadas fora do pacote inicial.
 *
 * Por que: juntas elas são o maior componente cliente do site (~35KB de
 * código, mais os ícones do lucide que só elas usam) e nenhuma das duas
 * aparece na tela antes de 8s — o balão espera `firstDelaySeconds` (8s) e o
 * popup espera a pessoa estar DE SAÍDA (ponteiro saindo pelo topo ou fim da
 * página), com as vigias armadas só aos 5s. Estar no pacote inicial só fazia
 * esse código ser baixado, compilado e hidratado dentro da janela em que o
 * navegador ainda tentava pintar a primeira dobra.
 *
 * O `import()` só dispara quando a thread principal fica ociosa
 * (`requestIdleCallback`, com teto de 3s para navegador que nunca fica
 * ocioso). Na prática isso acontece muito antes dos 5s do primeiro gatilho,
 * então nenhuma das duas camadas atrasa — os relógios delas continuam
 * começando bem antes de a pessoa ter chance de comprar.
 *
 * ⚠️ Se algum dia uma dessas camadas precisar aparecer nos primeiros
 * segundos, ela tem que sair daqui e voltar para o page.tsx: este arquivo
 * assume que ninguém olha para elas no começo.
 */

const AutoUpsellPopup = lazy(() =>
  import("@/components/UpsellPopup").then((m) => ({ default: m.AutoUpsellPopup })),
);

const PurchaseNotifications = lazy(() =>
  import("@/components/PurchaseNotifications").then((m) => ({
    default: m.PurchaseNotifications,
  })),
);

type ComIdle = Window & {
  requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

export function CamadasDiferidas() {
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    const w = window as ComIdle;
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setPronto(true), { timeout: 3000 });
      return () => w.cancelIdleCallback?.(id);
    }
    // Safari antigo não tem requestIdleCallback: um timer curto serve, já que
    // o que importa aqui é só não competir com a pintura da primeira dobra.
    const id = window.setTimeout(() => setPronto(true), 1200);
    return () => window.clearTimeout(id);
  }, []);

  if (!pronto) return null;

  return (
    <Suspense fallback={null}>
      <AutoUpsellPopup />
      <PurchaseNotifications />
    </Suspense>
  );
}
