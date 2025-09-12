export const EffectCategories = {
    PRIMARY: 'primary',
    SECONDARY: 'secondary', 
    FINAL_IMAGE: 'finalImage',
    KEY_FRAME: 'keyFrame'
};

export const isValidCategory = (category) => {
    return Object.values(EffectCategories).includes(category);
};