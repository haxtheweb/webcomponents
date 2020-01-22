// lint-staged.config.js
const micromatch = require('micromatch')

module.exports = {
  '*.js,json': files => {
    // from `files` filter those _NOT_ matching `*test.js`
    const match = micromatch.not(files, 'elements/**/*.*.js **/analysis-error.json themes/**/*.*.js libraries/**/*.js')
    return `eslint ${match.join(' ')}`
  }
}
