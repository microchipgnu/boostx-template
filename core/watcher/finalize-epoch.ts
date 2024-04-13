import { DataLocationOffChain, IndexService, } from "@ethsign/sp-sdk";
import { getPublicClient as getWatcherClient, getClient as getWatcherWalletClient } from "./client";
// TODO: use this 
// import { abi, bytecode } from "boostx/dist/core/contracts/basic-erc-20/basic"
// instead of this
import { encodeFunctionData } from "viem";
import { executeQuery } from "../third-parties/airstack/client";
import { GET_CASTS_BY_PARENT_HASH } from "../third-parties/airstack/queries";
import { getOffchainClient as getOffchainSignClient } from "../third-parties/sign.global/client"
import { abi } from "./basic";
import lighthouse from '@lighthouse-web3/sdk'

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
    let earnings = {} as Record<string, number>
    let previousEarnings = {} as Record<string, number>

    while (hasMorePages) {
        const res = await indexService.queryAttestationList({
            schemaId: process.env.BOOST_FULL_SCHEMA_ID,
            attester: process.env.ADDRESS,
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

        if (!castData) {
            continue
        }

        rawBoosterCastDataAirstack.push(castData)

        const address = (castData?.castedBy?.connectedAddresses?.[0]?.address ?? castData?.castedBy?.profileTokenAddress ?? null) as string | null

        if (address) {
            earnings[address] = (earnings?.[address] ?? 0) + 1 // TODO: select amount
        }
    }

    // 3.4 convert curatorFid to address
    // 3.4.1 add curator to earnings

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

        // 4.3 get previous epoch earnings
        const ipfsUrl = JSON.parse(previousEpochCasts.rows[0].data)["computed-data-ipfs"]
        // TODO: fetch from ipfs
        const ipfsData = {}

        previousEarnings = ipfsData
    }

    // 5. compute earnings for each address (creator, curator and engager)

    // 6. create assertation for EPOCH_STATE_FULL_SCHEMA_ID and store blob on filecoin

    // 6.1 store on filecoin
    // 6.1.1 Generate an API on the fly
    // https://docs.lighthouse.storage/lighthouse-1/how-to/create-an-api-key
    const response = await lighthouse.uploadText(JSON.stringify(earnings), process.env.LIGHTHOUSE_STORAGE_API_KEY!, "")
    const hash = response.data.Hash

    // 6.2 create assertation

    const signOffchainClient = getOffchainSignClient()
    await signOffchainClient.createAttestation({
        schemaId: process.env.EPOCH_STATE_FULL_SCHEMA_ID!,
        data: {
            "computed-data-ipfs": hash,
            "epoch": epochId.toString()
        },
        indexingValue: `epoch-${epochId}`,
        dataLocation: DataLocationOffChain.IPFS
    });

    // 7. interact with contract to set new epoch id

    const nextEpochId = epochId + 1n

    const walletClient = getWatcherWalletClient()
    await walletClient.sendTransaction({
        data: encodeFunctionData({
            abi,
            functionName: "setEpochId",
            args: [nextEpochId]
        })
    })
}