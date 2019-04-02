// Using jQuery, read our data and call visualize(...) only once the page is ready:
$(function() {
  d3.csv("football.csv").then(function(data) {
    // Write the data to the console for debugging:
    console.log(data);

    // Call our visualize function:
    visualize(data);
  });
});

var visualize = function(data) {
  // Boilerplate:
  var margin = { top: 50, right: 50, bottom: 50, left: 130 },
  width = 2000 - margin.left - margin.right,
  height = 3000 - margin.top - margin.bottom;

  var svg = d3.select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .style("width", width + margin.left + margin.right)
  .style("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var col = [];
  for (var i = 0; i < data.length; i++) {
    if (!col.includes(data[i].Opponent)) {
      col.push(data[i].Opponent)
    }
  }

  //col = col.filter( onlyUnique );

  var year = d3.scaleLinear()
  .domain([1892,2018])
  .range([0,width]);

  var axisVariable = d3.axisTop()
  .scale( year )
  .tickFormat(d3.format("d"))

  svg.append("g")
  .call( axisVariable );

  var team = d3.scalePoint()
  .domain(col)
  .range([0,height]);

  var axisVariable = d3.axisLeft()
  .scale( team )

  svg.append("g")
  .call( axisVariable );

  // Visualization Code:
  var j = 0;
  var colors = ["red", "violet", "skyblue", "chartreuse", "coral"]
  svg.selectAll("Season")
  .data(data)
  .enter()
  .append("circle")
  .attr("r", function (d, i) {
    return data[i].IlliniScore/3.5;
  })
  .attr("cx", function (d, i) {
    return year( d["Season"]);
  })
  .attr("cy", function (d, i) {
    return team (d ["Opponent"]);
  })
  .attr("fill", function (d, i) {
    return colors[Math.floor(data[i].IlliniScore/20)];
  })
  .attr("stroke", "black")
  .style("opacity", 0.65)
};
