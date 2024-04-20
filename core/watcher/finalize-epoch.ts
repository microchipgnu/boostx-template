import { DataLocationOffChain, IndexService, } from "@ethsign/sp-sdk";
import { getPublicClient as getWatcherClient, getClient as getWatcherWalletClient } from "./client";
import { abi } from "boostx/dist/core/contracts/basic-erc-20/basic"
import { encodeFunctionData } from "viem";
import { executeQuery } from "../third-parties/airstack/client";
import { GET_CASTS_BY_PARENT_HASH } from "../third-parties/airstack/queries";
import { getOffchainClient as getOffchainSignClient } from "../third-parties/sign.global/client"

// Filecoin
// Error: Cannot find module 'bls-eth-wasm' in prod
// import lighthouse from '@lighthouse-web3/sdk'

// this is where we finalize the epoch
// can set additional rules for earnings here
export const finalizeEpoch = async () => {
    const indexService = new IndexService("mainnet")
    // 1. get current epoch id
    const blockchainClient = getWatcherClient()
    const epochId = await blockchainClient.readContract({
        address: process.env.CONTRACT_ADDRESS as `0x${string}`,
        abi: abi,
        functionName: "epochId"
    }) as bigint

    // 2. get all registered posts from that epoch id
    let page = 1
    let hasMorePages = true;
    let boostedCasts = [] as { "cast-hash": string, "curator-fid": string }[]
    let rawBoosterCastDataAirstack = []
    let earnings = {} as Record<string, bigint>
    let previousEarnings = {} as Record<string, bigint>

    while (hasMorePages) {
        const res = await indexService.queryAttestationList({
            schemaId: process.env.BOOST_FULL_SCHEMA_ID,
            page,
            mode: "offchain",
            indexingValue: `epoch-${epochId}`,
        });

        for (const row of res.rows) {
            boostedCasts.push(JSON.parse(row.data));
        }

        hasMorePages = page * res.size < res.total;
        page++;
    }

    // 3. get all engagement with posts from that epoch id
    // 3.1 get cast information
    // 3.2 get responses
    // 3.3 get creator address

    for (const boostedCast of boostedCasts) {
        const castData = await executeQuery({
            query: GET_CASTS_BY_PARENT_HASH,
            variables: {
                parentHash: boostedCast?.["cast-hash"] as string
            }
        })

        console.log(castData)

        const cast = castData.data.FarcasterCasts.Cast[0]

        if (!cast) {
            continue
        }

        rawBoosterCastDataAirstack.push(cast)

        // TODO: later do this with accounts besides the farcaster one
        // const address = (cast?.castedBy?.connectedAddresses?.[0]?.address ?? cast?.castedBy?.profileTokenAddress ?? null) as string | null
        const address = cast?.castedBy?.userAssociatedAddresses[0] ?? null

        if (address) {
            earnings[address] = (earnings?.[address] ?? 0n) + 1000000000000000000n
        }
    }


    // 3.4 convert curatorFid to address
    // 3.4.1 add curator to earnings
    // TODO

    // 3.5 add creator to earnings
    // TODO

    // 4. get previous epoch id and get all previous earnings

    // 4.1 get previous epoch id
    const previousEpochId = `epoch-${epochId - 1n}`

    if (epochId - 1n > 0n) {
        // 4.2 get previous epoch attestation
        const previousEpochCasts = await indexService.queryAttestationList({
            schemaId: process.env.EPOCH_STATE_FULL_SCHEMA_ID,
            mode: "offchain",
            page: 1,
            indexingValue: previousEpochId
        })

        if (previousEpochCasts.total > 0) {
            // 4.3 get previous epoch earnings
            const state = JSON.parse(previousEpochCasts.rows[0].data)["computed-data"]
            // TODO: fetch from ipfs

            for (const [address, value] of Object.entries(JSON.parse(state))) {
                previousEarnings[address] = BigInt(value as bigint); // Convert string back to BigInt
            }
        }
    }

    // 5. compute earnings for each address (creator, curator and engager)

    const combinedEarnings = {} as Record<string, bigint>

    // Copy current earnings to combinedEarnings
    for (const [address, amount] of Object.entries(earnings)) {
        combinedEarnings[address] = amount; // Initialize or update address with current earnings
    }

    // Add or update with previous earnings
    for (const [address, previousAmount] of Object.entries(previousEarnings)) {
        if (combinedEarnings.hasOwnProperty(address)) {
            combinedEarnings[address] += previousAmount; // Add previous earnings to existing amount
        } else {
            combinedEarnings[address] = previousAmount; // Initialize with previous earnings if address does not exist
        }
    }

    // 6. create assertation for EPOCH_STATE_FULL_SCHEMA_ID and store blob on filecoin

    // 6.1 store on filecoin

    // Filecoin implementation is commented due to Error: Cannot find module 'bls-eth-wasm' in prod
    // It works locally
    // const response = await lighthouse.uploadText(JSON.stringify(earnings), process.env.LIGHTHOUSE_STORAGE_API_KEY!, "")
    const mockResponse = {
        data: {
            Hash: "Qm...",
        }
    }

    // 6.2 create assertation
    const signOffchainClient = getOffchainSignClient()
    await signOffchainClient.createAttestation({
        schemaId: process.env.EPOCH_STATE_FULL_SCHEMA_ID!,
        data: {
            "computed-data": JSON.stringify(combinedEarnings, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value),
            "ipfs-hash": mockResponse.data.Hash,
            "ipfs-url": `https://gateway.lighthouse.storage/ipfs/${mockResponse.data.Hash}`,
            "epoch": epochId.toString()
        },
        indexingValue: `epoch-${epochId}`,
        dataLocation: DataLocationOffChain.IPFS
    });

    // 7. interact with contract to set new epoch id

    const nextEpochId = epochId + 1n

    const walletClient = getWatcherWalletClient()
    const hash = await walletClient.sendTransaction({
        data: encodeFunctionData({
            abi,
            functionName: "setEpochId",
            args: [nextEpochId]
        }),
        to: process.env.CONTRACT_ADDRESS! as `0x${string}`,
    })
}