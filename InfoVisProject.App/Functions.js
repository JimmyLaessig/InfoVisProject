

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


// Normalizes the values in a such that the smallest is mapped to 0 and the largest to 1
function normalize(a)
{
    var max = Math.max(...a);
    var min = Math.min(...a);

    return a.map(v => (v - min) / (max - min));
}


function maxBy(a, f)
{
    var max = Math.max(...(a.map(f)));

    return a.find(a => f(a) == max);
}


function minBy(a, map)
{
    return Math.min(...(a.map(f)));
}

// Performs Least Squares Estimation
// http://www.stat.ufl.edu/~winner/qmb3250/notespart2.pdf
// Returns the coefficients b0 b1 for the line equation y = b0 + b1 * x
function calcLeastSquares(x, y) {

    var n = x.length;

    var xy = x.map( (value, index) => value + y[index]);
   

    var sum_x = sum(x);
    var sum_y = sum(y);

    var sum_xx = sumBy(x, xi => xi * xi);
    var sum_yy = sumBy(y, yi => yi * yi);
    var sum_xy = sum(xy);
    

    var avg_x = sum_x / n;
    var avg_y = sum_y / n;


    var SSxx = sum_xx - (sum_x * sum_x) / n;
    var SSxy = sum_xy - (sum_x * sum_y) / n;
    var SSyy = sum_yy - (sum_y * sum_y) / n;
   

    var b1 = SSxy / SSxx;

    var b0 = avg_y - b1 * avg_x;
    
    return {b0 : b0, b1 : b1};
}

// Calculates the center value from a sequence (max + min) / 2
function center(a)
{
	var min = Infinity;
	var max = -Infinity;
	
	a.forEach(v => {
		min = Math.min(v, min);
		max = Math.max(v, max);
	});

	return (min + max) / 2;
}


function sum(a) {
    return a.reduce((acc, val) => acc + val, 0.0);
}


function avg(a) {
    return sum(a) / a.length;
}


function sumBy(a, map) {
    return a.reduce((acc, val) => acc + map(val), 0.0);
}


function avgBy(a, map) {
    return a.reduce((acc, val) => acc + map(val), 0.0) / a.length;
}


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