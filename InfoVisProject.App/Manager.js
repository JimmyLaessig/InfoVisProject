document.write('<scr' + 'ipt type="text/javascript" src="./data/stations.js" ></scr' + 'ipt>');

var split = function (arr, chunkSize) {
    var groups = [], i;
    for (i = 0; i < arr.length; i += chunkSize) {
        groups.push(arr.slice(i, i + chunkSize));
    }
    return groups;
}

function State(year1, year2, value, zoom) {
    this.year1  = year;
    this.year2  = year2;
    this.value  = value;
    this.zoom   = zoom;
}


var markers = stations.map(station => {
    var id = station["Id"];
    var lat = parseFloat(station["Lat"]);
    var long = parseFloat(station["Long"]);
    var name = station["Name"];
    var year1 = 1990;
    var year2 = 2017;
    var value1 = 22.5;
    var value2 = 22.6;

    return new Marker(id, name, lat, long, year1, value1, year2, value2);
});


// min lod : 6
// max lod : 11
function filterStations(zoom)
{
    var level = Math.min(zoom - 6, 11 - 6);
    var level = Math.max(level, 0);

    var groupSize = 0.0;

    if (level == 0)         groupSize = 37;   
    else if(level == 1)     groupSize = 19;   
    else if (level == 2)    groupSize = 10;  
    else if (level == 3)    groupSize = 5;    
    else if (level == 4)    groupSize = 3;  
    else if (level == 5)    groupSize = 1; 
    else if (level == 6)    groupSize = 1;
    
    var groupedMarkers = split(markers, groupSize);  
    var groupedMarkers2 = groupedMarkers.map(group => { return Marker.average(group); });
    return groupedMarkers2;
}

function filterDataSet(state)
{

}