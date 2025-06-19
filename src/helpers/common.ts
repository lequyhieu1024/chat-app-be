export function convertName(name: string): string {
    const normalized = name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();

    const randomSuffix = Math.random().toString(36).substring(2, 5);

    return normalized + randomSuffix;
}
