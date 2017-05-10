

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
        let value1Text = (this.value1 == null) ? "n.A." : this.value1 + "";
        let value2Text = (this.value2 == null) ? "n.A." : this.value2 + "";

        let html =
            '<p>' + this.name + '</p>' +
            '<ul style="list-style-type:none"> '+
            '<li>' + this.year1 + ": " + value1Text+'</li>'+
            '<li>' + this.year2 + ": " + value2Text+'</li>'+            
            '</ul>';
        return html;
    }


    get getRotation()
    {
        if (this.value1 == null || this.value2 == null)
        {
            return 0.0;
        }
        
        var diff = this.value2 - this.value1;        
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

    get containsNull()
    {
        return this.value1 == null || this.value2 == null;
    }

    static group(marker) {

        if (marker.length <= 0) {
            return null;
        }

        var value1 = 0.0;
        var value2 = 0.0;

        var count1 = 0.0;
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

            if (element.value1 != null)
            {
                value1 += element.value1;
                count1++;
            }
            if (element.value2 != null)
            {
                value2 += element.value2;
                count2++;
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


        value1 = (count1 == 0) ? null : value1 / count1;
        value2 = (count2 == 0) ? null : value2 / count2;

        return new Marker(id, name, lat, long, year1, value1, year2, value2);
    }   
}