var config = {
    options: { atBegin: true },

    lint: {
        files: [ '<%= lint.all.src %>', '.jshintrc' ],
        tasks: [ 'lint' ]
    },

    test: {
        files: [ '<%= test.all %>', '<%= lint.all.src %>' ],
        tasks: [ 'test' ]
    },

    packageSolitaire: {
        files: [ '<%= package.solitaire.src %>', 'src/common/*.js', 'src/solitaire/*.js' ],
        tasks: [ 'package:solitaire' ]
    },

    packageFreecell: {
        files: [ '<%= package.freecell.src %>', 'src/common/*.js', 'src/freecell/*.js' ],
        tasks: [ 'package:freecell' ]
    },

    packageSpider: {
        files: [ '<%= package.spider.src %>', 'src/common/*.js', 'src/spider/*.js' ],
        tasks: [ 'package:spider' ]
    },

    serve: {
        files:  [
            'server/*.js',
            'server/routes/*.js'
        ],
        tasks:  [ 'serve:reload' ],
        options: {
            spawn: false,
            livereload: true
        }
    },

    reload: {
        files:  [
            'server/public/scripts/*.js',
            'server/public/styles/*.css',
            'server/views/*.jade'
        ],
        tasks:  [ ],
        options: {
            spawn: false,
            livereload: true
        }
    }
};

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.config('watch', config);
};
