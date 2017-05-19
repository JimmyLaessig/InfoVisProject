document.write('<script type="text/javascript" src="./data/stations.js" ></script>');
document.write('<script type="text/javascript" src="./data/data.js" ></script>');
document.write('<script type="text/javascript" src="./Functions.js" ></script>');


function State(year1, year2, value, zoom) {
    this.year1 = year1;
    this.year2 = year2;
    this.value = value;
    this.zoom = zoom;
}


class Manager {


    constructor(state, selectedMarker)
    {
        this.state = state;
        this.selectedMarker = selectedMarker;
    }

    set SelectedMarker(value)
    {
        this.selectedMarker = value;
    }

    get SelectedMarker()
    {
        return this.selectedMarker;
    }

    set State(value) 
    {
        this.state = value;
    }


    get State()
    {
        return this.state;
    }


    get ModalCoordinates()
    {
        var minLat = Infinity;
        var maxLat = -Infinity;
        var minLong = Infinity;
        var maxLong = -Infinity;

        for (var i = 0; i < stations.length; i++) {
            var lat = parseFloat(stations[i]["Lat"]);
            var long = parseFloat(stations[i]["Long"]);

            minLat = Math.min(lat, minLat);
            maxLat = Math.max(lat, maxLat);
            minLong = Math.min(long, minLong);
            maxLong = Math.max(long, maxLong);
        }

        var lat = (maxLat + minLat) / 2.0;
        var long = (maxLong + minLong) / 2.0;

        return { lat: lat, long: long };
    };


    getMarker(state) {
        
        var data_clamped = data.filter(v => parseInt(v["year"]) >= parseInt(state.year1) &&
                                            parseInt(v["year"]) <= parseInt(state.year2) &&
                                            v[state.value] != null);
        
        var marker = stations.map(station => {

            var values  = data_clamped.filter((v) => v["station"] == station.Id && v[state.value] != null);
            
            var lat     = parseFloat(station["Lat"]);
            var long    = parseFloat(station["Long"]);

            // Normalize data to 0..1
            var values = values.map(v => v[state.value].Value);
            var years = values.map(v => parseInt(v["year"]) - parseInt(state.year1));

            var xn = normalize(values);
            var yn = normalize(years);

            //console.log("Max: " + Math.max(...values));
            //console.log("Min: " + Math.min(...values));

            var value1 = calcLeastSquares(values, yn);
            var value2 = calcLeastSquares(xn, yn);

            var angle1 = Math.atan(value1.b1) * Math.PI / 180;
            var angle2 = Math.atan(value2.b1) * Math.PI / 180;

            //console.log("Id " + station.Id + ": #measures : " + x.length + " b0: " + value.b0 + " b1: " + value.b1);
            //console.log("Angle1: " + angle1);
            //console.log("Angle2: " + angle2);

            var value1 = (value1 != undefined) ? value1[state.value] : null;
            var value2 = (value2 != undefined) ? value2[state.value] : null;

            var value1 = (value1 != null) ? value1.Value : null;
            var value2 = (value2 != null) ? value2.Value : null;


            return new Marker(station["Id"], station["Name"], lat, long, state.year1, state.year2, angle2, [] );

        });

        return marker;
    }


    // min lod : 6
    // max lod : 11
    getMarkerLoD(state) {
        var markers = this.getMarker(state);
        var level = Math.max(0, Math.min(state.zoom - 6, 11 - 6));


        var groupSize = 0.0;

        if (level == 0) groupSize = 37;
        else if (level == 1) groupSize = 19;
        else if (level == 2) groupSize = 10;
        else if (level == 3) groupSize = 5;
        else if (level == 4) groupSize = 3;
        else if (level == 5) groupSize = 1;
        else if (level == 6) groupSize = 1;

        var groupedMarkers = split(markers, groupSize);

        var groupedMarkers2 = groupedMarkers.map(group => Marker.group(group));

        return groupedMarkers2;
    }


    get LineplotData() {

        var values = [];
        
        //for (var year = parseInt(this.state.year1); year <= parseInt(this.state.year2); year++ )
        //{
        //    var state = new State(year.toString(), year.toString(), this.state.value, this.state.zoom);
        //    var marker = this.getMarkerLoD(state);


        //    var avgValue = (marker.length > 0) ? avgBy(marker, m => m.value1) : null;

        //    var m = marker.find(m => m.getId == this.selectedMarker.getId);
        //    var value = (m != null) ? m.value1 : null;
        //    values.push({ year: year.toString(), avg : avgValue, value : value});
                  
        //}

        

        return values;
    }
}


