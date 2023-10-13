const { generateWebpackConfig } = require('shakapacker')
const options = {}

// This results in a new object copied from the mutable global
module.exports = generateWebpackConfig(options)
