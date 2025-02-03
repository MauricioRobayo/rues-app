import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

const revalidateToken = process.env.REVALIDATE_PATH_TOKEN;

export async function GET(request: NextRequest) {
  const token = request.headers.get("Authorization")?.split("Bearer ")[1];
  if (token !== revalidateToken) {
    return Response.json(
      { message: "Unauthorized" },
      {
        status: 401,
      },
    );
  }
  const path = request.nextUrl.searchParams.get("path");
  const type = request.nextUrl.searchParams.get("type");
  const isValidType = type === "page" || type === "layout";

  if (path) {
    revalidatePath(path, isValidType ? type : undefined);
    return Response.json({ revalidated: true, now: Date.now() });
  }

  return Response.json({
    revalidated: false,
    now: Date.now(),
    message: "Missing path to revalidate",
  });
}
