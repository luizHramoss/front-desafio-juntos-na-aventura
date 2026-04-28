export type Adventure = {
  id: string;
  name: string;
  destination: string;
  startDateISO: string;
  fromPriceCents: number;
  minPriceCents: number;
  maxGroupSize: number;
  currentGroupSize: number;
};

export type ReserveInput = {
  adventureId: string;
  name: string;
  email: string;
  whatsapp: string;
};

export type ReserveResult = {
  token: string;
  joinUrl: string;
};

const adventures: Adventure[] = [
  {
    id: "chapada-01",
    name: "Trilha + Cachoeiras Premium",
    destination: "Chapada dos Veadeiros, GO",
    startDateISO: "2026-06-14",
    fromPriceCents: 129900,
    minPriceCents: 99900,
    maxGroupSize: 10,
    currentGroupSize: 4,
  },
  {
    id: "lençois-02",
    name: "Dunas & Lagoas (impressionante)",
    destination: "Lençóis Maranhenses, MA",
    startDateISO: "2026-07-05",
    fromPriceCents: 189900,
    minPriceCents: 149900,
    maxGroupSize: 12,
    currentGroupSize: 7,
  },
  {
    id: "serra-03",
    name: "Feriado de Inverno Gastronômico",
    destination: "Serra Gaúcha, RS",
    startDateISO: "2026-08-16",
    fromPriceCents: 159900,
    minPriceCents: 119900,
    maxGroupSize: 8,
    currentGroupSize: 2,
  },
];

const tokenToAdventureId = new Map<string, string>();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function listAdventures(): Promise<Adventure[]> {
  await sleep(450);
  return adventures;
}

export async function getAdventureById(id: string): Promise<Adventure | null> {
  await sleep(350);
  return adventures.find((a) => a.id === id) ?? null;
}

export async function reserveAdventure(input: ReserveInput): Promise<ReserveResult> {
  await sleep(900);
  const token = `t_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
  tokenToAdventureId.set(token, input.adventureId);
  return { token, joinUrl: `/join/${token}` };
}

export async function getJoinData(token: string): Promise<Adventure | null> {
  await sleep(500);
  if (token === "demo") return adventures[0] ?? null;
  const adventureId = tokenToAdventureId.get(token);
  if (!adventureId) return null;
  return adventures.find((a) => a.id === adventureId) ?? null;
}

