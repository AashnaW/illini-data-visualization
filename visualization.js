// Using jQuery, read our data and call visualize(...) only once the page is ready:
$(function() {
  d3.csv("uiuc-students-by-curriculum.csv").then(function(data) {
    // Write the data to the console for debugging:
    // console.log(data);

    // Call our visualize function:
    visualize(data);
  });
});



var visualize = function(data) {


  // Boilerplate:
  var margin = { top: 50, right: 250, bottom: 50, left: 50 },
     width = 1400,
     height = 800;

  var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("width", width + margin.left + margin.right)
    .style("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var allMajors = ["Accountancy","Business Administration (MBA)","Computer Engineering",
                  "Computer Science","Curric Unassigned","Economics","Electrical Engineering",
                  "Mechanical Engineering","Psychology","Undeclared"]

  var dataReady = allMajors.map( function(majorName) {
    return {
      name: majorName,
      values: data.map(function(d) {
        return {Fall: d.Fall, value: +d[majorName]};
      })
    };
  });

  var myColor = d3.scaleOrdinal()
      .domain(allMajors)
      .range(d3.schemeSet2);

    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
      .domain([1980,2018])
      .range([ 0, width ]);

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));


    // Add Y axis
    var y = d3.scaleLinear()
      .domain( [0,3000])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y).tickFormat(d3.format("d")));

    // Add the lines
    var line = d3.line()
      .x(function(d) { return x(+d.Fall) })
      .y(function(d) { return y(+d.value) })
    svg.selectAll("myLines")
      .data(dataReady)
      .enter()
      .append("path")
        .attr("d", function(d){ return line(d.values) } )
        .attr("stroke", function(d){ return myColor(d.name) })
        .style("stroke-width", 4)
        .style("fill", "none")

    // Add the points
    svg
      // First we need to enter in a group
      .selectAll("myDots")
      .data(dataReady)
      .enter()
        .append('g')
        .style("fill", function(d){ return myColor(d.name) })
      // Second we need to enter in the 'values' part of this group
      .selectAll("myPoints")
      .data(function(d){ return d.values })
      .enter()
      .append("circle")
        .attr("cx", function(d) { return x(d.Fall) } )
        .attr("cy", function(d) { return y(d.value) } )
        .attr("r", 5)
        .attr("stroke", "white")

    // Add a legend at the end of each line
    svg
      .selectAll("myLabels")
      .data(dataReady)
      .enter()
        .append('g')
        .append("text")
          .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; }) // keep only the last value of each Fall sery
          .attr("transform", function(d) { return "translate(" + x(d.value.Fall) + "," + y(d.value.value) + ")"; }) // Put the text at the position of the last point
          .attr("x", 12) // shift the text a bit more right
          .text(function(d) { return d.name; })
          .style("fill", function(d){ return myColor(d.name) })
          .style("font-size", 15)



};
