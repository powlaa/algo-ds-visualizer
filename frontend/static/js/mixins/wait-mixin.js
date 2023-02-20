let waitMixin = {
    /**
     * Wait for a given amount of time
     */
    _wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    },
};
