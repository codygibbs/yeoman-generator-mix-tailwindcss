let mix = require('laravel-mix');
let tailwindcss = require('tailwindcss')
let glob = require("glob-all")
let PurgecssPlugin = require("purgecss-webpack-plugin")


mix.js('resources/js/app.js', 'public/js')
   .setPublicPath('public');

mix.sass('resources/css/styles.scss', 'public/css')
  .options({
    processCssUrls: false,
    postCss: [ tailwindcss('./resources/css/tailwind-config.js') ],
  })


// Custom PurgeCSS extractor for Tailwind that allows special characters in
// class names.
// 
// https://github.com/FullHuman/purgecss#extractor
class TailwindExtractor {
    static extract(content) {
        return content.match(/[A-z0-9-:\/]+/g) || [];
    }
}

// Only run PurgeCSS during production builds for faster development builds
// and so you still have the full set of utilities available during
// development.
if (mix.inProduction()) {
    mix.webpackConfig({
      plugins: [
        new PurgecssPlugin({
  
          // Specify the locations of any files you want to scan for class names.
          paths: glob.sync([
            path.join(__dirname, "public/**/*.html"),
            path.join(__dirname, "public/**/*.php"),
          ]),
          extractors: [
            {
              extractor: TailwindExtractor,
  
              // Specify the file extensions to include when scanning for
              // class names.
              extensions: ["html", "js", "php", "vue"]
            }
          ]
        })
      ]
    });
  }