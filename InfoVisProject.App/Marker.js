

function Tuple(year, value) {
	this.year = year;
	this.value = value;
}


class Marker
{

	constructor(id, name, lat, long, from, to, slope, samples)
    {
        this.id     = id;
        this.name   = name;
        this.lat    = lat;
        this.long   = long;
        this.from   = from;
        this.to     = to;
        this.slope	= slope;
		this.samples = samples;
    }


    get Id()        {return this.id; }
    get Name()      {return this.name;}
    get Latitude()  {return this.lat; }
    get Longitude() {return this.long; }
    get From()      {return this.from;}
    get To()        {return this.to;}
    get Slope()     {return this.slope;}
	get Samples() { return this.samples; }

    get ToolTip()
    {
        //let value1Text = (this.value1 == null) ? "n.A." : this.value1 + "";
        //let value2Text = (this.value2 == null) ? "n.A." : this.value2 + "";

        let html =
            '<p>' + this.name + '</p>';
            //'<ul style="list-style-type:none"> '+
            //'<li>' + this.year1 + ": " + value1Text+'</li>'+
            //'<li>' + this.year2 + ": " + value2Text+'</li>'+            
            //'</ul>';
        return html;
    }



    get Rotation()
    {
        if (this.slope == null )
        {
            return 0.0;
        }
        
        //var diff = this.value2 - this.value1;        
        //var rotation    = -diff * 100.0;    
        return this.slope;
        //return Math.min(90.0, Math.max(-90.0, rotation));      
    }

   

    get Color() {
        var rotation = this.Rotation;
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


    static group(marker) {
		
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
}


Marker.prototype.Contains = function (ids) {
    return ids.every(id => id in this.Id);
};