export function timeAgo({ createdAt }) {
    const now = new Date();
    const past = new Date(createdAt)
    const diff = Math.floor((now - past) / 1000);// how many seconds return

    if (diff < 60) return `${diff} second${diff !== 1 ? "s" : ""} ago`
    if (diff < 3600) {
        const minutes = Math.floor(diff / 60)
        return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`
    }
    if (diff < 86400) {
        const hours = Math.floor(diff / 3600);
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    if (diff < 2592000) {
        const days = Math.floor(diff / 86400);
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
    const months = Math.floor(diff / 2592000);
    return `${months} month${months !== 1 ? 's' : ''} ago`;
}