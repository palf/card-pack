exports.index = function (request, response) {
    'use strict';
    var data = { title: 'Node Template' };
    response.render('index', data);
};
