import { IndexService, } from "@ethsign/sp-sdk";
import { getPublicClient as getWatcherClient } from "./client"
import { abi } from "boostx/dist/core/contracts/basic-erc-20/basic"

interface AttestationData {
    castHash: string
}

export const checkPostBoosted = async ({ data }: { data: AttestationData }) => {
    const indexService = new IndexService("mainnet")

    const blockchainClient = getWatcherClient()
    const epochId = await blockchainClient.readContract({
        address: process.env.CONTRACT_ADDRESS as `0x${string}`,
        abi: abi,
        functionName: "epochId"
    })

    let page = 1
    let hasMorePages = true;

    while (hasMorePages) {
        const res = await indexService.queryAttestationList({
            schemaId: process.env.BOOST_FULL_SCHEMA_ID,
            attester: process.env.ADDRESS,
            page,
            mode: "offchain",
            indexingValue: `epoch-${epochId}`,
        });

        for (const row of res.rows) {
            const matches = matchesCriteria(row, data)
            if (matches) {
                return true;
            }
        }

        hasMorePages = page * res.size < res.total;
        page++;
    }

    return false
}


const matchesCriteria = (row: any, searchData: AttestationData): boolean => {
    try {
        const rowData = JSON.parse(row.data);
        const matches = rowData?.["cast-hash"] === searchData.castHash
        return matches;
    } catch (error) {
        console.error('Error matching criteria:', error);
        return false;
    }
}