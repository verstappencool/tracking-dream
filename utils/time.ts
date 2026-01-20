export const formatDate = (date: Date) =>
    date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

export const formatTime = (date: Date) =>
    date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
    });