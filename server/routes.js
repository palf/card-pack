exports.solitaire = function (req, res) {
    var data = { title: 'Solitaire' };
    res.render('solitaire', data);
};

exports.freecell= function (req, res) {
    var data = { title: 'Freecell' };
    res.render('freecell', data);
};

exports.spider= function (req, res) {
    var data = { title: 'Spider Solitaire' };
    res.render('spider', data);
};
