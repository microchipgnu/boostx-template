export const GET_CAST_INFO = `
    query GET_CAST_INFO ($hash:String){
        FarcasterCasts(input: {filter: {hash: {_eq: $hash}}, blockchain: ALL}) {
            Cast {
                fid
                url
                numberOfLikes
                numberOfRecasts
                numberOfReplies
                hash
                rawText
                castedAtTimestamp
                castedBy {
                    connectedAddresses {
                      address
                    }
                    profileTokenAddress
                    userAssociatedAddresses
                }
            }
        }
    }
`
export const GET_CASTS_BY_PARENT_HASH = `
    query GET_CASTS_BY_PARENT_HASH ($parentHash:String){
        FarcasterCasts(input: {filter: {parentHash: {_eq: $parentHash}}, blockchain: ALL}) {
            Cast {
                fid
                url
                numberOfLikes
                numberOfRecasts
                numberOfReplies
                hash
                rawText
                castedAtTimestamp
                castedBy {
                    connectedAddresses {
                      address
                    }
                    profileTokenAddress
                    userAssociatedAddresses
                }
            }
        }
    }
`

export const GET_USER_ADDRESS = `
    query GET_USER_ADDRESS($fid:String) {
        Socials(
        input: {filter: {userId: {_eq: $fid}, dappName: {_eq: farcaster}}, blockchain: ethereum}
        ) {
            Social {
                dappName
                userId
                userAddress
                userAssociatedAddresses
            }
        }
    }
`

export const GET_CASTS_BY_HASHES = `
    query GET_CASTS_BY_HASHES ($hashes: [String!]) {
        FarcasterCasts(input: {filter: {hash: {_in: $hashes}}, blockchain: ALL}) {
            Cast {
                url
            }
        }
    }
` 