import type { Endpoint } from "payload";
import { collectVariables } from "../variables";

/** GET /api/site-variables: every variable with its current value, for the Variables page's list. Signed-in editors only. */
export const siteVariables: Endpoint = {
  path: "/site-variables",
  method: "get",
  handler: async (req) => {
    if (!req.user) return Response.json({ error: "Sign in first" }, { status: 401 });
    return Response.json(await collectVariables(req.payload));
  },
};
