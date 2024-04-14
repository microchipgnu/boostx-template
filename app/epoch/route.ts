export const GET = async (req: Request, res: Response) => {
    if (
      req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return new Response("Unauthorized");
    }
    return new Response("OK");
  };