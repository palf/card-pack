var config = {
    options: { atBegin: true },

    lint: {
        files: [ '<%= lint.all.src %>', '.jshintrc' ],
        tasks: [ 'lint' ]
    },

    test: {
        files: [ '<%= test.all %>', 'src/**/*.js' ],
        tasks: [ 'test' ]
    },

    package: {
        files: [ '<%= package.all.src %>', 'src/**/*.js' ],
        tasks: [ 'package' ]
    },

    serve: {
        files:  [
            'server/*.js',
            'server/routes/*.js'
        ],
        tasks:  [ 'serve:reload' ],
        options: {
            spawn: false
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
