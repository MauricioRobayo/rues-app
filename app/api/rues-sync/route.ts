import { handler } from "@/app/api/rues-sync/handler";
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

  after(() => {
    handler({ debug: true });
  });

  return Response.json({ started: true });
}
