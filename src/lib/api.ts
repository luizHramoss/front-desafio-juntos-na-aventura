const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") || "http://localhost:3000";

type ApiErrorBody = { error?: string };

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let body: ApiErrorBody | null = null;
    try {
      body = (await response.json()) as ApiErrorBody;
    } catch {
      body = null;
    }
    throw new ApiError(body?.error || "Erro na API", response.status);
  }

  return response.json() as Promise<T>;
}

type ApiPricing = {
  people_count: number;
  price_per_person: number;
};

type ApiAdventure = {
  id: string;
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
  min_people: number;
  max_people: number;
  pricings: ApiPricing[];
  reservations_count?: number;
  min_price_per_person?: number;
  from_price_per_person?: number;
};

export type Adventure = {
  id: string;
  name: string;
  destination: string;
  startDateISO: string;
  endDateISO: string;
  minPeople: number;
  maxGroupSize: number;
  currentGroupSize: number;
  fromPriceCents: number;
  minPriceCents: number;
};

export type JoinData = {
  adventure: Adventure;
  currentPricePerPerson: number;
  message: string;
  bestPriceReached: boolean;
  statusNow: "pending_group" | "confirmed";
  reservationsCount: number;
};

function reaisToCents(value: number) {
  return Math.round(value * 100);
}

function mapAdventure(apiAdventure: ApiAdventure): Adventure {
  const minPricing = apiAdventure.pricings.reduce((acc, curr) =>
    curr.price_per_person < acc.price_per_person ? curr : acc
  );
  const fromPricing = apiAdventure.pricings.reduce((acc, curr) =>
    curr.people_count < acc.people_count ? curr : acc
  );

  return {
    id: apiAdventure.id,
    name: apiAdventure.name,
    destination: apiAdventure.destination,
    startDateISO: apiAdventure.start_date,
    endDateISO: apiAdventure.end_date,
    minPeople: apiAdventure.min_people,
    maxGroupSize: apiAdventure.max_people,
    currentGroupSize: apiAdventure.reservations_count ?? 0,
    fromPriceCents:
      reaisToCents(
        apiAdventure.from_price_per_person ?? fromPricing.price_per_person
      ),
    minPriceCents: reaisToCents(
      apiAdventure.min_price_per_person ?? minPricing.price_per_person
    ),
  };
}

export async function listAdventures(): Promise<Adventure[]> {
  const data = await apiRequest<ApiAdventure[]>("/adventures");
  return data.map(mapAdventure);
}

export async function getAdventureById(id: string): Promise<Adventure | null> {
  try {
    const data = await apiRequest<ApiAdventure>(`/adventures/${id}`);
    return mapAdventure(data);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function reserveAdventure(input: {
  adventureId: string;
  name: string;
  email: string;
  whatsapp: string;
}): Promise<{ token: string; joinUrl: string; deposit: number }> {
  const data = await apiRequest<{
    reservation: { share_token: string };
    share_url: string;
    deposit: number;
  }>("/reservations", {
    method: "POST",
    body: JSON.stringify({
      adventure_id: input.adventureId,
      name: input.name,
      email: input.email,
      whatsapp: input.whatsapp,
    }),
  });

  return {
    token: data.reservation.share_token,
    joinUrl: `/join/${data.reservation.share_token}`,
    deposit: reaisToCents(data.deposit),
  };
}

export async function getJoinData(token: string): Promise<JoinData | null> {
  try {
    const data = await apiRequest<{
      adventure: Omit<ApiAdventure, "pricings">;
      reservationsCount: number;
      currentPricePerPerson: number;
      message: string;
      bestPriceReached: boolean;
      statusNow: "pending_group" | "confirmed";
    }>(`/public/${token}`);

    const adventureData = await getAdventureById(data.adventure.id);
    if (!adventureData) return null;

    return {
      adventure: {
        ...adventureData,
        currentGroupSize: data.reservationsCount,
      },
      reservationsCount: data.reservationsCount,
      currentPricePerPerson: reaisToCents(data.currentPricePerPerson),
      message: data.message,
      bestPriceReached: data.bestPriceReached,
      statusNow: data.statusNow,
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

