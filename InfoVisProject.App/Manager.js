document.write('<script type="text/javascript" src="./data/stations.js" ></script>');
document.write('<script type="text/javascript" src="./data/data.js" ></script>');
document.write('<script type="text/javascript" src="./Functions.js" ></script>');




function State(year1, year2, value, zoom) {
    this.year1  = year1;
    this.year2  = year2;
    this.value  = value;
    this.zoom   = zoom;
}

var currentState = new State("1969", "2014", "temperature", 10);



function calculateMarkers(state)
{
    
    var marker = stations.map(station => {


        var value1 = data.find(v => v["station"] == station["Id"] && v["year"] == state.year1 && v[state.value] != null);                      
        var value2 = data.find(v => v["station"] == station["Id"] && v["year"] == state.year2 && v[state.value] != null);
                                
           
        console.log(value1);
        var lat         = parseFloat(station["Lat"]);
        var long        = parseFloat(station["Long"]);


        var value1 = (value1 != undefined) ? value1[state.value] : null;
        var value2 = (value2 != undefined) ? value2[state.value] : null;

        var value1 = (value1 != null) ? value1.Value : null;
        var value2 = (value2 != null) ? value2.Value : null;
        
        
        return new Marker(station["Id"], station["Name"], lat, long, state.year1, value1, state.year2, value2);
        
    });
    
    return createMarkerLoD(marker, state.zoom);
}


// min lod : 6
// max lod : 11
function createMarkerLoD(markers, zoom)
{
    var level = Math.max(0, Math.min(zoom - 6, 11 - 6));
    

    var groupSize = 0.0;

    if (level == 0)         groupSize = 37;   
    else if(level == 1)     groupSize = 19;   
    else if (level == 2)    groupSize = 10;  
    else if (level == 3)    groupSize = 5;    
    else if (level == 4)    groupSize = 3;  
    else if (level == 5)    groupSize = 1; 
    else if (level == 6)    groupSize = 1;
   
    var groupedMarkers = split(markers, groupSize);
   
    var groupedMarkers2 = groupedMarkers.map(group => Marker.group(group));
    
    return groupedMarkers2;
}