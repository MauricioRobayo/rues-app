import { ruesSyncRepository } from "@/app/repositories/rues-sync";
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
      }
    );
  }

  console.log("RUES sync started successfully:", syncId);

  after(() => {
    console.log("after is running!");
    let count = 0;˝
    new Promise((resolve) => {
      const interval = setInterval(() => {
        if (count >= 10) {
          clearInterval(interval);
          resolve(count);
          return;
        }
        count++;
      }, 1000);
    });
  });

  return Response.json({ syncId });
}
