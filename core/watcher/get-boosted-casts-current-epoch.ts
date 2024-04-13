import { DataLocationOffChain, IndexService, } from "@ethsign/sp-sdk";
import { getPublicClient as getWatcherClient, getClient as getWatcherWalletClient } from "./client";
// TODO: use this 
// import { abi, bytecode } from "boostx/dist/core/contracts/basic-erc-20/basic"
// instead of this
import { encodeFunctionData } from "viem";
import { executeQuery } from "../third-parties/airstack/client";
import { GET_CASTS_BY_HASHES, GET_CASTS_BY_PARENT_HASH } from "../third-parties/airstack/queries";
import { getOffchainClient as getOffchainSignClient } from "../third-parties/sign.global/client"
import { abi } from "./basic";

export const getBoostedCastsForCurrentEpoch = async () => {
    const indexService = new IndexService("mainnet")
    // 1. get current epoch id
    const blockchainClient = getWatcherClient()
    const epochId = await blockchainClient.readContract({
        address: process.env.CONTRACT_ADDRESS as `0x${string}`,
        abi: abi,
        functionName: "epochId"
    }) as bigint

    let page = 1
    let hasMorePages = true;
    let boostedCasts = [] as { "cast-hash": string, "curator-fid": string }[]

    while (hasMorePages) {
        const res = await indexService.queryAttestationList({
            schemaId: process.env.BOOST_FULL_SCHEMA_ID,
            page,
            mode: "offchain",
            indexingValue: `epoch-${epochId}`,
        });

        for (const row of res.rows) {
            boostedCasts.push(JSON.parse(row.data)["cast-hash"]);
        }

        hasMorePages = page * res.size < res.total;
        page++;
    }

    // unique
    boostedCasts = [...new Set(boostedCasts)];

    const result = await executeQuery({
        query: GET_CASTS_BY_HASHES,
        variables: {
            hashes: boostedCasts
        }
    })

    const urls = result?.data?.FarcasterCasts?.Cast.map((cast: any) => cast.url)

    return { urls, epochId: epochId.toString() }
}