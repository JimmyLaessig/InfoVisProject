## Visualization of Water Quality of San Francisco Bay
06.06.2017  
Author: Bernhard Rainer  
Email: bernhard.rainer@tuwien.ac.at  


This visualization displays the water quality measurements of the San Francisco Bay from 1969 to 2014. 
The application is developed as a standalone javascript web-aplication, meaning that no build has to be executed and no webserver is needed.

However, I've included a data-cleaning program that beforehand reduces the dataset to averages-per-year and reduces the dimensionality. The output is directly copied to the 'InfoVisProject.App/data/data.js' file in order to be available for to the web application. This does not need to be executed, since this file is shipped already with the program. 

# Toolkits
This application is build upon the following javascript libraries:              
Google Maps API 3.27              
D3 3.3.3              
JQuery 1.12.1              
Highcharts 5.0.12              

# Development Environment

 Visual Studio 2017 Enterprise
 
# Run the program
The application can be started by opening the 'InfoVisProject.App/index.html' file in a web browser. The application was developed and tested with Google Chrome, therefore I suggest to use Chrome as well. 


