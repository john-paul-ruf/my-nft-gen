// Stole off the net somewhere on stackoverflow.  Whoever you are, god bless you...
export const timeToString = (rez) => {
    const h = Math.trunc(rez / 3600000 % 100).toString().padStart(2, '0');
    const m = Math.trunc(rez / 60000 % 60).toString().padStart(2, '0');
    const s = Math.trunc(rez / 1000 % 60).toString().padStart(2, '0');
    const ms = Math.trunc(rez % 1000).toString().padStart(3, '0');
    return `${h}:${m}:${s}.${ms}`;
};
