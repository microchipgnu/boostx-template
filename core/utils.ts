export function getUnixTimestamp(dateString: string) {
    const date = new Date(dateString + "T00:00:00Z"); // Ensures time is set to 00:00:00 UTC
    return Math.floor(date.getTime() / 1000);
}

export function timestampToDateStr(unixTimestamp: number) {
    const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
    return date.toISOString().split('T')[0];
}

export function getTodayDateString() {
    let today = new Date();
    return today.toISOString().split('T')[0];
}