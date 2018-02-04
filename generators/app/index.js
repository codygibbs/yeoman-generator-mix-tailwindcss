// @ts-check

let Generator = require('yeoman-generator')

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts)

        this.argument('appname', {
            type: String,
            required: true
        })

        this.appname = this.options.appname
    }

    addFiles() {
        this._writeConfigFiles()
    
        this._writeAppFiles()
    
        this.npmInstall([
            'laravel-mix',
            'tailwindcss',
            'glob-all',
            'purgecss',
            'purgecss-webpack-plugin',
            'extract-text-webpack-plugin',
        ], { 'save': true })
    }

    end() {
        this.spawnCommandSync(
            this.destinationPath('node_modules/.bin/tailwind'), ['init', this.destinationPath('resources/css/tailwind-config.js')])
        
        this.spawnCommand('npm', ['run', 'dev'])
    }


    /**
     * @param {string} relPath 
     * 
     * @return {string}
     */
    _destinationAppPath(relPath) {
        return this.destinationPath(relPath)
    }

    _writeAppFiles() {
        this.fs.copyTpl(
            this.templatePath('resources/css/_styles.scss'),
            this._destinationAppPath('resources/css/styles.scss')
          )

        this.fs.copyTpl(
            this.templatePath('resources/js/_app.js'),
            this._destinationAppPath('resources/js/app.js')
          )

        this.fs.copyTpl(
            this.templatePath('public/_index.html'),
            this._destinationAppPath('public/index.html'),
            { title: this.appname }
          )

        this.fs.copyTpl(
            this.templatePath('.gitignore'),
            this._destinationAppPath('.gitignore')
          )

        this.fs.copyTpl(
            this.templatePath('_readme.md'),
            this._destinationAppPath('readme.md'),
            { title: this.appname }
          )
    }

    _writeConfigFiles() {
        this.fs.copyTpl(
            this.templatePath('_package.json'),
            this._destinationAppPath('package.json'),
            { name: this.appname }
          )

        this.fs.copyTpl(
            this.templatePath('_webpack.mix.js'),
            this._destinationAppPath('webpack.mix.js')
          )
    }
}
