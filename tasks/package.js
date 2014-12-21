var config = {
    options: {
    },

    solitaire: {
        src: './src/solitaire.js',
        dest: './server/public/scripts/solitaire.js'
    },

    freecell: {
        src: './src/freecell.js',
        dest: './server/public/scripts/freecell.js'
    },

    spider: {
        src: './src/spider.js',
        dest: './server/public/scripts/spider.js'
    }
};

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-browserify');
    grunt.renameTask('browserify', 'package');
    grunt.config('package', config);
};
