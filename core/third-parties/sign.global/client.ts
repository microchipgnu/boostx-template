import { SignProtocolClient, SpMode, EvmChains, OffChainSignType, } from "@ethsign/sp-sdk";
import { privateKeyToAccount } from "viem/accounts";

const getChain = (network: string | undefined) => {
    switch (network) {
        case "base-sepolia":
            return EvmChains.baseSepolia;
        case "arbitrum-sepolia":
            return EvmChains.arbitrumSepolia;
        case "gnosis-chiado":
            return EvmChains.gnosisChiado;
        default:
            return undefined;
    }
}

export const getClient = () => {
    const chain = getChain(process.env.NETWORK)
    const privateKey = process.env.PRIVATE_KEY as `0x${string}`;

    if (!chain || !privateKey) {
        throw new Error("Missing chain or privateKey")
    }

    const client = new SignProtocolClient(SpMode.OnChain, {
        chain: chain,
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