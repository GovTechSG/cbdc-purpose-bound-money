module.exports = {
  istanbulReporter: ["html", "lcov", "text-summary"],
  providerOptions: {
    mnemonic: process.env.MNEMONIC,
  },
  skipFiles: ["test", "lib", "mocks"],
};
