export const checkIfAnyNullOrUndefined = (obj) => Object.values(obj).some((value) => value === null || value === undefined);
