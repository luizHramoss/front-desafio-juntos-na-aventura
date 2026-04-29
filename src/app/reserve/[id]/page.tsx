import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ReserveForm } from "@/components/reserve-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBRLFromCents, formatShortDate } from "@/lib/format";
import { getAdventureById } from "@/lib/api";

export default async function ReservePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const adventure = await getAdventureById(id);
  if (!adventure) notFound();

  const depositCents = Math.round(adventure.minPriceCents * 0.2);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-center justify-between gap-3">
          <Button asChild variant="ghost">
            <Link href="/">
              <ArrowLeft className="mr-2 size-4" />
              Voltar
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Reserve e gere seu link</CardTitle>
              <p className="text-sm text-muted-foreground">
                {adventure.name} · {adventure.destination} · {formatShortDate(adventure.startDateISO)}
              </p>
            </CardHeader>
            <CardContent>
              <ReserveForm adventureId={adventure.id} />
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-background p-4">
                <p className="text-sm text-muted-foreground">Menor tarifa</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">
                  {formatBRLFromCents(adventure.minPriceCents)}
                </p>
              </div>
              <div className="rounded-lg border bg-background p-4">
                <p className="text-sm text-muted-foreground">Depósito (20%)</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">
                  {formatBRLFromCents(depositCents)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Você garante a vaga e o preço final ajusta com o grupo.
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Ao reservar, você gera um link para convidar amigos e destravar a tarifa mínima.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

