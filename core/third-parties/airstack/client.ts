export const executeQuery = async ({query, variables}: { query: string, variables: any }) => {
    const apiKey = process.env.AIRSTACK_API_KEY

    const response = await fetch('https://api.airstack.xyz/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `${apiKey}`,
        },
        body: JSON.stringify({
            query,
            variables
        }),
    });

    return response.json();
}