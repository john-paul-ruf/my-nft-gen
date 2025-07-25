// https://stackoverflow.com/a/51564734
export const hexToRgba = (hex, alpha = 1) => {
    const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
    return `rgba(${r},${g},${b},${alpha})`;
};

export const hexToRgbaObject = (hex, alpha = 1) => {
    const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
    return {
        red: r,
        green: g,
        blue: b,
        alpha: alpha,
    }
};

