import { abi } from "./basic";
import { getPublicClient as getWatcherClient, getClient as getWatcherWalletClient } from "./client";
import { getOffchainClient as getOffchainSignClient } from "../third-parties/sign.global/client"
import { IndexService } from "@ethsign/sp-sdk";
import { encodeFunctionData } from "viem";
// TODO: use this 
// import { abi, bytecode } from "boostx/dist/core/contracts/basic-erc-20/basic"


export const getEarnedAmount = async (account: `0x${string}`) => {
    const indexService = new IndexService("mainnet")

    const blockchainClient = getWatcherClient()
    const epochId = await blockchainClient.readContract({
        address: process.env.CONTRACT_ADDRESS as `0x${string}`,
        abi: abi,
        functionName: "epochId"
    }) as bigint

    const epochStateAttestationsList = await indexService.queryAttestationList({
        schemaId: process.env.EPOCH_STATE_FULL_SCHEMA_ID,
        mode: "offchain",
        page: 1,
        indexingValue: `epoch-${epochId}`,
    })

    console.log(epochStateAttestationsList)

    if (epochStateAttestationsList.total === 0) {
        return 0
    }

    const state = JSON.parse(epochStateAttestationsList.rows[0].data)["computed-data-ipfs"]

    const totalEarnings = state[account]

    if (!totalEarnings) {
        return 0
    }

    return BigInt(totalEarnings)
}