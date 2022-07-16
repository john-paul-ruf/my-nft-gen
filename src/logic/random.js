//I stole this code of the net
export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

//Same
export const randomNumber = (min, max) => {
    return Math.random() * (max - min) + min;
}