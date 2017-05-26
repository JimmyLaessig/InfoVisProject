

function Tuple(year, value) {
	this.year = year;
	this.value = value;
}


function Marker(id, name, lat, long, from, to, slope, samples) {
    this.Id         = id;
    this.Name       = name;
    this.Latitude   = lat;
    this.Longitude  = long;
    this.From       = from;
    this.To         = to;
    this.Slope      = slope;
    this.Samples    = samples;

    this.ToolTip = toolTip;
    this.Rotation = rotation;
    this.Color = color;

    this.Contains = contains;
    this.Equals = equals;

    this.ContainsNull = containsNull;
}

    function containsNull(infoType)
    {      
        if (infoType == "trend") {
            return this.Slope == null;
        }
        else if (infoType == "avg") {
            
            return this.Samples.length < 2
        }
        return true;
};
    
    function contains(ids) {
        return ids.every(id => id in this.Id);
    };

    function toolTip(infoType) {

        
        if (infoType == "trend")
        {
            let html =
                '<p>' + this.Name + '</p>' + 'Slope: ' + this.Slope;
            return html;
        }
        
        else if (infoType == "avg")
        {
            let sample1 = this.Samples[0]
            let sample2 = this.Samples[this.Samples.length - 1]

            if (this.ContainsNull(infoType)) {
                let html =
                    '<p>' + this.Name + '</p>' +
                    '<ul style="list-style-type:none"> ' +
                    '<li>' + this.From + ':  n.A. </li>' +
                    '<li>' + this.To + ': n.A. </li>' +
                    '</ul>';
                return html;
            }
            else {
                let html =
                    '<p>' + this.Name + '</p>' +
                    '<ul style="list-style-type:none"> ' +
                    '<li>' + sample1.year + ": " + sample1.value + '</li>' +
                    '<li>' + sample2.year + ": " + sample2.value + '</li>' +
                    '</ul>';
                return html;
            }
        }
        return "";   
        
        
    }



    function rotation(infoType, domain) {

        if (infoType == "trend") {
            if (this.slope == null) {
                return 0;
            }
            return  - this.slope * 100;
        }
        else if (infoType == "avg") {
            if (this.ContainsNull(infoType))
            {
                return 0.0;
            }
            else {
                var min = 0.0;
                var max = 0.0;
                if (domain == "temperature")
                {
                    max = maxTemperature;
                    min = minTemperature;
                }
                else if (domain == "salinity")
                {
                    max = maxSalinity;
                    min = minSalinity;
                }
                else if (domain == "discreteChlorophyll")
                {
                    max = maxDiscreteChlorohpyll;
                    min = minDiscreteChlorophyll;
                }
  
                var value1_normalized = (this.Samples[0].value - min) / (max - min);
                var value2_normalized = (this.Samples[this.Samples.length - 1].value - min) / (max - min);

                var diff = value2_normalized - value1_normalized;

                return -90 * diff;
            }
        }
        return 0.0;
          
    }



    function color(infoType, domain) {
        var rotation = this.Rotation(infoType, domain);
        if (rotation < 0) {

            var i = (-rotation / 90.0);
            var interpolate = d3.interpolateRgb("yellow", "red");
            return interpolate(i);
        }
        else {
            var i = Math.abs(rotation / 90.0);

            var interpolate = d3.interpolateRgb("yellow", "green");
            return interpolate(i);
        }
    }


    function equals(other) {   
        return this.Id.every(id => other.Id.includes(id)) && other.Id.every(id => this.Id.includes(id));
    }
    var groupMarker = function(marker) {
		
		var count = marker.length;


		if (count <= 0)
		{
            return null;
        }


		var id = [].concat.apply([], marker.map(m => m.Id));
		
		var name	= [].concat.apply([], marker.map(m => m.Name));

		var lat		= center(marker.map(m => m.Latitude));
		var long	= center(marker.map(m => m.Longitude));

		
		var slopes	= marker.filter(m => m.Slope != null && !isNaN(m.Slope));
		var slope	= (slopes.length > 0) ? avgBy(slopes, m => m.Slope) : null;	

        var year1	= marker[0].From;
        var year2	= marker[0].To;      

		// Get the sample from the marker
		var samples = marker.map(m => m.Samples);
		// Concat 2D Array to 1D Array
		var samples = [].concat.apply([], samples);
		// Group samples by year
		var samples = groupBy(samples, s => s.year + "");
		// Average grouped samples
		var samples = samples.map(o => new Tuple(parseInt(o.key), avgBy(o.values, t => t.value)));
		
		return new Marker(id, name, lat, long, year1, year2, slope, samples);
    }   




