//I stole this code of the net
export const getRandomIntExclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export const getRandomIntInclusive = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Same
export const randomNumber = (min, max) => {
    return Math.random() * (max - min) + min;
}