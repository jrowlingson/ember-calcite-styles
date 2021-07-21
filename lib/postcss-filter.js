const Filter = require('broccoli-persistent-filter')
const postcss = require('postcss')
const tailwindcss = require('tailwindcss')
const tailwindConfig = require(`${__dirname}/../../@esri/calcite-styles/tailwind.config.js`)

class PostCSSFilter extends Filter {

  constructor(inputNode, options = {}) {
    super(inputNode, { annotation: options.annotation })
    this.extensions = ['css']
    this.targetExtension = 'css'
    this.options = options
  }

  async processString(content, relativePath) {
    try {
      const result = await postcss([
        tailwindcss(Object.assign(tailwindConfig, { prefix: 'cs-' })),
      ]).process(content, {
        from: relativePath,
      })
      result.warnings().forEach(warning => process.stderr.write(warning.toString()))
      return result.css
    } catch (e) {
      process.stderr.write(e.message)
      throw e
    }
  }

}

module.exports = function postcssFilter(...params) {
  return new PostCSSFilter(...params)
}

module.exports.PostCSSFilter = PostCSSFilter
