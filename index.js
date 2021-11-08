'use strict';

const concat = require('broccoli-concat')
const filter = require('broccoli-funnel')
const merge = require('broccoli-merge-trees')
const tailwindFilter = require('./lib/tailwind-filter')

module.exports = {

  name: require('./package').name,

  included(app) {
    this._super.included.apply(this, arguments)
    this.options = app.options['ember-calcite-styles']
  },

  postprocessTree(type, tree) {
    if (type !== 'css') return tree
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
              tailwindFilter(
                filter(stylesWithAddonCss, { include: [ 'assets/ember-calcite-styles.css' ]}),
                {
                  purge: this.options?.purge
                }
              )
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

}


