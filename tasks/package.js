var config = {
    options: {
    },

    all: {
        src: './src/main.js',
        dest: './server/public/scripts/example.js'
    }
};

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-browserify');
    grunt.renameTask('browserify', 'package');
    grunt.config('package', config);
};
