"use client";

import Link from "next/link";
import { ArrowRight, Calendar, MapPin } from "lucide-react";

import type { Adventure } from "@/lib/mock-api";
import { formatBRLFromCents, formatShortDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function AdventureCard({ adventure }: { adventure: Adventure }) {
  const progressPct = Math.round(
    (adventure.currentGroupSize / adventure.maxGroupSize) * 100
  );
  const isConfirmed = adventure.currentGroupSize >= Math.ceil(adventure.maxGroupSize * 0.7);

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md"
      )}
    >
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-balance">{adventure.name}</CardTitle>
          <Badge variant={isConfirmed ? "success" : "pending"}>
            {isConfirmed ? "Quase confirmado" : "Em formação"}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4" />
            {adventure.destination}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-4" />
            {formatShortDate(adventure.startDateISO)}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">A partir de</p>
            <p className="text-2xl font-semibold tracking-tight">
              {formatBRLFromCents(adventure.fromPriceCents)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Grupo</p>
            <p className="text-sm font-medium">
              {adventure.currentGroupSize}/{adventure.maxGroupSize} ({progressPct}%)
            </p>
          </div>
        </div>
        <div className="h-1.5 w-full rounded-full bg-secondary">
          <div
            className="h-1.5 rounded-full bg-primary transition-all"
            style={{ width: `${Math.min(100, progressPct)}%` }}
          />
        </div>
      </CardContent>

      <CardFooter className="justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Menor tarifa:{" "}
          <span className="font-medium text-foreground">
            {formatBRLFromCents(adventure.minPriceCents)}
          </span>
        </p>
        <Button asChild>
          <Link href={`/reserve/${adventure.id}`}>
            Reservar <ArrowRight className="ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

