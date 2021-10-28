'use strict';

const concat = require('broccoli-concat')
const filter = require('broccoli-funnel')
const merge = require('broccoli-merge-trees')
const tailwindFilter = require('./lib/tailwind-filter')

module.exports = {

  name: require('./package').name,

  postprocessTree(type, tree) {
    if (type === 'css') {

      const stylesWithAddonCss = merge(
        [tree, filter(`${__dirname}/app/styles`, { destDir: 'assets' })],
        {
          overwrite: true,
        }
      )

      return merge(
        [
          stylesWithAddonCss,
          concat(
            merge(
              [
                stylesWithAddonCss,
                tailwindFilter(filter(stylesWithAddonCss, { include: [ 'assets/ember-calcite-styles.css' ]}))
              ],
              {
                overwrite: true
              }
            ),
            {
              inputFiles: [ 'assets/vendor.css' ],
              footerFiles: [ 'assets/ember-calcite-styles.css' ],
              outputFile: 'assets/vendor.css'
            }
          )
        ],
        {
          overwrite: true
        }
      )
    }
    return tree
  }

}


