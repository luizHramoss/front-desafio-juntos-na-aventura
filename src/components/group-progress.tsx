"use client";

import { CheckCircle2, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export type GroupStatus = "pending" | "confirmed" | "min_reached";

export function GroupProgress({
  current,
  max,
  status,
}: {
  current: number;
  max: number;
  status: GroupStatus;
}) {
  const pct = Math.round((current / max) * 100);
  const label =
    status === "min_reached"
      ? "Tarifa mínima atingida"
      : status === "confirmed"
        ? "Grupo confirmado"
        : "Em formação";

  const badgeVariant =
    status === "pending" ? "pending" : status === "confirmed" ? "success" : "secondary";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-muted-foreground" />
          <p className="text-sm font-medium">
            {current}/{max} pessoas
          </p>
        </div>
        <Badge variant={badgeVariant} className={cn(status === "min_reached" && "bg-primary/10 text-primary")}>
          {status === "confirmed" || status === "min_reached" ? (
            <CheckCircle2 className="mr-1 size-3.5" />
          ) : null}
          {label}
        </Badge>
      </div>
      <Progress value={Math.min(100, pct)} />
      <p className="text-xs text-muted-foreground">
        Progresso do grupo: {pct}%
      </p>
    </div>
  );
}

