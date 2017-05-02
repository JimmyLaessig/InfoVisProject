

class Marker
{

    constructor(id, name, lat, long, year1, value1, year2, value2)
    {
        this.id = id;
        this.name = name;
        this.lat = lat;
        this.long = long;
        this.year1 = year1;
        this.year2 = year2;
        this.value1 = value1;
        this.value2 = value2;    
    }
    get getId()
    {
        return id;
    }
    get getYear1()
    {
        return this.year1;
    }
    get getYear2()
    {
        return this.year2;
    }
    get getValue1()
    {
        return this.value1;
    }
    get getValue2()
    {
        return this.value2;
    }
    get getTooltip()
    {
        let html =
            '<p>' + this.name + '</p>' +
            '<ul style="list-style-type:none"> '+
            '<li>'+this.year1 + ": " + this.value1+'</li>'+
            '<li>'+this.year2 + ": " + this.value2+'</li>'+            
            '</ul>';
        return html;
    }


    get getRotation()
    {       
        var diff        = this.value2 - this.value1;        
        var rotation    = -diff * 100.0;     
        return Math.min(90.0, Math.max(-90.0, rotation));      
    }

    get getLatitude()
    {
        return this.lat;
    }

    get getLongitude()
    {
        return this.long;
    }

    get getColor() {
        var rotation = this.getRotation;
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


    static average(markers)
    {
        
        if (markers.length <= 0)
            return null;

        var value1 = 0.0;
        var value2 = 0.0;
        var lat     = 0.0;
        var long    = 0.0;

        var id      = "";
        var name    = "";

        markers.forEach((element) => {
            value1  += element.value1;
            value2  += element.value2;
            lat     += element.lat;
            long    += element.long;
            id      += element.id + "/";
            name    += element.name + "/";
        });

        id      = id.substring(0, id.length - 1);
        name    = name.substring(0, name.length - 1);

        lat     = lat    / markers.length;
        long    = long   / markers.length;
        value1  = value1 / markers.length;
        value2  = value2 / markers.length;

        return new Marker(id, name, lat, long, markers[0].year1, value1, markers[0].year2, value2);
    }

}