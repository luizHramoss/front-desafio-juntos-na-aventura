import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { AdventureCard } from "@/components/adventure-card";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { listAdventures } from "@/lib/api";

export default async function Home() {
  let adventures: Awaited<ReturnType<typeof listAdventures>> = [];
  let loadError: string | null = null;

  try {
    adventures = await listAdventures();
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Não foi possível carregar as aventuras.";
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="font-semibold tracking-tight">
            Juntos na Aventura
          </Link>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button asChild className="hidden sm:inline-flex">
              <Link href="#aventuras">
                Ver aventuras <ArrowRight className="ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-[-240px] h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute right-[-120px] top-[120px] h-[360px] w-[360px] rounded-full bg-emerald-500/10 blur-3xl" />
          </div>

          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                <Sparkles className="size-3.5 text-primary" />
                Reserve em 1 minuto e gere um link viral
              </p>
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                Viaje melhor pagando menos — juntos.
              </h1>
              <p className="mt-4 text-pretty text-base text-muted-foreground sm:text-lg">
                Você reserva, convida seus amigos e o preço cai conforme o grupo
                enche. Transparente, rápido e com vibe premium.
              </p>
              <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg">
                  <Link href="#aventuras">
                    Ver aventuras <ArrowRight className="ml-1" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/join/demo">Abrir demo viral</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="aventuras" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Aventuras em destaque
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Escolha uma aventura, reserve e gere um link para formar o grupo.
              </p>
            </div>
          </div>

          {loadError ? (
            <div className="rounded-xl border bg-card p-6">
              <p className="text-sm font-medium">Falha ao carregar aventuras.</p>
              <p className="mt-1 text-sm text-muted-foreground">{loadError}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {adventures.map((a) => (
                <AdventureCard key={a.id} adventure={a} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
