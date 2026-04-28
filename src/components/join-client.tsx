"use client";

import * as React from "react";
import Link from "next/link";
import { PartyPopper, Share2 } from "lucide-react";
import { toast } from "sonner";

import type { Adventure } from "@/lib/mock-api";
import { formatBRLFromCents, formatShortDate } from "@/lib/format";
import { useGroupStore } from "@/lib/store";
import { GroupProgress, type GroupStatus } from "@/components/group-progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function priceForGroup({
  fromPriceCents,
  minPriceCents,
  currentGroupSize,
  maxGroupSize,
}: Pick<
  Adventure,
  "fromPriceCents" | "minPriceCents" | "currentGroupSize" | "maxGroupSize"
>) {
  const t = Math.min(1, currentGroupSize / maxGroupSize);
  const delta = fromPriceCents - minPriceCents;
  return Math.round(fromPriceCents - delta * t);
}

export function JoinClient({
  token,
  adventure,
}: {
  token: string;
  adventure: Adventure;
}) {
  const { groupSizeByToken, increment, setFromServer } = useGroupStore();

  React.useEffect(() => {
    setFromServer(token, adventure.currentGroupSize);
  }, [adventure.currentGroupSize, setFromServer, token]);

  const current = groupSizeByToken[token] ?? adventure.currentGroupSize;
  const max = adventure.maxGroupSize;

  const currentPriceCents = priceForGroup({
    fromPriceCents: adventure.fromPriceCents,
    minPriceCents: adventure.minPriceCents,
    currentGroupSize: current,
    maxGroupSize: max,
  });

  const minReached = currentPriceCents <= adventure.minPriceCents;
  const confirmed = current >= Math.ceil(max * 0.7);

  const status: GroupStatus = minReached
    ? "min_reached"
    : confirmed
      ? "confirmed"
      : "pending";

  const remaining = Math.max(0, max - current);
  const message = minReached
    ? "Tarifa mínima atingida. Agora é só celebrar."
    : confirmed
      ? "Grupo confirmado. Últimas vagas!"
      : `Faltam ${remaining} pessoa${remaining === 1 ? "" : "s"} pra destravar mais desconto.`;

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
            <p className="text-sm text-muted-foreground">Preço atual</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight">
              {formatBRLFromCents(currentPriceCents)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              A partir de {formatBRLFromCents(adventure.fromPriceCents)} · mínimo{" "}
              {formatBRLFromCents(adventure.minPriceCents)}
            </p>
          </div>

          <div className="rounded-xl border bg-background p-4">
            <p className="text-sm font-medium">{message}</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <Button
                size="lg"
                className="flex-1"
                onClick={() => {
                  increment(token, max);
                  toast.success("Você entrou no grupo!");
                }}
                disabled={current >= max}
              >
                <PartyPopper className="mr-2" />
                Entrar no grupo
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
            Este é um mock: o botão simula pessoas entrando para você ver o preço
            mudando.
          </p>
          <Button asChild variant="secondary" className="w-full">
            <Link href={`/reserve/${adventure.id}`}>Reservar outra vaga</Link>
          </Button>
          <p className="text-xs text-muted-foreground">
            Token: <span className="font-mono">{token}</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

