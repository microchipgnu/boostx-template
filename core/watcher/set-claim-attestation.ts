import { IndexService } from "@ethsign/sp-sdk";
import { encodeFunctionData } from "viem";
import { executeQuery } from "../third-parties/airstack/client";
import { GET_USER_ADDRESS } from "../third-parties/airstack/queries";
import { abi } from "./basic";
import { getPublicClient as getWatcherClient, getClient as getWatcherWalletClient } from "./client";
// TODO: use this 
// import { abi, bytecode } from "boostx/dist/core/contracts/basic-erc-20/basic"

export const setClaimAttestation = async (fid: string, claimOnBehalf = false) => {
    const accountInfoData = await executeQuery({
        query: GET_USER_ADDRESS,
        variables: {
            fid: fid
        }
    })

    const account = accountInfoData.data.Socials[0].userAssociatedAddresses[0] || null

    if(!account) { 
        return null
    }
    
    const indexService = new IndexService("mainnet")
    const blockchainClient = getWatcherClient()
    const epochId = await blockchainClient.readContract({
        address: process.env.CONTRACT_ADDRESS as `0x${string}`,
        abi: abi,
        functionName: "epochId"
    }) as bigint

    // 1. get latest epoch state

    const previousEpochCasts = await indexService.queryAttestationList({
        schemaId: process.env.EPOCH_STATE_FULL_SCHEMA_ID,
        mode: "offchain",
        page: 1,
        indexingValue: `epoch-${epochId}`,
    })

    // 4.3 get previous epoch earnings
    const state = JSON.parse(previousEpochCasts.rows[0].data)["computed-data-ipfs"]

    const totalEarnings = state[account]

    if (!totalEarnings) {
        return
    }

    // 2. set total earned in contract for account 
    const walletClient = getWatcherWalletClient()
    const nonce = await blockchainClient.getTransactionCount({
        address: process.env.ADDRESS! as `0x${string}`,
        blockTag: "pending"
    })
    const hash = await walletClient.sendTransaction({
        data: encodeFunctionData({
            abi,
            functionName: "setAttestation",
            args: [account, BigInt(totalEarnings)]
        }),
        to: process.env.CONTRACT_ADDRESS! as `0x${string}`,
        nonce: nonce
    })

    if (claimOnBehalf) {
        await walletClient.sendTransaction({
            data: encodeFunctionData({
                abi,
                functionName: "claim",
                args: [account]
            }),
            to: process.env.CONTRACT_ADDRESS! as `0x${string}`,
            nonce: nonce + 1
        })
    }
}