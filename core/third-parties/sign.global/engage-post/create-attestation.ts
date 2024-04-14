import { getClient, schema } from "../client";

export const createAttestation = async ({ data, indexingValue}: { data: any, indexingValue?: string }) => {
    const client = getClient();

    const registerPostSchema = await client.createAttestation({
        schemaId: schema["engage-post-schema"].schemaId,
        data: data,
        indexingValue: indexingValue || "undefined",
    });

    return registerPostSchema
}
