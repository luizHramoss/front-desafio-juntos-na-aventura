"use client";

import * as React from "react";
import Link from "next/link";
import { LoaderCircle, PartyPopper, Share2 } from "lucide-react";
import { toast } from "sonner";

import { getJoinData, type JoinData } from "@/lib/api";
import { formatBRLFromCents, formatShortDate } from "@/lib/format";
import { GroupProgress, type GroupStatus } from "@/components/group-progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function JoinClient({
  token,
  initialData,
}: {
  token: string;
  initialData: JoinData;
}) {
  const [data, setData] = React.useState(initialData);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const refreshData = React.useCallback(
    async (silent = false) => {
      if (!silent) setIsRefreshing(true);
      try {
        const next = await getJoinData(token);
        if (!next) {
          setLoadError("Link de compartilhamento inválido.");
          return;
        }
        setData(next);
        setLoadError(null);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Falha ao atualizar os dados.";
        setLoadError(message);
      } finally {
        if (!silent) setIsRefreshing(false);
      }
    },
    [token]
  );

  React.useEffect(() => {
    const interval = window.setInterval(() => {
      void refreshData(true);
    }, 15000);
    return () => window.clearInterval(interval);
  }, [refreshData]);

  React.useEffect(() => {
    const onFocus = () => {
      void refreshData(true);
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refreshData]);

  const { adventure } = data;

  const current = data.reservationsCount;
  const max = adventure.maxGroupSize;
  const min = adventure.minPeople;

  const currentPriceCents = data.currentPricePerPerson;

  const minReached = data.bestPriceReached;
  const confirmed = data.statusNow === "confirmed";

  const status: GroupStatus = minReached
    ? "min_reached"
    : confirmed
      ? "confirmed"
      : "pending";

  const missingToConfirm = Math.max(0, min - current);

  const dynamicMessage = minReached
    ? "🔥 Tarifa mínima atingida! O melhor preço já está garantido para o grupo."
    : confirmed
      ? "🎉 Saída Confirmada! Convide mais amigos para tentar reduzir ainda mais a tarifa."
      : `Esta saída precisa de ${missingToConfirm} pessoa(s) para ser confirmada...`;

  const helperMessage =
    status === "min_reached"
      ? "Grupo completo no melhor tier de tarifa."
      : status === "confirmed"
        ? "Saída ativa e confirmada."
        : `Mínimo para confirmar: ${min} pessoas.`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado!");
    } catch {
      toast.error("Não foi possível copiar o link.");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="text-balance">{adventure.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {adventure.destination} · {formatShortDate(adventure.startDateISO)}
              </p>
            </div>
            <Badge variant={status === "pending" ? "pending" : "success"}>
              {status === "pending" ? "Em formação" : "Ao vivo"}
            </Badge>
          </div>
          <GroupProgress current={current} max={max} status={status} />
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-xl border bg-background p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground">Preço atual</p>
              {isRefreshing ? (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <LoaderCircle className="size-3 animate-spin" />
                  Atualizando
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-3xl font-semibold tracking-tight">
              {formatBRLFromCents(currentPriceCents)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              A partir de {formatBRLFromCents(adventure.fromPriceCents)} · mínimo{" "}
              {formatBRLFromCents(adventure.minPriceCents)}
            </p>
          </div>

          <div className="rounded-xl border bg-background p-4">
            <p className="text-sm font-medium">{dynamicMessage}</p>
            <p className="mt-2 text-xs text-muted-foreground">{helperMessage}</p>
            {loadError ? (
              <p className="mt-2 text-xs text-destructive">{loadError}</p>
            ) : null}
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <Button size="lg" className="flex-1" asChild>
                <Link href={`/reserve/${adventure.id}`}>
                  <PartyPopper className="mr-2" />
                  Entrar no grupo
                </Link>
              </Button>
              <Button size="lg" variant="outline" onClick={copyLink}>
                <Share2 className="mr-2" />
                Copiar link
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Dica: envie no WhatsApp. Quanto mais gente entrar, menor o preço.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Próximos passos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            Os dados são sincronizados com a API em tempo real.
          </p>
          <Button asChild variant="secondary" className="w-full">
            <Link href={`/reserve/${adventure.id}`}>Reservar outra vaga</Link>
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => void refreshData()}
            disabled={isRefreshing}
          >
            Atualizar agora
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

