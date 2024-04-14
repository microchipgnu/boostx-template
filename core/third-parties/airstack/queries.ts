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
                  }
            }
        }
    }
`