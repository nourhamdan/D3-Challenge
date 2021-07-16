
var svgWidth = 960;
var svgHeight = 700;

// Define the chart's margins 
var margin = {
    top: 20,
    right: 40,
    bottom: 100,
    left: 100
  };

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("fill", "white");

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Set initial axis names
var xLabel = "poverty"
var yLabel = "healthcare"

// Setup second SVG for correlation area
var svg2Width = 960;
var svg2Height = 100;

// Define the chart's margins as an object
var margin2 = {
    top: 40,
    right: 10,
    bottom: 10,
    left: 10
  };

// Define dimensions of the chart area
var dataWidth = svg2Width - margin.left - margin.right;
var dataHeight = svg2Height - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg2 = d3.select("#linRegress")
  .append("svg")
  .attr("width", svg2Width)
  .attr("height", svg2Height)
  .attr("fill", "white");

// Load data from .csv file
d3.csv("assets/data/data.csv").then(function(data) {

    var statesData = data;
    // Print the data
    console.log(statesData);

    // Parse data and cast to numeric
    statesData.forEach(function(data) {
        data.poverty    = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age        = +data.age;
        data.income     = +data.income;
      });
    
    // Set the domain for the xLinearScale function
    var xLinearScale = d3.scaleLinear()
        .range([0, chartWidth])
        .domain([d3.min(statesData, data => data[xLabel]) - 2, d3.max(statesData, data => data[xLabel]) + 2]);

    // Set the domain for the yLinearScale function
    var yLinearScale = d3.scaleLinear()
        .range([chartHeight, 0])
        .domain([d3.min(statesData, data => data[yLabel]) - 2, d3.max(statesData, data => data[yLabel]) + 2]);

    // Initialize axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
      
    // Append x and y axes to the chart
    var xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    var yAxis = chartGroup.append("g")
        .call(leftAxis);

    // Create scatterplot and append initial circles
    var circlesGroup = chartGroup.selectAll("g circle")
        .data(statesData)
        .enter()
        .append("g")

    // Append (x, y) locations for circles
    var circlesLoc = circlesGroup.append("circle")
        .attr("cx", d => xLinearScale(d[xLabel]))
        .attr("cy", d => yLinearScale(d[yLabel]))
        .attr("r", 17)
        .classed("stateCircle", true);   

    // Add labels for circles
    var circlesLabel = circlesGroup.append("text")
        .text(d => d.abbr)
        .attr("dx", d => xLinearScale(d[xLabel]))
        .attr("dy", d => yLinearScale(d[yLabel]) + 5)
        .classed("stateText", true);

    // Create group for xAxis labels
    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight})`);

    var povertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "poverty") // value to grab for event listener
        .text("In Poverty (%)")
        .classed("active", true);

    var ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 80)
        .attr("value", "age") 
        .text("Age (Median)")
        .classed("inactive", true);

    var incomeLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") 
        .text("Income (Median)")
        .classed("inactive", true);

    // Create group for yAxis labels
    var ylabelsGroup = chartGroup.append("g");

    var healthcareLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(chartHeight / 2))
        .attr("y", -40)
        .attr("value", "healthcare")
        .text("Healthcare (%)")
        .classed("active", true);
        var obeseLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(chartHeight / 2))
        .attr("y", -60)
        .attr("value", "obesity") 
        .text("Obeseness (%)")
        .classed("inactive", true);
        
        var smokesLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(chartHeight / 2))
        .attr("y", -80)
        .attr("value", "smokes")
        .text("Smokes (%)")
        .classed("inactive", true);

    // Append a group area, then set its margins
    var statsGroup = svg2.selectAll("text")
        .data([1])
        .enter()
        .append("text")
        .attr("transform", `translate(${margin2.left}, ${margin2.right})`);

    // set x y variables for corrCoeff and linRegress
    var xArr = statesData.map(function(data) {
        return data[xLabel];
    });
    var yArr = statesData.map(function(data) {
        return data[yLabel];
    });

    var createLine = d3.line()
        .x(data => xLinearScale(data.x))
        .y(data => yLinearScale(data.y));

    var regressPoints = regressionSetup(statesData, xLabel, yLabel, xArr);

    var plotRegress = chartGroup.append("path")
        .attr("class", "plot")
        .attr("stroke", "purple")
        .attr("stroke-width", "1")
        .attr("fill", "none")
        .attr("d", createLine(regressPoints));

  

    // Add the SVG text element to SVG2
    var statsText = statsGroup
        .attr("x", 50)
        .attr("y", 50)
        .text("Correlation Coefficient: " + corrCoeff.toFixed(6))
        .attr("fill", "black");
        
  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
    var value = d3.select(this).attr("value");
    if (value !== xLabel) {
   
    
  }
  });
  // y axis labels event listener
  ylabelsGroup.selectAll("text")
    .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== yLabel) {

    
  
    }
  });
// initial tooltips
circlesGroup = updateToolTip(circlesGroup, xLabel, yLabel);
});