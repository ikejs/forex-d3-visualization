// graph margins/dimensions
var margin = {top: 10, right: 30, bottom: 90, left: 40},
    width = 460 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// create svg
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// https://www.freeforexapi.com/api/live?pairs=EURUSD,EURGBP,GBPUSD,USDJPY,AUDUSD,USDCHF,NZDUSD,USDCAD,USDZAR
d3.json("test.json", function({ rates }) {

  // array of sorted rates [105.018977, 14.65357, 1.407747, ...]
  const sortedRates = Object.keys(rates).map(pair => rates[pair].rate).sort((a, b) => a - b).reverse();

  // X axis
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(Object.keys(rates))
    .padding(0.2);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Y axis
  var y = d3.scaleLinear()
    .domain([0, sortedRates[0]])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Bars
  svg.selectAll("mybar")
    .data(sortedRates)
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d); })
      .attr("width", x.bandwidth())
      .attr("fill", "#69b3a2")
      // no bar at the beginning thus:
      .attr("height", function(d) { return height - y(0); })
      .attr("y", function(d) { return y(0); })

  // Animation
  svg.selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", function(d) { 
      return y(d); 
    })
    .attr("height", function(d) { return height - y(d); })
    .delay(function(d,i){console.log(d, i) ; return(i*100)})

})
