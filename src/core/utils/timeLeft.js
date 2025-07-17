import { timeToString } from './timeToString.js';

export const timeLeft = (startDate, remainingFrames, maxConcurrentCalls) => {
    // Convert startDate to a Date object
    const startDateObj = new Date(startDate);

    // Get the current date
    const currentDate = new Date();

    // Calculate the duration between startDate and currentDate
    const durationMs = currentDate - startDateObj;

    // Calculate the adjusted total duration considering maxConcurrentCalls
    const adjustedDurationMs = (durationMs * remainingFrames) / maxConcurrentCalls;

    // Calculate the projected end date
    const projectedEndDateMs = startDateObj.getTime() + adjustedDurationMs;
    const projectedEndDateObj = new Date(projectedEndDateMs);

    // Format the projected end date for console
    const formattedProjectedEndDate = projectedEndDateObj.toLocaleString('en-US', { timeZone: 'CST' });

    // Format duration for console
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const durationSeconds = Math.floor((durationMs % (1000 * 60)) / 1000);

    return `
    Current Time: ${currentDate.toLocaleTimeString('en-US', { timeZone: 'CST' })}
    Frame Duration: ${durationHours}:${durationMinutes}:${durationSeconds}
    Projected End Date: ${formattedProjectedEndDate}`;
};

