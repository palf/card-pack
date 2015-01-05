var config = {
    options: {
        timeout: 3000,
        ignoreLeaks: false
    },

    all: [ 'test/*.js', 'test/**/*.js' ]
};


module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.renameTask('simplemocha', 'test');
    grunt.config('test', config);
};
