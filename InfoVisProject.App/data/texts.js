var lineplotTitle_Temperature           = "Mean Temperature per Year";
var lineplotTitle_Salinity              = "Mean Salinity per Year";
var lineplotTitle_DiscreteChlorophyll   = "Mean Discrete Chlorophyll per Year";

var lineplotYAxis_Temperature           = "Temperature (°C)";
var lineplotYAxis_Salinity              = "Salinity (psu)";
var lineplotYAxis_DiscreteChlorophyll   = "Discrete Chlorophyll (micrograms per liter)";


function getUnit(value)
{
    if (value == "temperature") {
        return "°C";
    }
    else if (value == "salinity") {
        return "psu";
    }
    else if (value == "discreteChlorophyll") {
        return "ug/L";
    }
}


function getLineplotTitle(value)
{
    if (value == "temperature") {
        return lineplotTitle_Temperature;
    }
    else if (value == "salinity") {
        return lineplotTitle_Salinity;
    }
    else if (value == "discreteChlorophyll") {
        return lineplotTitle_DiscreteChlorophyll;
    }
    else return "";
}


function getLineplotYAxis(value)
{
    if (value == "temperature") {
        return lineplotYAxis_Temperature;
    }
    else if (value == "salinity") {
        return lineplotYAxis_Salinity;
    }
    else if (value == "discreteChlorophyll") {
        return lineplotYAxis_DiscreteChlorophyll;
    }
    else return "";
}