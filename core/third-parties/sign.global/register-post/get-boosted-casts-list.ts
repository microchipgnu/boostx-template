import { schema } from "../client";
import { getUnixTimestamp, getTodayDateString } from "../../../utils";
import { decodeAbiParameters } from "viem";

// Method to perform API requests
const signProtocolIndex = async ({ network = "testnet", endpoint = "", method = "GET", body = null }) => {
  const baseURL = `https://${network}-rpc.sign.global/api/index`;
  const url = `${baseURL}/${endpoint}`;

  const headers = {
    'Content-Type': 'application/json'
  };

  const options = {
    method: method,
    headers: headers,
    body: body ? JSON.stringify(body) : null
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const getBoostedCastsList = async (network = "testnet") => {
  const indexingValue = getUnixTimestamp(getTodayDateString()).toString();
  const endpoint = `attestations?mode=onchain&page=1&indexingValue=${indexingValue}&schemaId=${schema['register-post-schema'].fullSchemaId}`;

  // Use the signProtocolIndex function to get data
  const result = await signProtocolIndex({ network, endpoint });

  console.log(result)

  let data = [];

  for (const record of result.data.rows) {

    let parsedData = {};

    if (record.mode === "onchain") {
      // Parsing logic for on-chain data
      try {
        const data = decodeAbiParameters(
          [record.dataLocation === "onchain" ? { components: record.schema.data, type: "tuple" } : { type: "string" }],
          record.data
        );
        // @ts-ignore
        parsedData = data[0];
      } catch (error) {
        try {
          const data = decodeAbiParameters(
            record.dataLocation === "onchain" ? record.schema.data : [{ type: "string" }],
            record.data as any
          );
          const obj: any = {};
          data.forEach((item: any, i: number) => {
            obj[record.schema.data[i].name] = item;
          });
          parsedData = obj;
        } catch (error) {

        }
      }
    } else {
      try {
        parsedData = JSON.parse(record.data);
      } catch (error) {
        console.error('Error parsing off-chain data:', error);
      }
    }

    data.push(parsedData);
  }

  return data;
};
