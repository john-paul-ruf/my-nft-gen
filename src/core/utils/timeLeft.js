import { timeToString } from './timeToString.js';

export const timeLeft = (startDate, remainingFrames) => {
    // Convert startDate to a Date object
    const startDateObj = new Date(startDate);

    // Get current date
    const currentDate = new Date();

    // Calculate duration between startDate and currentDate
    const durationMs = currentDate - startDateObj;

    const totalDurationMs = durationMs * remainingFrames;

    // Calculate projected end date
    const projectedEndDateMs = startDateObj.getTime() + totalDurationMs;
    const projectedEndDateObj = new Date(projectedEndDateMs);

    // Format projected end date for console
    const formattedProjectedEndDate = projectedEndDateObj.toLocaleString('en-US', { timeZone: 'UTC' });

    // Format duration for console
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const durationSeconds = Math.floor((durationMs % (1000 * 60)) / 1000);

    return `
    Frame Duration ${durationHours}:${durationMinutes}:${durationSeconds}
    Projected End Date: ${formattedProjectedEndDate}`;
};

