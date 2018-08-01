module.exports = {
    verbose: true,
    testTimeout: 60 * 1000,
    plugins: {
        sauce: {
            disabled: true,
            browsers: ["Windows 8.1/chrome", "OS X 10.10/chrome"]
        }
    }
};
