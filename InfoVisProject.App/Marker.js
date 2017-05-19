

class Marker
{

    constructor(id, name, lat, long, from, to, slope, values)
    {
        this.id     = id;
        this.name   = name;
        this.lat    = lat;
        this.long   = long;
        this.from   = from;
        this.to     = to;
        this.slope = slope;
        this.values = values;
    }


    get Id()        {return this.id; }
    get Name()      {return this.name;}
    get Latitude()  {return this.lat; }
    get Longitude() {return this.long; }
    get From()      {return this.from;}
    get To()        {return this.to;}
    get Slope()     {return this.slope;}


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

        if (marker.length <= 0) {
            return null;
        }

        var slope = 0.0;

        var count = 0.0;
        var count2 = 0.0;

        var minLat = Infinity;
        var maxLat = -Infinity;
        var minLong = Infinity;
        var maxLong = -Infinity;
      
        var id = "";
        var name = "";

        marker.forEach((element) => {

            minLat = Math.min(element.lat, minLat);
            maxLat = Math.max(element.lat, maxLat);
            minLong = Math.min(element.long, minLong);
            maxLong = Math.max(element.long, maxLong);

            if (element.Slope != null)
            {
                slope += element.Slope;
                count++;
            }
           
            id += element.id + "/";
            name += element.name + "/";


        });

        var lat = (minLat + maxLat) / 2.0;
        var long = (minLong + maxLong) / 2.0;

        id      = id.substring(0, id.length - 1);
        name    = name.substring(0, name.length - 1);


        var year1 = marker[0].year1;
        var year2 = marker[0].year2;


        slope = (count == 0) ? null : slope / count;
        

        return new Marker(id, name, lat, long, year1, year2, 0, []);
    }   
}