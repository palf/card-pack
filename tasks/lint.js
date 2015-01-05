var config = {
    options: {
        jshintrc: '.jshintrc'
    },

    all: {
        src: [
            'src/*.js',
            'src/**/*.js',
            'test/*.js',
            'test/**/*.js',
            'server/*.js',
            'server/routes/*.js',

            'gruntfile.js',
            'tasks/*.js'
        ]
    }
};

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.renameTask('jshint', 'lint');
    grunt.config('lint', config);
};
