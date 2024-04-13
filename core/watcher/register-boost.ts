// TODO: use this 
// import { abi, bytecode } from "boostx/dist/core/contracts/basic-erc-20/basic"
// instead of this
import { abi } from "./basic"
import { getOffchainClient as getOffchainSignClient } from "../third-parties/sign.global/client"
import { getPublicClient as getWatcherClient } from "./client"
import { DataLocationOffChain } from "@ethsign/sp-sdk"

export const registerPost = async ({data}: {data: any}) => {

    const client = getOffchainSignClient()

    const schemaId = process.env.BOOST_FULL_SCHEMA_ID

    if (!schemaId) {
        throw new Error("Missing schemaId")
    }

    const blockchainClient = getWatcherClient()
    const epochId = await blockchainClient.readContract({
        address: process.env.CONTRACT_ADDRESS as `0x${string}`,
        abi: abi,
        functionName: "epochId"
    })

    await client.createAttestation({
        schemaId: schemaId,
        data: {
            "curator-fid": data.castFid,
            "cast-hash": data.castHash
        },
        indexingValue: `epoch-${epochId}`,
        dataLocation: DataLocationOffChain.IPFS
    });
}