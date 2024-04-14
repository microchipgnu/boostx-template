export const executeQuery = async ({query, variables, context}: { query: string, variables: any, context?: any }) => {
    const apiKey = context?.env?.AIRSTACK_API_KEY || process.env.AIRSTACK_API_KEY

    // TODO: make use of env var, remove before commiting
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