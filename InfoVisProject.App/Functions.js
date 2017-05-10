
function groupBy(a, keyFunction) {
    var groups = {};
    a.forEach(function (el) {
        var key = keyFunction(el);
        if (key in groups == false) {
            groups[key] = [];
        }
        groups[key].push(el);
    });
    return Object.keys(groups).map(function (key) {
        return {
            key: key,
            values: groups[key]
        };
    });
};





function split (arr, chunkSize) {
    var groups = [], i;
    for (i = 0; i < arr.length; i += chunkSize) {
        groups.push(arr.slice(i, i + chunkSize));
    }
    return groups;
}

function distinctBy(a, key) {
    var seen = {};
    return a.filter(function (item) {
        var k = key(item);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    })
}

function choose(a, condidtion, map) {
    return a.reduce(function (res, val) {
        if (condidtion(val)) {
            res.push(map(val));
        }
        return res;
    }, []);
}