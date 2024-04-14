import { getClient } from "../client";


export const createSchema = async () => {
  const client = getClient();

  const registerPostSchema = await client.createSchema({
    name: "register-post-schema",
    data: [{ name: "castHash", type: "string" }, { "name": "version", "type": "string" }],
  });

  return registerPostSchema
}