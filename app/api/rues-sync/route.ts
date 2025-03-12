import { ruesSyncRepository } from "@/app/services/rues/repository";
import { handler } from "@/app/api/rues-sync/handler";
import { after } from "next/server";

const syncToken = process.env.CRON_SECRET;

if (!syncToken) {
  throw new Error("CRON_SECRET is required");
}

// TODO: Send email with report

export async function GET(request: Request) {
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

  after(async () => {
    await handler({ syncId, debug: true });
  });

  return Response.json({ syncId });
}
