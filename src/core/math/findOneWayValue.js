/**
 Given a range return the current value for the given frame in a total number of
 frames.
 **/
export const findOneWayValue = (min, max, times, totalFrame, currentFrame, invert = false) => {
    const range = max - min; //the range
    const segment = totalFrame / times;  //Segment is the number of frames if we only did the effect once
    const halfSegment = segment / 2;  //number of frame to go up and back with in a given time
    //the magic: frame segment is the current frame number if we only did this one time. Modulus operator
    const frameSegment = currentFrame % segment;
    const step = range / halfSegment; //How much to increment in a single frame

    if (!invert) {
        return min + (step * frameSegment); //bottom to top of range
    }

    return max - (step * frameSegment); //top to bottom of range
}
