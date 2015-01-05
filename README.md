# Node Template

A template for websites built on Node and Express

## Setup

    npm install grunt-cli -g
    npm install

## Tasks

    grunt lint
    grunt test
    grunt package
    grunt serve
    grunt watch

### Package
The `package` command will use browserify to create a js file in the 'server/public/scripts' folder

### Watch
The `watch` command expects you to have installed the liveReload plugin to your browser. When files change, this task will run linting, unit tests, packaging and will reload the current web page if the generated script file changes.

