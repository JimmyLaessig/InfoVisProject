document.write('<script type="text/javascript" src="./data/stations.js" ></script>');
document.write('<script type="text/javascript" src="./data/data.js" ></script>');
document.write('<script type="text/javascript" src="./Functions.js" ></script>');
document.write('<script src="./Marker.js" charset="utf-8"></script>');


function RenderObjects(activeMarker, selectedMarker, avgMarker)
{
    this.activeMarker   = activeMarker;
    this.selectedMarker = selectedMarker;
    this.avgMarker      = avgMarker;
}


function State(year1, year2, domain, infoType, zoom, selectedMarkerId) {
    this.year1              = year1;
    this.year2              = year2;
    this.domain             = domain;
    this.infoType           = infoType;
    this.zoom               = zoom;
    this.selectedMarkerId   = selectedMarkerId;
    
}


class Manager {


    constructor(state, selectedMarker)
    {
        this.state = state;
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
			var lat = parseFloat(stations[i].Lat);
			var long = parseFloat(stations[i].Long);

            minLat = Math.min(lat, minLat);
            maxLat = Math.max(lat, maxLat);
            minLong = Math.min(long, minLong);
            maxLong = Math.max(long, maxLong);
        }

        var lat = (maxLat + minLat) / 2.0;
        var long = (maxLong + minLong) / 2.0;

        return { lat: lat, long: long };
    };


    getMarker(state)
    {
        var data_clamped = data.filter(v => parseInt(v["year"]) >= state.year1 &&
                                            parseInt(v["year"]) <= state.year2 &&
                                            v[state.domain] != null);


        var marker = stations.map(station => {

			var lat		= parseFloat(station.Lat);
			var long	= parseFloat(station.Long);


			// Get samples for this station
			var samples = data_clamped.filter((v) => v["station"] == station.Id && v[state.domain] != null);

			
			var values	= samples.map(sample => sample[state.domain].Value);
			var years	= samples.map(sample => parseInt(sample["year"]));
  

			// Normalize data to 0..1
            var xn = normalize(values);
            var yn = normalize(years);

            // Calculate linear regression using least squares estimation
            var line = calcLeastSquares(xn, yn);

            var angle = Math.atan(line.b1) * Math.PI / 180;
            
			var samples = values.map((val, i) => new Tuple(years[i], val));
			
            return new Marker([station.Id], [station.Name], lat, long, state.year1, state.year2, angle, samples );

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

        var groupedMarkers = groupedMarkers.map(group => groupMarker(group));
 

        var avgMarker = groupMarker(groupedMarkers);

        

        var selectedMarker = maxBy(groupedMarkers, m =>
        {
            return this.state.selectedMarkerId.filter(id => m.Id.includes(id)).length;
        });

        console.log(selectedMarker);
        this.state = new State(this.state.year1, this.state.year2, this.state.domain, this.state.infoType, this.state.zoom, selectedMarker.Id);

        return new RenderObjects(groupedMarkers, selectedMarker, avgMarker);
    }   
}