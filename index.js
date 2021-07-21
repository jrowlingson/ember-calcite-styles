'use strict';

const concat = require('broccoli-concat')
const funnel = require('broccoli-funnel')
const merge = require('broccoli-merge-trees')
const postcssFilter = require('./lib/postcss-filter')
const { mv } = require('broccoli-stew')

module.exports = {

  name: require('./package').name,

  postprocessTree(type, tree) {
    if (type === 'css') {
      const stylesWithAddonCss = merge(
        [tree, funnel(`${__dirname}/app/styles`, { destDir: 'assets' })],
        {
          overwrite: true,
        }
      )
      return postcssFilter(
        merge(
          [
            stylesWithAddonCss,
            mv(
              concat(stylesWithAddonCss, {
                inputFiles: ['assets/vendor.css'],
                footerFiles: ['assets/ember-calcite-styles.css'],
                outputFile: 'vendor.css',
              }),
              'assets'
            ),
          ],
          { overwrite: true }
        )
      )
    }
    return tree
  },

}
