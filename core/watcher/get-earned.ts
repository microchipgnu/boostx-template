import { IndexService } from "@ethsign/sp-sdk";
import { executeQuery } from "../third-parties/airstack/client";
import { GET_USER_ADDRESS } from "../third-parties/airstack/queries";
import { abi } from "./basic";
import { getPublicClient as getWatcherClient } from "./client";
// TODO: use this 
// import { abi, bytecode } from "boostx/dist/core/contracts/basic-erc-20/basic"


export const getEarnedAmount = async (fid: string) => {
    const accountInfoData = await executeQuery({
        query: GET_USER_ADDRESS,
        variables: {
            fid: fid
        }
    })

    const account = accountInfoData.data.Socials.Social[0].userAssociatedAddresses[0] || null

    if(!account) { 
        return 0
    }

    const indexService = new IndexService("mainnet")

    const blockchainClient = getWatcherClient()
    const epochId = await blockchainClient.readContract({
        address: process.env.CONTRACT_ADDRESS as `0x${string}`,
        abi: abi,
        functionName: "epochId"
    }) as bigint

    const totalClaimed = await blockchainClient.readContract({
        address: process.env.CONTRACT_ADDRESS as `0x${string}`,
        abi: abi,
        functionName: "totalClaimedAmount",
        args: [account]
    }) as bigint

    const epochStateAttestationsList = await indexService.queryAttestationList({
        schemaId: process.env.EPOCH_STATE_FULL_SCHEMA_ID,
        mode: "offchain",
        page: 1,
        indexingValue: `epoch-${epochId - 1n === 0n ? 1 : epochId - 1n}`,
    })

    if (epochStateAttestationsList.total === 0) {
        return 0
    }

    const state = JSON.parse(epochStateAttestationsList.rows[0].data)["computed-data"]

    const totalEarnings = JSON.parse(state)[account]

    if (!totalEarnings) {
        return 0
    }

    return BigInt(totalEarnings || 0n) - BigInt(totalClaimed || 0n)
}