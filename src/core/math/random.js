// I stole this code of the net
export const getRandomIntExclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
};

export const getRandomIntInclusive = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// inspired
export const getRandomFromArray = (array) => array[getRandomIntExclusive(0, array.length)];

// Same
export const randomNumber = (min, max) => Math.random() * (max - min) + min;

// Same
export const randomId = () =>
// Math.random should be unique because of its seeding algorithm.
// Convert it to base 36 (numbers + letters), and grab the first 9 characters
// after the decimal.
    `-${Math.random().toString(36).substring(2, 9)}`;
