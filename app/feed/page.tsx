import { getBoostedCastsForCurrentEpoch } from "@/core/watcher/get-boosted-casts-current-epoch";
import { FarcasterEmbed } from "react-farcaster-embed";
import "react-farcaster-embed/dist/styles.css";

export default async function Page() {
    const boostedCasts = await getBoostedCastsForCurrentEpoch()

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '20px',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        },
        header: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#fff'
        },
        description: {
            fontSize: '16px',
            color: '#666',
            marginBottom: '20px'  // Adds some space between the description and the feeds
        },
        embed: {
            width: '100%', // Adjust width as necessary
            marginBottom: '20px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>Boosted Feed (${process.env.SYMBOL})</div>
            <div style={styles.description}>
                Explore the latest boosted casts from the community.
            </div>
            {
                boostedCasts.map((url: string, index: number) => (
                    <div key={index} style={styles.embed}>
                        <FarcasterEmbed url={url} />
                    </div>
                ))
            }
        </div>
    );
}
