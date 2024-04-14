import { getClient, schema } from "../client";

// Create an attestation



export const createAttestation = async ({ data, indexingValue}: { data: any, indexingValue?: string }) => {
    const client = getClient();

    const registerPostSchema = await client.createAttestation({
        schemaId: schema["register-post-schema"].schemaId,
        data: data,
        indexingValue: indexingValue || "undefined",
    });

    return registerPostSchema
}
