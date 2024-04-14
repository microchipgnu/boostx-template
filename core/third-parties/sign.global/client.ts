import { SignProtocolClient, SpMode, EvmChains, OffChainSignType, } from "@ethsign/sp-sdk";
import { privateKeyToAccount } from "viem/accounts";

export const getClient = () => {
    const privateKey = process.env.PRIVATE_KEY as `0x${string}`;

    const client = new SignProtocolClient(SpMode.OnChain, {
        chain: EvmChains.baseSepolia,
        account: privateKeyToAccount(privateKey),
    });

    return client
}

export const getOffchainClient = () => {
    const client = new SignProtocolClient(SpMode.OffChain, {
        signType: OffChainSignType.EvmEip712,
        account: privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`),
    });

    return client
}

export const schema = {
    "register-post-schema": {
        schemaId: "0x5a",
        fullSchemaId: "onchain_evm_84532_0x5a"
    },
    "engage-post-schema": {
        schemaId: "0x59",
        fullSchemaId: "onchain_evm_84532_0x59"
    }
}