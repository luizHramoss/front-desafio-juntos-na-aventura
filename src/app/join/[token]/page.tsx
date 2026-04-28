import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { JoinClient } from "@/components/join-client";
import { Button } from "@/components/ui/button";
import { getJoinData } from "@/lib/mock-api";

export default async function JoinPage({
  params,
}: {
  params: { token: string };
}) {
  const { token } = params;
  const adventure = await getJoinData(token);
  if (!adventure) notFound();

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-center justify-between gap-3">
          <Button asChild variant="ghost">
            <Link href="/">
              <ArrowLeft className="mr-2 size-4" />
              Aventuras
            </Link>
          </Button>
        </div>

        <JoinClient token={token} adventure={adventure} />
      </div>
    </div>
  );
}

