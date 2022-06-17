export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export const doEffect = (chance) => {
    const result = getRandomInt(0, 100)
    return result <= chance;
}