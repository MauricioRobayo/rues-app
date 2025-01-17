import { ruesSyncRepository } from "@/app/db/repositories/rues-sync";
import { handler } from "@/app/rues/handler";
import { after } from "next/server";

const syncToken = process.env.RUES_SYNC_TOKEN;

if (!syncToken) {
  throw new Error("RUES_SYNC_TOKEN is required");
}

// TODO: Send email with report
// TODO: cronjob

export async function POST(request: Request) {
  const token = request.headers.get("Authorization")?.split("Bearer ")[1];
  if (token !== syncToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const syncId = await ruesSyncRepository.insert({
    startedAtMs: new Date(),
    status: "started",
  });

  if (!syncId) {
    return Response.json(
      {
        message: "Could not generate rues_sync init record.",
      },
      {
        status: 500,
      },
    );
  }

  console.log("RUES sync started successfully:", syncId);

  after(() => {
    handler({ syncId, debug: true });
  });

  return Response.json({ syncId });
}
