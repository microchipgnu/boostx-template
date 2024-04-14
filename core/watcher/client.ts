import { createPublicClient, createWalletClient, http } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { baseSepolia } from "viem/chains"

export const postBoostingContractAddress = "0x7b33E1fb1E71Ef94d082d59FcF59bEC8aA205EB1"

export const getClient = (context: any) => {

    const privateKey = context.env.PRIVATE_KEY! as `0x${string}`

    const client = createWalletClient({
        chain: baseSepolia,
        transport: http(),
        account: privateKeyToAccount(privateKey)
    })

    return client
}

export const getPublicClient = () => {

    return createPublicClient({
        chain: baseSepolia,
        transport: http()
    })

}