export const currentTimeRange = (): number => {
    const now = Math.floor(Date.now() / 1000);
    return (now - (now % 5)) * 1000;
};
