module.exports = {
    verbose: true,
    sauce: false,
    suites: ["test/*"],
    plugins: {
        sauce: {
            disabled: true
        },
        local: {
            remote: false,
            browsers: ["chrome", "firefox"]
        }
    }
};
