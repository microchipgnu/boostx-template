import { createPublicClient, createWalletClient, http } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { baseSepolia, arbitrumSepolia, gnosisChiado } from "viem/chains"

export const getChain = (network: string | undefined) => {
	switch (network) {
		case "base-sepolia":
			return baseSepolia;
		case "arbitrum-sepolia":
			return arbitrumSepolia;
        case "gnosis-chiado":
            return gnosisChiado;
		default:
			return undefined;
	}
};

export const getClient = () => {
    const chain = getChain(process.env.NETWORK)
    const privateKey = process.env.PRIVATE_KEY! as `0x${string}`

    const client = createWalletClient({
        chain: chain,
        transport: http(),
        account: privateKeyToAccount(privateKey)
    })

    return client
}

export const getPublicClient = () => {
    const chain = getChain(process.env.NETWORK)

    return createPublicClient({
        chain: chain,
        transport: http()
    })
}