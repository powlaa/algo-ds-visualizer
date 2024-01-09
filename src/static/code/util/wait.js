/**
 * Wait for a given amount of time
 */
const wait = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export default wait;