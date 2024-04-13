import { finalizeEpoch } from "@/core/watcher/finalize-epoch";

export const maxDuration = 300; // run max 5 minutes

export const GET = async (req: Request, res: Response) => {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response("Unauthorized");
  }

  await finalizeEpoch()
  return new Response("OK");
};