import { getBoostedCastsForCurrentEpoch } from "@/core/watcher/get-boosted-casts-current-epoch";
import { FarcasterEmbed } from "react-farcaster-embed";
import "react-farcaster-embed/dist/styles.css";

export const revalidate = 5

export default async function Page() {
    const { epochId, urls } = await getBoostedCastsForCurrentEpoch()

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '20px',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  
        },
        header: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#fff'
        },
        description: {
            fontSize: '16px',
            color: '#666',
            marginBottom: '20px'
        },
        embed: {
            width: '100%',
            marginBottom: '20px'
        }
    };

    return (
        // @ts-ignore
        <div style={styles.container}>
            <div style={styles.header}>Boosted Feed (${process.env.SYMBOL}) - Epoch {epochId}</div>
            <div style={styles.description}>
                Explore the latest boosted casts from the community.
            </div>
            {
                urls?.map((url: string, index: number) => (
                    <div key={index} style={styles.embed}>
                        <FarcasterEmbed url={url} />
                    </div>
                ))
            }
        </div>
    );
}
