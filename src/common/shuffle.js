function shuffle (array) {
    var m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m);
        m--;
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}

module.exports = shuffle;
